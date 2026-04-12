
  # Sprint Plan: Blog/Portfolio Frontends, Decap CMS Auth, and Hardening

  ## Summary

  - Save this plan as Project Documentation/05_Blog_Portfolio_CMS_Hardening_Plan.md when execution resumes.
  - Root cause for /admin/ login failure: Decap CMS GitHub backend requires a server-side auth service;
    current static/admin/config.yml has backend.name: github but no base_url/OAuth proxy. Decap’s docs confirm
    GitHub auth requires a server, and OAuth proxy setups use /auth and /callback routes.
  - Chosen default: Cloudflare Worker OAuth proxy for Decap CMS auth, because the site is on GitHub Pages and
    already has a Cloudflare-oriented architecture.
  - References: https://decapcms.org/docs/github-backend/ and https://decapcms.org/docs/backends-overview/

  ## Sprint 6: CMS Auth Recovery and Admin Hardening

  - Phase 6.1: Add a Cloudflare Worker OAuth proxy plan and implementation scaffold.
  - Create a Worker source file such as cloudflare/decap-oauth-worker.js.
  - Worker routes must support GET /auth to redirect users to GitHub OAuth and GET /callback to exchange the
    code and postMessage the token back to Decap CMS.
  - Worker secrets must be external, not committed: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, OAUTH_STATE_SECRE
    T, and allowed origin https://cyberpendef.github.io.
  - GitHub OAuth App callback URL must be https://<cloudflare-worker-url>/callback.
  - Phase 6.2: Update static/admin/config.yml for the Worker.
  - Add backend.base_url: https://<cloudflare-worker-url>.
  - Add backend.auth_endpoint: auth.
  - Keep backend.name: github, repo: cyberpendef/cyberpendef.github.io, and branch: main.
  - Add site_domain: cyberpendef.github.io to avoid auth mismatches between local and production contexts.
  - Keep local_backend: true for local-only testing, but document that production GitHub login requires the
    Worker.
  - Phase 6.3: Harden the admin route.
  - Pin the Decap CMS CDN version to the current stable 3.x release instead of @^3.5.0.
  - Add a CMS-specific admin stylesheet for a clean dark CyberPenDef admin loading screen before Decap mounts.
  - Add static/admin/README.md with exact OAuth setup steps, callback URLs, required secrets, and expected
    login flow.
  - Phase 6.4: Verify CMS auth.
  - Test /admin/ locally with npx decap-server for local backend behavior.
  - Test production /admin/ with GitHub login after Worker deployment.
  - Acceptance criteria: clicking “Login with GitHub” opens GitHub OAuth, returns to the CMS, loads configured
    collections, and can create a draft blog post without breaking the site.

  ## Sprint 7: Blog Frontend With Modern Dynamic CSS Graphics

  - Phase 7.1: Extend blog content model.
  - Update Decap blog collection fields to include category, tags, reading_time, featured_image, accent_color,
    featured, seo_title, and seo_description.
  - Keep existing title, date, description, draft, and markdown body fields.
  - Phase 7.2: Build blog listing frontend.
  - Add a Hugo blog list layout for /blog/.
  - Style direction: modern cybersecurity editorial interface with animated grid background, neon scanline
    accents, category pills, featured article hero, and responsive card layout.
  - Render only non-draft posts, sorted newest first.
  # Sprint Plan: Blog/Portfolio Frontends, Decap CMS Auth, and Hardening

  ## Summary

  - Save this plan as Project Documentation/05_Blog_Portfolio_CMS_Hardening_Plan.md when execution resumes.
  - Root cause for /admin/ login failure: Decap CMS GitHub backend requires a server-side auth service;
    current static/admin/config.yml has backend.name: github but no base_url/OAuth proxy. Decap’s docs confirm
    GitHub auth requires a server, and OAuth proxy setups use /auth and /callback routes.
  - Chosen default: Cloudflare Worker OAuth proxy for Decap CMS auth, because the site is on GitHub Pages and
    already has a Cloudflare-oriented architecture.
  - References: https://decapcms.org/docs/github-backend/ and https://decapcms.org/docs/backends-overview/

  ## Sprint 6: CMS Auth Recovery and Admin Hardening

  - Phase 6.1: Add a Cloudflare Worker OAuth proxy plan and implementation scaffold.
  - Create a Worker source file such as cloudflare/decap-oauth-worker.js.
  - Worker routes must support GET /auth to redirect users to GitHub OAuth and GET /callback to exchange the
    code and postMessage the token back to Decap CMS.
  - Worker secrets must be external, not committed: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, OAUTH_STATE_SECRE
    T, and allowed origin https://cyberpendef.github.io.
  - GitHub OAuth App callback URL must be https://<cloudflare-worker-url>/callback.
  - Phase 6.2: Update static/admin/config.yml for the Worker.
  - Add backend.base_url: https://<cloudflare-worker-url>.
  - Add backend.auth_endpoint: auth.
  - Keep backend.name: github, repo: cyberpendef/cyberpendef.github.io, and branch: main.
  - Add site_domain: cyberpendef.github.io to avoid auth mismatches between local and production contexts.
  - Keep local_backend: true for local-only testing, but document that production GitHub login requires the
    Worker.
  - Phase 6.3: Harden the admin route.
  - Pin the Decap CMS CDN version to the current stable 3.x release instead of @^3.5.0.
  - Add a CMS-specific admin stylesheet for a clean dark CyberPenDef admin loading screen before Decap mounts.
  - Add static/admin/README.md with exact OAuth setup steps, callback URLs, required secrets, and expected
    login flow.
  - Phase 6.4: Verify CMS auth.
  - Test /admin/ locally with npx decap-server for local backend behavior.
  - Test production /admin/ with GitHub login after Worker deployment.
  - Acceptance criteria: clicking “Login with GitHub” opens GitHub OAuth, returns to the CMS, loads configured
    collections, and can create a draft blog post without breaking the site.

  ## Sprint 7: Blog Frontend With Modern Dynamic CSS Graphics

  - Phase 7.1: Extend blog content model.
  - Update Decap blog collection fields to include category, tags, reading_time, featured_image, accent_color,
    featured, seo_title, and seo_description.
  - Keep existing title, date, description, draft, and markdown body fields.
  - Phase 7.2: Build blog listing frontend.
  - Add a Hugo blog list layout for /blog/.
  - Style direction: modern cybersecurity editorial interface with animated grid background, neon scanline
    accents, category pills, featured article hero, and responsive card layout.
  - Render only non-draft posts, sorted newest first.
  - Add graceful empty state for no posts.
  - Phase 7.3: Build blog detail frontend.
  - Add a Hugo single layout for blog posts.
  - Include hero metadata, tags, reading-time display, featured image support, article body typography, and
    call-to-action back to services/contact.
  - Preserve existing global site design and do not modify existing service/about/contact content.
  - Phase 7.4: Verify blog frontend.
  - Add at least one draft sample content file only if needed for local visual testing, then keep it draft:
    true.
  - Run hugo and verify /blog/, a sample post, mobile layout, and empty-state behavior.

  ## Sprint 8: Portfolio Frontend and Case Study Presentation

  - Phase 8.1: Extend portfolio content model.
  - Update Decap portfolio collection fields to include client_type, service_category, challenge, solution,
    outcome, tools_used, metrics, featured_image, accent_color, featured, draft, and markdown body.
  - Keep optional client_name because some client work may need anonymization.
  - Phase 8.2: Build portfolio listing frontend.
  - Add a Hugo portfolio list layout for /portfolio/.
  - Style direction: case-study grid with cybernetic cards, animated border traces, service-category filters
    rendered as static links or chips, and visual outcome badges.
  - Show anonymized labels by default when client_name is absent.
  - Phase 8.3: Build portfolio detail frontend.
  - Add a Hugo single layout for portfolio entries.
  - Include challenge/solution/outcome sections, service metadata, tools used, optional metrics, image
    support, and CTA to the contact form.
  - Phase 8.4: Verify portfolio frontend.
  - Validate empty portfolio state.
  - Validate one draft sample entry if needed for local rendering.
  - Run hugo and manually inspect desktop/mobile layout.

  ## Sprint 9: Broader Security and Reliability Hardening

  - Phase 9.1: CSP and external dependency audit.
  - Update CSP only as needed for Decap CMS admin, Cloudflare Worker auth, GitHub OAuth flow, Cal.com iframe,
    Supabase, Google Fonts, and Turnstile.
  - Do not weaken CSP with broad wildcards except where technically required and documented.
  - Phase 9.2: Frontend runtime hardening.
  - Review inline scripts for unsafe rendering, especially CMS-generated content surfaces.
  - Ensure blog and portfolio templates render markdown through Hugo rather than raw client-side HTML
    injection.
  - Add rel="noopener" to external links where missing.
  - Phase 9.3: CMS editorial safety.
  - Enable Decap editorial workflow if you want staged review before publishing; default assumption is enable
    it for blog and portfolio, but not for fixed site pages.
  - Add required fields and helpful hints in CMS config so editors do not publish incomplete case studies or
    posts.
  - Phase 9.4: Deployment and operational checks.
  - Run hugo.
  - Test /admin/, /blog/, /portfolio/, /services/, /contact/, /portal/, and the chatbot after CSP changes.
  - Confirm GitHub Actions keep-alive and Hugo deploy workflows remain valid.

  ## Assumptions and Defaults

  - Use Cloudflare Worker OAuth proxy for CMS auth.
  - Use full frontends for blog and portfolio, not MVP-only pages.
  - Keep the existing CyberPenDef visual language, but make blog and portfolio more editorial and graphic-
    heavy with dynamic CSS accents.
  - Do not delete or rewrite existing website content.
  - Use https://cyberpendef.github.io as the production site origin unless a custom domain is provided later.
  - Replace <cloudflare-worker-url> with the actual deployed Worker URL during implementation and document it
    in static/admin/README.md.


  - Add graceful empty state for no posts.
  - Phase 7.3: Build blog detail frontend.
  - Add a Hugo single layout for blog posts.
  - Include hero metadata, tags, reading-time display, featured image support, article body typography, and
    call-to-action back to services/contact.
  - Preserve existing global site design and do not modify existing service/about/contact content.
  - Phase 7.4: Verify blog frontend.
  - Add at least one draft sample content file only if needed for local visual testing, then keep it draft:
    true.
  - Run hugo and verify /blog/, a sample post, mobile layout, and empty-state behavior.

  ## Sprint 8: Portfolio Frontend and Case Study Presentation

  - Phase 8.1: Extend portfolio content model.
  - Update Decap portfolio collection fields to include client_type, service_category, challenge, solution,
    outcome, tools_used, metrics, featured_image, accent_color, featured, draft, and markdown body.
  - Keep optional client_name because some client work may need anonymization.
  - Phase 8.2: Build portfolio listing frontend.
  - Add a Hugo portfolio list layout for /portfolio/.
  - Style direction: case-study grid with cybernetic cards, animated border traces, service-category filters
    rendered as static links or chips, and visual outcome badges.
  - Show anonymized labels by default when client_name is absent.
  - Phase 8.3: Build portfolio detail frontend.
  - Add a Hugo single layout for portfolio entries.
  - Include challenge/solution/outcome sections, service metadata, tools used, optional metrics, image
    support, and CTA to the contact form.
  - Phase 8.4: Verify portfolio frontend.
  - Validate empty portfolio state.
  - Validate one draft sample entry if needed for local rendering.
  - Run hugo and manually inspect desktop/mobile layout.

  ## Sprint 9: Broader Security and Reliability Hardening

  - Phase 9.1: CSP and external dependency audit.
  - Update CSP only as needed for Decap CMS admin, Cloudflare Worker auth, GitHub OAuth flow, Cal.com iframe,
    Supabase, Google Fonts, and Turnstile.
  - Do not weaken CSP with broad wildcards except where technically required and documented.
  - Phase 9.2: Frontend runtime hardening.
  - Review inline scripts for unsafe rendering, especially CMS-generated content surfaces.
  - Ensure blog and portfolio templates render markdown through Hugo rather than raw client-side HTML
    injection.
  - Add rel="noopener" to external links where missing.
  - Phase 9.3: CMS editorial safety.
  - Enable Decap editorial workflow if you want staged review before publishing; default assumption is enable
    it for blog and portfolio, but not for fixed site pages.
  - Add required fields and helpful hints in CMS config so editors do not publish incomplete case studies or
    posts.
  - Phase 9.4: Deployment and operational checks.
  - Run hugo.
  - Test /admin/, /blog/, /portfolio/, /services/, /contact/, /portal/, and the chatbot after CSP changes.
  - Confirm GitHub Actions keep-alive and Hugo deploy workflows remain valid.

  ## Assumptions and Defaults

  - Use Cloudflare Worker OAuth proxy for CMS auth.
  - Use full frontends for blog and portfolio, not MVP-only pages.
  - Keep the existing CyberPenDef visual language, but make blog and portfolio more editorial and graphic-
    heavy with dynamic CSS accents.
  - Do not delete or rewrite existing website content.
  - Use https://cyberpendef.github.io as the production site origin unless a custom domain is provided later.
  - Replace <cloudflare-worker-url> with the actual deployed Worker URL during implementation and document it
    in static/admin/README.md.


