import type { APIRoute } from "astro";
import { handleEventProxy } from "../../../umami";

const websiteId = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID;

export const POST: APIRoute = async ({ request }) => {
  if (!websiteId) {
    return new Response("Umami proxy not configured", { status: 500 });
  }
  return handleEventProxy(request, websiteId);
};
