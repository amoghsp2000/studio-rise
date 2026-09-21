/**
 * Deterministic generated cover art for projects without an image.
 * Draws a small "system diagram" (nodes + connections) seeded by the slug,
 * so every project gets a stable, distinct cover with zero network requests.
 */
function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

export function coverSvg(slug, title = '') {
  const rnd = seeded(slug);
  const W = 640, H = 360, cols = 6, rows = 3;
  const nodes = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (rnd() < 0.55) {
        nodes.push({
          x: Math.round(70 + c * ((W - 140) / (cols - 1)) + (rnd() - 0.5) * 30),
          y: Math.round(70 + r * ((H - 140) / (rows - 1)) + (rnd() - 0.5) * 30),
          c,
          hot: rnd() < 0.18,
        });
      }
    }
  }
  const edges = [];
  nodes.forEach((a) => {
    const next = nodes.filter((b) => b.c === a.c + 1);
    if (next.length) edges.push([a, next[Math.floor(rnd() * next.length)]]);
  });
  const hue = Math.floor(rnd() * 40) + 195; // blues
  const lines = edges
    .map(([a, b]) => {
      const mx = Math.round((a.x + b.x) / 2);
      return `<path d="M${a.x} ${a.y}C${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}" />`;
    })
    .join('');
  const dots = nodes
    .map((n) =>
      n.hot
        ? `<rect x="${n.x - 9}" y="${n.y - 9}" width="18" height="18" rx="3" class="cv-hot"/>`
        : `<rect x="${n.x - 6}" y="${n.y - 6}" width="12" height="12" rx="2.5" class="cv-node"/>`
    )
    .join('');

  return `<svg class="cover" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Generated diagram cover for ${title.replace(/"/g, '')}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="hsl(${hue} 45% 13%)"/>
    <g stroke="hsl(${hue} 40% 30%)" stroke-width="1" opacity=".55">${Array.from({ length: 11 }, (_, i) => `<path d="M${i * 64} 0V${H}"/>`).join('')}${Array.from({ length: 6 }, (_, i) => `<path d="M0 ${i * 72}H${W}"/>`).join('')}</g>
    <g fill="none" stroke="hsl(${hue} 55% 62%)" stroke-width="1.6" opacity=".8">${lines}</g>
    <g>${dots}</g>
  </svg>`;
}
