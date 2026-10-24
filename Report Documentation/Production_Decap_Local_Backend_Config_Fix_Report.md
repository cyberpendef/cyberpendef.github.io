# Production Decap Local Backend Configuration Fix

## Root Cause
The deployed `static/admin/config.yml` enabled `local_backend: true` alongside the production GitHub backend. Decap Proxy is a local-development mode: it directs browser requests to a server on the visitor's own machine, normally `http://localhost:8081/api/v1`. The deployed admin's Content Security Policy also blocks that local connection. As a result, the production CMS could not reliably connect to its configured GitHub repository after the OAuth step.

The OAuth Worker callback currently targets `https://cyberpendef.github.io`, which matches the production admin origin. The reported failure therefore did not justify adding localhost origins to the production OAuth allowlist.

## Changes
- Removed `local_backend: true` from the shared CMS configuration so hosted Decap uses the configured GitHub backend.
- Documented that the local proxy setting must remain local and uncommitted.
- Clarified that the deployed admin is the supported place to test the complete GitHub OAuth and publishing workflow.
- Added a troubleshooting note for the case where production's deployed configuration still enables `local_backend`.

## Verification
- Confirm the production build succeeds.
- Confirm the generated `admin/config.yml` retains the GitHub backend and Worker settings and omits `local_backend`.
- Confirm the source CMS YAML remains valid.

## Deployment Note
The repository change must be pushed to `main` and deployed by GitHub Pages before the production admin is fixed. After deployment, reload `/admin/` without the browser cache and test GitHub login again. If authentication still fails after the local proxy setting is absent, capture the OAuth callback and browser console errors for a separate investigation of the Worker token exchange or popup messaging.
