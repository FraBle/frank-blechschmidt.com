import { defineMiddleware } from "astro:middleware";
import { handleSubdomain } from "./subdomain";

export const onRequest = defineMiddleware(async (context, next) => {
  return handleSubdomain(context, next);
});
