// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [svelte(), react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
