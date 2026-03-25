// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import umami from '@yeskunall/astro-umami';

// https://astro.build/config
export default defineConfig({
  site: 'https://frank-blechschmidt.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    ...(process.env.PUBLIC_UMAMI_WEBSITE_ID
      ? [umami({ id: process.env.PUBLIC_UMAMI_WEBSITE_ID })]
      : []),
  ],
  trailingSlash: 'never',
  server: {
    host: '0.0.0.0',
    allowedHosts: ['claude'],
  },
});