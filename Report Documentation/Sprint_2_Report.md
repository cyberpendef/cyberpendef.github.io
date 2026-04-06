# Sprint 2: Dynamic Contact & Inquiry System
## Phase 2.1: Inquiry Edge Function Development

### Code Logic and Purpose Implemented
- **File Created:** `supabase/functions/submit-inquiry/index.ts`
- **Action:** Developed a Deno-based Supabase Edge Function to securely process contact form submissions.
- **Logic:**
  - **CORS Handling:** Implements preflight request handling to allow requests from the frontend.
  - **Turnstile Verification:** Extracts the `cf-turnstile-response` token from the payload and verifies it against the Cloudflare API (`https://challenges.cloudflare.com/turnstile/v0/siteverify`) using the `TURNSTILE_SECRET_KEY` environment variable. This prevents automated spam and guarantees that only humans can trigger the database insert.
  - **Secure DB Insertion:** Uses the `SUPABASE_SERVICE_ROLE_KEY` (which securely bypasses RLS on the server) to insert the verified lead into the `inquiries` table. This enforces the Zero-Trust policy where the frontend has no direct write access to the database.
  - **Email Notification:** Integrates the Resend API (`https://api.resend.com/emails`) using the `RESEND_API_KEY` to send a real-time notification email to the owner (cyberpendef@gmail.com) whenever a new inquiry is successfully saved.
  - **Error Handling:** Gracefully catches errors and returns sanitized JSON responses (e.g., 400 for bad tokens, 500 for internal errors) so the frontend can display appropriate UI feedback.

## Phase 2.2: Frontend Contact Form Modification

### Code Logic and Purpose Implemented
- **File Modified:** `layouts/contact/list.html`
- **Action:** Migrated the frontend form from a static Formspree submission to a dynamic Javascript-driven submission connecting to the custom Supabase Edge Function.
- **Logic:**
  - **Turnstile Integration:** Embedded the Cloudflare Turnstile Javascript API in the document and added the `<div class="cf-turnstile">` widget directly into the form. This adds a visual (but often invisible) CAPTCHA challenge to prove the user is human.
  - **Event Interception:** Replaced the standard HTML `<form action="...">` with a vanilla JavaScript `addEventListener('submit')`. This prevents the default page reload.
  - **Client-Side Validation:** The script checks if the user has successfully completed the Turnstile challenge (verifying the `cf-turnstile-response` token exists) before even attempting to contact the server.
  - **Fetch API:** Uses the modern `fetch()` API to securely transmit the form payload (including the Turnstile token) as JSON to the Supabase Edge Function URL.
  - **UX/UI Feedback:** Added dynamic state management to the submit button (e.g., disabling it and changing text to "Sending Request...") and injected styled success/error messages directly into the DOM based on the server's response. The form and CAPTCHA are automatically reset upon success or error.

### Next Steps
The next step is Phase 2.3: Testing & Validation. Once the Edge Function is deployed and the API keys are injected by the user, the contact form will be fully functional. Following testing, we will proceed to Sprint 3: Secure Client Portal.