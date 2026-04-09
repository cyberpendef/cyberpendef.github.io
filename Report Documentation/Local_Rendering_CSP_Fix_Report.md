# Local Rendering CSP Fix Report

## Scope
- Investigated the local Hugo preview rendering issue where the website loaded without its expected CSS styling.
- Traced the browser CSP violation back to the stylesheet URL generated in the base layout.

## Root Cause
- The main stylesheet in `layouts/_default/baseof.html` used Hugo's `Permalink`.
- `Permalink` generated an absolute URL using the production `baseURL` value: `https://cyberpendef.github.io/...`.
- During local testing on `http://localhost:1313`, the page origin and stylesheet origin no longer matched.
- The existing Content Security Policy allowed styles only from `'self'` and `https://fonts.googleapis.com`, so the browser correctly blocked the production-origin stylesheet.
- Once the stylesheet was blocked, the page fell back to raw HTML layout, which caused the broken rendering shown in the screenshot.

## Code Change
### `layouts/_default/baseof.html`
- Replaced `{{ $style.Permalink }}` with `{{ $style.RelPermalink }}`.
- Added a short template comment explaining why the stylesheet must stay same-origin for local previews.

## Why This Fix Is Correct
- `RelPermalink` keeps the generated CSS path relative to the current site origin.
- In production, the stylesheet still resolves correctly under the deployed domain.
- In local Hugo preview, the stylesheet now resolves from `localhost`, which satisfies the current CSP policy.
- This avoids weakening the CSP just to accommodate local development.

## Verification
- The fix should remove the CSP stylesheet violation for the main site bundle during local preview.
- A Hugo build was run after the change to ensure the template still renders correctly.

## Outcome
- Local preview and production now use the same stylesheet resource safely, without cross-origin CSP conflicts for the main CSS bundle.
