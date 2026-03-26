import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.PUBLIC_SENTRY_ENVIRONMENT || "production",
  sendDefaultPii: false,
  enableLogs: true,
  tracesSampleRate: 1.0,
});
