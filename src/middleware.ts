import { defineMiddleware } from "astro:middleware";
import { handleSubdomain } from "./subdomain";

const HSTS_VALUE = "max-age=31536000; includeSubDomains";
const CSP_VALUE = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "worker-src 'self' blob:",
].join("; ");

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
  patched.headers.set("Content-Security-Policy", CSP_VALUE);
  patched.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  patched.headers.set("X-Frame-Options", "DENY");
  patched.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  patched.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return patched;
});
