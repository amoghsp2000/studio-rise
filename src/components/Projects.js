import { projects, projectCategories, projectStatuses } from '../data/projects.js';
import { esc, attr, safeUrl } from '../lib/html.js';
import { link, projectPath } from '../lib/paths.js';
import { icon } from '../lib/icons.js';
import { coverSvg } from '../lib/cover.js';

const categoryLabel = Object.fromEntries(projectCategories.map((c) => [c.key, c.label]));
export const statusClass = (status) => `status--${String(status).toLowerCase().replace(/\s+/g, '-')}`;
export const hasCaseStudyPage = (p) => Boolean(p.caseStudy);
export const inProgress = (p) => ['Planning', 'In Development', 'Beta'].includes(p.status) && !p.archived;

/** Featured first, then live/maintained, then the rest, archived last. */
export function sortedProjects() {
  const rank = (p) => (p.archived ? 3 : p.featured ? 0 : ['Live', 'Maintained'].includes(p.status) ? 1 : 2);
  return [...projects].sort((a, b) => rank(a) - rank(b));
}

export function projectMedia(p, { eager = false } = {}) {
  const img = p.image;
  if (img && img.src) {
    const src = link(img.src);
    const loading = eager ? 'eager' : 'lazy';
    const sources = [img.avif ? `<source srcset="${attr(link(img.avif))}" type="image/avif">` : ''].join('');
    return `<picture>${sources}<img src="${attr(src)}" width="${Number(img.width) || 1280}" height="${Number(img.height) || 720}" alt="${attr(img.alt || `${p.title} screenshot`)}" loading="${loading}" decoding="async"></picture>`;
  }
  return coverSvg(p.slug, p.title);
}

export function projectLinks(p, { withCaseStudy = true } = {}) {
  const l = p.links || {};
  const out = [];
  if (withCaseStudy && hasCaseStudyPage(p)) {
    out.push(`<a class="card-link card-link--main" href="${attr(link(projectPath(p.slug)))}">${icon('doc', { size: 16 })}View case study<span class="visually-hidden">: ${esc(p.title)}</span></a>`);
  } else if (withCaseStudy && safeUrl(l.caseStudy)) {
    out.push(`<a class="card-link card-link--main" href="${attr(safeUrl(l.caseStudy))}" rel="noopener" target="_blank">${icon('doc', { size: 16 })}Case study<span class="visually-hidden">: ${esc(p.title)} (opens in a new tab)</span></a>`);
  }
  if (safeUrl(l.live)) {
    out.push(`<a class="card-link" href="${attr(safeUrl(l.live))}" rel="noopener" target="_blank">${icon('external', { size: 16 })}Live demo<span class="visually-hidden">: ${esc(p.title)} (opens in a new tab)</span></a>`);
  }
  if (safeUrl(l.github)) {
    out.push(`<a class="card-link" href="${attr(safeUrl(l.github))}" rel="noopener" target="_blank">${icon('github', { size: 16 })}GitHub<span class="visually-hidden">: ${esc(p.title)} source (opens in a new tab)</span></a>`);
  }
  return out.join('');
}

function card(p, index) {
  const cats = p.categories || [];
  return `
  <li class="project${p.featured ? ' project--featured' : ''}${p.archived ? ' project--archived' : ''}" data-categories="${attr(cats.join(' '))}">
    <article class="project__inner" aria-labelledby="project-${attr(p.slug)}">
      <div class="project__media">${projectMedia(p, { eager: index === 0 && false })}</div>
      <div class="project__body">
        <div class="project__meta">
          <span class="status ${statusClass(p.status)}">${esc(p.archived ? 'Archived' : p.status)}</span>
          <span class="project__cats">${cats.map((c) => esc(categoryLabel[c] || c)).join(', ')}</span>
        </div>
        <h3 class="project__title" id="project-${attr(p.slug)}">${esc(p.title)}</h3>
        <p class="project__summary">${esc(p.summary)}</p>
        <ul class="tags" aria-label="Technologies">${(p.technologies || []).map((t) => `<li class="tag">${esc(t)}</li>`).join('')}</ul>
        <div class="project__links">${projectLinks(p)}</div>
      </div>
    </article>
  </li>`;
}

export function Projects() {
  const list = sortedProjects();
  const count = (key) => (key === 'all' ? list.length : list.filter((p) => (p.categories || []).includes(key)).length);
  const filters = projectCategories
    .map((c) => {
      const n = count(c.key);
      return `<button type="button" class="filter" data-filter="${attr(c.key)}" data-label="${attr(c.label)}" aria-pressed="${c.key === 'all'}"${
        n === 0 ? ' data-empty="true"' : ''
      }>${esc(c.label)} <span class="filter__count" aria-hidden="true">${n}</span></button>`;
    })
    .join('');

  return `
<section class="section work" id="work" aria-labelledby="work-title">
  <div class="container">
    <header class="section-head section-head--row">
      <div>
        <h2 class="section-title" id="work-title">Projects</h2>
        <p class="section-lead">Products and tools built in-house, from AI engineering platforms to developer tooling. Client work is added here as projects are completed and approved for publication.</p>
      </div>
    </header>
    <div class="filters" role="group" aria-label="Filter projects by category">${filters}</div>
    <p class="visually-hidden" aria-live="polite" data-filter-status></p>
    <ul class="projects" data-projects>${list.map(card).join('')}</ul>
    <p class="projects__empty" data-projects-empty hidden>No projects in this category yet. <a class="text-link" href="#contact">Have one in mind?</a></p>
  </div>
</section>`;
}

export function Building() {
  const items = sortedProjects().filter(inProgress);
  if (!items.length) return '';
  const track = (status) => {
    const at = projectStatuses.indexOf(status);
    return `<ol class="track" aria-label="Status: ${attr(status)}">${projectStatuses
      .map((s, i) => `<li class="track__step${i < at ? ' is-done' : ''}${i === at ? ' is-current' : ''}"${i === at ? ' aria-current="step"' : ''}><span>${esc(s)}</span></li>`)
      .join('')}</ol>`;
  };
  const progressLink = (p) => {
    const url = safeUrl(p.links?.progress) || (hasCaseStudyPage(p) ? link(projectPath(p.slug)) : '') || safeUrl(p.links?.github);
    return url ? `<a class="text-link" href="${attr(url)}">View progress<span class="visually-hidden"> on ${esc(p.title)}</span></a>` : '';
  };
  return `
<section class="section building" id="building" aria-labelledby="building-title">
  <div class="container">
    <header class="section-head">
      <h2 class="section-title" id="building-title">Currently building</h2>
      <p class="section-lead">Work in progress, updated as it moves from planning to production.</p>
    </header>
    <ul class="building__list">
      ${items
        .map(
          (p) => `
      <li class="building__item">
        <article aria-labelledby="building-${attr(p.slug)}">
          <div class="building__head">
            <h3 class="building__title" id="building-${attr(p.slug)}">${esc(p.title)}</h3>
            <span class="status ${statusClass(p.status)}">${esc(p.status)}</span>
          </div>
          <p class="building__note">${esc(p.progressNote || p.summary)}</p>
          ${track(p.status)}
          ${progressLink(p)}
        </article>
      </li>`
        )
        .join('')}
    </ul>
  </div>
</section>`;
}
