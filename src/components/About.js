import { siteConfig } from '../config/site.js';
import { about } from '../data/content.js';
import { esc, attr, safeUrl } from '../lib/html.js';
import { icon } from '../lib/icons.js';

export function socialLinks(className = 'social') {
  const s = siteConfig.social;
  const items = [
    safeUrl(s.github) && `<li><a href="${attr(s.github)}" rel="noopener me" target="_blank">${icon('github', { size: 18 })}<span>GitHub</span></a></li>`,
    safeUrl(s.linkedin) && `<li><a href="${attr(s.linkedin)}" rel="noopener me" target="_blank">${icon('linkedin', { size: 18 })}<span>LinkedIn</span></a></li>`,
    safeUrl(s.x) && `<li><a href="${attr(s.x)}" rel="noopener me" target="_blank">${icon('x', { size: 18 })}<span>X</span></a></li>`,
    siteConfig.email && `<li><a href="mailto:${attr(siteConfig.email)}">${icon('mail', { size: 18 })}<span>${esc(siteConfig.email)}</span></a></li>`,
  ].filter(Boolean);
  return items.length ? `<ul class="${attr(className)}">${items.join('')}</ul>` : '';
}

export function About() {
  const { founder, location } = siteConfig;
  return `
<section class="section about" id="about" aria-labelledby="about-title">
  <div class="container about__grid">
    <div class="about__card">
      <div class="about__portrait" aria-hidden="true">${esc(founder.name.slice(0, 1))}</div>
      <p class="about__name">${esc(founder.name)}</p>
      <p class="about__role">${esc(founder.role)}</p>
      ${location ? `<p class="about__loc">${icon('pin', { size: 16 })}${esc(location)}</p>` : ''}
      ${socialLinks('social social--stack')}
    </div>
    <div class="about__copy">
      <h2 class="section-title" id="about-title">${esc(about.heading)}</h2>
      ${about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}
    </div>
  </div>
</section>`;
}
