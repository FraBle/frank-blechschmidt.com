# Performance Optimization Design

> Make the portfolio site as fast/snappy as possible by optimizing images,
> caching, resource hints, and CSS animations.

## Scope

Five optimization categories. Prefetching was evaluated and dropped (single-page
site, no internal navigation to prefetch).

## 1. Image Optimization (Critical)

**Problem**: `public/avatar.jpg` is 5735x5735 JPEG (8.8 MB), served via plain
`<img>` at 128px CSS display size.

**Changes**:

- **Optimize the source file**: Replace `public/avatar.jpg` with a compressed
  ~300x300 JPEG (~15-30 KB). This size covers 2x retina at the 128px display
  size and remains sufficient for favicon generation.
- **Use Astro's `<Image />` component**: Update `Hero.astro` in the
  `dev-portfolio-ai` theme fork to import and use `<Image />` instead of plain
  `<img>`. This provides automatic WebP/AVIF format negotiation and `srcset`
  generation.
- **Move avatar into Astro's asset pipeline**: Place the image at
  `src/assets/avatar.jpg` so Astro processes it. Update the favicon config to
  reference this path (or keep a copy in `public/` if the favicon integration
  requires it).
- **LCP priority**: Add `loading="eager"` and `fetchpriority="high"` since the
  avatar is above the fold and likely the Largest Contentful Paint element.

**Files changed**:

- `public/avatar.jpg` — replace with optimized version (or remove if fully
  migrated to `src/assets/`)
- `src/assets/avatar.jpg` — new optimized image
- `node_modules/dev-portfolio-ai/src/components/sections/Hero.astro` — switch
  to `<Image />`
- `src/pages/index.astro` — update `image` prop to use imported asset
- `astro.config.mjs` — update favicon `input` path if needed

## 2. Caching Headers

**Problem**: `public/_headers` only contains an `X-Robots-Tag` rule for preview
domains. No `Cache-Control` directives.

**Changes** in `public/_headers`:

| Pattern | Header | Rationale |
|---------|--------|-----------|
| `/_astro/*` | `Cache-Control: public, max-age=31536000, immutable` | Content-hashed filenames; safe to cache forever |
| `/favicon*`, `/apple-touch-icon*`, `/safari-pinned-tab*` | `Cache-Control: public, max-age=604800` | Rarely change but not content-hashed (1 week) |
| `/*` | `Cache-Control: public, max-age=3600, s-maxage=86400` | 1h browser, 1d CDN; short enough for content updates |

**Files changed**: `public/_headers`

## 3. Resource Hints

**Problem**: Google Fonts (`Itim`) loaded from `fonts.googleapis.com` with no
`preconnect`. Browser must discover the `<link>` stylesheet, then perform
DNS+TCP+TLS to both `fonts.googleapis.com` (CSS) and `fonts.gstatic.com`
(font files).

**Changes** in `BaseLayout.astro` (theme fork), before the font stylesheet link:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

Sentry (server-side only) and Umami (conditional) are not worth hinting.

**Files changed**: `node_modules/dev-portfolio-ai/src/layouts/BaseLayout.astro`

## 4. Prefetching

**Dropped.** Astro's prefetch accelerates multi-page navigation. This is a
single-page portfolio with no internal navigation links to prefetch. Zero
impact; not worth the config noise.

## 5. CSS Animation Optimization

**Problem**: `border-shift` animation on `.ai-border` animates
`background-position` on a `background-size: 300% 300%` gradient, which
triggers main-thread repaints every frame for 6 seconds in an infinite loop.

The other two animations (`sparkle-pulse`, `shimmer`) already use
compositor-friendly properties (`transform`, `opacity`) and need no changes.

**Changes** in `src/pages/index.astro`:

- Replace `background-position` animation with a pseudo-element approach:
  the gradient is placed on a `::before` pseudo-element and animated via
  `transform: translate()`, which is GPU-composited.
- Add `will-change: transform` to the pseudo-element so the browser promotes
  it to its own compositor layer upfront.
- Keep the same visual effect (gradient border shifting diagonally on a
  6-second loop).

**Files changed**: `src/pages/index.astro` (style block, lines ~282-347)

## Expected Impact

| Metric | Before | After (est.) |
|--------|--------|-------------|
| Avatar transfer size | ~8.8 MB | ~5-15 KB (WebP at 128px) |
| LCP | Bottlenecked on avatar download | Sub-second on broadband |
| Repeat visit cache hits | None (no cache headers) | Full hit on `/_astro/*` assets |
| Google Fonts connection | ~100-300ms cold | Eliminated by preconnect |
| Animation frame budget | Repaints on `.ai-border` | Compositor-only, off main thread |

## Out of Scope

- Sentry trace sampling rate (explicitly excluded by user)
- Font self-hosting (system fonts + one Google Font is acceptable)
- Service worker / offline support
- Image CDN (Cloudflare already serves as CDN)
