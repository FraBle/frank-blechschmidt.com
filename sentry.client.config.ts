import * as Sentry from "@sentry/astro";

// Guard against execution in workerd during pre-rendering.
// @astrojs/cloudflare pre-renders pages in the workerd runtime, which bundles
// this client config into the server pre-rendering code. Sentry's BrowserClient
// default integrations call addEventListener(type, handler, true) which workerd
// rejects, crashing pre-rendering and producing empty HTML pages.
if (typeof window !== "undefined") {
  Sentry.init({
    dsn: import.meta.env.PUBLIC_SENTRY_DSN,
    sendDefaultPii: false,
    enableLogs: true,
    tracesSampleRate: 0.1,
  });
}
