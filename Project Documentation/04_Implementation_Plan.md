# Implementation Plan

This document outlines the phased approach to upgrading the CyberPenDef website without causing downtime to the existing site.

## Phase 1: Infrastructure Preparation & Edge Hardening
**Goal:** Establish the secure foundation.

1.  **Cloudflare Setup:**
    *   Create a free Cloudflare account.
    *   Add `cyberpendef.github.io` (or a custom domain if acquired later) to Cloudflare.
    *   Enable the Proxy (Orange Cloud).
    *   Configure Page Rules to inject strict HTTP Security Headers (CSP, HSTS, X-Frame-Options).
2.  **Supabase Setup:**
    *   Create a new Supabase project (Free Tier).
    *   Define Database Schema (`inquiries`, `clients`, `service_tickets`, `testimonials`).
    *   Implement strict Row Level Security (RLS) policies for all tables.
3.  **Anti-Spam Setup:**
    *   Create a Cloudflare Turnstile site key and secret key.

## Phase 2: Secure Contact & Inquiry System
**Goal:** Replace Formspree with a secure, custom backend.

1.  **Backend Logic (Supabase Edge Function):**
    *   Create `submit-inquiry` Edge Function.
    *   Add Turnstile Secret Key and Resend API Key as environment variables.
    *   Write Deno code to: Verify Turnstile -> Insert to DB -> Send Email via Resend.
2.  **Frontend Integration:**
    *   Modify `layouts/contact/list.html` in the Hugo codebase.
    *   Embed the Turnstile JS widget.
    *   Write Vanilla JS to intercept the form `submit` event, gather data + token, and `fetch()` the Edge Function URL.

## Phase 3: Client Portal Authentication
**Goal:** Create a secure area for clients to view their project status.

1.  **Frontend UI:**
    *   Create `layouts/portal/index.html` (Login view).
    *   Create `layouts/portal/dashboard.html` (Authenticated view).
2.  **Authentication Logic:**
    *   Integrate `supabase-js` via CDN.
    *   Implement `supabase.auth.signInWithOtp()` for Magic Link login.
    *   Implement route protection in JS (redirect to login if no active session).
3.  **Data Retrieval:**
    *   In the dashboard view, use `supabase.from('service_tickets').select('*')` to fetch data relying on RLS to filter securely.

## Phase 4: AI Chatbot Integration
**Goal:** Deploy a secure, context-aware AI assistant.

1.  **Backend Logic (Supabase Edge Function):**
    *   Create `ai-assistant` Edge Function.
    *   Add Groq API Key as an environment variable.
    *   Write the System Prompt defining the AI's boundaries and knowledge.
    *   Implement logic to call Groq API and stream the response.
2.  **Frontend UI:**
    *   Create `layouts/partials/chatbot.html`.
    *   Build the chat interface using existing CSS variables.
    *   Write Vanilla JS to handle message sending, receiving the stream, and updating the UI.

## Phase 5: Content Management System (Decap CMS)
**Goal:** Enable easy updates for blogs and portfolios.

1.  **Configuration:**
    *   Create `static/admin/index.html` and `static/admin/config.yml`.
    *   Configure `config.yml` to map to Hugo's `content/` structure (e.g., `content/blog`, `content/services`).
2.  **Authentication:**
    *   Set up GitHub OAuth application to allow Decap CMS to commit to the repository.

## Phase 6: Scheduling & Utilities
**Goal:** Finalize business workflows.

1.  **Booking Integration:**
    *   Embed Cal.com iframe in relevant service pages and the contact page.
2.  **Keep-Alive Cron:**
    *   Set up a free cron job (e.g., cron-job.org) to ping the Supabase REST endpoint every 3 days to prevent the free tier from pausing.

## Maintenance & Future Expansion
*   **Log Monitoring:** Regularly review Cloudflare WAF logs and Supabase Auth logs.
*   **Model Upgrades:** The Edge Function architecture allows seamless swapping of the underlying LLM (e.g., moving from Groq to a custom tuned model) without changing frontend code.
*   **Custom Domain:** If a custom domain is purchased, update Cloudflare DNS and GitHub Pages settings; the architecture remains identical.
