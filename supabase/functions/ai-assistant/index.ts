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
        stream: true,
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text()
      console.error('Groq API Error:', errorData)
      throw new Error('Failed to connect to the AI brain.')
    }

    if (!groqResponse.body) {
      throw new Error('AI stream body is unavailable')
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    // Convert Groq's SSE stream into a plain text stream that the browser can append directly.
    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqResponse.body!.getReader()
        let buffer = ''

        try {
          while (true) {
            const { value, done } = await reader.read()

            if (done) {
              break
            }

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''

            for (const rawLine of lines) {
              const line = rawLine.trim()

              if (!line || !line.startsWith('data:')) {
                continue
              }

              const payload = line.replace(/^data:\s*/, '')

              if (payload === '[DONE]') {
                controller.close()
                return
              }

              try {
                const parsed = JSON.parse(payload)
                const chunk = parsed.choices?.[0]?.delta?.content ?? ''

                if (chunk) {
                  controller.enqueue(encoder.encode(chunk))
                }
              } catch (parseError) {
                console.error('Stream Parse Error:', parseError)
              }
            }
          }

          if (buffer.trim().startsWith('data:')) {
            const payload = buffer.trim().replace(/^data:\s*/, '')
            if (payload && payload !== '[DONE]') {
              try {
                const parsed = JSON.parse(payload)
                const chunk = parsed.choices?.[0]?.delta?.content ?? ''
                if (chunk) {
                  controller.enqueue(encoder.encode(chunk))
                }
              } catch (parseError) {
                console.error('Final Stream Parse Error:', parseError)
              }
            }
          }

          controller.close()
        } catch (streamError) {
          console.error('Stream Forwarding Error:', streamError)
          controller.error(streamError)
        } finally {
          reader.releaseLock()
        }
      }
    })

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
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
