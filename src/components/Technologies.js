import { technologyLayers } from '../data/technologies.js';
import { esc, attr } from '../lib/html.js';

export function Technologies() {
  const layers = technologyLayers
    .map(
      (layer) => `
    <li class="layer layer--${attr(layer.id)}">
      <div class="layer__label">
        <h3 class="layer__title">${esc(layer.title)}</h3>
        <p class="layer__role">${esc(layer.role)}</p>
      </div>
      <ul class="layer__items">
        ${layer.items.map((t) => `<li class="chip${t.primary ? ' chip--primary' : ''}">${esc(t.name)}</li>`).join('')}
      </ul>
    </li>`
    )
    .join('');

  return `
<section class="section stack" id="stack" aria-labelledby="stack-title">
  <div class="container">
    <header class="section-head">
      <h2 class="section-title" id="stack-title">The technology stack, layer by layer</h2>
      <p class="section-lead">Proven tools chosen per project, from the database up to the AI layer. Highlighted tools are the ones used most in production.</p>
    </header>
    <ol class="layers">${layers}</ol>
  </div>
</section>`;
}
