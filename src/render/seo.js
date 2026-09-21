import { siteConfig, contactConfig } from '../config/site.js';
import { services } from '../data/services.js';
import { projects } from '../data/projects.js';
import { technologyLayers } from '../data/technologies.js';
import { esc, attr, jsonLd, safeUrl } from '../lib/html.js';
import { absolute, link, projectPath } from '../lib/paths.js';

/** Keyword list for <meta name="keywords"> (low SEO weight today, kept short and honest). */
export const keywords = [
  'software development company', 'software development studio', 'custom software development',
  'backend development services', 'API development', 'API integration services', 'PHP development',
  'web application development', 'SaaS development', 'business automation', 'workflow automation',
  'AI integration', 'AI agent development', 'software development India', 'freelance software developer India',
];

/** Common <head> tags. `page` = { title, description, path, type, image, noindex } */
export function headTags(page = {}) {
  const title = page.title || `Custom Software, API & Automation Development | ${siteConfig.name}`;
  const description = page.description || siteConfig.description;
  const canonical = absolute(page.path || '');
  const image = absolute(page.image || siteConfig.ogImage);
  const robots = page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large';

  return `
    <title>${esc(title)}</title>
    <meta name="description" content="${attr(description)}">
    <meta name="keywords" content="${attr(keywords.join(', '))}">
    <meta name="author" content="${attr(siteConfig.founder.name)}">
    <meta name="robots" content="${robots}">
    <link rel="canonical" href="${attr(canonical)}">
    <meta name="theme-color" content="${attr(siteConfig.themeColor)}">

    <meta property="og:type" content="${attr(page.type || 'website')}">
    <meta property="og:site_name" content="${attr(siteConfig.name)}">
    <meta property="og:locale" content="${attr(siteConfig.locale)}">
    <meta property="og:title" content="${attr(title)}">
    <meta property="og:description" content="${attr(description)}">
    <meta property="og:url" content="${attr(canonical)}">
    <meta property="og:image" content="${attr(image)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${attr(`${siteConfig.name}: ${siteConfig.tagline}`)}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${attr(title)}">
    <meta name="twitter:description" content="${attr(description)}">
    <meta name="twitter:image" content="${attr(image)}">

    <link rel="icon" href="${attr(link('favicon.svg'))}" type="image/svg+xml">
    <link rel="icon" href="${attr(link('favicon-32.png'))}" sizes="32x32" type="image/png">
    <link rel="apple-touch-icon" href="${attr(link('apple-touch-icon.png'))}">
    <link rel="manifest" href="${attr(link('site.webmanifest'))}">`;
}

const ids = {
  org: () => absolute('#organization'),
  person: () => absolute('#founder'),
  site: () => absolute('#website'),
};

const sameAs = () => Object.values(siteConfig.social).map(safeUrl).filter(Boolean);

function organization() {
  return {
    '@type': 'Organization',
    '@id': ids.org(),
    name: siteConfig.name,
    url: absolute(''),
    logo: absolute('apple-touch-icon.png'),
    description: siteConfig.description,
    email: siteConfig.email || undefined,
    founder: { '@id': ids.person() },
    sameAs: sameAs().length ? sameAs() : undefined,
    areaServed: siteConfig.areaServed || undefined,
    knowsAbout: [...new Set(technologyLayers.flatMap((l) => l.items.map((i) => i.name)))],
    makesOffer: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, description: s.summary },
    })),
    contactPoint: siteConfig.email
      ? { '@type': 'ContactPoint', contactType: 'sales', email: siteConfig.email, availableLanguage: ['English'] }
      : undefined,
  };
}

function person() {
  return {
    '@type': 'Person',
    '@id': ids.person(),
    name: siteConfig.founder.name,
    jobTitle: siteConfig.founder.role,
    worksFor: { '@id': ids.org() },
    url: absolute('#about'),
    homeLocation: siteConfig.location ? { '@type': 'Place', name: siteConfig.location } : undefined,
    sameAs: sameAs().length ? sameAs() : undefined,
  };
}

function website() {
  return {
    '@type': 'WebSite',
    '@id': ids.site(),
    name: siteConfig.name,
    url: absolute(''),
    description: siteConfig.description,
    publisher: { '@id': ids.org() },
    inLanguage: siteConfig.lang,
  };
}

export function projectSchema(p) {
  const github = safeUrl(p.links?.github);
  const node = {
    '@type': github ? 'SoftwareSourceCode' : 'CreativeWork',
    name: p.title,
    description: p.summary,
    url: p.caseStudy ? absolute(projectPath(p.slug)) : undefined,
    creator: { '@id': ids.org() },
    keywords: (p.technologies || []).join(', '),
    dateCreated: p.year || undefined,
    creativeWorkStatus: p.status,
  };
  if (github) {
    node.codeRepository = github;
    node.programmingLanguage = p.technologies?.[0];
  }
  return node;
}

const clean = (obj) => JSON.parse(JSON.stringify(obj)); // drops undefined

export function homeSchema() {
  return jsonLd(
    clean({
      '@context': 'https://schema.org',
      '@graph': [
        organization(),
        person(),
        website(),
        {
          '@type': 'ItemList',
          name: `Projects by ${siteConfig.name}`,
          itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: projectSchema(p) })),
        },
      ],
    })
  );
}

export function caseStudySchema(p) {
  return jsonLd(
    clean({
      '@context': 'https://schema.org',
      '@graph': [
        { ...organization(), makesOffer: undefined },
        { ...projectSchema(p), '@id': absolute(`${projectPath(p.slug)}#project`), about: p.caseStudy?.problem },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: absolute('') },
            { '@type': 'ListItem', position: 2, name: 'Projects', item: absolute('#work') },
            { '@type': 'ListItem', position: 3, name: p.title, item: absolute(projectPath(p.slug)) },
          ],
        },
      ],
    })
  );
}

export const contactMode = contactConfig.mode;
