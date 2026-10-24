# CyberPenDef Decap CMS Admin Setup

## Purpose
The `/admin/` route loads Decap CMS and authenticates to GitHub through the Cloudflare Worker OAuth proxy.

## Production URLs
- Admin UI: `https://cyberpendef.github.io/admin/`
- OAuth Worker: `https://cyberpendef-decap-oauth.cyberpendef.workers.dev`
- OAuth callback: `https://cyberpendef-decap-oauth.cyberpendef.workers.dev/callback`

## GitHub App Settings
The deployed Worker is configured with a GitHub App client ID. Configure or update that GitHub App under:

```text
https://github.com/settings/apps
```

Set the app's user authorization callback URL to:

```text
https://cyberpendef-decap-oauth.cyberpendef.workers.dev/callback
```

Grant only the repository permissions required by the CMS:

| Permission | Access | Purpose |
| --- | --- | --- |
| Contents | Read and write | Read and save Hugo content through Git blobs, trees, and commits |
| Pull requests | Read and write | Required by the configured `editorial_workflow` to create and update review pull requests |
| Metadata | Read-only | Required repository metadata; GitHub grants this automatically |

Install the app on the `cyberpendef` account and ensure its repository access includes `cyberpendef.github.io`. If GitHub prompts the app owner to approve updated permissions, approve them. The user authorizing the CMS must also have write access to the repository.

The Worker does not send an OAuth `scope` parameter because GitHub App API access is controlled by the app's configured permissions and installation access, not classic OAuth App scopes.

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
6. The Worker completes Decap CMS's `authorizing:github` popup handshake.
7. The Worker sends the authentication result to Decap after the handshake.
8. Decap CMS loads the configured site page, blog, and portfolio collections.

## Local Development
- The shared `config.yml` intentionally does not enable `local_backend`; the deployed admin must use its configured GitHub backend and OAuth Worker.
- Use `https://cyberpendef.github.io/admin/` to test the complete GitHub OAuth and publishing flow.
- A local Hugo preview can verify admin styling and configuration loading, but local OAuth is not configured: the Worker posts successful authorization only to the production site origin.
- If you specifically need to edit a local repository with Decap Proxy, enable `local_backend: true` only in a local, uncommitted copy of `config.yml` and run `npx decap-server` from the repository root. This local proxy mode is not the production GitHub workflow and does not support the configured editorial workflow.
- Do not commit the local-only `local_backend` setting. It makes browsers try to contact a proxy on each visitor's own computer instead of using the hosted GitHub repository.

## Troubleshooting
- If the browser opens `api.netlify.com/auth...` and shows `Not Found`, the deployed `/admin/config.yml` is stale or missing the Worker `base_url`.
- If the Worker returns an origin-like hash in `Access-Control-Allow-Origin`, reset `ALLOWED_ORIGIN` to exactly `https://cyberpendef.github.io` and redeploy.
- If GitHub says the callback URL is invalid, verify the GitHub App's user authorization callback exactly matches the Worker callback URL.
- If GitHub login returns to `/admin/` but leaves Decap on the login screen, verify the deployed Worker performs the `authorizing:github` handshake before sending its authorization result.
- If Decap remains on the login screen or collections fail to load, confirm the deployed `/admin/config.yml` does not set `local_backend: true`; production must use the GitHub backend and Worker.
- If saving fails with `POST /git/blobs` returning `403 Resource not accessible by integration`, check the GitHub App's `Contents: Read and write` permission, repository installation access, owner approval of updated permissions, and the signing-in user's repository write access. After updating access, sign out of Decap and sign in again to obtain a fresh authorization.
