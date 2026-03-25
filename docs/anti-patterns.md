# Anti-Pattern Log

Patterns to avoid, discovered during development.

---

## Don't use `rm` without `-f` in automated/scripted contexts

**Context:** During migration, `rm package-lock.json` prompted for confirmation interactively, blocking the pipeline.

**Failure signal:** Command hangs waiting for stdin confirmation.

**Preferred pattern:** Always use `rm -f` for non-interactive file removal. For directories, `rm -rf`.

**Recovery:** Kill the stuck process, rerun with `-f` flag.

---

## Don't swap package managers or runtimes without approval

**Context:** Project uses Bun (chosen explicitly). An agent might default to npm/yarn/pnpm.

**Failure signal:** `package-lock.json` appears alongside `bun.lock`, or CI uses wrong install command.

**Preferred pattern:** Check `AGENTS.md` → Environment section for the repo's package manager. Use it consistently. No swaps without user approval.

**Recovery:** Remove the wrong lockfile, regenerate with the correct package manager.

---

## Don't reference GitHub Actions by tag alone

**Context:** Tags are mutable — a compromised upstream could push malicious code to an existing tag.

**Failure signal:** Actions referenced as `uses: foo/bar@v3` without SHA.

**Preferred pattern:** Pin to full commit SHA with version comment: `uses: foo/bar@{sha} # v3.x.x`

**Recovery:** Look up the tag's SHA via `gh api repos/{owner}/{repo}/git/ref/tags/{tag}` and pin it.

---

## Don't use Hugo shortcodes in Astro content

**Context:** Original content used Hugo shortcodes like `{{< figure class="avatar" src="/avatar.jpg" >}}`. These don't work in Astro.

**Failure signal:** Build error or literal shortcode text rendered in output.

**Preferred pattern:** Use standard HTML (`<figure class="avatar"><img src="/avatar.jpg" /></figure>`) or Astro components.

**Recovery:** Replace shortcode syntax with equivalent HTML.
