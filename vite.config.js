import { defineConfig } from 'vite';
import siteGenerator from './plugins/site-generator.js';

// The base path comes from siteConfig.url (see src/config/site.js),
// so GitHub project pages (/repo/) and custom domains (/) both just work.
export default defineConfig({
  plugins: [siteGenerator()],
  build: {
    target: 'es2019',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    reportCompressedSize: true,
  },
});
