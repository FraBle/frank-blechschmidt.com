import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      name: "Frank Blechschmidt",
      description:
        "Resume and professional background of Frank Blechschmidt. Exposes resources for about, skills, contact, patents, and open source projects.",
      url: "https://frank-blechschmidt.com/mcp",
      transport: "streamable-http",
      version: "2025-11-25",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};
