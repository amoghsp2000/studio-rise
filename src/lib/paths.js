import { siteConfig } from '../config/site.js';

const siteUrl = new URL(siteConfig.url);

/** Base path derived from siteConfig.url, e.g. '/' or '/my-repo/'. */
export const basePath = siteUrl.pathname.endsWith('/') ? siteUrl.pathname : `${siteUrl.pathname}/`;

/** Absolute origin + base, always with a trailing slash. */
export const siteRoot = `${siteUrl.origin}${basePath}`;

const strip = (p) => String(p).replace(/^\/+/, '');

/** Site-relative link that respects the base path: link('projects/x/') → '/repo/projects/x/'. */
export const link = (path = '') => `${basePath}${strip(path)}`;

/** Absolute URL for canonical, Open Graph, sitemap and schema. */
export const absolute = (path = '') => `${siteRoot}${strip(path)}`;

/** Anchor that works from any page: '#work' → '/repo/#work'. */
export const anchor = (hash, onHome = true) => (onHome ? hash : `${basePath}${hash}`);

export const projectPath = (slug) => `projects/${slug}/`;
