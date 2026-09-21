import { siteConfig, contactConfig } from '../config/site.js';
import { contactCopy } from '../data/content.js';
import { esc, attr, safeUrl } from '../lib/html.js';
import { icon } from '../lib/icons.js';

const mailto = (subject) => `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}`;

export function Contact() {
  const booking = safeUrl(contactConfig.bookingUrl);
  const bookHref = booking || mailto(`Consultation request: ${siteConfig.name}`);
  const bookAttrs = booking ? ' rel="noopener" target="_blank"' : '';

  return `
<section class="section contact" id="contact" aria-labelledby="contact-title">
  <div class="container contact__grid">
    <div class="contact__intro">
      <h2 class="contact__title" id="contact-title">${esc(contactCopy.heading)}</h2>
      <p class="contact__lead">${esc(contactCopy.lead)}</p>
      <div class="contact__actions">
        <a class="button button--primary" href="#contact-form" data-focus-form>Start a project</a>
        <a class="button button--ghost" href="${attr(bookHref)}"${bookAttrs}>${icon('calendar', { size: 18 })}Book a consultation</a>
        <a class="button button--ghost" href="${attr(mailto(`Project enquiry: ${siteConfig.name}`))}">${icon('mail', { size: 18 })}Send an email</a>
      </div>
      ${contactConfig.responseTime ? `<p class="contact__note">${esc(contactConfig.responseTime)}</p>` : ''}
      <p class="contact__note">Prefer to write directly? <a class="text-link" href="mailto:${attr(siteConfig.email)}">${esc(siteConfig.email)}</a></p>
    </div>

    <form class="form" id="contact-form" data-contact-form novalidate
      data-mode="${attr(contactConfig.mode)}" data-endpoint="${attr(safeUrl(contactConfig.formEndpoint))}" data-email="${attr(siteConfig.email)}">
      <div class="form__row">
        <div class="field">
          <label for="cf-name">Name</label>
          <input id="cf-name" name="name" type="text" autocomplete="name" required maxlength="120">
        </div>
        <div class="field">
          <label for="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" autocomplete="email" required maxlength="200">
        </div>
      </div>
      <div class="field">
        <label for="cf-company">Company <span class="field__opt">(optional)</span></label>
        <input id="cf-company" name="company" type="text" autocomplete="organization" maxlength="160">
      </div>
      <div class="field">
        <label for="cf-type">What do you need?</label>
        <select id="cf-type" name="projectType" required>
          <option value="">Choose one</option>
          ${contactCopy.projectTypes.map((t) => `<option>${esc(t)}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label for="cf-message">Project details</label>
        <textarea id="cf-message" name="message" rows="5" required maxlength="4000" aria-describedby="cf-message-hint"></textarea>
        <p class="field__hint" id="cf-message-hint">What are you building or fixing, and what does success look like?</p>
      </div>
      <div class="field field--hp" aria-hidden="true">
        <label for="cf-website">Leave this empty</label>
        <input id="cf-website" name="_gotcha" type="text" tabindex="-1" autocomplete="off">
      </div>
      <button class="button button--primary button--lg form__submit" type="submit">${
        contactConfig.mode === 'mailto' ? 'Send enquiry by email' : 'Send enquiry'
      }</button>
      <p class="form__status" role="status" aria-live="polite" data-form-status></p>
      ${contactConfig.mode === 'mailto' ? '<p class="field__hint">This opens your email app with the details filled in. Nothing is stored on this website.</p>' : '<p class="field__hint">Your details are used only to reply to this enquiry.</p>'}
    </form>
  </div>
</section>`;
}
