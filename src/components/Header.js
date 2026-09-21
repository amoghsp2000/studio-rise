import { siteConfig, navigation } from '../config/site.js';
import { esc, attr } from '../lib/html.js';
import { link, anchor } from '../lib/paths.js';
import { icon } from '../lib/icons.js';

export const BrandMark = () => `
  <span class="brand__mark" aria-hidden="true">${esc(siteConfig.mark)}</span>
  <span class="brand__name">${esc(siteConfig.name)}</span>`;

export function Header({ onHome = true } = {}) {
  const items = navigation
    .map((item) => {
      const href = item.href.startsWith('#') ? anchor(item.href, onHome) : link(item.href);
      return `<li><a class="nav__link" href="${attr(href)}">${esc(item.label)}</a></li>`;
    })
    .join('');

  return `
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <div class="container site-header__inner">
    <a class="brand" href="${attr(link(''))}" aria-label="${attr(siteConfig.name)}, home">${BrandMark()}</a>
    <nav class="nav" aria-label="Main">
      <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-menu" data-nav-toggle>
        <span class="nav__toggle-open">${icon('menu')}<span class="visually-hidden">Open menu</span></span>
        <span class="nav__toggle-close">${icon('close')}<span class="visually-hidden">Close menu</span></span>
      </button>
      <div class="nav__panel" id="nav-menu" data-nav-panel>
        <ul class="nav__list">${items}</ul>
        <a class="button button--primary nav__cta" href="${attr(anchor('#contact', onHome))}">Start a project</a>
      </div>
    </nav>
  </div>
</header>`;
}
