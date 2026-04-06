# Security Architecture

As a cybersecurity professional, the website must demonstrate defense-in-depth. This architecture minimizes the attack surface by eliminating traditional web servers and enforcing strict access controls at the edge and database levels.

## 1. Edge Defense (Cloudflare Proxy)

GitHub Pages alone is vulnerable to basic scanning and lacks advanced header controls. By proxying the domain through Cloudflare, we enforce:

*   **Strict Transport Security (HSTS):** Forcing all connections over HTTPS.
*   **Custom Security Headers (via Cloudflare Rules):**
    *   `Content-Security-Policy (CSP)`: Restricts where scripts, styles, and images can be loaded from, mitigating XSS attacks.
    *   `X-Frame-Options: DENY`: Prevents Clickjacking.
    *   `X-Content-Type-Options: nosniff`: Prevents MIME-sniffing.
    *   `Referrer-Policy: strict-origin-when-cross-origin`.
*   **Web Application Firewall (WAF):** Blocks SQLi, XSS payloads, and known bad user agents before they even reach GitHub or Supabase.
*   **Bot Fight Mode:** Challenges suspicious traffic.

## 2. API & Form Protection (Cloudflare Turnstile + Edge Verification)

Frontend-only CAPTCHAs can be bypassed by sending HTTP requests directly to the API endpoint. 

**The Hardened Workflow:**
1. The frontend Turnstile widget generates a token `T`.
2. The frontend sends `{ data: "...", token: T }` to the Supabase Edge Function.
3. The Edge Function **must** independently verify token `T` with Cloudflare's `/siteverify` endpoint using a Secret Key.
4. Only if Cloudflare confirms the token is valid and recent does the Edge Function process the data.

## 3. Zero-Trust Database (Supabase RLS)

The Supabase "Anon" (Anonymous) key will be visible in the frontend JavaScript. This is safe **ONLY IF** Row Level Security (RLS) is strictly configured.

### Example RLS Policies

**Table: `inquiries` (Contact Form Submissions)**
*   *Requirement:* Anyone can submit a form, but no one (not even the submitter) can read the database.
*   *Policy:* 
    *   `INSERT`: Allowed for `anon` role.
    *   `SELECT`, `UPDATE`, `DELETE`: Denied for `anon` role.

**Table: `service_tickets` (Client Portal)**
*   *Requirement:* Clients can only see their own tickets.
*   *Policy:*
    *   `SELECT`: Allowed IF `auth.uid() = client_id`.
    *   `INSERT`, `UPDATE`, `DELETE`: Denied for authenticated users (Admin only).

**Table: `testimonials`**
*   *Requirement:* Public can read approved testimonials.
*   *Policy:*
    *   `SELECT`: Allowed IF `approved = true`.

## 4. Secret Management

*   **Never in Frontend:** Groq API keys, Resend API keys, and Cloudflare Secret keys are NEVER stored in the Hugo repository or frontend JavaScript.
*   **Edge Secrets:** These keys are stored as encrypted Environment Variables within the Supabase dashboard and are only accessible by the Deno Edge Functions running on Supabase's secure backend infrastructure.

## 5. Rate Limiting (Denial of Wallet Protection)

To prevent an attacker from spamming the AI Chatbot (consuming Groq credits) or the Contact Form (consuming Resend quotas), rate limiting must be enforced.
*   Implemented via Cloudflare WAF rules (e.g., max 5 requests per IP per minute to the Edge Function URLs).
*   Secondary rate limiting logic can be implemented within the Deno Edge Functions using an in-memory cache or Redis (if scaling requires).
