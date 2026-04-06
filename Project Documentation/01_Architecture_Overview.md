# CyberPenDef Website - Architecture Overview

## 1. Executive Summary

This document outlines the hardened, "Zero-Cost Hybrid" architecture for the CyberPenDef cybersecurity freelancing website. The goal is to upgrade the existing static Hugo site hosted on GitHub Pages with dynamic, AI-powered features and a secure client portal, without incurring monthly hosting costs or migrating away from the current `cyberpendef.github.io` domain.

Crucially, as a cybersecurity service provider, the architecture mandates an **Enterprise-Grade Security-First approach**, implementing Zero Trust principles, strict access controls, and robust protection against common web vulnerabilities (OWASP Top 10) and automated attacks.

## 2. Core Objectives

*   **Zero Infrastructure Cost:** Utilize generous free tiers of premium services (GitHub Pages, Cloudflare, Supabase, Groq, Resend).
*   **Domain Retention:** Maintain the existing `cyberpendef.github.io` domain.
*   **No Code Rewrite:** Augment the existing Hugo HTML/CSS/JS codebase rather than rewriting the frontend in a complex framework like React/Next.js.
*   **Dynamic Capabilities:** Introduce an interactive Contact/Inquiry system, a secure Client Portal, an AI-powered Chatbot, and a CMS-driven Knowledge Base/Blog.
*   **Uncompromising Security:** Implement a multi-layered defense strategy including WAF, Bot Protection, cryptographically verified tokens, and Row Level Security (RLS).

## 3. Technology Stack (The "Hardened Hybrid" Stack)

| Layer | Component | Technology | Primary Purpose | Cost |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend/Hosting** | GitHub Pages | Static HTML/CSS/JS (Hugo output) | UI delivery, SEO | $0 |
| **Edge / WAF** | Cloudflare | DNS, Proxy, WAF | DDoS protection, Security Headers, Caching | $0 |
| **Anti-Spam/Bot** | Cloudflare Turnstile | CAPTCHA alternative | Prevent automated abuse of forms/APIs | $0 |
| **Backend / DB** | Supabase | PostgreSQL, Auth, Storage | Client data, secure file storage, user auth | $0 |
| **Serverless Logic** | Supabase Edge Functions | Deno-based execution | Secure API routing, secret management | $0 |
| **AI Engine** | Groq API (Llama 3 / Gemini) | LLM Inference | Powering the AI Chatbot | $0 |
| **Email** | Resend | Transactional Email API | Notifications for inquiries and portal events | $0 |
| **Content Mgmt** | Decap CMS | Git-based CMS | Managing blog, portfolio, and testimonials | $0 |
| **Scheduling** | Cal.com | Embedded Calendar | Client appointment booking | $0 |

## 4. Key Architectural Decisions

1.  **Decoupled Frontend/Backend (Jamstack):** The frontend remains purely static. All dynamic functionality is achieved via client-side JavaScript (`fetch` API and `supabase-js`) calling out to secure, serverless endpoints.
2.  **Edge Execution for Secrets:** API keys for Resend and Groq are **never** exposed in the frontend code. Frontend JS calls a Supabase Edge Function, which securely holds the secrets and makes the final API calls.
3.  **Zero-Trust Database:** The Supabase PostgreSQL database is locked down by default. Row Level Security (RLS) policies act as the ultimate gatekeeper, mathematically proving identity via JWTs before allowing any read/write operations.
4.  **Git-Backed CMS:** Instead of a traditional database-driven CMS (like WordPress) which introduces attack vectors, Decap CMS commits markdown files directly to the GitHub repository, triggering a static rebuild.
