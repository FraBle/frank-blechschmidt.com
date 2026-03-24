// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://frank-blechschmidt.com',
  output: 'server',
  adapter: cloudflare(),
  trailingSlash: 'never',
  server: {
    host: '0.0.0.0',
    allowedHosts: ['claude'],
  },
});