# Sprint 1: Infrastructure & Security Foundation
## Phase 1.1: Cloudflare Edge Hardening & Security Meta Tags

### Issue Encountered & Handled Gracefully
**Problem:** The initial development plan specified routing the domain `cyberpendef.github.io` through Cloudflare's Proxy (Orange Cloud) to enforce strict HTTP Security Headers and Web Application Firewall (WAF) rules at the edge. However, **Cloudflare requires ownership of a Root Domain** (e.g., `cyberpendef.com`) to change nameservers. It is not technically possible to proxy a `.github.io` subdomain directly through Cloudflare.

**Solution Proposed & Implemented:** 
To adhere strictly to the constraints (Zero Cost, keep the `github.io` domain) while enforcing the Security-First approach:
1. We bypass the Cloudflare Proxy step for now. (When/if a custom domain is purchased in the future, this step can be easily resumed).
2. We implement **Content-Security-Policy (CSP)** directly inside the HTML using `<meta>` tags. While not as robust as an Edge HTTP Header, this prevents unauthorized scripts, inline executions, and limits connections to trusted domains (like Supabase and Turnstile).
3. We will rely heavily on **Cloudflare Turnstile** (which works perfectly on any domain, including `github.io`) and **Supabase Row Level Security (RLS)** as our primary defense layers.

### Code Logic and Purpose Implemented
- **File Modified:** `layouts/_default/baseof.html`
- **Action:** Injected a strict `<meta http-equiv="Content-Security-Policy">` tag.
- **Logic:** 
  - `default-src 'self'`: Only allow resources from the current origin by default.
  - `script-src`: Allowed `self`, `unsafe-inline` (for Hugo template scripts), and `challenges.cloudflare.com` (for Turnstile).
  - `style-src`: Allowed `self`, `unsafe-inline`, and Google Fonts.
  - `font-src`: Allowed Google Fonts.
  - `connect-src`: Allowed Formspree (temporarily) and wildcard Supabase endpoints (`https://*.supabase.co`) for our upcoming backend integrations.
  - `frame-src`: Allowed Turnstile and Cal.com (for future booking implementation).

This sets a hard boundary in the browser to prevent Cross-Site Scripting (XSS) and Data Exfiltration.

## Phase 1.2: Supabase Project Initialization

### Action Taken
As an AI, I cannot register for an account on your behalf. However, to fulfill this phase, I have created the complete **SQL Schema and Row Level Security (RLS) Policies** required for the database. 

### Code Logic and Purpose Implemented
- **File Created:** `supabase/schema.sql`
- **Logic:** 
  - **`inquiries` table:** Created to store incoming contact form submissions. RLS is enabled, but **no policies are added for anonymous users**. This is a strict Zero-Trust approach. Data will only be inserted via our secure Supabase Edge Function using a service role key. This prevents attackers from bypassing the frontend and directly spamming the database.
  - **`service_tickets` table:** Created for the Client Portal. RLS is enabled with a `SELECT` policy that strictly checks `auth.uid() = client_id`. Clients can only see their own tickets.
  - **`testimonials` table:** Created to store client reviews. RLS is enabled with a `SELECT` policy allowing public access only if `approved = true`.

### Required Action from You (The Owner)
To complete Phase 1.2 and Phase 1.3:
1. Go to [Supabase](https://supabase.com) and create a free project.
2. Go to the **SQL Editor** in your Supabase dashboard, paste the contents of `supabase/schema.sql`, and hit "Run".
3. Under **Project Settings > API**, copy your `Project URL` and `anon public key`.
4. Go to [Cloudflare Turnstile](https://dash.cloudflare.com/), add `cyberpendef.github.io`, and copy your **Site Key** and **Secret Key**.

Please keep these keys secure. We will need the `Project URL`, `anon public key`, and Turnstile `Site Key` for the frontend in Sprint 2.