# Software studio website

A static, SEO-first landing page for a software development studio. It is built with Vite and plain JavaScript and deploys to GitHub Pages with no backend.

Every page is **pre-rendered to HTML at build time** from data files. Search engines and visitors without JavaScript see the full content. The small client script (≈6 KB) only adds interactivity: the mobile menu, project filters, the hero trace tabs and the contact form.

---

## Quick start

Requires Node.js 18.18 or newer (the deploy workflow uses Node 22).

```bash
npm install
npm run dev       # http://localhost:5173 with live reload
npm run build     # production build → dist/
npm run preview   # serve dist/ locally at http://localhost:4173
npm run check     # validate the build (SEO tags, JSON-LD, links, headings, alt text)
```

---

## Before you publish: replace the placeholders

Open **`src/config/site.js`** and set:

| Setting | What to put |
|---|---|
| `name`, `mark` | Studio name and the letter(s) used in the logo mark |
| `founder` | Your name and title |
| `url` | Your real public URL, **with trailing slash** (see *Deploy* below) |
| `email` | The address enquiries should go to |
| `social.github`, `social.linkedin`, `social.x` | Profile URLs; leave empty to hide |
| `location`, `areaServed` | Optional; empty string hides them |

`npm run check` prints a warning while `url` or `email` still point at `example.com`.

Then update the brand assets:

1. Edit `NAME` and `MARK` at the top of `scripts/make-brand-assets.py` and run `python3 scripts/make-brand-assets.py`. It needs Pillow and fontTools; see *Brand assets* below. This regenerates the PNG favicons, the app icons and `public/assets/images/og-image.png`.
2. Edit the letter in `public/favicon.svg`.
3. Edit `name` and `short_name` in `public/site.webmanifest`.

---

## Where everything lives

```
├── .github/workflows/deploy.yml   GitHub Pages deployment
├── index.html                     Template; content is injected at build time
├── vite.config.js
├── plugins/
│   └── site-generator.js          Pre-renders pages, emits sitemap/robots/404/case studies
├── public/                        Copied as-is: favicons, OG image, project images
│   └── assets/projects/           ← put project screenshots here
├── scripts/
│   ├── check-build.mjs            Post-build validation
│   └── make-brand-assets.py       Regenerates favicons + OG image
└── src/
    ├── config/site.js             ← company details, contact, analytics, navigation
    ├── data/
    │   ├── projects.js            ← projects and case studies
    │   ├── services.js            ← services
    │   ├── technologies.js        ← technology stack layers
    │   └── content.js             ← hero, process, principles, about, contact copy
    ├── components/                One render function per section (HTML strings)
    ├── render/
    │   ├── pages.js               Assembles home, case-study and 404 pages
    │   └── seo.js                 Meta tags, Open Graph, JSON-LD
    ├── lib/                       Escaping, paths, icons, generated covers
    ├── styles/                    global.css, components.css, responsive.css
    └── main.js                    Browser interactivity only
```

**Rule of thumb:** content changes go in `src/config/` or `src/data/`. You should rarely need to touch components.

---

## Add a project

Edit **`src/data/projects.js`** and add one object to the `projects` array:

```js
{
  title: 'Invoice Extraction Platform',
  slug: 'invoice-extraction',            // unique; becomes /projects/invoice-extraction/
  summary: 'One or two sentences for the card.',
  categories: ['ai', 'saas'],            // keys from projectCategories
  technologies: ['PHP', 'MySQL', 'LLM APIs'],
  status: 'In Development',              // Planning | In Development | Beta | Live | Maintained
  featured: false,                       // featured projects show first, full width
  archived: false,
  year: '2026',
  image: {                               // optional; a generated cover is used otherwise
    src: 'assets/projects/invoice-extraction.webp',
    avif: 'assets/projects/invoice-extraction.avif',   // optional
    width: 1280, height: 720,
    alt: 'Invoice review screen showing extracted fields',
  },
  links: {
    github: 'https://github.com/you/repo',  // empty strings are hidden
    live: '',
    progress: '',                            // optional link for "View progress"
    caseStudy: '',                           // only for an external write-up
  },
  progressNote: 'Shown in “Currently building” while unfinished.',
  caseStudy: {                               // optional; creates a case-study page
    problem: '',
    solution: '',
    architecture: '',
    challenges: ['', ''],
    technologies: [],
    results: '',
  },
}
```

Adding the object is all you need to do:

- The project appears in the filterable **Projects** grid.
- If its status is Planning, In Development or Beta, it also appears in **Currently building** with a progress track.
- If it has a `caseStudy`, it gets its own page at `/projects/<slug>/`, a **View case study** link, JSON-LD and a sitemap entry.

**Images.** Put files in `public/assets/projects/`. Use WebP, with AVIF optional, at about 1280×720, which fits the 16:9 cards. Always give the real `width`/`height` so the layout doesn't shift while loading. Images are lazy-loaded, except on case-study pages where they appear at the top.

**Categories.** To add or rename a filter, edit `projectCategories` in the same file. Filters with no projects stay visible but greyed out, and selecting one shows an empty-state message.

---

## Change services, stack and copy

- **Services:** `src/data/services.js`. Each has an `icon` key from `src/lib/icons.js`, a summary, tags and optional `details` for the expandable “Learn more”.
- **Technology stack:** `src/data/technologies.js`. Layers render top to bottom; `primary: true` highlights a tool.
- **Hero, process steps, principles, about, contact copy, hero trace examples:** `src/data/content.js`.
- **Navigation:** `navigation` in `src/config/site.js`.

---

## Contact form

GitHub Pages cannot run server code, so `contactConfig` in `src/config/site.js` controls how enquiries are sent:

| `mode` | Behaviour |
|---|---|
| `'mailto'` (default) | Opens the visitor's email app with the enquiry pre-filled. No third party, nothing stored. |
| `'formspree'` | Posts to Formspree. Create a form at formspree.io and set `formEndpoint: 'https://formspree.io/f/<id>'`. |
| `'custom'` | Posts JSON to any endpoint that accepts it (Getform, Basin, your own API). |

The form includes a hidden honeypot field (`_gotcha`) that Formspree recognises as a spam signal.

`bookingUrl` is optional. Set it to a Cal.com or Calendly link and **Book a consultation** opens it. Leave it empty and the button opens an email with a consultation subject line.

No API keys or secrets belong anywhere in this project. Everything in `src/` is shipped to the browser.

---

## Deploy to GitHub Pages

1. **Create a repository** and push this project to its `main` branch.
2. **Set `url` in `src/config/site.js`** to the address the site will live at:
   - Project site: `https://<user>.github.io/<repo>/`
   - User site (repo named `<user>.github.io`): `https://<user>.github.io/`
   - Custom domain: `https://yourdomain.com/`

   The base path for assets and links is derived from this URL automatically. **If it's wrong, CSS and JS will 404 after deployment.**
3. In the repository, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
4. Push to `main`. The workflow in `.github/workflows/deploy.yml` then:
   - installs dependencies,
   - builds,
   - runs `npm run check` (a failing check stops the deploy),
   - publishes `dist/`.

   Watch progress under the **Actions** tab. You can also run it manually with **Run workflow**.

---

## Custom domain

1. Set `url` in `src/config/site.js` to `https://yourdomain.com/` and push.
2. Create a file `public/CNAME` containing just your domain, e.g. `yourdomain.com`. This keeps the setting across deploys.
3. At your DNS provider:
   - **Apex domain** (`yourdomain.com`): add four `A` records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`. Optionally add the matching `AAAA` records from GitHub's documentation.
   - **Subdomain** (`www.yourdomain.com`): add a `CNAME` record pointing to `<user>.github.io`.
4. In **Settings → Pages**, enter the domain under **Custom domain**. Once the DNS check passes, tick **Enforce HTTPS**.
5. Recommended: verify the domain in your GitHub account settings, under **Pages**, to prevent takeover.

DNS changes can take anywhere from minutes to 24 hours to propagate.

---

## SEO

What is already handled:

- **Pre-rendered HTML.** All content is in the page source, not injected by JavaScript.
- **Page structure.** One `<h1>` per page, with a clean H2/H3 hierarchy and semantic landmarks (`header`, `nav`, `main`, `section`, `article`, `footer`).
- **Meta tags.** A title, meta description, keywords and `robots` tag on every page, plus **canonical URLs** built from `siteConfig.url`.
- **Social sharing.** **Open Graph** and **Twitter/X card** tags, with a 1200×630 share image.
- **Structured data (JSON-LD).** `Organization`, founder `Person`, `WebSite` and an `ItemList` of projects. Each case-study page also has its own `CreativeWork` (or `SoftwareSourceCode`, when a GitHub link exists) plus a `BreadcrumbList`. There are no fake ratings or reviews.
- **`sitemap.xml`.** Generated on every build, listing the home page and every case-study page with `lastmod` set to the build date.
- **`robots.txt`.** Generated with the correct sitemap URL.
- **`404.html`.** Served by GitHub Pages for unknown URLs and marked `noindex`.

After the first deployment:

1. **Google Search Console**
   - Add your site at search.google.com/search-console. With a custom domain, the *Domain* property with a DNS TXT record is the most robust option.
   - Submit `https://yourdomain.com/sitemap.xml` under **Sitemaps**.
   - Use **URL inspection → Request indexing** for the home page.
2. **Bing Webmaster Tools.** Import the site from Search Console in one click.
3. **Validate structured data** with the Rich Results Test (search.google.com/test/rich-results) and the Schema Markup Validator (validator.schema.org).
4. **Check share previews** by pasting your URL into LinkedIn's Post Inspector and the opengraph.xyz preview.

**Content strategy.** The landing page already uses the core service phrases naturally, such as custom software development, backend development, API integration and business automation. Long-term ranking will come mostly from genuinely useful articles, like the future-blog topics suggested below, and from real case studies. Keyword pages won't do it.

---

## Analytics (optional, off by default)

In `src/config/site.js`:

```js
export const analyticsConfig = {
  enabled: true,
  provider: 'plausible',       // 'plausible' | 'umami' | 'ga4'
  trackingId: 'yourdomain.com', // Plausible domain, Umami website ID, or GA4 'G-XXXX'
  scriptUrl: '',                // Umami only: your script URL
};
```

Plausible and Umami don't use cookies. If you choose GA4 and have visitors in the EU/UK, you may need a consent banner.

---

## Brand assets

`scripts/make-brand-assets.py` redraws the temporary identity: favicon PNGs, app icons and the Open Graph image. It needs Pillow and fontTools. The first time only, convert the web fonts it uses:

```bash
pip install pillow fonttools brotli
mkdir -p scripts/.fonts
python3 - <<'EOF'
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
b = 'node_modules/'
f = TTFont(b + '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2'); f.flavor = None
instantiateVariableFont(f, {"wght": 700}).save('scripts/.fonts/brico700.ttf')
g = TTFont(b + '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2'); g.flavor = None
g.save('scripts/.fonts/plex400.ttf')
EOF
python3 scripts/make-brand-assets.py
```

When you have a real logo:

- Replace `public/favicon.svg`, the PNG icons and `og-image.png` directly.
- Replace the `.brand__mark` element in `src/components/Header.js` with an `<img>` or inline SVG.

---

## Architecture notes

- **Why no framework.** A marketing site needs fast first paint, crawlable HTML and simple editing more than it needs client-side state. Components here are pure functions that return escaped HTML strings. The same functions run inside Vite at build time and in the dev server.
- **Security.** All content passes through `esc()`/`attr()`, and link URLs are filtered by `safeUrl()`, which allows only http(s), mailto and relative links. JSON-LD is serialised with `<` escaped. There is no `innerHTML` with dynamic content in the browser.
- **Performance.** Pages ship one CSS file (~7 KB gzip) and one JS file (~2.6 KB gzip). Fonts are self-hosted, latin subset only, with `font-display: swap`, and the headline font is preloaded. Project covers are inline SVG when there is no image, so they cost no extra requests.
- **Accessibility.** Includes:
  - a skip link
  - visible focus styles
  - a keyboard-operable menu that traps focus and closes with Escape
  - WAI-ARIA tabs in the hero, with arrow keys, Home and End
  - toggle buttons with `aria-pressed` and a live result count
  - labelled form fields with error messages announced
  - `prefers-reduced-motion` support throughout
- **Growing the site.** The generator in `plugins/site-generator.js` already emits extra pages (case studies, 404). Adding `/blog/<slug>/` means three steps:
  1. Add a `src/data/posts.js`, for example with Markdown converted at build time.
  2. Add a renderer in `src/render/pages.js`.
  3. Push the posts into `extraPages()` and `sitemapXml()`.

  `/services/<slug>/` pages would follow the same pattern from `services.js`.

---

## Dependencies

| Package | Why |
|---|---|
| `vite` (dev) | Dev server, bundling, minification |
| `@fontsource-variable/bricolage-grotesque` | Display typeface, self-hosted |
| `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono` | Body and code typefaces, self-hosted |

There are no runtime JavaScript libraries.

---

## Suggested next steps after launch

1. Replace the placeholders, deploy, and submit the sitemap to Search Console.
2. Add real screenshots to your projects, and a GitHub link to each one you open-source.
3. Publish case studies for client work once each client approves.
4. Start the technical blog with articles like these:
   - How to integrate APIs into a PHP application
   - Building reliable webhook systems
   - How to automate business workflows
   - How to integrate LLMs into existing applications
5. Switch the contact form to Formspree if you want enquiries to arrive without depending on the visitor's email app.
6. Add real testimonials only when clients provide them, with their permission.
7. Run Lighthouse on the deployed URL (Chrome DevTools → Lighthouse) and re-check after adding images.
