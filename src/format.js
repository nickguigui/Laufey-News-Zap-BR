// Textos do canal. Toda mensagem começa com 💜 (assinatura do Nick).

const pick = (lista, seed) => lista[Math.abs(seed) % lista.length];

export const CANAL_ON = [
  `_*CANAL ON‼️*_

_💜- Bom dia, boa tarde e boa noite, meus ouvintes! Tudo bem com vocês? ☕ E se você acabou de chegar no canal: seja muito bem-vindo, pega seu chá e se acomoda! 🫖_

_Hoje tem notícias fresquinhas da Laufey, curiosidade, música do dia 🎧, quiz, enquete pra votar, icon liberado e, se bater a bad, um 'me core' 🖤. Beijos do Nick, bora começar!! 💌_

(Canal abre às 6:00 e fecha às 23:30)`,

  `_*CANAL ON‼️*_

_💜- Acorda, acorda, ouvintes! 🌤️ O sol nasceu, o violoncelo tá afinado 🎻 e o canal tá oficialmente aberto! Quem chegou agora: bem-vindo à casa, pode tirar o sapato 🧦_

_Hoje tem notícia, enquete, icon e talvez um 'me core' pra quebrar seu coraçãozinho 💔. Beijos do Nick, vamos nessa!! ✨_

(Canal abre às 6:00 e fecha às 23:30)`,

  `_*CANAL ON‼️*_

_💜- Bom diaaa, meus amores! ☀️ Já tomaram o cafezinho? Porque o jornal da Laufey acabou de abrir as portas 📰🎀 E pra quem é novo por aqui: seja muuuito bem-vindo!_

_Fiquem de olho que hoje rola enquete 🗳️, icon novinho 🖼️ e aquele 'me core' que dói mas a gente gosta 🥲. Beijos do Nick, começamos!! 💕_

(Canal abre às 6:00 e fecha às 23:30)`,

  `_*CANAL ON‼️*_

_💜- Atenção, ouvintes: o canal está ON! 📻✨ Bom dia, boa tarde, boa noite (vai que você tá em outro fuso 🌍). Novato? Senta aqui, tem lugar e tem chá 🍵_

_A programação de hoje: notícias da Laufey, votação, icon liberado e um 'me core' pra quem gosta de sofrer em jazz 🎷🖤. Beijos do Nick, bora!! 💌_

(Canal abre às 6:00 e fecha às 23:30)`,

  `_*CANAL ON‼️*_

_💜- Plim plim! 🔔 O canal mais aconchegante do WhatsApp acabou de abrir! Bom dia, boa tarde e boa noite pra você, meu ouvinte favorito (não conta pros outros 🤫)_

_Hoje tem curiosidade, música do dia, quiz pra testar se você é fã de verdade 🧠 e muito mais. Beijos do Nick, bora!! 🎀_

(Canal abre às 6:00 e fecha às 23:30)`,

  `_*CANAL ON‼️*_

_💜- Bom dia, flor do dia! 🌷 Bom dia também pra quem acordou com cara de 'Falling Behind' 🥲 Relaxa que o canal abriu e a gente cuida de você hoje!_

_Notícias, enquetes, jogos e aquele 'me core' que dói bonito 🖤. Novato por aqui? Seja muito bem-vindo! Beijos do Nick!! 💌_

(Canal abre às 6:00 e fecha às 23:30)`,

  `_*CANAL ON‼️*_

_💜- Senhoras e senhores, ouvintes e ouvintas 🎩 O canal da Laufey está oficialmente ABERTO! Pega sua xícara, ajeita o cobertor e vem com a gente ☕🧶_

_Hoje tem música do dia 🎧, curiosidade 🧠, isso ou aquilo 🤔 e quiz! Beijos do Nick, vamos começar!! ✨_

(Canal abre às 6:00 e fecha às 23:30)`,

  `_*CANAL ON‼️*_

_💜- Bom diaaa! O despertador tocou, o violoncelo acordou 🎻 e o canal abriu! Se você chegou agora, bem-vindo à família mais sofrida e feliz do WhatsApp 🫂_

_Fica de olho na programação: tem notícia, enquete, jogo e até 'me core' mais tarde 🖤. Beijos do Nick!! 💜_

(Canal abre às 6:00 e fecha às 23:30)`,

  `_*CANAL ON‼️*_

_💜- Atenção, atenção! 📣 O jornal da Laufey está no ar! Bom dia, boa tarde e boa noite, ouvintes queridos. Quem é novo: tira o casaco e fica à vontade 🧥_

_Hoje tem informação, interação e um pouquinho de sofrência pra equilibrar 😌🖤. Beijos do Nick, bora!! 🌤️_

(Canal abre às 6:00 e fecha às 23:30)`,

  `_*CANAL ON‼️*_

_💜- Cheguei, cheguei! 🏃‍♂️💨 Bom dia, meus amores! O canal abriu e hoje promete: música do dia, quiz, enquetes e o jogo da noite 🎮_

_E se o dia for difícil, lembra: sempre tem uma música da Laufey pra te abraçar 🫂. Beijos do Nick!! 💕_

(Canal abre às 6:00 e fecha às 23:30)`,
];

export const CANAL_OFF = [
  `_*CANAL OFF‼️*_

💜- \`"Ué… já acabou?! Mas eu nem terminei meu chá…"\`

_Calma, ouvinte, não chora não (ou chora ouvindo Laufey, a gente entende 🥲)! Amanhã tem mais notícias e interações. Durma bem e beijos do Nick! 💕🌙_`,

  `_*CANAL OFF‼️*_

💜- \`"Como assim fechou?! Eu tava no meio de um surto aqui!"\`

_Respira, ouvinte 🫁 Guarda o surto pra amanhã que às 6:00 a gente volta com tudo. Coloca Bewitched pra tocar e vai dormir! Beijos do Nick! 🌙✨_`,

  `_*CANAL OFF‼️*_

💜- \`"Nãããão, logo agora que eu ia mandar o icon pro meu crush…"\`

_Manda amanhã, ouvinte, com coragem 😌 O canal tá fechando, mas a Laufey continua no seu fone. Boa noite e beijos do Nick! 💤💕_`,

  `_*CANAL OFF‼️*_

💜- \`"Já são 23:30?! O tempo voa quando a gente tá sofrendo em jazz…"\`

_Pois é, ouvinte 🥲 Hora de descansar esse coração. Amanhã tem mais notícia, enquete e 'me core'. Boa noite e beijos do Nick! 🌙🎻_`,

  `_*CANAL OFF‼️*_

💜- \`"Espera, espera! Eu ainda nem descobri a resposta do quiz…"\`

_Descobriu sim, você só não prestou atenção 😂 Amanhã tem quiz novo pra você se redimir. Boa noite e beijos do Nick! 🌙💜_`,

  `_*CANAL OFF‼️*_

💜- \`"Fechou?! E agora quem vai me fazer companhia?"\`

_A Laufey, ué! Coloca *While You Were Sleeping* e deixa ela te ninar 😴🎶 Amanhã às 6:00 a gente volta. Beijos do Nick! 💕_`,

  `_*CANAL OFF‼️*_

💜- \`"Mas eu tava gostando tanto…"\`

_Eu sei, eu sei 🥺 Mas até o violoncelo precisa descansar. Amanhã tem mais música do dia, curiosidade e jogo. Durma bem e beijos do Nick! 🎻🌙_`,

  `_*CANAL OFF‼️*_

💜- \`"Já vai? Fica mais um pouquinho…"\`

_Bem que eu queria, ouvinte, mas o Nick também precisa dormir 😂💤 Amanhã cedinho a gente volta com tudo. Boa noite! 💜✨_`,

  `_*CANAL OFF‼️*_

💜- \`"Como assim o dia acabou? Eu nem chorei ouvindo Promise ainda…"\`

_Ainda dá tempo! Mas faz isso debaixo do cobertor, que é mais confortável 🧶😭 Boa noite e beijos do Nick! 🌙_`,

  `_*CANAL OFF‼️*_

💜- \`"Ah não, de novo esse aviso de fechamento…"\`

_De novo e todo dia, meu amor 😌 Mas amanhã às 6:00 ele vira CANAL ON outra vez. Bons sonhos (com a Laufey, de preferência) e beijos do Nick! 💕🎻_`,
];

export function canalOn(seed) { return pick(CANAL_ON, seed); }
export function canalOff(seed) { return pick(CANAL_OFF, seed); }

// ───────── Formatação do WhatsApp ─────────
// _*título*_  → negrito + itálico        _texto_  → itálico
// *texto*     → negrito                  ~texto~  → riscado
// `texto`     → código (fala/destaque)   > texto  → citação
// - item      → lista
// Formatação só funciona dentro de UMA linha, então cada parágrafo é formatado separado.

const TIPO_LANCAMENTO = { single: 'um single novo', album: 'um álbum novo', ep: 'um EP novo', compile: 'uma coletânea nova' };

/** Remove caracteres que quebrariam a formatação (títulos vindos de fora). */
const limpo = (t) => String(t ?? '').replace(/[*_~`]/g, ' ').replace(/\s+/g, ' ').trim();
const titulo = (t) => `_*${t}*_`;
const ital = (t) => `_${t}_`;

function dataBR(d) {
  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(d));
  if (ymd) return `${ymd[3]}/${ymd[2]}/${ymd[1]}`;
  const t = Date.parse(d);
  return Number.isNaN(t) ? '' : new Date(t).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

export function formatarItem(item) {
  const t = limpo(item.titulo);
  switch (item.tipo) {
    case 'youtube':
      return item.shorts
        ? `${titulo('SHORTS NOVO DA LAUFEY‼️ 📱✨')}\n\n💜- ${ital('Corre ver que é rapidinho 🏃‍♀️💨')}\n\n> *${t}*\n\n▶️ ${item.link}`
        : `${titulo('VÍDEO NOVO DA LAUFEY‼️ 🎬🎻')}\n\n💜- ${ital('Dá o play e já volta aqui pra comentar 👀')}\n\n> *${t}*\n\n▶️ ${item.link}`;
    case 'youtube_outros':
      return `${titulo('LAUFEY POR AÍ 📺✨')}\n\n💜- ${ital('Entrevista, show ou apresentação nova na área!')}\n\n> *${t}*\n\n- 📡 Canal: \`${limpo(item.canal)}\`\n- ▶️ ${item.link}`;
    case 'lancamento': {
      const oque = TIPO_LANCAMENTO[item.formato] || 'música nova';
      if (item.futuro) {
        return `${titulo('VEM AÍ‼️ 📣💿')}\n\n💜- ${ital(`A Laufey vai lançar ${oque}:`)}\n\n> *${t}*\n\n- 📅 Sai em: \`${dataBR(item.data)}\`\n- 🎧 ${item.link}\n\n${ital('Já pode ir preparando o coração 🫀')}`;
      }
      return `${titulo('LANÇAMENTO NOVO‼️ 💿🎶')}\n\n💜- ${ital(`A Laufey acabou de soltar ${oque}:`)}\n\n> *${t}*\n\n- 📅 \`${dataBR(item.data)}\`\n- 🎧 ${item.link}\n\n${ital('Já pode chorar, dançar e surtar (nessa ordem) 😭💃')}`;
    }
    case 'noticia':
      return `${titulo('NOTÍCIA DO DIA 📰☕')}\n\n💜- ${ital('Saiu agora, fresquinha:')}\n\n> *${t}*\n\n${item.fonte ? `- 🗞️ Fonte: \`${limpo(item.fonte)}\`\n` : ''}- 🔗 ${item.link}`;
    case 'reddit':
      return `${titulo('DIRETO DO r/laufey 💬')}\n\n💜- ${ital('Os fãs tão comentando isso aqui:')}\n\n> *${t}*\n\n${item.score ? `- ⬆️ \`${item.score} votos\`\n` : ''}- 🔗 ${item.link}`;
    default:
      return `💜- *${t}*\n${item.link || ''}`;
  }
}

/** Converte "💜 *TÍTULO* emojis\n\n_corpo_" no padrão do canal. */
function padraoCanal(txt) {
  return txt.replace(/^💜 \*(.+?)\*\s*(.*?)\n\n/, (_, a, b) => `${titulo(`${a}${b ? ' ' + b : ''}`)}\n\n💜- `);
}

const ICONES = [
  `💜 *ICON LIBERADO!* 🖼️✨\n\n_Pode salvar e usar à vontade! Só não esquece de dar os créditos pro canal, tá? 😌🎀_`,
  `💜 *ICON DO DIA!* 🖼️🎻\n\n_Esse aqui tá a sua cara, confessa 👀 Salva antes que alguém roube! 💕_`,
  `💜 *ICON LIBERADO!* 🌷\n\n_Troca a foto de perfil agora e manda print pra gente_ ~mentira, não manda~ _mas usa 😂_`,
  `💜 *ICON NOVO NA ÁREA!* 🖼️💫\n\n_Quem pegar primeiro é o fã número 1_ \`(regra que eu acabei de inventar)\` 😌`,
  `💜 *ICON LIBERADO!* 🎀\n\n_Esse aqui combina com um perfil que só ouve Laufey e chora em silêncio. Ou seja: todo mundo aqui 🥲_`,
  `💜 *ICON DO DIA!* ☕\n\n_Salva, coloca de perfil e espera o crush perguntar_ \`"quem é?"\` 😏 _Aí você manda From The Start_`,
  `💜 *ICON LIBERADO!* 🌙\n\n_Pra quem quer um perfil bonito e misterioso, tipo música de jazz às 2 da manhã 🎷_`,
  `💜 *ICON FRESQUINHO!* 🖼️🍵\n\n_Acabou de sair do forno. Pode pegar, é de graça, igual o amor que a gente sente por ela 💜_`,
  `💜 *ICON LIBERADO!* 🎻\n\n_Usa, abusa e se alguém perguntar de onde é, fala que é do_ *canal mais fofo do WhatsApp* 😌✨`,
  `💜 *ICON DO DIA!* 🌷\n\n_Esse é pra deixar o perfil com cheirinho de chá e livro antigo 📖☕_`,
];
export const ICON_LEGENDAS = ICONES.map(padraoCanal);

const NUMS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '#️⃣', '*️⃣'];

/** Texto de enquete (usado se a enquete nativa falhar). */
export function enqueteTexto(e, cabecalho = 'ENQUETE DO DIA 🗳️') {
  return `${titulo(cabecalho)}\n\n💜- ${e.pergunta}\n\n${e.opcoes.map((o, i) => `${NUMS[i]} ${ital(limpo(o))}`).join('\n')}\n\n> Reage com o número da sua escolha! 👇`;
}

/** "fala" — resposta  →  fala em `código`, resposta em itálico. */
export function meCoreTexto(texto) {
  const m = /^"(.+?)"\s*—\s*(.+)$/s.exec(texto);
  if (!m) return `${titulo('ME CORE 🖤')}\n\n💜- ${ital(texto)}`;
  return `${titulo('ME CORE 🖤')}\n\n💜- \`"${m[1]}"\`\n\n${ital(m[2])}`;
}

export function curiosidadeTexto(texto) {
  return `${titulo('CURIOSIDADE DO DIA 🧠✨')}\n\n💜- ${ital('Você sabia?')}\n\n> ${texto}\n\n${ital('Reage com 🤯 se você não sabia!')}`;
}

export function quizRespostaTexto(q) {
  return `${titulo('RESPOSTA DO QUIZ ✅')}\n\n💜- \`${limpo(q.pergunta)}\`\n\n> ✔️ Resposta certa: *${limpo(q.opcoes[q.correta])}* 🎉\n> ${q.explicacao}\n\n${ital('Quem acertou merece um chá ☕')}\n${ital('Quem errou merece')} ~dois~ *três* 🍵🍵🍵`;
}

const INTRO_JOGO = ['Hora do jogo, ouvintes! 🎮', 'Bora brincar um pouquinho? 🎲', 'Valendo... nada, mas valendo! 😂', 'Joguinho da noite chegando! 🌙', 'Atenção, participantes! 📣'];

// WhatsApp não tem spoiler: ~4000 caracteres invisíveis forçam o "Ler mais",
// então a resposta só aparece quando a pessoa toca para expandir.
export const LER_MAIS = '‎'.repeat(4001);
const RESPOSTA = /^\(?\s*resposta\b|^resposta amanhã/i;

/** Jogos: título no padrão, opções em lista, frases soltas em itálico. Respostas ficam escondidas no "Ler mais". */
export function jogoTexto(texto) {
  const todas = texto.split('\n');
  const respostas = todas.filter((l) => RESPOSTA.test(l.trim()))
    .map((l) => l.trim().replace(/^\((.*)\)$/, '$1').replace(/^resposta amanhã…?\s*brincadeira:\s*/i, 'Resposta: ').replace(/^resposta:?\s*/i, ''));
  const linhas = todas.filter((l) => !RESPOSTA.test(l.trim()));
  while (linhas.length > 1 && !linhas.at(-1).trim()) linhas.pop();
  const cab = linhas.shift().replace(/^🎮\s*\*(.+?)\*\s*(.*)$/, (_, a, b) => titulo(`🎮 ${a}${b ? ' ' + b : ''}`));
  const corpo = linhas.map((l) => {
    if (!l.trim()) return l;
    if (/^Resposta/.test(l)) return `> ${l}`;                                         // revelação
    if (/^_.*_$/.test(l) || /\*/.test(l)) return l;                                  // já formatada
    if (!/\p{L}/u.test(l)) return l;                                                 // só emojis
    if (l.includes(' = ')) return `- ${l.replace(/ = (.+)$/, ' = _$1_')}`;              // "😭 = Promise"
    if (/^[^:]{1,18}: \S/.test(l) && !/^Escolhe/.test(l)) return `- ${l.replace(/: (.+)$/, ': _$1_')}`; // "Jan: Snow White"
    if (/^\(.*\)$/.test(l)) return `> ${l.slice(1, -1)}`;                              // "(resposta: ...)"
    return ital(l);
  });
  const intro = INTRO_JOGO[texto.length % INTRO_JOGO.length];
  const escondida = respostas.length
    ? ['', '🤫 _Pensou? Não vale trapacear! A resposta tá escondida aqui embaixo_ 👇' + LER_MAIS, '', ...respostas.map((r) => `> ✔️ ${r}`)]
    : [];
  return [cab, '', `💜- ${ital(intro)}`, ...corpo, ...escondida].join('\n');
}

export function dataEspecialTexto(d, ano) {
  const anos = ano - d.ano;
  const s = anos > 1 ? 's' : '';
  if (d.tipo === 'aniversario') {
    return `${titulo('HOJE É DIA DE FESTA‼️ 🎂🎉')}\n\n💜- ${ital(`Hoje a Laufey completa`)} *${anos} anos*! 🥳🎻\n\n${ital('Deixa nos comentários...')} ~brincadeira, canal não tem comentário~ 😂\n> Reage com 🎂 pra mandar parabéns pra ela!\n\n${ital('Feliz aniversário, Laufey! Obrigado por fazer a trilha sonora das nossas crises 💜')}`;
  }
  if (d.tipo === 'grammy') {
    return `${titulo('HOJE NA HISTÓRIA 🏆')}\n\n💜- ${ital(`Há ${anos} ano${s}, a Laufey ganhava o`)} *Grammy* ${ital('de Melhor Álbum Vocal Pop Tradicional com')} *Bewitched*! ✨\n\n> Reage com 🏆 se você lembra onde estava nesse dia!`;
  }
  return `${titulo('HOJE NA HISTÓRIA 📅💿')}\n\n💜- ${ital(`Há ${anos} ano${s} saía`)} *${d.titulo}*! 🎶\n\n> Qual a sua música favorita dele?\n\n${ital('Reage com 💜 se ele mudou sua vida!')}`;
}

export function contagemTexto(item, dias) {
  const falta = dias === 1 ? 'FALTA 1 DIA' : `FALTAM ${dias} DIAS`;
  return `${titulo(`CONTAGEM REGRESSIVA ⏳`)}\n\n💜- *${falta}* ${ital('para')} *${limpo(item.titulo)}*! 📣\n\n- 📅 \`${dataBR(item.data)}\`\n\n${ital(dias <= 3 ? 'Tá chegando!!! Prepara o fone e os lencinhos 🎧🤧' : 'Vai separando o chá e o coração ☕💜')}`;
}

const FIGURINHAS = [
  ['HORA DAS FIGURINHASSS‼️ 🎨✨', 'Chegou o momento mais esperado do dia! Salva todas e usa sem moderação 😌'],
  ['HORA DAS FIGURINHASSS‼️ 💜🖼️', 'Atenção, colecionadores! Pacotinho novo saindo do forno agora 🔥'],
  ['HORA DAS FIGURINHASSS‼️ 🎀', 'Prepara o dedo pra salvar, porque hoje veio coisa boa 👀'],
  ['HORA DAS FIGURINHASSS‼️ 🌷', 'Figurinha nova pra mandar no grupo e fingir que é casual 😂'],
  ['HORA DAS FIGURINHASSS‼️ ☕🎻', 'Seu estoque de figurinha da Laufey agradece. Pode pegar!'],
];

export function figurinhasTexto(qtd, seed) {
  const [cab, frase] = FIGURINHAS[Math.abs(seed) % FIGURINHAS.length];
  return `${titulo(cab)}\n\n💜- ${ital(frase)}\n\n> *${qtd} figurinha${qtd > 1 ? 's' : ''} novinha${qtd > 1 ? 's' : ''}* da Laufey vindo aí 👇\n\n${ital('Pra salvar: toca na figurinha > Adicionar às favoritas ⭐')}`;
}

// ───────── Enfeites (estilo "aesthetic") ─────────
const ENFEITES_TOPO = [
  '˚₊‧꒰ა ♡ ໒꒱ ‧₊˚',
  '⋆˚꩜｡𐔌՞. .՞𐦯⋆. 𐙚 ˚',
  '˚୨୧⋆｡˚ ⋆',
  '☆⋆｡𖦹°‧★',
  '⋆｡‧˚ʚ♡ɞ˚‧｡⋆',
  '✮⋆˙ ♡ ˙⋆✮',
  '‧₊˚✩彡 ♡ 彡✩˚₊‧',
  '⊹ ࣪ ˖ ♡ ˖ ࣪ ⊹',
];
const ENFEITES_FIM = [
  '˚ ༘ ೀ⋆｡˚ ♡',
  '⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆',
  '𐙚 ⋆˚｡⋆୨୧˚',
  '‧₊˚ ☁️⋅♡𓂃 ࣪ ִֶָ☾.',
  '₊˚⊹♡ ⋆｡˚',
  '♡ ⋆｡˚ ❀ ⋆｡˚ ♡',
];
const BOLINHAS = ['⋆', '♡', '˚', '✮', '⊹', '𐙚'];

const hash = (t) => { let h = 0; for (const c of t) h = (h * 31 + c.codePointAt(0)) | 0; return Math.abs(h); };

/** Coloca enfeite em cima e embaixo, e troca os marcadores de lista por símbolos fofos. */
export function decorar(txt) {
  if (!txt) return txt;
  const h = hash(txt);
  const topo = ENFEITES_TOPO[h % ENFEITES_TOPO.length];
  const fim = ENFEITES_FIM[(h >> 3) % ENFEITES_FIM.length];
  const bol = BOLINHAS[(h >> 5) % BOLINHAS.length];
  const corpo = txt.split('\n').map((l) => l.replace(/^- /, `${bol} `)).join('\n');
  return `${topo}\n${corpo}\n\n${fim}`;
}

/** Enfeite curtinho pro nome das enquetes (que não aceitam negrito/itálico). */
export function decorarEnquete(nome) {
  const h = hash(nome);
  const pares = [['˚₊‧꒰ა', '໒꒱‧₊˚'], ['⋆｡˚', '˚｡⋆'], ['✮⋆˙', '˙⋆✮'], ['ʚ♡ɞ', 'ʚ♡ɞ']];
  const [a, b] = pares[h % pares.length];
  return `${a} ${nome} ${b}`;
}
