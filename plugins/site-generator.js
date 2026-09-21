/**
 * Vite plugin that turns the data + component files into a fully
 * pre-rendered static site:
 *   • injects rendered <head> tags and page markup into index.html
 *   • emits /projects/<slug>/index.html for every project with a caseStudy
 *   • emits 404.html, sitemap.xml and robots.txt
 *   • serves all of the above in the dev server too
 *
 * Because config and data are plain ES modules, adding a project or
 * changing company details never requires touching this file.
 */
import { siteConfig } from '../src/config/site.js';
import { basePath, absolute, projectPath } from '../src/lib/paths.js';
import {
  homeHead, homeBody, caseStudyProjects, caseStudyHead, caseStudyBody, notFoundBody,
} from '../src/render/pages.js';
import { headTags } from '../src/render/seo.js';

const today = () => new Date().toISOString().slice(0, 10);

function documentShell({ head, body, assets }) {
  return `<!doctype html>
<html lang="${siteConfig.lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${head}
    ${assets}
  </head>
  <body>
    ${body}
  </body>
</html>
`;
}

export function sitemapXml() {
  const urls = [
    { loc: absolute(''), priority: '1.0' },
    ...caseStudyProjects().map((p) => ({ loc: absolute(projectPath(p.slug)), priority: '0.7' })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today()}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}
</urlset>
`;
}

export const robotsTxt = () => `User-agent: *
Allow: /

Sitemap: ${absolute('sitemap.xml')}
`;

/** Preload the display font used by the hero headline (avoids a late swap on the LCP element). */
function fontPreloads(bundle) {
  if (!bundle) return '';
  return Object.keys(bundle)
    .filter((f) => /bricolage-grotesque-latin-wght-normal-.*\.woff2$/.test(f))
    .map((f) => `\n    <link rel="preload" href="${basePath}${f}" as="font" type="font/woff2" crossorigin>`)
    .join('');
}

const extraPages = () => [
  ...caseStudyProjects().map((p) => ({
    fileName: `${projectPath(p.slug)}index.html`,
    head: caseStudyHead(p),
    body: caseStudyBody(p),
  })),
  {
    fileName: '404.html',
    head: headTags({ title: `Page not found | ${siteConfig.name}`, path: '404.html', noindex: true }),
    body: notFoundBody(),
  },
];

export default function siteGenerator() {
  return {
    name: 'site-generator',

    config() {
      return { base: basePath };
    },

    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!html.includes('<!--site:body-->')) return html;
        return html
          .replace('<!--site:head-->', `<!--site:head-->${fontPreloads(ctx.bundle)}`)
          .replace('__LANG__', siteConfig.lang)
          .replace('<!--site:head-->', homeHead())
          .replace('<!--site:body-->', homeBody());
      },
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = (req.url || '').split('?')[0];
        if (!url.startsWith(basePath)) return next();
        const rel = url.slice(basePath.length);
        const send = (type, body) => { res.setHeader('Content-Type', type); res.end(body); };

        if (rel === 'sitemap.xml') return send('application/xml', sitemapXml());
        if (rel === 'robots.txt') return send('text/plain', robotsTxt());

        const target = rel.endsWith('/') || rel === '' ? `${rel}index.html` : rel;
        const page = extraPages().find((p) => p.fileName === target);
        if (!page) return next();
        const html = documentShell({
          head: page.head,
          body: page.body,
          assets: `<script type="module" src="${basePath}src/main.js"></script>`,
        });
        send('text/html', await server.transformIndexHtml(url, html));
      });
    },

    // order: 'post' so Vite's CSS plugin has already added the stylesheet to the bundle.
    generateBundle: { order: 'post', handler(_options, bundle) {
      const entry = Object.values(bundle).find((c) => c.type === 'chunk' && c.isEntry);
      // With cssCodeSplit: false Vite emits one stylesheet asset rather than
      // attaching it to the entry chunk, so collect CSS from the bundle itself.
      const css = [
        ...new Set([
          ...(entry?.viteMetadata ? [...entry.viteMetadata.importedCss] : []),
          ...Object.keys(bundle).filter((f) => f.endsWith('.css')),
        ]),
      ];
      const assets = [
        fontPreloads(bundle).trim(),
        entry ? `<script type="module" crossorigin src="${basePath}${entry.fileName}"></script>` : '',
        ...css.map((f) => `<link rel="stylesheet" crossorigin href="${basePath}${f}">`),
      ].join('\n    ');

      for (const page of extraPages()) {
        this.emitFile({ type: 'asset', fileName: page.fileName, source: documentShell({ ...page, assets }) });
      }
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml() });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt() });
    } },
  };
}
