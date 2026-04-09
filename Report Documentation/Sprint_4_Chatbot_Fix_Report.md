# Sprint 4 Chatbot Fix Report

## Scope
- Investigated the `Cybernet Assistant` widget failure reported from the Secure Portal page.
- Traced both the frontend chatbot integration and the live Supabase Edge Function endpoint.
- Applied a frontend stability fix and documented the remaining deployment dependency.

## Root Cause Analysis
- The chatbot partial rendered a Cloudflare Turnstile container but did not load the Turnstile SDK in the partial itself.
- The widget relied on a hidden Turnstile field that could remain uninitialized, which made the verification flow fragile when the backend requested CAPTCHA validation.
- The chat UI inserted user and assistant message text with `innerHTML`, which created an avoidable frontend injection risk.
- The live Supabase endpoint at `https://qfkdrluonrhmubqyeyex.supabase.co/functions/v1/ai-assistant` currently responds with `404 NOT_FOUND`, which confirms the deployed function is missing or not available under that route.

## Code Changes Implemented
### `config.toml`
- Added `supabase_url` and `supabase_anon_key` under `[params]`.
- Purpose: centralize runtime configuration so the chatbot does not depend on brittle hard-coded values inside the partial script.

### `layouts/partials/chatbot.html`
- Added the Cloudflare Turnstile script with explicit rendering mode.
- Added a dedicated `message-content` rule so assistant responses preserve line breaks safely.
- Replaced direct `innerHTML` injection for normal message rendering with safe text rendering.
- Added helper functions to:
  - update message content safely
  - read the Turnstile token
  - wait for the Turnstile SDK to load
  - lazily render the verification widget only when the backend requests it
  - parse non-ideal API responses more defensively
- Added config validation before sending a chat request.
- Added `apikey` and `Authorization` headers to match Supabase Edge Function expectations cleanly.
- Improved error handling so unreadable API responses and verification failures surface clearer messages in the widget.
- Reset the Turnstile widget only when a rendered widget actually exists.

## Verification Performed
- Ran a local Hugo build successfully with `hugo`.
- Confirmed no template build errors after the chatbot changes.
- Probed the public function endpoint and confirmed the current live response:

```text
HTTP/2 404
{"code":"NOT_FOUND","message":"Requested function was not found"}
```

## Operational Follow-Up Required
- Redeploy the Supabase Edge Function:

```bash
supabase functions deploy ai-assistant --no-verify-jwt
```

- Ensure the following Supabase secrets are configured before or after deployment:
  - `GROQ_API_KEY`
  - `TURNSTILE_SECRET_KEY`

## Deployment Completion Status
- Connected to the linked Supabase project `qfkdrluonrhmubqyeyex`.
- Confirmed the original production issue: only `submit-inquiry` was active and `ai-assistant` was missing.
- Deployed `ai-assistant` successfully with public access configuration (`verify_jwt: false`).
- Re-tested the public endpoint after deployment.
- The endpoint now resolves correctly and returns:

```text
HTTP/2 400
{"error":"Security verification (Turnstile) is missing"}
```

- This is expected for a direct probe that does not include a valid Turnstile token.
- The `404 NOT_FOUND` production failure has been resolved.

## Outcome
- The frontend chatbot integration is now more robust and secure.
- The missing production function has been restored.
- End-to-end live chatting still depends on the browser successfully rendering Turnstile and on the configured `GROQ_API_KEY` secret being valid during a real verified request.
