# Decap CMS OAuth Popup Handshake Fix

## Root Cause

The deployed CMS uses Decap CMS 3.8.3 and its GitHub OAuth backend. The pinned Decap bundle requires a two-way popup handshake:

1. The callback popup sends `authorizing:github` to the admin window.
2. Decap validates that message came from the configured OAuth worker origin and replies to the popup.
3. The popup returns an `authorization:github:success:...` or `authorization:github:error:...` message.

The Worker previously skipped the handshake: it sent the authorization result immediately and closed the popup. Decap was still listening for the initial handshake, so it ignored that result and never advanced beyond its login screen. Removing `local_backend` fixed the separate production configuration issue, but could not fix this Worker-to-Decap protocol mismatch.

## Changes

- Updated `cloudflare/decap-oauth-worker.js` to initiate the expected handshake, wait for a reply from both the exact admin origin and the opener window, then return the authentication result and close the popup.
- Added a clear message when the callback is opened without a CMS window.
- Added `cloudflare/decap-oauth-worker.test.js` to check handshake ordering, origin/source validation, result delivery, listener cleanup, and popup closure.
- Updated `static/admin/README.md` with the handshake flow and a focused troubleshooting entry.

## Verification

- Run the focused Worker regression check with:

```bash
node --experimental-default-type=module --test cloudflare/decap-oauth-worker.test.js
```

- Run a Hugo production build to verify the site and CMS assets still generate.
- The Worker is deployed independently of the GitHub Pages workflow. After this source fix is pushed, deploy it from the repository root with `npx wrangler deploy`; pushing the static site alone does not update the OAuth callback.

## User Impact

Once the updated Worker is deployed, the expected path is GitHub login → Worker callback → Decap popup handshake → CMS dashboard. The test does not perform a real GitHub login or expose OAuth credentials.
