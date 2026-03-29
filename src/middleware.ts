import { defineMiddleware } from "astro:middleware";
import { handleSubdomain } from "./subdomain";

const HSTS_VALUE = "max-age=31536000; includeSubDomains";

export const onRequest = defineMiddleware(async (context, next) => {
  // Redirect HTTP to HTTPS
  const url = new URL(context.request.url);
  if (url.protocol === "http:" && url.hostname !== "localhost") {
    url.protocol = "https:";
    return new Response(null, {
      status: 301,
      headers: {
        Location: url.toString(),
        "Strict-Transport-Security": HSTS_VALUE,
      },
    });
  }

  const response = await handleSubdomain(context, next);

  // Clone response to ensure mutable headers (CF Workers responses can be immutable)
  const patched = new Response(response.body, response);
  patched.headers.set("Strict-Transport-Security", HSTS_VALUE);
  return patched;
});
