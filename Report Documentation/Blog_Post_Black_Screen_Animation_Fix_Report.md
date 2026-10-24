# Blog Post Black Screen Animation Fix

## Root Cause

The published blog page included its article content in the HTML, but the entire article remained invisible because its computed opacity was `0`.

The blog detail layout applies the `stagger-in` class to the full article. The shared layout uses an `IntersectionObserver` to add the `visible` class, which starts the fade-in animation. The observer was configured with a `0.1` threshold, requiring at least 10% of the observed element's area to be visible at once. This article is substantially taller than the viewport, so the threshold was never reached and the observer never revealed it.

This was confirmed in the live browser: the article and content were present, the article had no `visible` class, and its computed opacity was `0`.

## Fix

- Changed the shared observer threshold from `0.1` to `0`. Staggered elements now begin their existing fade-in animation as soon as any part of the element intersects the viewport.
- This preserves the existing animation while ensuring long blog posts can render visibly.

## Verification

- Run `hugo --minify` to confirm the production site builds.
- Check the blog detail page in a browser and confirm the full post becomes visible after the article enters the viewport.
