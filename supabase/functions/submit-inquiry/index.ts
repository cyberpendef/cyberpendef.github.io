import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, phone, audience_category, service_category, message, claim_free_consultation, 'cf-turnstile-response': turnstileToken } = await req.json()

    // 1. Verify Turnstile Token
    const turnstileSecretKey = Deno.env.get('TURNSTILE_SECRET_KEY')
    if (!turnstileSecretKey) {
      throw new Error('TURNSTILE_SECRET_KEY is not set')
    }

    if (!turnstileToken) {
      return new Response(JSON.stringify({ error: 'Turnstile token is missing' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const formData = new FormData()
    formData.append('secret', turnstileSecretKey)
    formData.append('response', turnstileToken)
    
    // Optional: Log IP for extra verification (requires proxy config)
    // formData.append('remoteip', req.headers.get('x-forwarded-for') || '')

    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })

    const turnstileResult = await turnstileResponse.json()

    if (!turnstileResult.success) {
      console.error('Turnstile verification failed:', turnstileResult)
      return new Response(JSON.stringify({ error: 'CAPTCHA verification failed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 2. Insert into Supabase (using Service Role Key to bypass RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL or Service Role Key is not set')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: inquiryData, error: dbError } = await supabase
      .from('inquiries')
      .insert([
        {
          name,
          email,
          phone,
          audience_category,
          service_category,
          message,
          claim_free_consultation: claim_free_consultation === 'Yes' || claim_free_consultation === true
        }
      ])
      .select()

    if (dbError) {
      console.error('Database Error:', dbError)
      throw new Error('Failed to save inquiry')
    }

    // 3. Send Notification Email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const myEmail = 'cyberpendef@gmail.com' // From your config.toml

    if (resendApiKey) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'CyberPenDef Inquiries <onboarding@resend.dev>', // Update with verified domain later
          to: [myEmail],
          subject: `New Inquiry from ${name} - ${service_category || 'General'}`,
          html: `
            <h2>New Inquiry Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Audience:</strong> ${audience_category}</p>
            <p><strong>Service:</strong> ${service_category || 'N/A'}</p>
            <p><strong>Claimed Free Consultation:</strong> ${claim_free_consultation ? 'Yes' : 'No'}</p>
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        })
      })
      
      if (!resendRes.ok) {
        console.error('Resend Error:', await resendRes.text())
        // We don't fail the whole request if email fails, but we log it.
      }
    } else {
      console.warn('RESEND_API_KEY not set. Skipping email notification.')
    }

    return new Response(JSON.stringify({ success: true, message: 'Inquiry submitted successfully!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Internal Error:', error.message)
    return new Response(JSON.stringify({ error: 'An internal server error occurred' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
