import type { APIRoute } from "astro";
import { handleMcpRequest } from "../mcp";

export const ALL: APIRoute = async ({ request }) => {
  return handleMcpRequest(request);
};
