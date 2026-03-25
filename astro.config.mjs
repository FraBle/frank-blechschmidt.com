// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import umami from '@yeskunall/astro-umami';
import sentry from '@sentry/astro';
import favicons from 'astro-favicons';
import skills from 'astro-skills';
import llms from 'astro-llms-generate';

// https://astro.build/config
export default defineConfig({
  site: 'https://frank-blechschmidt.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    sitemap(),
    ...(process.env.PUBLIC_UMAMI_WEBSITE_ID
      ? [umami({ id: process.env.PUBLIC_UMAMI_WEBSITE_ID })]
      : []),
    sentry({
      org: 'frank-blechschmidt',
      project: 'javascript-astro',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
    }),
    favicons({
      name: 'Frank Blechschmidt',
      short_name: 'FB',
      icons: {
        android: false,
        appleIcon: true,
        appleStartup: false,
        windows: false,
        yandex: false,
      },
    }),
    skills(),
    llms(),
  ],
  trailingSlash: 'never',
  server: {
    host: '0.0.0.0',
    allowedHosts: ['claude'],
  },
});
