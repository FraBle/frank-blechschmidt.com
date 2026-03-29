import type { APIRoute } from "astro";

const UPSTREAM = "https://api-gateway.umami.dev/api/send";

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return new Response("Invalid content type", { status: 400 });
  }

  try {
    const body = await request.text();
    const response = await fetch(UPSTREAM, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    return new Response(response.body, { status: response.status });
  } catch {
    return new Response("Upstream error", { status: 502 });
  }
};
