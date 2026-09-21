/**
 * Client entry. All content is already in the HTML (pre-rendered at build
 * time); this file only adds behaviour. Every feature checks that its
 * elements exist, so the same bundle runs on the home page, case-study
 * pages and the 404 page.
 */
import '@fontsource-variable/bricolage-grotesque/wght.css';
import '@fontsource/ibm-plex-sans/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-500.css';
import '@fontsource/ibm-plex-sans/latin-600.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import './styles/global.css';
import './styles/components.css';
import './styles/responsive.css';

import { analyticsConfig } from './config/site.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

document.documentElement.classList.add('js');

/* ── Header: scrolled state ──────────────────────────────────── */
function initHeader() {
  const header = $('[data-header]');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ── Mobile navigation ───────────────────────────────────────── */
function initNav() {
  const toggle = $('[data-nav-toggle]');
  const panel = $('[data-nav-panel]');
  if (!toggle || !panel) return;
  const mq = window.matchMedia('(max-width: 899px)');

  const setOpen = (open, { focus = true } = {}) => {
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
    if (open && focus) $('a', panel)?.focus();
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false, { focus: false });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
    // Keep focus inside the open menu on mobile.
    if (e.key === 'Tab' && mq.matches && document.body.classList.contains('nav-open')) {
      const items = [toggle, ...$$('a, button', panel)];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  mq.addEventListener('change', () => setOpen(false, { focus: false }));
}

/* ── Active section highlight in nav ─────────────────────────── */
function initActiveNav() {
  const links = $$('.nav__link').filter((a) => a.hash && a.pathname === location.pathname);
  if (!links.length || !('IntersectionObserver' in window)) return;
  const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
  const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.removeAttribute('aria-current'));
        byId.get(entry.target.id)?.setAttribute('aria-current', 'true');
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => io.observe(s));
}

/* ── Hero trace tabs (WAI-ARIA tabs pattern) ─────────────────── */
function initTrace() {
  const tabs = $$('.trace__tab');
  if (!tabs.length) return;
  const select = (tab, { focus = false } = {}) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) {
        panel.hidden = !on;
        if (on) {
          // Restart the line-by-line animation for the newly shown trace.
          panel.classList.remove('is-playing');
          void panel.offsetWidth;
          panel.classList.add('is-playing');
        }
      }
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: 1, ArrowLeft: -1 };
      if (e.key in keys) {
        e.preventDefault();
        select(tabs[(i + keys[e.key] + tabs.length) % tabs.length], { focus: true });
      } else if (e.key === 'Home') { e.preventDefault(); select(tabs[0], { focus: true }); }
      else if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], { focus: true }); }
    });
  });
  $('.trace__log:not([hidden])')?.classList.add('is-playing');
}

/* ── Project filtering ───────────────────────────────────────── */
function initFilters() {
  const buttons = $$('[data-filter]');
  const list = $('[data-projects]');
  if (!buttons.length || !list) return;
  const cards = $$('.project', list);
  const empty = $('[data-projects-empty]');
  const status = $('[data-filter-status]');

  const apply = (key) => {
    let shown = 0;
    cards.forEach((card) => {
      const match = key === 'all' || card.dataset.categories.split(' ').includes(key);
      card.hidden = !match;
      if (match) shown++;
    });
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === key)));
    if (empty) empty.hidden = shown > 0;
    const label = buttons.find((b) => b.dataset.filter === key)?.textContent.trim();
    if (status) status.textContent = `${shown} project${shown === 1 ? '' : 's'} shown${key === 'all' ? '' : ` in ${label}`}.`;
  };

  buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter)));
}

/* ── Contact form ────────────────────────────────────────────── */
function initContact() {
  const form = $('[data-contact-form]');
  if (!form) return;
  const statusEl = $('[data-form-status]', form);
  const submit = $('button[type="submit"]', form);
  const setStatus = (msg, kind = '') => {
    statusEl.textContent = msg;
    statusEl.dataset.kind = kind;
  };

  $$('[data-focus-form]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      $('#cf-name', form)?.focus({ preventScroll: true });
    })
  );

  const validate = () => {
    let firstInvalid = null;
    $$('input[required], select[required], textarea[required]', form).forEach((field) => {
      const ok = field.checkValidity() && field.value.trim() !== '';
      field.setAttribute('aria-invalid', String(!ok));
      if (!ok && !firstInvalid) firstInvalid = field;
    });
    return firstInvalid;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalid = validate();
    if (invalid) {
      const name = form.querySelector(`label[for="${invalid.id}"]`)?.textContent.replace('(optional)', '').trim();
      setStatus(`Check the ${name ? name.toLowerCase() : 'highlighted'} field and try again.`, 'error');
      invalid.focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    if (data._gotcha) return; // spam trap

    const mode = form.dataset.mode;
    const endpoint = form.dataset.endpoint;

    if (mode === 'mailto' || !endpoint) {
      const subject = `Project enquiry: ${data.projectType}`;
      const body = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        data.company ? `Company: ${data.company}` : '',
        `Need: ${data.projectType}`,
        '',
        data.message,
      ].filter((l) => l !== null).join('\n');
      window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus('Your email app should open with the enquiry ready to send. If it doesn’t, email us directly using the address above.', 'info');
      return;
    }

    submit.disabled = true;
    setStatus('Sending…', 'info');
    try {
      const { _gotcha, ...payload } = data;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      $$('[aria-invalid]', form).forEach((f) => f.removeAttribute('aria-invalid'));
      setStatus('Enquiry sent. You’ll get a reply by email.', 'success');
    } catch {
      setStatus(`The enquiry couldn’t be sent. Try again, or email ${form.dataset.email} directly.`, 'error');
    } finally {
      submit.disabled = false;
    }
  });

  form.addEventListener('input', (e) => {
    if (e.target.getAttribute('aria-invalid') === 'true' && e.target.checkValidity() && e.target.value.trim()) {
      e.target.setAttribute('aria-invalid', 'false');
    }
  });
}

/* ── Optional analytics ──────────────────────────────────────── */
function initAnalytics() {
  const { enabled, provider, trackingId, scriptUrl } = analyticsConfig;
  if (!enabled || !trackingId) return;
  const add = (src, attrs = {}) => {
    const s = document.createElement('script');
    s.defer = true;
    s.src = src;
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    document.head.appendChild(s);
  };
  if (provider === 'plausible') add('https://plausible.io/js/script.js', { 'data-domain': trackingId });
  else if (provider === 'umami' && scriptUrl) add(scriptUrl, { 'data-website-id': trackingId });
  else if (provider === 'ga4') {
    add(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(trackingId)}`);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', trackingId, { anonymize_ip: true });
  }
}

initHeader();
initNav();
initActiveNav();
initTrace();
initFilters();
initContact();
initAnalytics();
