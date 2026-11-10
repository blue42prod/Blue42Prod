const load = (g) => Object.entries(g).map(([p, m]) => ({ slug: p.split('/').pop().replace(/\.(md|json)$/, ''), ...(m.frontmatter || m.default || {}), Content: m.Content }));
const byDate = (k) => (a, b) => new Date(b[k]) - new Date(a[k]);
export const regions = [
  { id: 'north', name: 'North Louisiana', label: 'North', x: 370, y: 110, rects: [[0, 0, 750, 215]] },
  { id: 'central', name: 'Central', label: 'Central', x: 330, y: 285, rects: [[0, 215, 750, 130]] },
  { id: 'southwest', name: 'Southwest', label: 'Southwest', x: 105, y: 440, rects: [[0, 345, 210, 355]] },
  { id: 'acadiana', name: 'Acadiana', label: 'Acadiana', x: 300, y: 450, rects: [[210, 345, 180, 355], [390, 545, 130, 155]] },
  { id: 'baton-rouge', name: 'Baton Rouge Area', label: 'Baton Rouge', x: 455, y: 445, rects: [[390, 345, 130, 200]] },
  { id: 'northshore', name: 'Northshore', label: 'Northshore', x: 568, y: 420, rects: [[520, 345, 230, 160]] },
  { id: 'new-orleans', name: 'Greater New Orleans', label: 'New Orleans', x: 590, y: 590, rects: [[520, 505, 230, 195]] },
];
export const regionName = (id) => (regions.find((r) => r.id === id) || {}).name || '';
export const stories = load(import.meta.glob('../content/stories/*.md', { eager: true })).sort(byDate('date'));
export const photographers = load(import.meta.glob('../content/photographers/*.md', { eager: true })).sort((a, b) => a.title.localeCompare(b.title));
export const photos = load(import.meta.glob('../content/photos/*.md', { eager: true })).filter((p) => p.permission === true);
export const polls = load(import.meta.glob('../content/polls/*.md', { eager: true })).sort(byDate('week'));
export const rankingSets = load(import.meta.glob('../content/rankings/*.md', { eager: true })).sort(byDate('week'));
import siteData from '../content/settings/site.json';
export const site = siteData;
export const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export const jerseySvg = (color, num) => {
  const c = /^#[0-9a-f]{6}$/i.test(color || '') ? color : '#1647FF';
  const lum = (parseInt(c.slice(1, 3), 16) * 0.3 + parseInt(c.slice(3, 5), 16) * 0.6 + parseInt(c.slice(5, 7), 16) * 0.1);
  const t = lum > 150 ? '#0C1330' : '#FFFFFF';
  const d = 'M30 10L45 6Q60 22 75 6L90 10L115 30L102 50L90 42V120H30V42L18 50L5 30Z';
  return `<svg viewBox="0 0 120 130" role="img" aria-label="Jersey design"><path d="${d}" fill="${c}" stroke="#C9D2EE" stroke-width="1.5"/><text x="60" y="94" text-anchor="middle" font-family="Arial Black,sans-serif" font-weight="800" font-size="38" fill="${t}">${(num || '').toString().slice(0, 3)}</text></svg>`;
};
