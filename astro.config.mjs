import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
// Change this to your real web address once you have it (used for the sitemap and share links).
export default defineConfig({ site: 'https://blue42prod.com', integrations: [sitemap()] });
