/**
 * Minimal, dependency-free HTML helpers.
 * All data rendered into markup MUST pass through `esc()` (text) or `attr()`
 * (attribute values). Components never insert raw user/content strings.
 */
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);
export const attr = esc;

/** Join non-empty fragments. */
export const join = (parts, sep = '') => parts.filter(Boolean).join(sep);

/** Only allow http(s), mailto and site-relative URLs in href/src. */
export function safeUrl(url) {
  const value = String(url ?? '').trim();
  if (!value) return '';
  if (/^(https?:|mailto:|#|\/|\.\/)/i.test(value)) return value;
  if (/^[a-z0-9][\w\-./]*$/i.test(value) && !/^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
  return '';
}

/** Serialise JSON-LD safely inside a <script> tag. */
export const jsonLd = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
