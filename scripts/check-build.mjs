/**
 * Post-build checks:  npm run build && npm run check
 * Verifies the generated site without a browser: required files, one <h1>
 * per page, SEO tags, valid JSON-LD, image alt text, and that every
 * internal link / asset reference resolves to a file in dist/.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteConfig } from '../src/config/site.js';
import { basePath } from '../src/lib/paths.js';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const problems = [];
const fail = (msg) => problems.push(msg);

if (!existsSync(dist)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const files = walk(dist);
const pages = files.filter((f) => f.endsWith('.html'));

for (const required of ['index.html', '404.html', 'sitemap.xml', 'robots.txt', 'favicon.svg', siteConfig.ogImage]) {
  if (!existsSync(join(dist, required))) fail(`missing ${required}`);
}

const resolveLocal = (url) => {
  const clean = url.split('#')[0].split('?')[0];
  if (!clean) return true;
  if (!clean.startsWith(basePath)) return false;
  let rel = clean.slice(basePath.length);
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  return existsSync(join(dist, decodeURIComponent(rel)));
};

for (const page of pages) {
  const name = relative(dist, page);
  const html = readFileSync(page, 'utf8');

  if (!/<link rel="stylesheet"[^>]+\.css"/.test(html)) fail(`${name}: no stylesheet linked`);
  if (!/<script type="module"[^>]+\.js"/.test(html)) fail(`${name}: no script linked`);

  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(`${name}: expected exactly one <h1>, found ${h1s.length}`);

  for (const tag of ['<title>', 'name="description"', 'rel="canonical"', 'property="og:title"', 'property="og:image"', 'name="twitter:card"', 'name="robots"']) {
    if (!html.includes(tag)) fail(`${name}: missing ${tag}`);
  }

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(json); } catch (e) { fail(`${name}: invalid JSON-LD (${e.message})`); }
  }
  if (name === 'index.html' && !html.includes('application/ld+json')) fail('index.html: no JSON-LD');

  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(img)) fail(`${name}: <img> without alt: ${img.slice(0, 80)}`);
  }

  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, url] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(url)) continue;
    if (url.startsWith('#')) {
      if (url.length > 1 && !ids.has(url.slice(1))) fail(`${name}: broken in-page anchor ${url}`);
      continue;
    }
    if (!resolveLocal(url)) fail(`${name}: broken link ${url}`);
  }
}

const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const path = new URL(loc).pathname;
  if (!resolveLocal(path)) fail(`sitemap: ${loc} has no matching file`);
}

if (siteConfig.url.includes('example.com')) console.warn('⚠  siteConfig.url is still the example.com placeholder.');
if (siteConfig.email.includes('example.com')) console.warn('⚠  siteConfig.email is still the example.com placeholder.');

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ ${pages.length} pages checked: SEO tags, JSON-LD, headings, alt text, links and sitemap all OK.`);
