import { siteConfig, navigation } from '../config/site.js';
import { services } from '../data/services.js';
import { esc, attr } from '../lib/html.js';
import { link, anchor } from '../lib/paths.js';
import { BrandMark } from './Header.js';
import { socialLinks } from './About.js';

export function Footer({ onHome = true } = {}) {
  const year = new Date().getFullYear();
  return `
<footer class="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      <a class="brand" href="${attr(link(''))}">${BrandMark()}</a>
      <p>${esc(siteConfig.tagline)}</p>
      ${siteConfig.areaServed ? `<p class="site-footer__muted">${esc(siteConfig.areaServed)}</p>` : ''}
    </div>
    <nav class="site-footer__col" aria-label="Footer">
      <h2 class="site-footer__heading">Studio</h2>
      <ul>
        ${navigation.map((n) => `<li><a href="${attr(n.href.startsWith('#') ? anchor(n.href, onHome) : link(n.href))}">${esc(n.label)}</a></li>`).join('')}
        <li><a href="${attr(anchor('#contact', onHome))}">Contact</a></li>
      </ul>
    </nav>
    <div class="site-footer__col">
      <h2 class="site-footer__heading">Services</h2>
      <ul>
        ${services.slice(0, 6).map((s) => `<li><a href="${attr(anchor(`#service-${s.id}`, onHome))}">${esc(s.title)}</a></li>`).join('')}
      </ul>
    </div>
    <div class="site-footer__col">
      <h2 class="site-footer__heading">Contact</h2>
      ${socialLinks('social social--stack')}
    </div>
  </div>
  <div class="container site-footer__base">
    <p>© <span>${year}</span> ${esc(siteConfig.name)}. All rights reserved.</p>
  </div>
</footer>`;
}
