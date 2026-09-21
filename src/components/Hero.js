import { hero, traceScenarios } from '../data/content.js';
import { esc, attr } from '../lib/html.js';

const stateLabel = { ok: 'done', wait: 'waiting', warn: 'needs attention' };

function tracePanel() {
  const tabs = traceScenarios
    .map(
      (s, i) => `<button class="trace__tab" role="tab" type="button" id="trace-tab-${attr(s.id)}"
        aria-controls="trace-panel-${attr(s.id)}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(s.label)}</button>`
    )
    .join('');

  const panels = traceScenarios
    .map(
      (s, i) => `
      <ol class="trace__log" role="tabpanel" id="trace-panel-${attr(s.id)}" aria-labelledby="trace-tab-${attr(s.id)}" tabindex="0"${i === 0 ? '' : ' hidden'}>
        ${s.lines
          .map(
            ([t, comp, msg, state], n) => `
          <li class="trace__line trace__line--${attr(state)}" style="--i:${n}">
            <span class="trace__time">${esc(t)}</span>
            <span class="trace__comp">${esc(comp)}</span>
            <span class="trace__msg">${esc(msg)}</span>
            <span class="trace__state" aria-label="${attr(stateLabel[state] || state)}"></span>
          </li>`
          )
          .join('')}
      </ol>`
    )
    .join('');

  return `
  <figure class="trace" aria-label="Example request traces from systems like the ones we build">
    <div class="trace__bar">
      <div class="trace__tabs" role="tablist" aria-label="Example systems">${tabs}</div>
    </div>
    ${panels}
    <figcaption class="trace__caption">Illustrative traces of the kinds of systems we build.</figcaption>
  </figure>`;
}

export function Hero() {
  return `
<section class="hero" aria-labelledby="hero-title">
  <div class="container hero__grid">
    <div class="hero__copy">
      <h1 class="hero__title" id="hero-title">${esc(hero.title)}</h1>
      <p class="hero__lead">${esc(hero.lead)}</p>
      <div class="hero__actions">
        <a class="button button--primary button--lg" href="#contact">Start a project</a>
        <a class="button button--ghost button--lg" href="#work">View projects</a>
      </div>
      <ul class="hero__cred" aria-label="Areas of expertise">
        ${hero.credibility.map((c) => `<li>${esc(c)}</li>`).join('')}
      </ul>
    </div>
    ${tracePanel()}
  </div>
</section>`;
}
