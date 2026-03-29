import type { APIRoute } from "astro";
import { handleEventProxy } from "../../../umami";

export const POST: APIRoute = async ({ request }) => {
  return handleEventProxy(request, import.meta.env.PUBLIC_UMAMI_WEBSITE_ID);
};
