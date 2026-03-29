import { redirects } from "./site.config";

const MAIN_DOMAIN = "frank-blechschmidt.com";

export function extractSubdomain(hostname: string): string | null {
  if (hostname.endsWith(`.${MAIN_DOMAIN}`)) {
    return hostname.replace(`.${MAIN_DOMAIN}`, "");
  }
  if (hostname.endsWith(".localhost")) {
    return hostname.replace(".localhost", "");
  }
  return null;
}

interface SubdomainContext {
  request: Request;
  redirect: (url: string, status: number) => Response;
}

export async function handleSubdomain(
  context: SubdomainContext,
  next: () => Promise<Response>,
): Promise<Response> {
  const url = new URL(context.request.url);
  const subdomain = extractSubdomain(url.hostname);

  if (subdomain && subdomain in redirects) {
    console.log("Subdomain redirect:", subdomain, "->", redirects[subdomain]);
    return context.redirect(redirects[subdomain], 302);
  }

  if (subdomain && subdomain !== "www") {
    console.warn("Unknown subdomain:", subdomain);
    return new Response("Not Found", { status: 404 });
  }

  return next();
}
