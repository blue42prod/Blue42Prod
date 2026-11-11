// Returns the newest upload for a YouTube channel, so the site always shows the latest video.
// Responses are cached at the CDN for 30 minutes to keep things fast and avoid hammering YouTube.
const json = (d, s = 200, cache = true) => new Response(JSON.stringify(d), {
  status: s,
  headers: {
    'content-type': 'application/json',
    'cache-control': 'public, max-age=300',
    'netlify-cdn-cache-control': cache ? 'public, durable, s-maxage=1800, stale-while-revalidate=86400' : 'public, s-maxage=120',
  },
});
const UA = { 'user-agent': 'Mozilla/5.0 (compatible; SiteVideoFetcher/1.0)', 'accept-language': 'en-US,en;q=0.9' };
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

async function channelId(raw) {
  let u;
  try { u = new URL(/^https?:\/\//i.test(raw) ? raw : 'https://www.youtube.com/' + raw.replace(/^\/+/, '')); } catch { return null; }
  if (!/(^|\.)youtube\.com$/i.test(u.hostname)) return null;
  const direct = u.pathname.match(/\/channel\/(UC[\w-]{22})/);
  if (direct) return direct[1];
  const res = await fetch('https://www.youtube.com' + u.pathname, { headers: UA });
  if (!res.ok) return null;
  const html = await res.text();
  const m = html.match(/"externalId":"(UC[\w-]{22})"/) || html.match(/youtube\.com\/channel\/(UC[\w-]{22})/) || html.match(/"channelId":"(UC[\w-]{22})"/);
  return m ? m[1] : null;
}

export default async (req) => {
  const channel = (new URL(req.url).searchParams.get('channel') || '').trim().slice(0, 200);
  if (!channel) return json({ error: 'missing channel' }, 400, false);
  try {
    const id = await channelId(channel);
    if (!id) return json({ video: null }, 200, false);
    const feed = await fetch('https://www.youtube.com/feeds/videos.xml?channel_id=' + id, { headers: UA });
    if (!feed.ok) return json({ video: null }, 200, false);
    const xml = await feed.text();
    const entry = (xml.match(/<entry>([\s\S]*?)<\/entry>/) || [])[1];
    if (!entry) return json({ video: null });
    const vid = (entry.match(/<yt:videoId>([\w-]{6,20})<\/yt:videoId>/) || [])[1];
    const title = decode((entry.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '');
    const published = (entry.match(/<published>([^<]+)<\/published>/) || [])[1] || '';
    return json({ video: vid ? { id: vid, title, published } : null });
  } catch {
    return json({ video: null }, 200, false);
  }
};

export const config = { path: '/api/youtube-latest' };
