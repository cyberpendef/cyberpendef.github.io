import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const { message, 'cf-turnstile-response': turnstileToken } = await req.json()

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 1. Verify Turnstile Token (Anti-Spam)
    const turnstileSecretKey = Deno.env.get('TURNSTILE_SECRET_KEY')
    if (turnstileSecretKey) {
      if (!turnstileToken) {
        return new Response(JSON.stringify({ error: 'Security verification (Turnstile) is missing' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }

      const formData = new FormData()
      formData.append('secret', turnstileSecretKey)
      formData.append('response', turnstileToken)
      
      const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData,
      })

      const turnstileResult = await turnstileResponse.json()

      if (!turnstileResult.success) {
        console.error('Turnstile verification failed:', turnstileResult)
        return new Response(JSON.stringify({ error: 'Security verification failed' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }
    } else {
      console.warn('TURNSTILE_SECRET_KEY not set. Skipping verification (Development Mode).')
    }

    // 2. Call Groq API
    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY is not set')
    }

    const systemPrompt = `
      You are the CyberPenDef AI Assistant, a professional and helpful security consultant for Shaik Hidayatullah's cybersecurity freelancing business.
      
      Your personality: Professional, direct, informative, and security-conscious. 
      Use a slightly "cyberpunk" or "high-tech" tone but maintain business professionalism.
      
      Knowledge Base:
      - Services: Web Penetration Testing, Network Security Audits, Vulnerability Assessments, IT Support, Cloud Security.
      - Owner: Shaik Hidayatullah (CEHv13 Certified).
      - Target Audience: Small businesses, freelancers, and individuals in the India & Gulf region.
      - Pricing: Transparent, fixed-rate packages or custom quotes based on scope.
      - Contact: Encourage users to use the Contact page or the Client Portal for official inquiries.
      
      Guidelines:
      - NEVER give specific legal advice.
      - NEVER perform any hacking or provide illegal instructions.
      - If a user asks a complex technical question, provide a high-level summary and suggest booking a professional consultation.
      - Be concise. Keep responses under 3 paragraphs if possible.
    `;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text()
      console.error('Groq API Error:', errorData)
      throw new Error('Failed to connect to the AI brain.')
    }

    const aiData = await groqResponse.json()
    const aiMessage = aiData.choices[0].message.content

    return new Response(JSON.stringify({ response: aiMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Internal Error:', error.message)
    return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
