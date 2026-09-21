import { services } from '../data/services.js';
import { esc, attr } from '../lib/html.js';
import { icon } from '../lib/icons.js';

export function Services() {
  const items = services
    .map(
      (s) => `
    <article class="service" id="service-${attr(s.id)}">
      <div class="service__icon">${icon(s.icon, { size: 22 })}</div>
      <div class="service__body">
        <h3 class="service__title">${esc(s.title)}</h3>
        <p class="service__summary">${esc(s.summary)}</p>
        <ul class="tags" aria-label="Typical technologies">${s.tags.map((t) => `<li class="tag">${esc(t)}</li>`).join('')}</ul>
        ${
          s.details
            ? `<details class="service__more">
            <summary>Learn more<span class="visually-hidden"> about ${esc(s.title)}</span></summary>
            <p>${esc(s.details)}</p>
          </details>`
            : ''
        }
      </div>
    </article>`
    )
    .join('');

  return `
<section class="section services" id="services" aria-labelledby="services-title">
  <div class="container services__grid">
    <header class="section-head services__head">
      <h2 class="section-title" id="services-title">Software development services</h2>
      <p class="section-lead">Custom software development, backend engineering and API integration for businesses that have outgrown spreadsheets, manual steps and disconnected tools.</p>
      <a class="text-link" href="#contact">Discuss your project</a>
    </header>
    <div class="services__list">${items}</div>
  </div>
</section>`;
}
