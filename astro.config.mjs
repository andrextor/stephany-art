// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// Production domain for canonical URLs, Open Graph and the sitemap. Override it when the
// custom domain is live, e.g. SITE_URL=https://stephanylondono.com pnpm build.
const site = process.env.SITE_URL ?? 'https://stephany.ialopez11012.workers.dev';

// https://astro.build/config
export default defineConfig({
  site,
  integrations: site
    ? [
        sitemap({
          filter: (page) => !page.endsWith('/404/'),
          i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } },
        }),
      ]
    : [],
  fonts: [
    {
      name: 'Cormorant Garamond',
      cssVariable: '--font-cormorant',
      provider: fontProviders.google(),
      weights: [500],
      styles: ['normal', 'italic'],
      display: 'swap',
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      name: 'Manrope',
      cssVariable: '--font-manrope',
      provider: fontProviders.google(),
      weights: [400, 600],
      styles: ['normal'],
      display: 'swap',
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
