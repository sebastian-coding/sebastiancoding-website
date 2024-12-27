import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://sebastiancoding.com',
    integrations: [mdx(), sitemap(), partytown({
        config: {
            forward: ['dataLayer.push']
        }
    })],
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'es'],
    }
});
