# Phase 6.2 Decap Worker Config Report

## Scope
- Wired Decap CMS production GitHub authentication to the deployed Cloudflare Worker OAuth proxy.
- Updated only the CMS configuration file for this phase.

## Worker URL
```text
https://cyberpendef-decap-oauth.cyberpendef.workers.dev
```

## File Changed
- `static/admin/config.yml`

## Configuration Added
```yaml
backend:
  base_url: https://cyberpendef-decap-oauth.cyberpendef.workers.dev
  auth_endpoint: auth

site_domain: cyberpendef.github.io
```

## Purpose
- `base_url` tells Decap CMS where to send the GitHub OAuth popup flow.
- `auth_endpoint: auth` maps Decap CMS to the Worker's `/auth` route.
- `site_domain` locks the expected production site domain and helps avoid mismatches between local and production CMS behavior.

## Important External Requirement
- The GitHub OAuth App callback URL must match:

```text
https://cyberpendef-decap-oauth.cyberpendef.workers.dev/callback
```

- The Cloudflare Worker must have these secrets configured:
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`
  - `OAUTH_STATE_SECRET`
  - `ALLOWED_ORIGIN=https://cyberpendef.github.io`

## Verification Plan
- Run `hugo`.
- Confirm `public/admin/config.yml` contains the Worker `base_url`, `auth_endpoint`, and `site_domain`.
- After deployment, revisit `/admin/` and click `Login with GitHub`.

## Verification Performed
- Ran `hugo` successfully.
- Confirmed `static/admin/config.yml` and `public/admin/config.yml` both include:
  - `base_url: https://cyberpendef-decap-oauth.cyberpendef.workers.dev`
  - `auth_endpoint: auth`
  - `site_domain: cyberpendef.github.io`

## Follow-Up Check
- A `HEAD` probe to `/auth` returned `405`, which is acceptable because the Worker only supports `GET` and `OPTIONS`.
- The same response exposed a suspicious `Access-Control-Allow-Origin` value that looked like a hash instead of `https://cyberpendef.github.io`.
- In Cloudflare Worker settings, verify that the `ALLOWED_ORIGIN` secret/value is exactly:

```text
https://cyberpendef.github.io
```

- If it is incorrect, update the Worker secret/value and redeploy the Worker before testing `/admin/` login.
