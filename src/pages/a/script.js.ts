import type { APIRoute } from "astro";
import { handleScriptProxy } from "../../umami";

export const GET: APIRoute = async () => {
  return handleScriptProxy();
};
