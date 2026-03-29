import type { APIRoute } from "astro";

const sentryDsn = new URL(import.meta.env.PUBLIC_SENTRY_DSN);
const SENTRY_HOST = sentryDsn.hostname;
const SENTRY_PROJECT_ID = sentryDsn.pathname.replace("/", "");

export const POST: APIRoute = async ({ request }) => {
  try {
    const envelope = await request.text();
    const header = JSON.parse(envelope.split("\n")[0]);

    const dsn = new URL(header.dsn);
    if (dsn.hostname !== SENTRY_HOST) {
      return new Response("Invalid DSN host", { status: 400 });
    }

    const projectId = dsn.pathname.replace("/", "");
    if (projectId !== SENTRY_PROJECT_ID) {
      return new Response("Invalid project", { status: 400 });
    }

    const upstream = `https://${SENTRY_HOST}/api/${projectId}/envelope/`;
    const response = await fetch(upstream, {
      method: "POST",
      body: envelope,
      headers: { "Content-Type": "application/x-sentry-envelope" },
    });

    return new Response(response.body, { status: response.status });
  } catch {
    return new Response("Invalid envelope", { status: 400 });
  }
};
