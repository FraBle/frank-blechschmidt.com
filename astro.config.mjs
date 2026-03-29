// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import umami from '@yeskunall/astro-umami';
import sentry from '@sentry/astro';
import favicons from 'astro-favicons';
import skills from 'astro-skills';
import llms from 'astro-llms-generate';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://frank-blechschmidt.com',
  output: 'server',
  adapter: cloudflare({ prerenderEnvironment: 'node' }),
  integrations: [
    sitemap(),
    ...(process.env.PUBLIC_UMAMI_WEBSITE_ID
      ? [umami({
          id: process.env.PUBLIC_UMAMI_WEBSITE_ID,
          endpointUrl: 'https://frank-blechschmidt.com',
          trackerScriptName: 'a/script.js',
          hostUrl: '/a',
        })]
      : []),
    ...(process.env.SENTRY_AUTH_TOKEN
      ? [sentry({
          org: 'frank-blechschmidt',
          project: 'frank-blechschmidt-com',
          authToken: process.env.SENTRY_AUTH_TOKEN,
          telemetry: false,
          // Server-side Sentry is handled by worker-entry.ts via @sentry/cloudflare's
          // withSentry wrapper. Disabling here avoids double init and works around
          // a regex mismatch in @sentry/astro's Vite plugin that fails to wrap the
          // @astrojs/cloudflare v13 export pattern.
          enabled: { server: false },
          sourceMapsUploadOptions: {
            assets: ['dist/server/**/*', 'dist/client/**/*'],
          },
          unstable_sentryVitePluginOptions: {
            release: {
              setCommits: { auto: true },
            },
          },
        })]
      : []),
    favicons({
      input: { favicons: ['public/avatar.jpg'] },
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
  vite: {
    plugins: [tailwindcss()],
  },
  trailingSlash: 'never',
  // Bind all interfaces for container/Codespace/Claude dev environments
  server: {
    host: '0.0.0.0',
    allowedHosts: ['claude'],
  },
});
