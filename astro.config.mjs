// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// Production domain, e.g. SITE_URL=https://stephanylondono.com pnpm build.
// Canonical URLs and the sitemap are only generated when it is set.
const site = process.env.SITE_URL;

// https://astro.build/config
export default defineConfig({
  site,
  integrations: site ? [sitemap({ filter: (page) => !page.endsWith('/404/') })] : [],
  fonts: [
    {
      name: 'Cormorant Garamond',
      cssVariable: '--font-cormorant',
      provider: fontProviders.google(),
      weights: [500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      name: 'Manrope',
      cssVariable: '--font-manrope',
      provider: fontProviders.google(),
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
