# Phase 5.2 Cal.com Integration Report

## Scope
- Implemented a configurable Cal.com booking embed for the Services and Contact pages.
- Kept the integration non-destructive by introducing a reusable partial and config-driven booking settings.

## Files Changed
- `config.toml`
- `layouts/partials/booking_embed.html`
- `layouts/contact/list.html`
- `layouts/services/list.html`

## Code Logic and Purpose
### `config.toml`
- Added:
  - `params.cal_booking_url`
  - `params.cal_booking_title`
  - `params.cal_booking_description`
- This keeps the booking configuration editable from one place without modifying page templates.

### `layouts/partials/booking_embed.html`
- Introduced a shared booking section used by multiple pages.
- If `cal_booking_url` is configured:
  - renders an inline iframe booking experience
  - adds a direct-link fallback in case an iframe is blocked or fails to load
- If `cal_booking_url` is empty:
  - renders a visible admin-facing placeholder message instead of a broken embed

### `layouts/contact/list.html` and `layouts/services/list.html`
- Added the reusable booking partial near the lower portion of each page so users can book after reading service and contact details.

## Security and Compatibility Notes
- The existing CSP already permits `https://cal.com` in `frame-src`, so an iframe-based embed remains compatible with the current site policy.
- The embed is lazy-loaded and uses `referrerpolicy=\"strict-origin-when-cross-origin\"`.

## Operational Follow-Up Required
- Set `params.cal_booking_url` in `config.toml` to your real Cal.com booking page URL to activate the live calendar.
- If you want production scheduling authentication, event routing, or team/event-type selection, those still need to be configured in your Cal.com account outside the repository.

## Outcome
- Phase 5.2 repository implementation is complete.
- Services and Contact now have a reusable, configurable scheduling section ready for a live Cal.com booking URL.
