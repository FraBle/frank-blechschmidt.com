# Playbook Log

Reusable workflows discovered during development.

---

### Upgrade npm/bun dependencies

**Trigger:** Periodic maintenance or security advisory.

**Steps:**
1. `bun update` — update within semver ranges.
2. `bunx npm-check-updates -u` — bump to latest majors (review breaking changes first).
3. `bun install` — regenerate lockfile.
4. `bun run build` — verify build passes.
5. Commit `package.json` + `bun.lock`.

**Verification:** `bun run build` succeeds.

**Docs updated:** None usually needed.

**Learning:** All deps were already latest when first checked — Astro/Cloudflare ecosystem moves fast, check frequently.

---

### Upgrade GitHub Actions and pin to SHAs

**Trigger:** Dependabot alert or periodic maintenance.

**Steps:**
1. Find latest release tag: `gh api repos/{owner}/{repo}/releases/latest --jq '.tag_name'`
2. Get commit SHA: `gh api repos/{owner}/{repo}/git/ref/tags/{tag} --jq '.object.sha'`
3. If `.object.type` is `"tag"` (annotated), dereference: `gh api repos/{owner}/{repo}/git/tags/{sha} --jq '.object.sha'`
4. Update workflow: `uses: {owner}/{repo}@{sha} # {tag}`
5. Commit and push.

**Verification:** CI passes on push.

**Docs updated:** None.

**Learning:** Most Actions use lightweight tags (direct commit refs), but some use annotated tags that need dereferencing.

---

### Add a new page

**Trigger:** New content page needed.

**Steps:**
1. Create `src/pages/{slug}.astro`.
2. Use `BaseLayout` with appropriate `title` prop.
3. Add HTML content inside `<div class="container">`.
4. Optionally add nav entry in `src/site.config.ts` → `nav` array.
5. `bun run build` to verify.

**Verification:** Page renders at `/{slug}`, nav link works if added.

**Docs updated:** Update Key Files in `AGENTS.md` if the page is significant.

**Learning:** Content is raw HTML in Astro pages (not Markdown) because the Hugo theme's styling depends on specific HTML structure.

---

### Add a new subdomain redirect

**Trigger:** New short URL like `{name}.frank-blechschmidt.com` needed.

**Steps:**
1. Add entry to `siteConfig.redirects` in `src/site.config.ts`.
2. `bun run build` to verify.
3. DNS: ensure `*.frank-blechschmidt.com` wildcard CNAME exists in Cloudflare.

**Verification:** `bun run preview`, then `curl -I -H "Host: {name}.frank-blechschmidt.com" http://localhost:8787/`

**Docs updated:** None.

**Learning:** Middleware reads hostname from request — works automatically for any subdomain in the redirect map.
