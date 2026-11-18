// Música do dia: card estilo player + prévia oficial de 30s (Deezer) + links.
import sharp from 'sharp';
import { CONFIG } from './config.js';

const norm = (t) => t.toLowerCase().replace(/\s*[([].*$/, '').replace(/[^a-z0-9]+/g, ' ').trim();
const NATAL = /christmas|santa|winter wonderland|holiday|snow is falling|jingle/i;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const COMENTARIOS = [
  'Coloca o fone, fecha os olhos e me agradece depois 🎧✨',
  'Essa aqui é pra ouvir com chá na mão e coração aberto ☕💜',
  'Se você não conhecia, prepara que vai virar vício 😵‍💫',
  'Aquela que a gente ouve 1x e coloca no repeat 47x 🔁',
  'Recomendação do Nick: ouvir olhando pela janela, de preferência com chuva 🌧️',
  'Hoje o dia pede essa. Não discuta com o universo 🔮',
  'Essa é pra você que tá precisando de um abraço em forma de música 🫂',
  'Se bater saudade de algo que você nem viveu, a culpa é dela 🥲',
  'Essa é daquelas que fazem o ônibus lotado virar cena de filme 🚌🎞️',
  'Ouve uma vez com atenção na letra, depois me conta se você sobreviveu 🫠',
  'Perfeita pra trilha sonora do seu dia, seja ele bom ou péssimo 🎬',
  'Fecha a porta do quarto, apaga a luz e só sente 🌙',
  'Essa aqui merece estar na sua playlist favorita. Se já tá, ouve de novo 🔁',
  'Música certa pra dançar sozinho na cozinha enquanto faz um café ☕💃',
  'Aviso: pode causar suspiros, lágrimas e vontade de mandar mensagem pra alguém 📱',
  'Uma das minhas favoritas. E você, já conhecia? 👀',
  'Se a Laufey fosse um abraço, ia soar exatamente assim 🫂',
  'Ideal pra ouvir olhando o céu, de preferência no fim da tarde 🌅',
  'Coloca no volume certo: alto o suficiente pra sentir, baixo o suficiente pra chorar em paz 🔉',
  'Hoje é dia de redescobrir essa preciosidade 💎',
];

let cache = null;
async function catalogo() {
  if (cache) return cache;
  const get = async (u) => (await fetch(u, { signal: AbortSignal.timeout(20_000) })).json();
  const { data: top = [] } = await get(`https://api.deezer.com/artist/${CONFIG.deezerArtistId}/top?limit=100`);
  // completa com as faixas de estúdio dos álbuns (o top 100 tem versões repetidas)
  const { data: albuns = [] } = await get(`https://api.deezer.com/artist/${CONFIG.deezerArtistId}/albums?limit=100`);
  const estudio = albuns.filter((a) => a.record_type !== 'single' && !/live|symphony|session/i.test(a.title));
  const extras = (await Promise.all(estudio.map((a) => get(`https://api.deezer.com/album/${a.id}`).catch(() => null))))
    .filter(Boolean)
    .flatMap((al) => (al.tracks?.data || []).map((t) => ({ ...t, album: { title: al.title, cover_xl: al.cover_xl } })));
  const data = [...top, ...extras];
  if (!data.length) throw new Error('Deezer não respondeu a lista de músicas');
  return (cache = data);
}

export async function escolherMusica(usadas, seed, mes) {
  const data = await catalogo();
  const vistas = new Set();
  let lista = data.filter((t) => t.preview && !vistas.has(norm(t.title)) && vistas.add(norm(t.title)));
  if (mes !== 12) lista = lista.filter((t) => !NATAL.test(`${t.title} ${t.album.title}`));
  let livres = lista.filter((t) => !usadas.includes(norm(t.title)));
  if (!livres.length) { usadas.length = 0; livres = lista; }
  const t = livres[Math.abs(seed) % livres.length];
  return {
    chave: norm(t.title),
    titulo: t.title,
    artista: t.artist?.name || 'Laufey',
    album: t.album.title,
    capa: t.album.cover_xl,
    preview: t.preview,
    deezer: t.link,
    duracao: t.duration,
    comentario: COMENTARIOS[Math.abs(seed) % COMENTARIOS.length],
  };
}

export function legendaMusica(m) {
  const q = encodeURIComponent(`${m.titulo} ${m.artista}`);
  const limpo = (t) => String(t).replace(/[*_~`]/g, '');
  return `_*MÚSICA DO DIA 🎧*_

💜- _${m.comentario}_

> 🎵 *${limpo(m.titulo)}*
> 👤 _${limpo(m.artista)}_
> 💿 _${limpo(m.album)}_

- 🟢 Spotify: https://open.spotify.com/search/${q}
- 🎧 Deezer: ${m.deezer}
- 📺 YouTube: https://www.youtube.com/results?search_query=${q}

\`prévia de 30s aqui embaixo 👇\``;
}

function quebrar(texto, max) {
  const linhas = []; let atual = '';
  for (const p of texto.split(' ')) {
    if ((atual + ' ' + p).trim().length > max) { if (atual) linhas.push(atual); atual = p; } else atual = (atual + ' ' + p).trim();
  }
  if (atual) linhas.push(atual);
  return linhas.slice(0, 3);
}

/** Card 1200x630 estilo "player de música" com capa, nome, artista e álbum. */
export async function cardMusica(m) {
  const W = 1200, H = 630, C = 470;
  const capa = Buffer.from(await (await fetch(m.capa, { signal: AbortSignal.timeout(20_000) })).arrayBuffer());
  const fundo = await sharp(capa).resize(W, H, { fit: 'cover' }).blur(40).modulate({ brightness: 0.45 }).toBuffer();
  const mascara = Buffer.from(`<svg width="${C}" height="${C}"><rect width="${C}" height="${C}" rx="28" fill="#fff"/></svg>`);
  const capaR = await sharp(capa).resize(C, C).composite([{ input: mascara, blend: 'dest-in' }]).png().toBuffer();
  const tl = quebrar(m.titulo, 20);
  const fs = tl.length > 2 ? 54 : 66;
  const x = 80 + C + 60, y0 = 210;
  const total = Math.max(30, m.duracao || 200);
  const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <text x="${x}" y="130" font-family="DejaVu Sans, Arial, sans-serif" font-size="24" font-weight="bold" fill="#C9A8F0" letter-spacing="4">MÚSICA DO DIA</text>
    ${tl.map((l, i) => `<text x="${x}" y="${y0 + i * (fs + 8)}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${fs}" font-weight="bold" fill="#FFFFFF">${esc(l)}</text>`).join('')}
    <text x="${x}" y="${y0 + tl.length * (fs + 8) + 18}" font-family="DejaVu Sans, Arial, sans-serif" font-size="34" fill="#E8E0F2">${esc(m.artista)}</text>
    ${quebrar(m.album, 34).slice(0, 2).map((l, i) => `<text x="${x}" y="${y0 + tl.length * (fs + 8) + 64 + i * 32}" font-family="DejaVu Sans, Arial, sans-serif" font-size="26" fill="#B9AECB">${esc(l)}</text>`).join('')}
    <rect x="${x}" y="478" width="480" height="8" rx="4" fill="#FFFFFF" opacity="0.25"/>
    <rect x="${x}" y="478" width="170" height="8" rx="4" fill="#C9A8F0"/>
    <circle cx="${x + 170}" cy="482" r="11" fill="#FFFFFF"/>
    <text x="${x}" y="520" font-family="DejaVu Sans, Arial, sans-serif" font-size="20" fill="#B9AECB">0:30</text>
    <text x="${x + 480}" y="520" text-anchor="end" font-family="DejaVu Sans, Arial, sans-serif" font-size="20" fill="#B9AECB">${mmss(total)}</text>
    <g transform="translate(${x + 240},572)" fill="#FFFFFF">
      <path d="M-90,-14 L-110,0 L-90,14 Z M-112,-14 L-116,-14 L-116,14 L-112,14 Z"/>
      <circle r="30" fill="#FFFFFF"/><path d="M-8,-13 L-8,13 M6,-13 L6,13" stroke="#2A1F3D" stroke-width="7" stroke-linecap="round"/>
      <path d="M90,-14 L110,0 L90,14 Z M112,-14 L116,-14 L116,14 L112,14 Z"/>
    </g>
    <path transform="translate(${W - 70},${H - 50}) scale(0.7)" fill="#C9A8F0" d="M0,30 C-40,0 -30,-30 0,-12 C30,-30 40,0 0,30 Z"/>
  </svg>`);
  return sharp(fundo)
    .composite([{ input: capaR, left: 80, top: (H - C) / 2 }, { input: svg, left: 0, top: 0 }])
    .jpeg({ quality: 90 })
    .toBuffer();
}
