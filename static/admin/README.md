# CyberPenDef Decap CMS Admin Setup

## Purpose
The `/admin/` route loads Decap CMS and authenticates to GitHub through the Cloudflare Worker OAuth proxy.

## Production URLs
- Admin UI: `https://cyberpendef.github.io/admin/`
- OAuth Worker: `https://cyberpendef-decap-oauth.cyberpendef.workers.dev`
- OAuth callback: `https://cyberpendef-decap-oauth.cyberpendef.workers.dev/callback`

## GitHub OAuth App Settings
Create or update a GitHub OAuth App at:

```text
https://github.com/settings/developers
```

Use:

```text
Application name:
CyberPenDef Decap CMS

Homepage URL:
https://cyberpendef.github.io

Authorization callback URL:
https://cyberpendef-decap-oauth.cyberpendef.workers.dev/callback
```

Do not enable Device Flow unless a future CMS auth flow explicitly requires it.

## Cloudflare Worker Secrets
Set these values in Cloudflare for the Worker:

```text
GITHUB_CLIENT_ID=<GitHub OAuth App client ID>
GITHUB_CLIENT_SECRET=<GitHub OAuth App client secret>
OAUTH_STATE_SECRET=<long random value>
ALLOWED_ORIGIN=https://cyberpendef.github.io
```

With Wrangler:

```bash
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler secret put OAUTH_STATE_SECRET
npx wrangler secret put ALLOWED_ORIGIN
npx wrangler deploy
```

## Expected Login Flow
1. Visit `https://cyberpendef.github.io/admin/`.
2. Click `Login with GitHub`.
3. Decap opens the Worker `/auth` route.
4. The Worker redirects to GitHub OAuth.
5. GitHub redirects to the Worker `/callback` route.
6. The Worker sends the token back to the Decap CMS popup flow.
7. Decap CMS loads the configured site page, blog, and portfolio collections.

## Local Development
- The shared `config.yml` intentionally does not enable `local_backend`; the deployed admin must use its configured GitHub backend and OAuth Worker.
- Use `https://cyberpendef.github.io/admin/` to test the complete GitHub OAuth and publishing flow.
- A local Hugo preview can verify admin styling and configuration loading, but local OAuth is not configured: the Worker posts successful authorization only to the production site origin.
- If you specifically need to edit a local repository with Decap Proxy, enable `local_backend: true` only in a local, uncommitted copy of `config.yml` and run `npx decap-server` from the repository root. This local proxy mode is not the production GitHub workflow and does not support the configured editorial workflow.
- Do not commit the local-only `local_backend` setting. It makes browsers try to contact a proxy on each visitor's own computer instead of using the hosted GitHub repository.

## Troubleshooting
- If the browser opens `api.netlify.com/auth...` and shows `Not Found`, the deployed `/admin/config.yml` is stale or missing the Worker `base_url`.
- If the Worker returns an origin-like hash in `Access-Control-Allow-Origin`, reset `ALLOWED_ORIGIN` to exactly `https://cyberpendef.github.io` and redeploy.
- If GitHub says the callback URL is invalid, verify the GitHub OAuth App callback exactly matches the Worker callback URL.
- If Decap remains on the login screen or collections fail to load, confirm the deployed `/admin/config.yml` does not set `local_backend: true`; production must use the GitHub backend and Worker.
