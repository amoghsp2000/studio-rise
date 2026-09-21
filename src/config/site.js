/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — the one file to edit for company details.
 * ─────────────────────────────────────────────────────────────
 * Used at build time (pre-rendered HTML, SEO tags, JSON-LD,
 * sitemap.xml, robots.txt) and in the browser.
 * Never put secrets here: this file ships to every visitor.
 */

export const siteConfig = {
  /** Company / studio name. Header, footer, titles and schema. */
  name: 'Studio Rise',

  /** One or two letters used by the temporary logo mark. */
  mark: 'R',

  /** Founder details (About section + Person schema). */
  founder: {
    name: 'Amogh',
    role: 'Founder & Software Engineer',
  },

  /** Short positioning line, used in the footer and schema. */
  tagline: 'Custom software, backend systems, APIs, automation and AI integration.',

  /** Meta description (aim for 140–160 characters). */
  description:
    'Software development studio building custom web applications, backend systems, API integrations, business automation and AI-powered software for growing businesses.',

  /**
   * Full public URL of the site, INCLUDING any sub-path, with a trailing slash.
   *   Custom domain:        'https://yourstudio.com/'
   *   GitHub project page:  'https://<user>.github.io/<repo>/'
   *   GitHub user page:     'https://<user>.github.io/'
   * Vite's base path, canonical URLs, the sitemap and every internal
   * link are derived from this value automatically.
   */
  url: 'https://amoghsp2000.github.io/studio-rise/',

  /** Public contact email (mailto links + contact form fallback). */
  email: 'amoghpuranikmath22@gmail.com',

  /** Optional. Empty string hides it. */
  location: 'Karnataka, India',
  areaServed: 'Clients worldwide, working remotely from India',

  /** Empty string hides a link everywhere (header, footer, schema). */
  social: {
    github: '',
    linkedin: '',
    x: '',
  },

  /** Default social-share image (1200×630, lives in /public). */
  ogImage: 'assets/images/og-image.png',

  lang: 'en',
  locale: 'en_IN',
  themeColor: '#0b1a2b',
};

/**
 * Contact / lead capture.
 * GitHub Pages has no server, so the form either opens the visitor's
 * email client or posts to a static form provider.
 *
 *   mode: 'mailto'     → no third party, works immediately
 *   mode: 'formspree'  → formEndpoint: 'https://formspree.io/f/<id>'
 *   mode: 'custom'     → any endpoint that accepts a JSON POST
 */
export const contactConfig = {
  mode: 'mailto',
  formEndpoint: '',
  /** Optional scheduling link (Cal.com, Calendly…). Empty → email fallback. */
  bookingUrl: '',
  /** First-reply expectation you are comfortable committing to. Empty hides it. */
  responseTime: 'Replies usually within one working day.',
};

/**
 * Analytics are OFF by default. Supported providers:
 *   'plausible' → trackingId: your domain as registered in Plausible
 *   'umami'     → trackingId: website ID, scriptUrl: your Umami script URL
 *   'ga4'       → trackingId: 'G-XXXXXXX'
 */
export const analyticsConfig = {
  enabled: false,
  provider: 'none',
  trackingId: '',
  scriptUrl: '',
};

/** Main navigation. In-page anchors are resolved against the home page. */
export const navigation = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Approach', href: '#approach' },
  { label: 'Stack', href: '#stack' },
  { label: 'About', href: '#about' },
];
