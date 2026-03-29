import * as Sentry from "@sentry/cloudflare";
import handler from "@astrojs/cloudflare/entrypoints/server";

export default Sentry.withSentry(
  (env) => ({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT || "production",
    sendDefaultPii: false,
    enableLogs: true,
    integrations: [
      Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
    ],
    tracesSampleRate: parseFloat(env.SENTRY_TRACES_SAMPLE_RATE || "1.0"),
  }),
  handler,
);
