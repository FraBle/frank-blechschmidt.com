import { defineMiddleware } from "astro:middleware";
import { redirects } from "./site.config";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const host = url.hostname;

  // Handle subdomain redirects (e.g., linkedin.frank-blechschmidt.com)
  const mainDomain = "frank-blechschmidt.com";
  let subdomain: string | null = null;

  if (host.endsWith(`.${mainDomain}`)) {
    subdomain = host.replace(`.${mainDomain}`, "");
  } else if (host.endsWith(".localhost")) {
    // Local development support
    subdomain = host.replace(".localhost", "");
  }

  if (subdomain && subdomain in redirects) {
    return context.redirect(redirects[subdomain], 302);
  }

  if (subdomain && subdomain !== "www") {
    // Unknown subdomain -> 404
    return new Response("Not Found", { status: 404 });
  }

  return next();
});
