import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://sebastiancoding.com',
    integrations: [mdx(), sitemap()],
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'es'],
    }
});
