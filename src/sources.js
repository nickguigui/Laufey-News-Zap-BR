// Busca novidades da Laufey em fontes públicas e gratuitas.
// Cada item: { id, tipo, titulo, link, imagem?, extra? }
import { XMLParser } from 'fast-xml-parser';
import { CONFIG } from './config.js';

const UA = 'Mozilla/5.0 (compatible; laufey-channel-bot/1.0)';
const xml = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@' });
const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const DAY = 86_400_000;

async function get(url, type = 'text') {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: '*/*' }, signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
  return type === 'json' ? res.json() : res.text();
}

export async function youtube() {
  const feed = xml.parse(await get(`https://www.youtube.com/feeds/videos.xml?channel_id=${CONFIG.youtubeChannelId}`)).feed;
  return arr(feed.entry).map((e) => ({
    id: `yt:${e['yt:videoId']}`,
    tipo: 'youtube',
    titulo: String(e.title),
    link: e.link?.['@href'] || `https://youtu.be/${e['yt:videoId']}`,
    imagem: `https://i.ytimg.com/vi/${e['yt:videoId']}/hqdefault.jpg`,
    data: e.published,
    shorts: String(e.link?.['@href'] || '').includes('/shorts/'),
  }));
}

export async function deezer() {
  const { data } = await get(`https://api.deezer.com/artist/${CONFIG.deezerArtistId}/albums?limit=50`, 'json');
  const limite = Date.now() - 21 * DAY; // ignora catálogo antigo
  return arr(data)
    .filter((a) => Date.parse(a.release_date) >= limite)
    .map((a) => ({
      id: `dz:${a.id}`,
      tipo: 'lancamento',
      titulo: a.title,
      link: a.link,
      imagem: a.cover_xl,
      data: a.release_date,
      formato: a.record_type, // single | album | ep
    }));
}

async function googleNews(hl, gl, ceid) {
  const q = encodeURIComponent('Laufey -"God of War" -Kratos -Atreus -Thor -Loki -Marvel -Ragnarok');
  const rss = xml.parse(await get(`https://news.google.com/rss/search?q=${q}&hl=${hl}&gl=${gl}&ceid=${ceid}`)).rss;
  const limite = Date.now() - 2 * DAY;
  return arr(rss.channel?.item)
    .filter((i) => Date.parse(i.pubDate) >= limite && /laufey/i.test(i.title) && !/god of war|kratos|atreus|thor|loki|marvel|ragnar|faye|t[yý]r|jotun|frost giant/i.test(i.title))
    .map((i) => {
      const fonte = typeof i.source === 'object' ? i.source['#text'] : i.source;
      let titulo = String(i.title);
      if (fonte && titulo.endsWith(` - ${fonte}`)) titulo = titulo.slice(0, -(fonte.length + 3));
      return {
        id: `news:${titulo.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 80)}`,
        tipo: 'noticia',
        titulo,
        link: i.link,
        fonte,
        data: i.pubDate,
      };
    });
}

export async function noticias() {
  const [pt, en] = await Promise.allSettled([
    googleNews('pt-BR', 'BR', 'BR:pt-419'),
    googleNews('en-US', 'US', 'US:en'),
  ]);
  const itens = [...(pt.value || []), ...(en.value || [])];
  if (!itens.length && pt.status === 'rejected') throw pt.reason;
  // mais recentes primeiro, sem duplicar
  const vistos = new Set();
  return itens
    .sort((a, b) => Date.parse(b.data) - Date.parse(a.data))
    .filter((i) => !vistos.has(i.id) && vistos.add(i.id));
}

// Reddit bloqueia acesso anônimo; usa a API oficial (app "script" grátis).
// Sem REDDIT_CLIENT_ID/REDDIT_CLIENT_SECRET a fonte é simplesmente pulada.
export async function reddit() {
  const id = process.env.REDDIT_CLIENT_ID, secret = process.env.REDDIT_CLIENT_SECRET;
  if (!id || !secret) return [];
  const tok = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'), 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
    signal: AbortSignal.timeout(20_000),
  }).then((r) => r.json());
  if (!tok.access_token) throw new Error('Reddit recusou as credenciais');
  const res = await fetch(`https://oauth.reddit.com/r/${CONFIG.subreddit}/top?t=day&limit=10`, {
    headers: { Authorization: `Bearer ${tok.access_token}`, 'User-Agent': UA },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} no Reddit`);
  const posts = (await res.json()).data.children.map((c) => c.data);
  return posts
    .filter((p) => !p.stickied && !p.over_18 && p.score >= CONFIG.redditMinScore)
    .map((p) => ({
      id: `rd:${p.id}`,
      tipo: 'reddit',
      titulo: p.title,
      link: `https://www.reddit.com${p.permalink}`,
      score: p.score,
      imagem: /\.(jpe?g|png|webp)$/i.test(p.url || '') ? p.url : undefined,
    }));
}

export async function buscarTudo() {
  const fontes = { youtube, deezer, noticias, reddit };
  const out = {};
  await Promise.all(Object.entries(fontes).map(async ([nome, fn]) => {
    try { out[nome] = await fn(); }
    catch (e) { console.warn(`⚠️  Fonte ${nome} falhou: ${e.message}`); out[nome] = null; }
  }));
  return out;
}
