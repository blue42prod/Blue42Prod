const load = (g) => Object.entries(g).map(([p, m]) => ({ slug: p.split('/').pop().replace(/\.(md|json)$/, ''), ...(m.frontmatter || m.default || {}), Content: m.Content }));
const byDate = (k) => (a, b) => new Date(b[k]) - new Date(a[k]);
export const regions = [
  { id: 'north', bounds: [[31.95, -94.05], [33.02, -91.05]], name: 'North Louisiana', label: 'North', x: 370, y: 110, rects: [[0, 0, 750, 215]] },
  { id: 'central', bounds: [[30.85, -93.6], [31.95, -91.45]], name: 'Central', label: 'Central', x: 330, y: 285, rects: [[0, 215, 750, 130]] },
  { id: 'southwest', bounds: [[29.7, -93.9], [30.85, -92.55]], name: 'Southwest', label: 'Southwest', x: 105, y: 440, rects: [[0, 345, 210, 355]] },
  { id: 'acadiana', bounds: [[29.2, -92.6], [30.85, -90.45]], name: 'Acadiana', label: 'Acadiana', x: 300, y: 450, rects: [[210, 345, 180, 355], [390, 545, 130, 155]] },
  { id: 'baton-rouge', bounds: [[30.1, -91.6], [31.0, -90.65]], name: 'Baton Rouge Area', label: 'Baton Rouge', x: 455, y: 445, rects: [[390, 345, 130, 200]] },
  { id: 'northshore', bounds: [[30.2, -90.6], [31.0, -89.6]], name: 'Northshore', label: 'Northshore', x: 568, y: 420, rects: [[520, 345, 230, 160]] },
  { id: 'new-orleans', bounds: [[29.25, -90.4], [30.1, -89.6]], name: 'Greater New Orleans', label: 'New Orleans', x: 590, y: 590, rects: [[520, 505, 230, 195]] },
];
export const regionName = (id) => (regions.find((r) => r.id === id) || {}).name || '';
export const stories = load(import.meta.glob('../content/stories/*.md', { eager: true })).sort(byDate('date'));
export const creators = load(import.meta.glob('../content/creators/*.md', { eager: true })).sort((a, b) => a.title.localeCompare(b.title));
export const shop = load(import.meta.glob('../content/shop/*.md', { eager: true })).filter((p) => p.active !== false).sort((a, b) => (a.order ?? 10) - (b.order ?? 10));
// Game galleries: each file is one game with a list of photos. Only photos with permission on file are shown.
const cleanPhotos = (list, fallback = {}) => (list || []).filter((p) => p && p.permission === true).map((p) => ({ ...p, photographer: p.photographer || fallback.photographer || '', game: p.game || fallback.game || '' }));
export const galleries = load(import.meta.glob('../content/galleries/*.md', { eager: true }))
  .map((g) => ({ ...g, photos: cleanPhotos(g.photos, { photographer: g.photographer, game: g.title }) }))
  .filter((g) => g.photos.length > 0)
  .sort((a, b) => (b.date ? new Date(b.date) : 0) - (a.date ? new Date(a.date) : 0));
import potwData from '../content/settings/photos-of-the-week.json';
export const photosOfWeek = { ...potwData, photos: cleanPhotos(potwData.photos).slice(0, 5) };
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
// Homepage carousel: the logo slide always opens, then up to 20 photos. Photos stay hidden unless permission is on file.
import carouselData from '../content/settings/home-carousel.json';
export const homeCarousel = { shuffle: carouselData.shuffle !== false, seconds: Math.max(2, Number(carouselData.seconds) || 8), photos: (carouselData.photos || []).filter((p) => p && p.permission === true).slice(0, 20) };
// Schools map: one file per school. Pins need a latitude and longitude. Photos stay hidden unless permission is on file.
export const schools = load(import.meta.glob('../content/schools/*.md', { eager: true }))
  .map(({ Content, ...s }) => ({ ...s, lat: Number(s.lat), lng: Number(s.lng), photos: (s.photos || []).filter((p) => p && p.image && p.permission === true), stats: (s.stats || []).filter((x) => x && x.label), funFacts: (s.funFacts || []).filter(Boolean) }))
  .filter((s) => s.title && Number.isFinite(s.lat) && Number.isFinite(s.lng))
  .sort((a, b) => a.title.localeCompare(b.title));
