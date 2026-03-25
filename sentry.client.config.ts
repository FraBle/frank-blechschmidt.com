import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
  integrations: [Sentry.browserTracingIntegration()],
  enableLogs: true,
  tracesSampleRate: 0.1,
});
