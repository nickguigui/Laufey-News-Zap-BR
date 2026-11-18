// Execução do bot (roda a cada 30 min no GitHub Actions).
// Uso: node src/run.js [--dry]   |   FORCE=on|off|poll|mecore|icon|news node src/run.js
import fs from 'node:fs';
import path from 'node:path';
import { CONFIG, paths, sleep } from './config.js';
import { buscarTudo } from './sources.js';
import { agoraBR, hm, diaAnterior, seedDoDia } from './schedule.js';
import { canalOn, canalOff, formatarItem, ICON_LEGENDAS, meCoreTexto, enqueteTexto } from './format.js';
import { unpackDir, packDir } from './crypto.js';

const DRY = process.argv.includes('--dry') || process.env.DRY_RUN === '1';
const FORCE = process.env.FORCE || '';
const FONTES = ['youtube', 'deezer', 'noticias', 'reddit'];

// ---------- estado ----------
function carregarEstado() {
  let s = {};
  try { s = JSON.parse(fs.readFileSync(paths.state, 'utf8')); } catch {}
  s.seen ||= {}; for (const f of FONTES) s.seen[f] ||= [];
  s.daily ||= {}; s.icons ||= []; s.enquetes ||= []; s.mecore ||= [];
  return s;
}
function salvarEstado(s) {
  if (DRY) return;
  for (const f of FONTES) s.seen[f] = s.seen[f].slice(-500);
  const dias = Object.keys(s.daily).sort();
  for (const d of dias.slice(0, Math.max(0, dias.length - 7))) delete s.daily[d];
  fs.writeFileSync(paths.state, JSON.stringify(s, null, 2) + '\n');
}

const lerJSON = (nome) => JSON.parse(fs.readFileSync(path.join(paths.content, nome), 'utf8'));

function sortearNaoUsado(total, usados, seed) {
  if (usados.length >= total) usados.length = 0; // acabou: recomeça o ciclo
  const livres = [...Array(total).keys()].filter((i) => !usados.includes(i));
  return livres[Math.abs(seed) % livres.length];
}

// ---------- montar mensagens ----------
function msgOn(dia) {
  return { chave: 'on', dia, texto: canalOn(seedDoDia(dia)), imagemLocal: path.join(paths.assets, 'canal-on.png') };
}
function msgOff(dia) {
  return { chave: 'off', dia, texto: canalOff(seedDoDia(dia)), imagemLocal: path.join(paths.assets, 'canal-off.png') };
}
function msgIcon(s, dia) {
  const arquivos = fs.existsSync(paths.icons)
    ? fs.readdirSync(paths.icons).filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !s.icons.includes(f)).sort()
    : [];
  if (!arquivos.length) { console.log('ℹ️  Sem icons novos na pasta icons/ — pulando o icon de hoje.'); return null; }
  return {
    chave: 'icon', dia, arquivoIcon: arquivos[0],
    texto: ICON_LEGENDAS[seedDoDia(dia) % ICON_LEGENDAS.length],
    imagemLocal: path.join(paths.icons, arquivos[0]),
  };
}
function msgEnquete(s, dia) {
  const lista = lerJSON('enquetes.json');
  const i = sortearNaoUsado(lista.length, s.enquetes, seedDoDia(dia) * 7);
  return { chave: 'poll', dia, indiceEnquete: i, enquete: lista[i], texto: enqueteTexto(lista[i]) };
}
function msgMeCore(s, dia) {
  const lista = lerJSON('mecore.json');
  const i = sortearNaoUsado(lista.length, s.mecore, seedDoDia(dia) * 13);
  return { chave: 'mecore', dia, indiceMeCore: i, texto: meCoreTexto(lista[i]) };
}
function msgItem(fonte, item) {
  return { chave: 'item', fonte, item, texto: formatarItem(item), imagemUrl: item.imagem };
}

// ---------- envio ----------
async function baixar(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

async function enviar(sock, jid, m) {
  if (m.enquete) {
    try {
      const nome = `💜 ENQUETE DO DIA 🗳️ ${m.enquete.pergunta.replace(/[*_]/g, '')}`;
      await sock.sendMessage(jid, { poll: { name: nome, values: m.enquete.opcoes.slice(0, 12), selectableCount: 1 } });
      return;
    } catch (e) { console.warn(`⚠️  Enquete nativa falhou (${e.message}), enviando em texto.`); }
  }
  let img = null;
  try {
    if (m.imagemLocal && fs.existsSync(m.imagemLocal)) img = fs.readFileSync(m.imagemLocal);
    else if (m.imagemUrl) img = await baixar(m.imagemUrl);
  } catch (e) { console.warn(`⚠️  Não consegui baixar a imagem (${e.message}).`); }
  if (img) {
    try { await sock.sendMessage(jid, { image: img, caption: m.texto }); return; }
    catch (e) { console.warn(`⚠️  Envio com imagem falhou (${e.message}), mandando só texto.`); }
  }
  await sock.sendMessage(jid, { text: m.texto });
}

function marcarFeito(s, m) {
  if (m.chave === 'item') { s.seen[m.fonte].push(m.item.id); return; }
  const d = (s.daily[m.dia] ||= {});
  d[m.chave] = true;
  if (m.chave === 'icon') s.icons.push(m.arquivoIcon);
  if (m.chave === 'poll') s.enquetes.push(m.indiceEnquete);
  if (m.chave === 'mecore') s.mecore.push(m.indiceMeCore);
}

// ---------- principal ----------
async function main() {
  const s = carregarEstado();
  const { dia, min } = agoraBR();
  const S = CONFIG.slots;
  const hoje = (s.daily[dia] ||= {});
  hoje.noticias ||= 0; hoje.reddit ||= 0;
  console.log(`🕰️  ${dia} ${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')} (Brasília)${DRY ? ' — DRY RUN' : ''}`);

  // 1) novidades
  const fontes = await buscarTudo();
  const novos = {};
  for (const f of FONTES) novos[f] = (fontes[f] || []).filter((i) => !s.seen[f].includes(i.id));
  if (!s.seeded && !FORCE) {
    for (const f of FONTES) s.seen[f].push(...(fontes[f] || []).map((i) => i.id));
    s.seeded = true;
    console.log('🌱 Primeira execução: registrei o que já existe, sem postar o histórico.');
    for (const f of FONTES) novos[f] = [];
  }

  // 2) monta a fila
  const fila = [];
  let off = null;
  if (FORCE) {
    const prim = FONTES.map((f) => (fontes[f] || [])[0] && msgItem(f, fontes[f][0])).find(Boolean);
    const m = { on: msgOn(dia), off: msgOff(dia), poll: msgEnquete(s, dia), mecore: msgMeCore(s, dia), icon: msgIcon(s, dia), news: prim }[FORCE];
    if (!m) throw new Error(`FORCE inválido ou sem conteúdo: ${FORCE}`);
    m.forcado = true;
    fila.push(m);
  } else if (min < hm(S.on)) {
    // madrugada: só fecha o canal de ontem se o cron atrasou
    const ontem = diaAnterior(dia);
    if (s.daily[ontem]?.on && !s.daily[ontem]?.off) off = msgOff(ontem);
  } else {
    const fechou = min >= hm(S.off);
    if (!hoje.on && !fechou) fila.push(msgOn(dia));
    const aberto = !fechou && (hoje.on || fila.length);
    if (aberto) {
      for (const it of novos.youtube) fila.push(msgItem('youtube', it));
      for (const it of novos.deezer) fila.push(msgItem('deezer', it));
      const vagasNews = Math.max(0, CONFIG.maxNewsPerDay - hoje.noticias);
      novos.noticias.slice(0, vagasNews).forEach((it) => fila.push(msgItem('noticias', it)));
      novos.noticias.slice(vagasNews).forEach((it) => s.seen.noticias.push(it.id)); // excedente do dia: descarta
      const vagasRd = Math.max(0, CONFIG.maxRedditPerDay - hoje.reddit);
      novos.reddit.slice(0, vagasRd).forEach((it) => fila.push(msgItem('reddit', it)));
      novos.reddit.slice(vagasRd).forEach((it) => s.seen.reddit.push(it.id));
      if (min >= hm(S.icon) && !hoje.icon) { const m = msgIcon(s, dia); if (m) fila.push(m); }
      if (min >= hm(S.poll) && !hoje.poll) fila.push(msgEnquete(s, dia));
      if (min >= hm(S.mecore) && !hoje.mecore) fila.push(msgMeCore(s, dia));
    }
    if (fechou && hoje.on && !hoje.off) off = msgOff(dia);
  }
  // limite por execução (o resto sai na próxima); o OFF sempre vai por último
  const max = CONFIG.maxPostsPerRun - (off ? 1 : 0);
  const enviarAgora = [...fila.slice(0, max), ...(off ? [off] : [])];
  if (fila.length > max) console.log(`⏳ ${fila.length - max} post(s) ficaram para a próxima execução.`);

  if (!enviarAgora.length) {
    console.log('😴 Nada para postar agora.');
    salvarEstado(s);
    return;
  }

  // 3) dry run: só mostra
  if (DRY) {
    for (const m of enviarAgora) {
      console.log(`\n──────── [${m.chave}${m.fonte ? ':' + m.fonte : ''}]${m.imagemLocal || m.imagemUrl ? ' 🖼️ ' + (m.imagemLocal ? path.basename(m.imagemLocal) : m.imagemUrl) : ''}${m.enquete ? ' (enquete nativa)' : ''}\n${m.texto}`);
    }
    console.log(`\n✅ ${enviarAgora.length} mensagem(ns) seriam postadas, com ${CONFIG.delayBetweenPostsMs / 1000}s entre cada.`);
    return;
  }

  // 4) conecta e posta
  const jid = process.env.CHANNEL_JID;
  const key = process.env.AUTH_KEY;
  if (!jid || !jid.endsWith('@newsletter')) throw new Error('CHANNEL_JID ausente/inválido (rode "npm run login").');
  if (!fs.existsSync(paths.authEnc)) throw new Error('auth.enc não encontrado (rode "npm run login").');
  unpackDir(paths.authEnc, paths.authRuntime, key);

  const { connect } = await import('./whatsapp.js');
  const { sock, wasChanged } = await connect(paths.authRuntime);
  console.log('🟢 Conectado ao WhatsApp.');
  await sleep(4000);

  let enviados = 0;
  try {
    for (const m of enviarAgora) {
      if (enviados > 0) {
        console.log(`⏱️  Esperando ${CONFIG.delayBetweenPostsMs / 1000}s...`);
        await sleep(CONFIG.delayBetweenPostsMs);
      }
      await enviar(sock, jid, m);
      enviados++;
      console.log(`📤 Postado: [${m.chave}${m.fonte ? ':' + m.fonte : ''}] ${(m.item?.titulo || m.texto.split('\n')[0]).slice(0, 80)}`);
      if (!m.forcado) {
        marcarFeito(s, m);
        if (m.fonte === 'noticias') hoje.noticias++;
        if (m.fonte === 'reddit') hoje.reddit++;
        salvarEstado(s);
      }
    }
  } finally {
    salvarEstado(s);
    await sleep(3000);
    if (wasChanged()) packDir(paths.authRuntime, paths.authEnc, key);
    try { sock.end(undefined); } catch {}
    fs.rmSync(paths.authRuntime, { recursive: true, force: true });
  }
  console.log(`✅ ${enviados} post(s) enviados.`);
}

main().then(() => process.exit(0), (e) => { console.error('❌', e.message); process.exit(1); });
