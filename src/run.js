// Execução do bot (roda a cada 30 min no GitHub Actions).
// Uso: node src/run.js [--dry]
//      FORCE=<slot> node src/run.js   (slots: on off curiosidade data musica icon isso poll quiz resposta mecore jogo news)
import fs from 'node:fs';
import path from 'node:path';
import { CONFIG, paths, sleep } from './config.js';
import { buscarTudo } from './sources.js';
import { agoraBR, hm, diaAnterior, seedDoDia } from './schedule.js';
import * as F from './format.js';
import { escolherMusica, legendaMusica, cardMusica } from './music.js';
import { unpackDir, packDir } from './crypto.js';
import { enviarCanal } from './canal.js';

const DRY = process.argv.includes('--dry') || process.env.DRY_RUN === '1';
const FORCE = process.env.FORCE || '';
const FONTES = ['youtube', 'youtubeOutros', 'deezer', 'noticias', 'reddit'];
const LIMITE_DIA = { noticias: CONFIG.maxNewsPerDay, reddit: CONFIG.maxRedditPerDay, youtubeOutros: CONFIG.maxYoutubeOutrosPerDay };
const DAY = 86_400_000;
const figurinhasEnviadas = new Set(); // nomes das figurinhas confirmadas pelo WhatsApp nesta execução

// ---------- estado ----------
function carregarEstado() {
  let s = {};
  try { s = JSON.parse(fs.readFileSync(paths.state, 'utf8')); } catch {}
  s.seen ||= {}; for (const f of FONTES) s.seen[f] ||= [];
  s.daily ||= {}; s.icons ||= []; s.figurinhas ||= [];
  s.usados ||= {};
  for (const k of ['curiosidades', 'quiz', 'isso', 'textos', 'enquetes', 'mecore', 'musicas']) s.usados[k] ||= [];
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

function sortear(total, usados, seed) {
  if (usados.length >= total) usados.length = 0; // acabou: recomeça o ciclo
  const livres = [...Array(total).keys()].filter((i) => !usados.includes(i));
  return livres[Math.abs(seed) % livres.length];
}

// ---------- slots diários ----------
// Cada builder devolve uma mensagem, null (tenta de novo depois) ou { pular: true } (nada hoje).
const SLOTS = {
  on: (s, dia) => ({ texto: F.canalOn(seedDoDia(dia)), imagemLocal: path.join(paths.assets, 'canal-on.png') }),
  off: (s, dia) => ({ texto: F.canalOff(seedDoDia(dia)), imagemLocal: path.join(paths.assets, 'canal-off.png') }),

  curiosidade: (s, dia) => {
    const lista = lerJSON('curiosidades.json');
    const i = sortear(lista.length, s.usados.curiosidades, seedDoDia(dia) * 3);
    return { texto: F.curiosidadeTexto(lista[i]), marcar: () => s.usados.curiosidades.push(i) };
  },

  data: (s, dia, ctx) => {
    const mmdd = dia.slice(5), ano = Number(dia.slice(0, 4));
    const hoje = lerJSON('datas.json').filter((d) => d.data === mmdd);
    if (hoje.length) return { texto: hoje.map((d) => F.dataEspecialTexto(d, ano)).join('\n\n━━━━━━━━━━\n\n') };
    const futuros = (ctx.fontes.deezer || []).filter((i) => i.futuro)
      .map((i) => ({ i, dias: Math.ceil((Date.parse(`${i.data}T00:00:00-03:00`) - Date.now()) / DAY) }))
      .filter((x) => x.dias >= 1 && x.dias <= 30)
      .sort((a, b) => a.dias - b.dias);
    if (futuros.length) return { texto: F.contagemTexto(futuros[0].i, futuros[0].dias), imagemUrl: futuros[0].i.imagem };
    return { pular: true };
  },

  musica: async (s, dia) => {
    const m = await escolherMusica(s.usados.musicas, seedDoDia(dia) * 11, Number(dia.slice(5, 7)));
    return {
      texto: legendaMusica(m),
      imagemBuffer: await cardMusica(m),
      audioUrl: m.preview,
      rotulo: `música do dia: ${m.titulo}`,
      marcar: () => s.usados.musicas.push(m.chave),
    };
  },

  figurinhas: (s, dia) => {
    const arquivos = fs.existsSync(paths.figurinhas)
      ? fs.readdirSync(paths.figurinhas).filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !s.figurinhas.includes(f)).sort()
      : [];
    if (!arquivos.length) { console.log('ℹ️  Sem figurinhas novas na pasta figurinhas/ — pulando por enquanto.'); return null; }
    const lote = arquivos.slice(0, CONFIG.figurinhasPorVez);
    return {
      texto: F.figurinhasTexto(lote.length, seedDoDia(dia)),
      figurinhas: lote.map((f) => path.join(paths.figurinhas, f)),
      rotulo: `hora das figurinhas (${lote.length})`,
      marcar: () => s.figurinhas.push(...lote.filter((f) => figurinhasEnviadas.has(f))),
    };
  },

  icon: (s) => {
    const arquivos = fs.existsSync(paths.icons)
      ? fs.readdirSync(paths.icons).filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !s.icons.includes(f)).sort()
      : [];
    if (!arquivos.length) { console.log('ℹ️  Sem icons novos na pasta icons/ — pulando o icon por enquanto.'); return null; }
    return {
      texto: F.ICON_LEGENDAS[s.icons.length % F.ICON_LEGENDAS.length],
      imagemLocal: path.join(paths.icons, arquivos[0]),
      marcar: () => s.icons.push(arquivos[0]),
    };
  },

  isso: (s, dia) => {
    const lista = lerJSON('jogos.json').issoOuAquilo;
    const i = sortear(lista.length, s.usados.isso, seedDoDia(dia) * 5);
    return {
      texto: F.enqueteTexto({ pergunta: 'Qual você prefere?', opcoes: lista[i] }, 'ISSO OU AQUILO? 🤔'),
      poll: { name: '💜 ISSO OU AQUILO? 🤔', values: lista[i] },
      marcar: () => s.usados.isso.push(i),
    };
  },

  poll: (s, dia) => {
    const lista = lerJSON('enquetes.json');
    const i = sortear(lista.length, s.usados.enquetes, seedDoDia(dia) * 7);
    const e = lista[i];
    return {
      texto: F.enqueteTexto(e),
      poll: { name: `💜 ENQUETE DO DIA 🗳️ ${e.pergunta.replace(/[*_]/g, '')}`, values: e.opcoes.slice(0, 12) },
      marcar: () => s.usados.enquetes.push(i),
    };
  },

  quiz: (s, dia) => {
    const lista = lerJSON('quiz.json');
    const i = sortear(lista.length, s.usados.quiz, seedDoDia(dia) * 17);
    const q = lista[i];
    return {
      texto: F.enqueteTexto({ pergunta: q.pergunta, opcoes: q.opcoes }, 'QUIZ 🧠'),
      poll: { name: `💜 QUIZ 🧠 ${q.pergunta} (resposta mais tarde!)`, values: q.opcoes },
      marcar: (d) => { s.usados.quiz.push(i); d.quizIndex = i; },
    };
  },

  resposta: (s, dia) => {
    if (!s.daily[dia]?.quiz) return null; // espera o quiz sair primeiro
    const i = s.daily[dia].quizIndex;
    if (i == null) return { pular: true };
    return { texto: F.quizRespostaTexto(lerJSON('quiz.json')[i]) };
  },

  mecore: (s, dia) => {
    const lista = lerJSON('mecore.json');
    const i = sortear(lista.length, s.usados.mecore, seedDoDia(dia) * 13);
    return { texto: F.meCoreTexto(lista[i]), marcar: () => s.usados.mecore.push(i) };
  },

  jogo: (s, dia) => {
    const lista = lerJSON('jogos.json').textos;
    const i = sortear(lista.length, s.usados.textos, seedDoDia(dia) * 19);
    return { texto: F.jogoTexto(lista[i]), marcar: () => s.usados.textos.push(i) };
  },
};

async function montarSlot(chave, s, dia, ctx) {
  try {
    const m = await SLOTS[chave](s, dia, ctx);
    if (!m) return null;
    return { chave, dia, ...m };
  } catch (e) {
    console.warn(`⚠️  Não deu pra montar "${chave}": ${e.message}`);
    return null;
  }
}

function msgItem(fonte, item) {
  return { chave: 'item', fonte, item, texto: F.formatarItem(item), imagemUrl: item.imagem, rotulo: item.titulo };
}

// ---------- envio ----------
async function baixar(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

async function enviar(sock, jid, m) {
  const texto = F.decorar(m.texto);
  if (m.poll) {
    try {
      await enviarCanal(sock, jid, { poll: { name: F.decorarEnquete(m.poll.name.replace(/[*_]/g, '')).slice(0, 250), values: m.poll.values, selectableCount: 1 } });
      return;
    } catch (e) { console.warn(`⚠️  Enquete nativa falhou (${e.message}), enviando em texto.`); }
  }
  let img = m.imagemBuffer || null;
  try {
    if (!img && m.imagemLocal && fs.existsSync(m.imagemLocal)) img = fs.readFileSync(m.imagemLocal);
    else if (!img && m.imagemUrl) img = await baixar(m.imagemUrl);
  } catch (e) { console.warn(`⚠️  Não consegui baixar a imagem (${e.message}).`); }
  let foi = false;
  if (img) {
    try { await enviarCanal(sock, jid, { image: img, caption: texto }); foi = true; }
    catch (e) { console.warn(`⚠️  Envio com imagem falhou (${e.message}), mandando só texto.`); }
  }
  if (!foi) await enviarCanal(sock, jid, { text: texto });
  if (m.figurinhas) {
    const { criarFigurinha } = await import('./stickers.js');
    for (const arq of m.figurinhas) {
      console.log(`⏱️  Esperando ${CONFIG.delayBetweenPostsMs / 1000}s (figurinha)...`);
      await sleep(CONFIG.delayBetweenPostsMs);
      try {
        await enviarCanal(sock, jid, { sticker: await criarFigurinha(fs.readFileSync(arq)) });
        figurinhasEnviadas.add(path.basename(arq));
        console.log(`   🎨 figurinha enviada: ${path.basename(arq)}`);
      } catch (e) { console.warn(`⚠️  Figurinha ${path.basename(arq)} falhou (${e.message}).`); }
    }
  }
  if (m.audioUrl) {
    try {
      await sleep(3000);
      const { paraMensagemDeVoz } = await import('./audio.js');
      const voz = await paraMensagemDeVoz(await baixar(m.audioUrl));
      await enviarCanal(sock, jid, { audio: voz.ogg, ptt: true, seconds: voz.segundos, waveform: voz.waveform, mimetype: 'audio/ogg; codecs=opus' });
    } catch (e) { console.warn(`⚠️  Prévia em áudio falhou (${e.message}).`); }
  }
}

function marcarFeito(s, m) {
  if (m.chave === 'item') {
    s.seen[m.fonte].push(m.item.id);
    const d = (s.daily[agoraBR().dia] ||= {});
    if (LIMITE_DIA[m.fonte]) d[`n_${m.fonte}`] = (d[`n_${m.fonte}`] || 0) + 1;
    return;
  }
  const d = (s.daily[m.dia] ||= {});
  d[m.chave] = true;
  m.marcar?.(d);
}

// ---------- principal ----------
async function main() {
  const s = carregarEstado();
  const { dia, min } = agoraBR();
  const S = CONFIG.slots;
  const hoje = (s.daily[dia] ||= {});
  console.log(`🕰️  ${dia} ${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')} (Brasília)${DRY ? ' — DRY RUN' : ''}`);

  // 1) novidades
  const fontes = await buscarTudo();
  const ctx = { fontes };
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
    let m;
    if (FORCE === 'news') {
      const f = FONTES.find((x) => (fontes[x] || []).length);
      m = f && msgItem(f, fontes[f][0]);
    } else if (SLOTS[FORCE]) {
      m = await montarSlot(FORCE, s, dia, ctx);
      if (m?.pular) m = null;
    }
    if (!m) throw new Error(`FORCE inválido ou sem conteúdo agora: ${FORCE}`);
    m.forcado = true;
    fila.push(m);
  } else if (min < hm(S.on)) {
    // madrugada: só fecha o canal de ontem se o cron atrasou
    const ontem = diaAnterior(dia);
    if (s.daily[ontem]?.on && !s.daily[ontem]?.off) off = await montarSlot('off', s, ontem, ctx);
  } else {
    const fechou = min >= hm(S.off);
    if (!hoje.on && !fechou) fila.push(await montarSlot('on', s, dia, ctx));
    const aberto = !fechou && (hoje.on || fila.length);
    if (aberto) {
      // novidades primeiro (com limite diário por fonte)
      for (const f of FONTES) {
        const lim = LIMITE_DIA[f];
        const vagas = lim == null ? Infinity : Math.max(0, lim - (hoje[`n_${f}`] || 0));
        novos[f].slice(0, vagas).forEach((it) => fila.push(msgItem(f, it)));
        novos[f].slice(vagas).forEach((it) => s.seen[f].push(it.id)); // excedente do dia: descarta
      }
      // interações do dia, na ordem do horário
      for (const [chave, hora] of Object.entries(S)) {
        if (chave === 'on' || chave === 'off' || hoje[chave] || min < hm(hora)) continue;
        const m = await montarSlot(chave, s, dia, ctx);
        if (!m) continue;
        if (m.pular) { if (!DRY) hoje[chave] = true; continue; }
        fila.push(m);
      }
    }
    if (fechou && hoje.on && !hoje.off) off = await montarSlot('off', s, dia, ctx);
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
      const midia = [
        m.imagemBuffer && '🖼️ card gerado', m.imagemLocal && `🖼️ ${path.basename(m.imagemLocal)}`,
        !m.imagemLocal && !m.imagemBuffer && m.imagemUrl && `🖼️ ${m.imagemUrl}`, m.audioUrl && '🔊 prévia 30s', m.poll && '🗳️ enquete nativa', m.figurinhas && `🎨 ${m.figurinhas.length} figurinhas`,
      ].filter(Boolean).join(' · ');
      console.log(`\n──────── [${m.chave}${m.fonte ? ':' + m.fonte : ''}] ${midia}\n${m.poll ? `(enquete) ${F.decorarEnquete(m.poll.name.replace(/[*_]/g, ''))}\n• ${m.poll.values.join('\n• ')}` : F.decorar(m.texto)}`);
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
      console.log(`📤 Postado: [${m.chave}${m.fonte ? ':' + m.fonte : ''}] ${(m.rotulo || m.texto.split('\n')[0]).slice(0, 80)}`);
      if (!m.forcado) { marcarFeito(s, m); salvarEstado(s); }
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
