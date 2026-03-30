# Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize the portfolio site for maximum speed by compressing the avatar image, enabling Astro's image pipeline, adding caching headers, resource hints, and GPU-composited CSS animations.

**Architecture:** The avatar moves from `public/` (static copy) to `src/assets/` (Astro-processed). The theme fork (`dev-portfolio-ai`) gets two changes: Hero.astro switches from `<img>` to Astro `<Image />`, and BaseLayout.astro gets Google Fonts preconnect hints. Site-level changes add caching headers in `public/_headers` and rewrite the `.ai-border` CSS animation in `index.astro`.

**Tech Stack:** Astro 6 `<Image />` component, sharp (already available via Node), Cloudflare `_headers` file, CSS `transform` animations.

**Spec:** `docs/superpowers/specs/2026-03-29-performance-optimization-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `src/assets/avatar.jpg` | Optimized avatar for Astro image pipeline |
| Modify | `public/avatar.jpg` | Replace with optimized version (favicon source) |
| Modify | `node_modules/dev-portfolio-ai/src/types.ts:51-59` | Accept `ImageMetadata \| string` for image prop |
| Modify | `node_modules/dev-portfolio-ai/src/components/sections/Hero.astro:1-15,98-99` | Use Astro `<Image />` component |
| Modify | `node_modules/dev-portfolio-ai/src/layouts/BaseLayout.astro:47` | Add preconnect hints before font link |
| Modify | `src/pages/index.astro:112` | Pass imported ImageMetadata instead of string path |
| Modify | `public/_headers` | Add Cache-Control rules |
| Modify | `src/pages/index.astro:282-347` | Rewrite `.ai-border` animation to use transform |

---

### Task 1: Optimize Avatar Image

**Files:**

- Create: `src/assets/avatar.jpg`
- Modify: `public/avatar.jpg`

- [ ] **Step 1: Create the optimized avatar using sharp**

Run a one-off Node script to resize and compress the avatar. Sharp is already available.

```bash
node -e "
const sharp = require('sharp');
sharp('public/avatar.jpg')
  .resize(300, 300, { fit: 'cover' })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile('src/assets/avatar.jpg')
  .then(info => console.log('Created src/assets/avatar.jpg:', info.size, 'bytes'));
"
```

Expected: a file ~15-30 KB at 300x300.

- [ ] **Step 2: Replace public/avatar.jpg with the same optimized version**

The favicon integration reads from `public/avatar.jpg`. Replace it so favicon
generation uses the smaller file too.

```bash
cp src/assets/avatar.jpg public/avatar.jpg
```

- [ ] **Step 3: Verify both files exist and are small**

```bash
ls -lh src/assets/avatar.jpg public/avatar.jpg
```

Expected: both files ~15-30 KB.

- [ ] **Step 4: Commit**

```bash
git add src/assets/avatar.jpg public/avatar.jpg
git commit -m "perf: optimize avatar image from 8.8 MB to ~20 KB

Resize 5735x5735 to 300x300 (2x retina at 128px display), compress with
mozjpeg quality 80. Covers both Astro image pipeline (src/assets/) and
favicon generation (public/)."
```

---

### Task 2: Update Theme — Hero.astro to Use Astro `<Image />`

**Files:**

- Modify: `node_modules/dev-portfolio-ai/src/types.ts`
- Modify: `node_modules/dev-portfolio-ai/src/components/sections/Hero.astro`

- [ ] **Step 1: Update HeroProps type to accept ImageMetadata**

In `node_modules/dev-portfolio-ai/src/types.ts`, change the `image` field on
`HeroProps` (line 54) from `string` to accept both:

```typescript
// Before:
export interface HeroProps {
  name: string;
  label: string;
  image: string;
  email?: string;
  phone?: string;
  location?: LocationInfo;
  profiles?: ProfileItem[];
}

// After:
export interface HeroProps {
  name: string;
  label: string;
  image: ImageMetadata | string;
  email?: string;
  phone?: string;
  location?: LocationInfo;
  profiles?: ProfileItem[];
}
```

Add the import at the top of the file:

```typescript
import type { ImageMetadata } from "astro";
```

- [ ] **Step 2: Update Hero.astro to use Astro `<Image />`**

In `node_modules/dev-portfolio-ai/src/components/sections/Hero.astro`:

Add to the imports (after the existing imports, before the `interface` line):

```typescript
import { Image } from "astro:assets";
```

Replace line 99 (the `<img>` tag):

```astro
<!-- Before: -->
<img class="shadow-lg shadow-skin-hues" src={image} alt={name} />

<!-- After: -->
{typeof image === "string" ? (
  <img class="shadow-lg shadow-skin-hues" src={image} alt={name} loading="eager" fetchpriority="high" />
) : (
  <Image class="shadow-lg shadow-skin-hues" src={image} alt={name} width={256} height={256} loading="eager" fetchpriority="high" />
)}
```

Width/height 256 gives 2x for the 128px CSS display size. Astro will
auto-generate WebP format and appropriate quality.

- [ ] **Step 3: Build to verify the theme changes compile**

```bash
bun run build
```

Expected: build succeeds. The avatar is still passed as a string `/avatar.jpg`
at this point, so the string branch is used.

- [ ] **Step 4: Commit**

```bash
git add node_modules/dev-portfolio-ai/src/types.ts node_modules/dev-portfolio-ai/src/components/sections/Hero.astro
git commit -m "perf: update Hero component to use Astro Image

Accept ImageMetadata | string for the image prop. When ImageMetadata is
passed, renders via Astro <Image /> for automatic WebP/AVIF and srcset.
Falls back to plain <img> for string URLs. Adds loading=eager and
fetchpriority=high since avatar is above the fold (LCP element)."
```

---

### Task 3: Wire Up Avatar Import in index.astro

**Files:**

- Modify: `src/pages/index.astro`

- [ ] **Step 1: Import the avatar and pass it to Hero**

In `src/pages/index.astro`, add the import in the frontmatter (after the
existing imports, around line 16):

```typescript
import avatarImage from "../assets/avatar.jpg";
```

Then change the Hero prop (line 112):

```astro
<!-- Before: -->
image="/avatar.jpg"

<!-- After: -->
image={avatarImage}
```

- [ ] **Step 2: Build and verify**

```bash
bun run build
```

Expected: build succeeds. Check that the output includes an optimized image in
`dist/client/_astro/` with a hashed filename.

```bash
ls -lh dist/client/_astro/avatar*
```

Expected: a WebP or AVIF file, roughly 5-15 KB.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "perf: pass avatar through Astro image pipeline

Import avatar from src/assets/ as ImageMetadata and pass to Hero. Astro
now generates optimized WebP with content-hashed filename."
```

---

### Task 4: Add Google Fonts Preconnect in BaseLayout

**Files:**

- Modify: `node_modules/dev-portfolio-ai/src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add preconnect hints before the font stylesheet link**

In `node_modules/dev-portfolio-ai/src/layouts/BaseLayout.astro`, insert two
lines before line 47 (the Google Fonts `<link>` tag):

```html
<!-- Before: -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Itim" />

<!-- After: -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Itim" />
```

- [ ] **Step 2: Build to verify**

```bash
bun run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add node_modules/dev-portfolio-ai/src/layouts/BaseLayout.astro
git commit -m "perf: add preconnect hints for Google Fonts

Eliminates ~100-300ms DNS+TCP+TLS latency for fonts.googleapis.com and
fonts.gstatic.com by establishing early connections."
```

---

### Task 5: Add Caching Headers

**Files:**

- Modify: `public/_headers`

- [ ] **Step 1: Update the _headers file**

Replace the full contents of `public/_headers` with:

```
# Cloudflare Workers _headers file
# https://developers.cloudflare.com/pages/configuration/headers/

# Fingerprinted assets (JS, CSS, images processed by Astro) — cache forever
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

# Favicons — cache for 1 week (not content-hashed)
/favicon*
  Cache-Control: public, max-age=604800
/apple-touch-icon*
  Cache-Control: public, max-age=604800
/safari-pinned-tab*
  Cache-Control: public, max-age=604800

# HTML and everything else — 1h browser, 1d CDN
/*
  Cache-Control: public, max-age=3600, s-maxage=86400

# Preview deployments — noindex
https://:project.:subdomain.workers.dev/*
  X-Robots-Tag: noindex
```

- [ ] **Step 2: Build to verify the file is copied to dist**

```bash
bun run build && cat dist/client/_headers
```

Expected: the file appears in `dist/client/` with the new rules.

- [ ] **Step 3: Commit**

```bash
git add public/_headers
git commit -m "perf: add Cache-Control headers for static assets

Fingerprinted /_astro/* assets cached immutably (1 year). Favicons
cached for 1 week. HTML gets 1h browser / 1d CDN cache."
```

---

### Task 6: Rewrite .ai-border CSS Animation

**Files:**

- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace the .ai-border and .ai-section CSS**

In `src/pages/index.astro`, replace the entire `.ai-section` and `.ai-border`
CSS blocks (lines ~282-307) and the `@keyframes border-shift` (lines ~335-338)
with this complete replacement:

```css
/* Animated gradient border — GPU composited */
.ai-section {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}
.ai-section > :not(.ai-border) {
  position: relative;
  z-index: 1;
}
.ai-border {
  position: absolute;
  inset: 0;
  border-radius: 0.5rem;
  overflow: hidden;
  pointer-events: none;
}
.ai-border::before {
  content: "";
  position: absolute;
  inset: -100% -100%;
  background: linear-gradient(
    135deg,
    var(--color-accent) 0%,
    transparent 20%,
    transparent 80%,
    var(--color-accent) 100%
  );
  opacity: 0.5;
  animation: border-shift 6s ease-in-out infinite;
  will-change: transform;
}
.ai-border::after {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: calc(0.5rem - 1px);
  background: var(--color-fill);
}
```

And replace `@keyframes border-shift`:

```css
@keyframes border-shift {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(25%, 25%); }
}
```

How it works: instead of animating `background-position` (repaint every frame),
an oversized `::before` pseudo-element carries the static gradient and moves via
`transform: translate()` (GPU composited). The `::after` pseudo-element masks
the interior, leaving only the 1px border edge visible. `isolation: isolate` on
the parent and `z-index: 1` on content siblings ensure correct stacking.

- [ ] **Step 2: Build and visually verify**

```bash
bun run build && bun run preview
```

Open `http://localhost:8787` in a browser. Verify:

- "Machine-Readable" card has shifting gradient border (same visual as before)
- Pills, text, and copy button render above the border (not obscured)
- Animation is smooth

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "perf: switch .ai-border animation to GPU-composited transform

Replace background-position animation (triggers repaints) with transform
on a pseudo-element (compositor-only). Same visual effect, no main thread
paint work."
```

---

### Task 7: Final Verification

- [ ] **Step 1: Full build**

```bash
bun run build
```

Expected: clean build, no warnings.

- [ ] **Step 2: Check optimized image output**

```bash
ls -lh dist/client/_astro/avatar* dist/client/avatar.jpg
```

Expected: `_astro/avatar*.webp` ~5-15 KB, `avatar.jpg` ~15-30 KB.

- [ ] **Step 3: Check _headers in output**

```bash
cat dist/client/_headers
```

Expected: all Cache-Control rules present.

- [ ] **Step 4: Run tests**

```bash
bun run build && vitest run
```

Expected: all tests pass.

- [ ] **Step 5: Preview and spot-check**

```bash
bun run preview
```

Open `http://localhost:8787`. Check:

- Avatar loads quickly and looks correct (not blurry or stretched)
- "Machine-Readable" card has animated gradient border
- Page source includes `<link rel="preconnect" ...>` for Google Fonts
- Network tab shows `_astro/*` responses have `Cache-Control: immutable`

- [ ] **Step 6: Commit any remaining changes**

If any tweaks were needed during verification, commit them.
