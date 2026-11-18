// Gera assets/canal-on.png e assets/canal-off.png (rode no PC: npm run cards).
// Usa assets/laufey.jpg se existir; senão baixa a foto oficial de artista do Deezer.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { CONFIG, paths } from './config.js';

const W = 1280, H = 800, FOTO = 800;
const fotoPath = path.join(paths.assets, 'laufey.jpg');

if (!fs.existsSync(fotoPath)) {
  const r = await fetch(`https://api.deezer.com/artist/${CONFIG.deezerArtistId}/image?size=xl`);
  fs.writeFileSync(fotoPath, Buffer.from(await r.arrayBuffer()));
  console.log('📥 Foto baixada em assets/laufey.jpg (troque por outra se quiser e rode de novo).');
}

const TEMAS = {
  on: { bg: '#F4EADB', painel: '#F4EADB', texto: '#6E2A3B', acento: '#8E5BB5', sub: 'abriu! bom dia 💜', estado: 'ON', deco: 'sol' },
  off: { bg: '#161C36', painel: '#161C36', texto: '#F4EADB', acento: '#B48CE0', sub: 'fechou! boa noite', estado: 'OFF', deco: 'lua' },
};

function painelSVG(t) {
  const x0 = FOTO, cx = x0 + (W - FOTO) / 2;
  const deco = t.deco === 'sol'
    ? `<g transform="translate(${cx},150)" stroke="${t.acento}" stroke-width="6" stroke-linecap="round">
         <circle r="34" fill="none"/>
         ${[...Array(8).keys()].map((i) => { const a = (i * Math.PI) / 4; return `<line x1="${Math.cos(a) * 50}" y1="${Math.sin(a) * 50}" x2="${Math.cos(a) * 68}" y2="${Math.sin(a) * 68}"/>`; }).join('')}
       </g>`
    : `<g transform="translate(${cx},150)">
         <circle r="48" fill="${t.acento}"/><circle cx="22" cy="-14" r="44" fill="${t.painel}"/>
         <circle cx="-120" cy="40" r="4" fill="${t.texto}"/><circle cx="110" cy="-30" r="3" fill="${t.texto}"/><circle cx="90" cy="70" r="5" fill="${t.texto}"/>
       </g>`;
  // coração (o 💜 do Nick) desenhado em vetor
  const coracao = (x, y, s) => `<path transform="translate(${x},${y}) scale(${s})" fill="${t.acento}" d="M0,30 C-40,0 -30,-30 0,-12 C30,-30 40,0 0,30 Z"/>`;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect x="${x0}" y="0" width="${W - FOTO}" height="${H}" fill="${t.painel}"/>
    <rect x="${x0 + 24}" y="24" width="${W - FOTO - 48}" height="${H - 48}" fill="none" stroke="${t.texto}" stroke-width="3" rx="18"/>
    <rect x="${x0 + 36}" y="36" width="${W - FOTO - 72}" height="${H - 72}" fill="none" stroke="${t.acento}" stroke-width="1.5" rx="12"/>
    ${deco}
    <text x="${cx}" y="345" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="96" font-weight="bold" fill="${t.texto}" letter-spacing="6">CANAL</text>
    <text x="${cx}" y="500" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${t.estado === 'ON' ? 150 : 128}" font-weight="bold" font-style="italic" fill="${t.acento}">${t.estado}<tspan font-size="80" font-style="normal" fill="${t.texto}" dx="6">!!</tspan></text>
    <line x1="${cx - 120}" y1="560" x2="${cx + 120}" y2="560" stroke="${t.texto}" stroke-width="2"/>
    <text x="${cx}" y="615" text-anchor="middle" font-family="Georgia, serif" font-size="34" font-style="italic" fill="${t.texto}">${t.sub.replace(' 💜', '')}</text>
    ${coracao(cx, 672, 1.0)}
    <text x="${cx}" y="735" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="${t.texto}" opacity="0.75">beijos do Nick</text>
  </svg>`);
}

function vinheta(t) {
  // leve fusão da foto com o painel
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${FOTO}" height="${H}">
    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0.75" stop-color="${t.painel}" stop-opacity="0"/><stop offset="1" stop-color="${t.painel}" stop-opacity="0.85"/></linearGradient></defs>
    <rect width="${FOTO}" height="${H}" fill="url(#g)"/></svg>`);
}

for (const [nome, t] of Object.entries(TEMAS)) {
  let foto = sharp(fotoPath).resize(FOTO, H, { fit: 'cover', position: 'attention' });
  if (nome === 'off') foto = foto.modulate({ brightness: 0.8, saturation: 0.75 }).tint('#c3cbef');
  const fotoBuf = await foto.toBuffer();
  const out = path.join(paths.assets, `canal-${nome}.png`);
  await sharp({ create: { width: W, height: H, channels: 3, background: t.bg } })
    .composite([{ input: fotoBuf, left: 0, top: 0 }, { input: vinheta(t), left: 0, top: 0 }, { input: painelSVG(t), left: 0, top: 0 }])
    .png()
    .toFile(out);
  console.log(`🖼️  ${path.relative(paths.assets, out)} gerado`);
}
