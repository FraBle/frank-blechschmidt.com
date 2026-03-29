import type { APIRoute } from "astro";
import { parseDsn, handleTunnelRequest } from "../tunnel";

const expectedDsn = parseDsn(import.meta.env.PUBLIC_SENTRY_DSN);

export const POST: APIRoute = async ({ request }) => {
  return handleTunnelRequest(request, expectedDsn);
};
