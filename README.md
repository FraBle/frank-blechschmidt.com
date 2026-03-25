# frank-blechschmidt.com

Personal resume website built with [Astro](https://astro.build/) and deployed to [Cloudflare Workers](https://workers.cloudflare.com/).

## Tech Stack

- **Framework:** Astro (SSR mode)
- **Hosting:** Cloudflare Workers
- **Styling:** Bootstrap 4.6.2 + custom SCSS (ported from [hugo-researcher](https://github.com/FraBle/hugo-researcher) theme)
- **CI/CD:** GitHub Actions with [wrangler-action](https://github.com/cloudflare/wrangler-action)
- **Testing:** Vitest with 100% coverage
- **Linting:** oxlint, markdownlint-cli2, knip
- **Git hooks:** husky + lint-staged + commitlint (Conventional Commits)

## Features

- Server-side rendered resume/about and contact pages
- Subdomain redirects (e.g., `linkedin.frank-blechschmidt.com` → LinkedIn profile) handled via Astro middleware
- Cookie consent banner with Google Analytics (respects Do-Not-Track)
- Monospaced, minimal design with Inconsolata font

## Development

```bash
bun install
bun run dev
```

## Build

```bash
bun run build
bun run preview  # Preview with Wrangler locally
```

## Deployment

Deploys automatically on push to `main` via GitHub Actions.

### Required GitHub Secrets

| Secret                   | Description                          |
| ------------------------ | ------------------------------------ |
| `CLOUDFLARE_API_TOKEN`   | Cloudflare API token (Workers write) |
| `CLOUDFLARE_ACCOUNT_ID`  | Cloudflare account ID                |

## Project Structure

```text
├── public/               # Static assets (avatar, favicon, resume PDF)
├── src/
│   ├── pages/            # index, about, contact, 404
│   ├── middleware.ts     # Subdomain redirect logic
│   ├── subdomain.ts     # Subdomain extraction helper
│   └── site.config.ts   # Site configuration and redirect map
├── astro.config.mjs
├── vitest.config.ts
└── wrangler.jsonc
```

## License

[MIT](LICENSE)
