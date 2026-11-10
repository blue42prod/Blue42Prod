import { getStore } from '@netlify/blobs';
const json = (d, s = 200, h = {}) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...h } });
const clean = (s) => String(s || '').replace(/[^a-z0-9-]/gi, '').slice(0, 80);
async function hash(s) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
export default async (req, context) => {
  const store = getStore('votes'); const url = new URL(req.url);
  if (req.method === 'GET') { const p = clean(url.searchParams.get('poll')); const d = await store.get('counts:' + p, { type: 'json' }); return json({ counts: (d && d.counts) || [] }); }
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  let b; try { b = await req.json(); } catch { return json({ error: 'bad' }, 400); }
  const poll = clean(b.poll), opt = Number(b.option);
  if (!poll || !Number.isInteger(opt) || opt < 0 || opt > 19) return json({ error: 'bad' }, 400);
  const key = 'counts:' + poll; const cur = (await store.get(key, { type: 'json' })) || { counts: [] };
  const m = (req.headers.get('cookie') || '').match(new RegExp('b42v_' + poll + '=(\\d+)'));
  if (m) return json({ counts: cur.counts, choice: Number(m[1]) });
  const ip = (context && context.ip) || req.headers.get('x-nf-client-connection-ip') || '';
  const vk = 'voter:' + poll + ':' + await hash(ip + poll + 'b42salt');
  if (ip && await store.get(vk)) return json({ counts: cur.counts, choice: -1 });
  while (cur.counts.length <= opt) cur.counts.push(0);
  cur.counts[opt]++;
  await store.setJSON(key, cur);
  if (ip) await store.set(vk, '1');
  return json({ counts: cur.counts, choice: opt }, 200, { 'set-cookie': 'b42v_' + poll + '=' + opt + '; Path=/; Max-Age=2592000; SameSite=Lax' });
};
export const config = { path: '/api/vote' };
