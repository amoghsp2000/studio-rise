/**
 * Page renderers. Pure functions returning HTML strings, used by the Vite
 * plugin at build time (and in the dev server), so every page is fully
 * pre-rendered for search engines and works without JavaScript.
 */
import { siteConfig } from '../config/site.js';
import { projects, projectCategories } from '../data/projects.js';
import { esc, attr } from '../lib/html.js';
import { link, anchor, projectPath } from '../lib/paths.js';
import { headTags, homeSchema, caseStudySchema } from './seo.js';
import { Header } from '../components/Header.js';
import { Hero } from '../components/Hero.js';
import { Services } from '../components/Services.js';
import { Projects, Building, projectMedia, projectLinks, statusClass } from '../components/Projects.js';
import { Technologies } from '../components/Technologies.js';
import { Process, Principles } from '../components/Process.js';
import { About } from '../components/About.js';
import { Contact } from '../components/Contact.js';
import { Footer } from '../components/Footer.js';

export function homeHead() {
  return headTags({ path: '' }) + homeSchema();
}

export function homeBody() {
  return `${Header({ onHome: true })}
<main id="main">
  ${Hero()}
  ${Services()}
  ${Projects()}
  ${Building()}
  ${Process()}
  ${Principles()}
  ${Technologies()}
  ${About()}
  ${Contact()}
</main>
${Footer({ onHome: true })}`;
}

export const caseStudyProjects = () => projects.filter((p) => p.caseStudy);

const catLabel = Object.fromEntries(projectCategories.map((c) => [c.key, c.label]));

export function caseStudyHead(p) {
  return (
    headTags({
      title: `${p.title}: Case Study | ${siteConfig.name}`,
      description: p.summary.length > 160 ? `${p.summary.slice(0, 157).trimEnd()}…` : p.summary,
      path: projectPath(p.slug),
      type: 'article',
    }) + caseStudySchema(p)
  );
}

export function caseStudyBody(p) {
  const cs = p.caseStudy;
  const block = (id, title, text) =>
    text ? `<section class="cs-block" aria-labelledby="cs-${id}"><h2 id="cs-${id}">${esc(title)}</h2><p>${esc(text)}</p></section>` : '';
  const links = projectLinks(p, { withCaseStudy: false });

  return `${Header({ onHome: false })}
<main id="main" class="cs">
  <div class="container">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="${attr(link(''))}">Home</a></li>
        <li><a href="${attr(anchor('#work', false))}">Projects</a></li>
        <li><span aria-current="page">${esc(p.title)}</span></li>
      </ol>
    </nav>
    <header class="cs-hero">
      <div class="cs-hero__copy">
        <div class="project__meta">
          <span class="status ${statusClass(p.status)}">${esc(p.status)}</span>
          <span class="project__cats">${(p.categories || []).map((c) => esc(catLabel[c] || c)).join(', ')}${p.year ? `, ${esc(p.year)}` : ''}</span>
        </div>
        <h1 class="cs-hero__title">${esc(p.title)}</h1>
        <p class="cs-hero__lead">${esc(p.summary)}</p>
        ${links ? `<div class="project__links">${links}</div>` : ''}
      </div>
      <div class="cs-hero__media">${projectMedia(p, { eager: true })}</div>
    </header>

    <div class="cs-content">
      <div class="cs-main">
        ${block('problem', 'The problem', cs.problem)}
        ${block('solution', 'The solution', cs.solution)}
        ${block('architecture', 'Architecture', cs.architecture)}
        ${
          cs.challenges?.length
            ? `<section class="cs-block" aria-labelledby="cs-challenges"><h2 id="cs-challenges">Engineering challenges</h2><ul class="cs-list">${cs.challenges
                .map((c) => `<li>${esc(c)}</li>`)
                .join('')}</ul></section>`
            : ''
        }
        ${block('results', 'Results', cs.results)}
      </div>
      <aside class="cs-aside" aria-labelledby="cs-tech">
        <h2 id="cs-tech" class="cs-aside__title">Technologies</h2>
        <ul class="tags">${(cs.technologies || p.technologies || []).map((t) => `<li class="tag">${esc(t)}</li>`).join('')}</ul>
      </aside>
    </div>

    <section class="cs-cta" aria-labelledby="cs-cta-title">
      <h2 id="cs-cta-title">Need something similar built?</h2>
      <p>Describe the problem and we’ll suggest a practical way to solve it.</p>
      <a class="button button--primary button--lg" href="${attr(anchor('#contact', false))}">Start a project</a>
    </section>
  </div>
</main>
${Footer({ onHome: false })}`;
}

export function notFoundBody() {
  return `${Header({ onHome: false })}
<main id="main" class="cs">
  <div class="container not-found">
    <h1 class="cs-hero__title">Page not found</h1>
    <p class="cs-hero__lead">The page you were looking for doesn’t exist or has moved.</p>
    <p><a class="button button--primary" href="${attr(link(''))}">Go to the home page</a></p>
  </div>
</main>
${Footer({ onHome: false })}`;
}
