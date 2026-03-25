import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = () => {
  const body = `Contact: mailto:contact@frank-blechschmidt.com
Expires: 2027-03-25T00:00:00.000Z
Preferred-Languages: en, de
Canonical: https://frank-blechschmidt.com/.well-known/security.txt
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
};
