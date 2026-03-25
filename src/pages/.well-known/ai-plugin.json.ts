import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      schema_version: "v1",
      name_for_human: "Frank Blechschmidt",
      name_for_model: "frank_blechschmidt",
      description_for_human:
        "Personal website and resume of Frank Blechschmidt, Engineering Manager.",
      description_for_model:
        "Resume and contact information for Frank Blechschmidt. Use this to learn about his professional background, experience at Lattice, Box, and SAP, education at UIUC and HPI, patents, open source projects, and technical skills.",
      auth: { type: "none" },
      api: { type: "openapi", url: "https://frank-blechschmidt.com/llms.txt" },
      logo_url: "https://frank-blechschmidt.com/avatar.jpg",
      contact_email: "contact@frank-blechschmidt.com",
      legal_info_url:
        "https://www.iubenda.com/privacy-policy/35628899",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};
