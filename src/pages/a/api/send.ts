import type { APIRoute } from "astro";

const UPSTREAM = "https://api-gateway.umami.dev/api/send";
const MAX_BODY_SIZE = 65536; // 64KB

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return new Response("Invalid content type", { status: 400 });
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
    return new Response("Payload too large", { status: 413 });
  }

  try {
    const body = await request.text();
    if (body.length > MAX_BODY_SIZE) {
      return new Response("Payload too large", { status: 413 });
    }

    const { payload } = JSON.parse(body);
    if (payload?.website !== import.meta.env.PUBLIC_UMAMI_WEBSITE_ID) {
      return new Response("Forbidden", { status: 403 });
    }

    const response = await fetch(UPSTREAM, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    return new Response(response.body, { status: response.status });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return new Response("Invalid JSON", { status: 400 });
    }
    return new Response("Upstream error", { status: 502 });
  }
};
