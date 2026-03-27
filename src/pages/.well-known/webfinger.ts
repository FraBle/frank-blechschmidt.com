import type { APIRoute } from "astro";

export const GET: APIRoute = ({ url }) => {
  const resource = url.searchParams.get("resource");

  if (
    resource !== "acct:frank@frank-blechschmidt.com" &&
    resource !== "https://frank-blechschmidt.com"
  ) {
    return new Response(JSON.stringify({ error: "Resource not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      subject: "acct:frank@frank-blechschmidt.com",
      aliases: ["https://frank-blechschmidt.com"],
      links: [
        {
          rel: "http://webfinger.net/rel/profile-page",
          type: "text/html",
          href: "https://frank-blechschmidt.com/",
        },
        {
          rel: "http://webfinger.net/rel/avatar",
          type: "image/jpeg",
          href: "https://frank-blechschmidt.com/avatar.jpg",
        },
        {
          rel: "https://webfinger.net/rel/openid-issuer",
          href: "https://frank-blechschmidt.com",
        },
      ],
    }),
    {
      headers: {
        "Content-Type": "application/jrd+json",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
};
