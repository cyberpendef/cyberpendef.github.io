# Development Plan

## Overview
This development plan outlines the iterative approach to upgrading the CyberPenDef website. The execution is strictly divided into Sprints, and each Sprint is broken down into specific Phases as mandated by the `GEMINI.md` directives. This ensures an error-free, step-by-step implementation that preserves the existing Hugo content while adding secure, dynamic features.

---

## Sprint 1: Infrastructure & Security Foundation
**Goal:** Establish the hardened edge, serverless backend, and anti-spam measures.

*   **Phase 1.1: Cloudflare Edge Hardening**
    *   Configure Cloudflare Proxy for `cyberpendef.github.io`.
    *   Implement Page Rules for strict HTTP Security Headers (CSP, HSTS, X-Frame-Options).
    *   Enable Bot Fight Mode.
*   **Phase 1.2: Supabase Project Initialization**
    *   Create Supabase project and obtain API keys.
    *   Define Database Schema for `inquiries`, `service_tickets`, and `testimonials`.
    *   Implement foundational Row Level Security (RLS) policies (Default Deny).
*   **Phase 1.3: Anti-Spam (Cloudflare Turnstile) Setup**
    *   Generate Cloudflare Turnstile Site Key and Secret Key.

---

## Sprint 2: Dynamic Contact & Inquiry System
**Goal:** Replace Formspree with a secure, custom backend workflow.

*   **Phase 2.1: Inquiry Edge Function Development**
    *   Develop a Deno-based Supabase Edge Function (`submit-inquiry`).
    *   Implement Turnstile backend verification logic.
    *   Integrate Resend API for email notifications.
    *   Implement secure database insertion logic.
*   **Phase 2.2: Frontend Contact Form Modification**
    *   Modify existing `layouts/contact/list.html` (without removing existing CSS/HTML structure).
    *   Embed Turnstile JS widget.
    *   Write Vanilla JS to intercept form submission and `fetch()` the Edge Function.
*   **Phase 2.3: Testing & Validation**
    *   End-to-end testing of the inquiry flow.
    *   Verify RLS policies block unauthorized read access to the `inquiries` table.

---

## Sprint 3: Secure Client Portal
**Goal:** Build a secure, authenticated dashboard for clients.

*   **Phase 3.1: Supabase Auth & Strict RLS**
    *   Configure Supabase Authentication (Magic Links/OTP).
    *   Refine RLS policies on `service_tickets` so clients (`auth.uid()`) can only `SELECT` their own records.
*   **Phase 3.2: Portal Login UI Development**
    *   Create a new Hugo layout: `layouts/portal/index.html`.
    *   Implement the login interface matching the Cyberpunk aesthetic.
    *   Add JS for requesting the Magic Link.
*   **Phase 3.3: Client Dashboard Implementation**
    *   Create `layouts/portal/dashboard.html`.
    *   Implement JS to verify the active JWT session.
    *   Fetch and render client-specific data from Supabase.

---

## Sprint 4: AI Chatbot Integration
**Goal:** Deploy a secure, context-aware AI assistant without exposing API keys.

*   **Phase 4.1: AI Edge Function Development**
    *   Develop `ai-assistant` Edge Function.
    *   Integrate Groq API and secure the API key in environment variables.
    *   Write the System Prompt defining the assistant's knowledge base and boundaries.
*   **Phase 4.2: Frontend Chatbot UI**
    *   Create `layouts/partials/chatbot.html`.
    *   Design a floating chat widget complementing the existing site design.
*   **Phase 4.3: Chat Logic & Integration**
    *   Write Vanilla JS to handle message streaming and state management.
    *   Inject the partial into the base layout.

---

## Sprint 5: Content Management & Scheduling
**Goal:** Enable easy content updates and service bookings.

*   **Phase 5.1: Decap CMS Configuration**
    *   Create `static/admin/index.html` and `static/admin/config.yml`.
    *   Configure collections for Blogs and Portfolio items mapping to Hugo's `content/` folder.
    *   Setup GitHub OAuth for Decap CMS.
*   **Phase 5.2: Cal.com Integration**
    *   Configure Cal.com account and event types.
    *   Embed the booking iframe into the Services/Contact pages.
*   **Phase 5.3: Keep-Alive Automation**
    *   Configure a cron job (e.g., cron-job.org) to ping the Supabase REST endpoint to prevent free-tier pausing.

---

**Note:** At the end of each Phase, explicit user consent will be requested before proceeding to the next Phase, per `GEMINI.md` directives.