// Figurinhas automáticas: usadas quando a pasta figurinhas/ está vazia.
// Mistura figurinhas de frase (texto com contorno branco, estilo adesivo)
// e figurinhas com capas oficiais dos álbuns/singles da Laufey (API do Deezer).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { CONFIG, paths } from './config.js';
import { criarFigurinha } from './stickers.js';

const FRASES = JSON.parse(fs.readFileSync(path.join(paths.content, 'figurinhas-frases.json'), 'utf8'));

// paletas vintage (texto, sombra)
const CORES = [
  ['#7b3fa0', '#d9b8f0'], ['#a8325e', '#f5c2d6'], ['#2f5d8a', '#bcd6f0'], ['#6b4a2b', '#ecd9bf'],
  ['#3d6b4f', '#c8e6d2'], ['#8a2f2f', '#f2c4c4'], ['#4b3f8a', '#cfc8f5'], ['#b0592a', '#f7d6bf'],
];
const ENFEITES = ['♡', '☆', '✿', '⋆', '♪', '✧', '❀', '♫'];

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function quebrar(frase, max) {
  const linhas = [];
  let atual = '';
  for (const p of frase.split(/\s+/)) {
    if ((atual + ' ' + p).trim().length > max && atual) { linhas.push(atual); atual = p; }
    else atual = (atual + ' ' + p).trim();
  }
  if (atual) linhas.push(atual);
  return linhas;
}

const FONTE = "'DejaVu Serif', Georgia, 'Times New Roman', serif";

// frase sozinha, fundo transparente (o contorno branco vem do criarFigurinha)
async function figuraFrase(frase, n) {
  const [cor, sombra] = CORES[n % CORES.length];
  const enf = ENFEITES[n % ENFEITES.length];
  const linhas = quebrar(frase, 13);
  const tam = Math.min(78, Math.floor(420 / Math.max(...linhas.map((l) => l.length), 6) * 1.75), Math.floor(380 / linhas.length));
  const alt = tam * 1.15;
  const topo = 256 - (alt * linhas.length) / 2 + tam * 0.8;
  const texto = linhas.map((l, i) => `<text x="256" y="${topo + i * alt}">${esc(l)}</text>`).join('');
  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <g font-family="${FONTE}" font-weight="bold" font-style="italic" font-size="${tam}" text-anchor="middle">
    <g fill="${sombra}" transform="translate(5,5)">${texto}</g>
    <g fill="${cor}" stroke="#ffffff" stroke-width="3" paint-order="stroke">${texto}</g>
  </g>
  <g font-family="${FONTE}" font-size="46" fill="${cor}" text-anchor="middle">
    <text x="70" y="${Math.max(60, topo - tam - 6)}">${enf}</text>
    <text x="442" y="${Math.min(490, topo + (linhas.length - 1) * alt + tam + 20)}">${enf}</text>
  </g>
</svg>`;
  return criarFigurinha(await sharp(Buffer.from(svg)).png().toBuffer());
}

// capa oficial + faixa com a frase
async function figuraCapa(urlCapa, frase, n) {
  const capa = Buffer.from(await (await fetch(urlCapa, { signal: AbortSignal.timeout(20_000) })).arrayBuffer());
  const [cor] = CORES[n % CORES.length];
  const linhas = quebrar(frase, 20).slice(0, 2);
  const tam = 34, alt = 40, faixa = 30 + linhas.length * alt;
  const texto = linhas.map((l, i) => `<text x="256" y="${512 - faixa + 34 + i * alt}">${esc(l)}</text>`).join('');
  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="${512 - faixa}" width="512" height="${faixa}" fill="#fffaf2" opacity="0.92"/>
  <g font-family="${FONTE}" font-weight="bold" font-style="italic" font-size="${tam}" fill="${cor}" text-anchor="middle">${texto}</g>
</svg>`;
  const base = await sharp(capa).resize(512, 512, { fit: 'cover' }).composite([{ input: Buffer.from(svg) }]).jpeg().toBuffer();
  return criarFigurinha(base);
}

async function capas() {
  try {
    const r = await fetch(`https://api.deezer.com/artist/${CONFIG.deezerArtistId}/albums?limit=50`, { signal: AbortSignal.timeout(20_000) });
    const { data } = await r.json();
    const lista = (data || []).map((a) => a.cover_xl).filter(Boolean);
    const art = await (await fetch(`https://api.deezer.com/artist/${CONFIG.deezerArtistId}`, { signal: AbortSignal.timeout(20_000) })).json();
    if (art.picture_xl) lista.push(art.picture_xl);
    return [...new Set(lista)];
  } catch { return []; }
}

// Devolve n figurinhas { nome, gerar() } sem repetir frase até acabar a lista.
export async function figurinhasAuto(usados, seed, n) {
  const lista = await capas();
  const out = [];
  for (let k = 0; k < n; k++) {
    if (usados.length >= FRASES.length) usados.length = 0;
    const livres = [...FRASES.keys()].filter((i) => !usados.includes(i) && !out.some((o) => o.i === i));
    const i = livres[Math.abs(seed * 7 + k * 13) % livres.length];
    const comCapa = lista.length && k % 3 === 1; // ~1 a cada 3 com capa
    const urlCapa = comCapa ? lista[Math.abs(seed + Math.floor(k / 3)) % lista.length] : null;
    out.push({
      i,
      nome: `auto:${i}`,
      gerar: () => (urlCapa ? figuraCapa(urlCapa, FRASES[i], seed + k) : figuraFrase(FRASES[i], seed + k)),
    });
  }
  return out;
}
