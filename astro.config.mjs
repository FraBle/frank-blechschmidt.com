// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import umami from '@yeskunall/astro-umami';
import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://frank-blechschmidt.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    ...(process.env.PUBLIC_UMAMI_WEBSITE_ID
      ? [umami({ id: process.env.PUBLIC_UMAMI_WEBSITE_ID })]
      : []),
    sentry({
      org: 'frank-blechschmidt',
      project: 'javascript-astro',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
    }),
  ],
  trailingSlash: 'never',
  server: {
    host: '0.0.0.0',
    allowedHosts: ['claude'],
  },
});
