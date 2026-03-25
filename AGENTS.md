# AGENTS.md

> Shared conventions for all AI agents working on this project,
> regardless of platform.
> Read by: Cursor, Claude Code, Gemini, and other agent platforms.
> Last updated: 2026-03-24

## Purpose

This file is the single source of truth for how AI agents collaborate on
this project. Every platform-specific config (`CLAUDE.md`, etc.) should
reference this file rather than duplicating its contents.

## Instruction Precedence

When instructions conflict, apply this order:

1. System/developer/platform runtime instructions
2. `AGENTS.md`
3. User request

## Project Overview

Personal portfolio/CV website of Frank Blechschmidt. Astro project hosted on Cloudflare Workers: <http://frank-blechschmidt.com>

### Commands

- `bun install` — install dependencies
- `bun run dev` — start Astro dev server (localhost:4321)
- `bun run build` — production build to `dist/`
- `bun run preview` — preview production build locally via Wrangler

### Environment

- **Runtime:** Bun (managed via [mise](https://mise.jdx.dev/), global config `latest`)
- **Framework:** Astro 6 (SSR mode)
- **Adapter:** `@astrojs/cloudflare` — deploys to Cloudflare Workers
- **Styling:** SCSS (via `sass`), Bootstrap 4.6.2 + Font Awesome + Academicons (CDN)
- **CI/CD:** GitHub Actions → `wrangler deploy`

### Key Files

- `src/site.config.ts` — all site configuration (nav, footer, redirects, consent, GA)
- `src/middleware.ts` — subdomain redirect logic (replaces former Go server)
- `src/layouts/BaseLayout.astro` — main HTML layout (head, CDN links, slot)
- `src/pages/about.astro` — primary resume/CV content
- `src/pages/contact.astro` — contact info and links
- `src/styles/researcher.scss` — ported hugo-researcher theme styles
- `astro.config.mjs` — Astro config (SSR, Cloudflare adapter)
- `wrangler.jsonc` — Cloudflare Workers config

## Shared Principles

These apply to all agents regardless of platform:

- **Read before writing.** Always read existing files before modifying them.
- **Small PRs.** One concern per PR. Prompt the human before large-scope changes.
- **Don't guess on undocumented patterns.** Ask the human or check the decision log.
- **Follow known patterns first.** Check decision/playbook/anti-pattern logs
  before inventing a new workflow.
- **Update docs when you learn.** If you discover something, record it so the
  next agent (on any platform) benefits.
- **Ask when gaps appear.** If required context is missing, ask a concise
  clarifying question before multi-step execution.
- **Credential safety.** Never print secrets to stdout. They persist in
  transcripts and logs.
- **Ask before you spend.** If the operator's prompt is vague or ambiguous,
  ask clarifying questions before executing. Specificity keeps token costs and
  wasted cycles down. A 10-second clarification is cheaper than a wrong
  multi-step workflow.

## Agent Protocol

- PRs: use `gh pr view/diff` (no URLs).
- CI: `gh run list/view` (rerun/fix til green).
- "Make a note" => edit AGENTS.md (shortcut; not a blocker). Ignore `CLAUDE.md`.
- Bugs: add regression test when it fits.
- Keep files <~500 LOC; split/refactor as needed.
- Large scope: ask before edits touching >10 files, >500 LOC, adding
  dependencies, schema/migration updates, or CI/workflow changes.
- Commits: Conventional Commits (`feat|fix|refactor|build|ci|chore|docs|style|perf|test`).
- Prefer end-to-end verify; if blocked, say what's missing.
- New deps: quick health check (recent releases/commits, adoption).
- Web: search early; quote exact errors; prefer 2024–2026 sources.
- Style: telegraph. Drop filler/grammar. noun-phrases ok. Min tokens
  (global AGENTS + replies).
- Use repo's package manager/runtime; no swaps w/o approval.
- Decision log: `docs/decisions.md` (append date, context, decision, rationale, impact).
- Playbook log: `docs/playbooks.md` (append trigger, steps, verification,
  docs updated, learning).
- Anti-pattern log: `docs/anti-patterns.md` (append context, failure signal,
  preferred pattern, recovery).

## Build / Test

- Before handoff: run full gate (lint/typecheck/tests/docs).
- CI red: `gh run list/view`, rerun, fix, push, repeat until green.
- Keep it observable (logs, panes, tails, MCP/browser tools).

## Definition of Done

- Docs-only change: docs updated, links/commands validated, no broken references.
- Code change: lint green, tests green, build green.
- Dependency change (`bun.lock`): health check recorded + validation rerun.

## Validation Matrix

- `bun.lock`: `bun install --frozen-lockfile`, then `bun run build`.
- `src/**/*.astro`, `src/**/*.ts`, `src/**/*.scss`: `bun run build`.
- `wrangler.jsonc`: `bun run build`, then `bun run preview` (smoke test).
- `.github/workflows/*.yml`: review only (CI validates on push).

## Approval Matrix

- Ask first: new branch creation/rename, dependency additions/removals,
  CI/workflow edits, force-push/rebase of shared branches.
- Implicitly authorized: if user asks for CI recovery on an existing
  branch/PR, pushes needed to get CI green are allowed.
- No approval needed: read-only inspection (`git status/diff/log`, file
  reads, local non-destructive checks).

## Git

- **Never push directly to main.** All changes go through PRs.
  Create a feature branch, push it, and open a PR. Even single-line
  fixes must go through the PR workflow.
- Safe by default: `git status/diff/log`. Push only when user asks.
- `git checkout` ok for PR review / explicit request.
- Branch changes require user consent.
- Destructive ops forbidden unless explicit (`reset --hard`, `clean`,
  `restore`, `rm`, ...).
- Remotes: prefer HTTPS; flip SSH->HTTPS before pull/push.
- Don't delete/rename unexpected stuff; stop + ask.
- No repo-wide S/R scripts; keep edits small/reviewable.
- If user types a command ("pull and push"), that's consent for that command.
- No amend unless asked.
- Big review: `git --no-pager diff --color=never`.
- Multi-agent: check `git status/diff` before edits; ship small commits.
- No `/` in branch names, use `-` instead

## Critical Thinking

- Fix root cause (not band-aid).
- Unsure: read more code; if still stuck, ask w/ short options.
- Conflicts: call out; pick safer path.

## Blocked Work Reporting

- Use this format: `blocked_by`, `attempted`, `exact_error`, `next_safe_option`.
- Include exact command and first actionable error line; do not paraphrase away
  key details.

## Continuous Learning

- Start from existing patterns in `docs/decisions.md`, `docs/playbooks.md`,
  and `docs/anti-patterns.md`.
- If those docs do not cover a new scenario, ask a focused clarifying question
  before committing to a multi-step path.
- After execution, record reusable workflows in `docs/playbooks.md`.
- After incidents or missteps, record what to avoid in
  `docs/anti-patterns.md`.
- When learning changes project policy, add/update `docs/decisions.md`.

## Maintenance

- Any change to `AGENTS.md` must update the `Last updated` date.
- Any non-trivial rule change in `AGENTS.md` must add an entry in `docs/decisions.md`.
