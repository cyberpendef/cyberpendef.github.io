# Phase 6.4 CMS Auth Verification Report

## Scope
- Verified the Decap CMS admin route, OAuth proxy wiring, and branded loading shell behavior.
- Used Playwright MCP and Chrome DevTools MCP for browser-level inspection as requested.

## Verification Performed
### Static and Build Verification
- Ran `hugo` successfully.
- Confirmed generated admin config contains:
  - `base_url: https://cyberpendef-decap-oauth.cyberpendef.workers.dev`
  - `auth_endpoint: auth`
  - `site_domain: cyberpendef.github.io`
- Confirmed generated admin HTML uses pinned Decap CMS:
  - `https://unpkg.com/decap-cms@3.8.3/dist/decap-cms.js`

### Cloudflare Worker OAuth Verification
- Probed:

```text
https://cyberpendef-decap-oauth.cyberpendef.workers.dev/auth?origin=https%3A%2F%2Fcyberpendef.github.io
```

- Result:
  - `HTTP/2 302`
  - Redirected to GitHub OAuth.
  - Redirect URI was correctly set to:

```text
https://cyberpendef-decap-oauth.cyberpendef.workers.dev/callback
```

- Probed `/callback` without OAuth parameters.
- Result:
  - Controlled auth error page returned.
  - `targetOrigin` was correctly set to:

```text
https://cyberpendef.github.io
```

### Playwright MCP Verification
- Loaded:

```text
http://127.0.0.1:1313/admin/
```

- Confirmed Decap CMS mounted successfully.
- Confirmed the branded loading shell is hidden after Decap loads:
  - `shellExists: true`
  - `shellHidden: true`
  - `cmsLoadedClass: true`
  - `ncRootExists: true`
  - `ncRootChildren: 1`
- Clicked `Login with GitHub`.
- Result:
  - Opened GitHub login/OAuth page.
  - URL used the Cloudflare Worker callback route, not the old Netlify auth endpoint.

### Chrome DevTools MCP Verification
- Loaded:

```text
http://127.0.0.1:1313/admin/
```

- Confirmed visible admin UI contains:
  - `Login with GitHub`
  - `Go back to site`
- Confirmed the loading shell is hidden after Decap loads using DOM inspection:
  - `shellHidden: true`
  - `cmsLoadedClass: true`
  - `ncRootChildren: 1`

## Console Notes
- Local console showed a failed request to:

```text
http://localhost:8081/api/v1
```

- This is expected in local testing when `npx decap-server` is not running and `local_backend: true` is enabled.
- Local console also showed a missing `favicon.ico`; this is unrelated to CMS auth.

## Outcome
- Phase 6.4 verification passed.
- The original `api.netlify.com/auth... Not Found` route is no longer used by the CMS login button.
- The branded admin loading shell no longer remains visible after Decap CMS content loads.
- GitHub login now reaches the GitHub OAuth page through the configured Cloudflare Worker flow.
