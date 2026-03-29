import type { APIRoute } from "astro";

const UPSTREAM = "https://cloud.umami.is/script.js";

export const GET: APIRoute = async () => {
  try {
    const response = await fetch(UPSTREAM);

    if (!response.ok) {
      return new Response("Upstream error", { status: 502 });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Upstream error", { status: 502 });
  }
};
