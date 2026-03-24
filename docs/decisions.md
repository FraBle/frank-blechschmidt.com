# Decision Log

Append-only log of architectural and project decisions.

---

### 2026-03-24 — Migrate from Hugo + Go + GAE to Astro + Cloudflare Workers

**Context:** Site was Hugo (static) + Go HTTP server (subdomain redirects) on Google App Engine. Stack had three moving parts for a two-page resume site.

**Decision:** Replace with Astro (SSR mode) on Cloudflare Workers.

**Rationale:**
- Astro SSR lets middleware handle subdomain redirects natively — no separate server needed.
- Cloudflare Workers: edge-deployed, no cold starts, simpler than GAE.
- Astro's component model is cleaner than Hugo templates for this use case.
- Reduces stack from three technologies (Hugo + Go + GAE) to one (Astro + CF Workers).

**Impact:** Removed Hugo, Go server, GAE config, git submodule. All logic now lives in Astro pages + middleware.

---

### 2026-03-24 — Port hugo-researcher theme as custom SCSS + Astro components

**Context:** Hugo site used the `hugo-researcher` theme as a git submodule. Theme uses Bootstrap 4.6.2, Inconsolata font, and custom SCSS with Hugo template variables.

**Decision:** Port the theme's SCSS directly (hardcoding the default variable values) and convert Hugo partials to Astro components. Keep Bootstrap/Font Awesome/Academicons as CDN links.

**Rationale:**
- Theme is simple (~160 lines SCSS). Keeping it as a dependency (submodule) adds complexity for no benefit.
- CDN links match the original and avoid bundling large CSS frameworks.
- Hardcoded SCSS values are fine — this site has one user and one theme.

**Impact:** No git submodule dependency. Theme is fully owned in `src/styles/researcher.scss` and `src/components/`.

---

### 2026-03-24 — SSR mode for subdomain redirects via Astro middleware

**Context:** The Go server's primary purpose (beyond static file serving) was subdomain-based redirects (e.g., `linkedin.frank-blechschmidt.com` → LinkedIn profile).

**Decision:** Use Astro's `output: 'server'` mode with middleware to handle subdomain redirects. Redirect map lives in `src/site.config.ts`.

**Rationale:**
- Static output would require external redirect rules (Cloudflare Bulk Redirects) — more infrastructure to manage.
- Middleware keeps redirect logic co-located with the app.
- SSR overhead is negligible for a two-page site on Workers.

**Impact:** All redirect logic in `src/middleware.ts`. No external redirect configuration needed.

---

### 2026-03-24 — Pin GitHub Actions to commit SHAs

**Context:** GitHub Actions were referenced by tag (e.g., `actions/checkout@v4`).

**Decision:** Pin all external Actions to full commit SHAs with version comments.

**Rationale:** Supply chain security. Tags are mutable — SHAs are not.

**Impact:** Actions pinned to SHAs. Version comments (e.g., `# v6.0.2`) preserved for readability.

---

### 2026-03-24 — Migrate from npm to Bun

**Context:** Project was scaffolded with npm.

**Decision:** Switch to Bun as package manager and build runner.

**Rationale:**
- Faster installs and builds.
- Frank uses mise to manage Bun globally.
- Production runtime is Cloudflare Workers (workerd) regardless — Bun is dev/CI only.

**Impact:** `package-lock.json` → `bun.lock`. CI uses `oven-sh/setup-bun`. README updated.

---

### 2026-03-24 — Use mise for tool version management

**Context:** Needed a way to manage Bun (and other tool) versions consistently.

**Decision:** Use mise (global config) rather than project-level `.tool-versions` or `.nvmrc`.

**Rationale:** Frank already uses mise globally for bun, go, and node. No need for project-level overrides for a single-developer project.

**Impact:** No `.tool-versions` or `.mise.toml` in repo. Agents should expect tools on PATH via mise.
