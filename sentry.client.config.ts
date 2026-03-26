import * as Sentry from "@sentry/astro";

// Guard: @astrojs/cloudflare pre-renders pages in workerd, which executes
// this file. Sentry's default integrations call addEventListener with
// useCapture=true, crashing workerd and producing empty HTML.
if (typeof window !== "undefined") {
  Sentry.init({
    dsn: import.meta.env.PUBLIC_SENTRY_DSN,
    environment: import.meta.env.PUBLIC_SENTRY_ENVIRONMENT || "production",
    sendDefaultPii: false,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
  });
}
