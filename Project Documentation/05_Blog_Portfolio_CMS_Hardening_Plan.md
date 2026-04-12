# Blog/Portfolio Frontends, Decap CMS Auth, and Hardening Plan

## Summary
- Root cause for `/admin/` GitHub login failure: Decap CMS is configured with the GitHub backend, but no server-side OAuth proxy is configured.
- Chosen production auth approach: Cloudflare Worker OAuth proxy for Decap CMS.
- Frontend scope: full blog and portfolio frontends with modern cybersecurity styling and dynamic CSS graphics.
- Production origin assumption: `https://cyberpendef.github.io`.

---

## Sprint 6: CMS Auth Recovery and Admin Hardening
**Goal:** Restore production Decap CMS GitHub login and make the admin surface safer and clearer.

### Phase 6.1: Cloudflare Worker OAuth Proxy Scaffold
- Create `cloudflare/decap-oauth-worker.js`.
- Implement `GET /auth` to redirect to GitHub OAuth.
- Implement `GET /callback` to exchange the GitHub authorization code and return a Decap-compatible popup message.
- Keep secrets external:
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`
  - `OAUTH_STATE_SECRET`
  - `ALLOWED_ORIGIN`
- Document that the GitHub OAuth callback URL must be `https://<cloudflare-worker-url>/callback`.

### Phase 6.2: Wire Decap CMS to the Worker
- Update `static/admin/config.yml`.
- Add `backend.base_url: https://<cloudflare-worker-url>`.
- Add `backend.auth_endpoint: auth`.
- Keep `backend.name: github`, `repo: cyberpendef/cyberpendef.github.io`, and `branch: main`.
- Add `site_domain: cyberpendef.github.io`.
- Keep `local_backend: true` for local-only CMS testing.

### Phase 6.3: Admin Route Hardening
- Pin the Decap CMS CDN version instead of using a broad semver range.
- Add a CMS-specific admin loading style.
- Add `static/admin/README.md` with OAuth setup steps, callback URL, required secrets, and expected login flow.

### Phase 6.4: CMS Auth Verification
- Test `/admin/` locally with `npx decap-server`.
- Test production `/admin/` after Worker deployment.
- Confirm GitHub login returns to the CMS, loads collections, and can create a draft blog post.

---

## Sprint 7: Blog Frontend With Modern Dynamic CSS Graphics
**Goal:** Add a complete blog experience that can be managed through Decap CMS.

### Phase 7.1: Blog Content Model
- Extend the Decap `blog` collection with:
  - `category`
  - `tags`
  - `reading_time`
  - `accent_color`
  - `featured`
  - `seo_title`
  - `seo_description`
- Keep existing `title`, `date`, `description`, `draft`, `featured_image`, and markdown body fields.

### Phase 7.2: Blog Listing Frontend
- Add `/blog/` list layout.
- Use a modern cybersecurity editorial style with animated grid background, scanline accents, category pills, featured hero, and responsive article cards.
- Render non-draft posts newest first.
- Add graceful empty state.

### Phase 7.3: Blog Detail Frontend
- Add blog single layout.
- Include metadata, tags, reading time, featured image support, article typography, and CTA back to services/contact.

### Phase 7.4: Blog Verification
- Run `hugo`.
- Verify `/blog/`, blog detail pages, mobile layout, draft exclusion, and empty state.

---

## Sprint 8: Portfolio Frontend and Case Study Presentation
**Goal:** Add a portfolio/case-study experience that can be managed through Decap CMS.

### Phase 8.1: Portfolio Content Model
- Extend the Decap `portfolio` collection with:
  - `client_type`
  - `challenge`
  - `solution`
  - `tools_used`
  - `metrics`
  - `accent_color`
  - `featured`
- Keep `client_name` optional for anonymized client work.

### Phase 8.2: Portfolio Listing Frontend
- Add `/portfolio/` list layout.
- Use cybernetic case-study cards, animated border traces, category chips, and outcome badges.
- Show anonymized labels when `client_name` is absent.

### Phase 8.3: Portfolio Detail Frontend
- Add portfolio single layout.
- Include challenge, solution, outcome, service metadata, tools used, optional metrics, image support, and contact CTA.

### Phase 8.4: Portfolio Verification
- Run `hugo`.
- Verify `/portfolio/`, portfolio detail pages, mobile layout, draft exclusion, and empty state.

---

## Sprint 9: Broader Security and Reliability Hardening
**Goal:** Tighten security, reliability, and operational readiness after adding CMS-managed content.

### Phase 9.1: CSP and External Dependency Audit
- Update CSP only as needed for Decap CMS admin, Cloudflare Worker auth, GitHub OAuth, Cal.com iframe, Supabase, Google Fonts, and Turnstile.
- Avoid broad wildcards unless required and documented.

### Phase 9.2: Frontend Runtime Hardening
- Review CMS-generated content templates for unsafe rendering.
- Ensure blog and portfolio content is rendered through Hugo markdown handling, not client-side HTML injection.
- Add `rel="noopener"` to external links where missing.

### Phase 9.3: CMS Editorial Safety
- Enable editorial workflow for blog and portfolio if staged review is desired.
- Add required CMS fields and hints to prevent incomplete content publishing.

### Phase 9.4: Deployment and Operational Checks
- Run `hugo`.
- Test `/admin/`, `/blog/`, `/portfolio/`, `/services/`, `/contact/`, `/portal/`, and the chatbot.
- Confirm GitHub Actions deploy and Supabase keep-alive workflows remain valid.
