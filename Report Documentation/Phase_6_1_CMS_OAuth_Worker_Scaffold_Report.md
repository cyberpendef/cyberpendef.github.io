# Phase 6.1 CMS OAuth Worker Scaffold Report

## Scope
- Added the repository scaffold for the Decap CMS GitHub OAuth proxy.
- Focused only on the Cloudflare Worker source file for Phase 6.1.
- Did not wire `static/admin/config.yml` to the Worker yet; that belongs to Phase 6.2 after the deployed Worker URL is known.

## File Added
- `cloudflare/decap-oauth-worker.js`

## Implementation Summary
- Added a Cloudflare Worker with two Decap/GitHub OAuth routes:
  - `GET /auth`: creates a signed OAuth state payload and redirects the browser to GitHub authorization.
  - `GET /callback`: verifies the signed state, exchanges the GitHub code for an access token, and returns the Decap-compatible popup `postMessage` result.
- Kept all sensitive values external to the repository:
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`
  - `OAUTH_STATE_SECRET`
  - `ALLOWED_ORIGIN`
- Added state signing with HMAC-SHA256 and a 10-minute state expiry to reduce OAuth replay risk.
- Restricted the default allowed origin to `https://cyberpendef.github.io`.

## Security Notes
- No GitHub OAuth client secret was committed.
- The Worker callback response uses a restrictive CSP for the popup page.
- The Worker defaults to a single allowed production origin and does not use a broad wildcard CORS policy.

## Phase 6.2 Follow-Up
- Deploy the Worker to Cloudflare.
- Create a GitHub OAuth App with callback URL `https://<cloudflare-worker-url>/callback`.
- Set Worker secrets in Cloudflare.
- Update `static/admin/config.yml` with:
  - `backend.base_url`
  - `backend.auth_endpoint: auth`
  - `site_domain: cyberpendef.github.io`

## Outcome
- Phase 6.1 scaffold is complete.
- The CMS auth failure is not expected to be fixed until Phase 6.2 wires Decap CMS to a deployed Worker URL.
