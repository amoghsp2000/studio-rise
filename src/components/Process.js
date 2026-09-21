import { processSteps, principles } from '../data/content.js';
import { esc } from '../lib/html.js';

export function Process() {
  return `
<section class="section section--light approach" id="approach" aria-labelledby="approach-title">
  <div class="container">
    <header class="section-head">
      <h2 class="section-title" id="approach-title">How projects are built</h2>
      <p class="section-lead">A predictable engineering process, so you always know what is happening, what is next and what it depends on.</p>
    </header>
    <ol class="steps">
      ${processSteps
        .map(
          (s, i) => `
      <li class="step">
        <span class="step__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="step__title">${esc(s.title)}</h3>
        <p class="step__text">${esc(s.text)}</p>
      </li>`
        )
        .join('')}
    </ol>
  </div>
</section>`;
}

export function Principles() {
  return `
<section class="section section--light principles" id="principles" aria-labelledby="principles-title">
  <div class="container principles__grid">
    <header class="section-head">
      <h2 class="section-title" id="principles-title">Why work with us</h2>
      <p class="section-lead">No inflated numbers. These are the engineering principles every project is held to.</p>
    </header>
    <dl class="principles__list">
      ${principles
        .map((p) => `<div class="principle"><dt>${esc(p.title)}</dt><dd>${esc(p.text)}</dd></div>`)
        .join('')}
    </dl>
  </div>
</section>`;
}
