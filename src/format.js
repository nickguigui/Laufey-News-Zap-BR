// Textos do canal. Toda mensagem começa com 💜 (assinatura do Nick).

const pick = (lista, seed) => lista[Math.abs(seed) % lista.length];

export const CANAL_ON = [
  `_*CANAL ON‼️*_

_💜- Bom dia, boa tarde e boa noite, meus ouvintes! Tudo bem com vocês? ☕ E se você acabou de chegar no canal: seja muito bem-vindo, pega seu chá e se acomoda! 🫖_

_Hoje tem notícias fresquinhas da Laufey, enquete pra votar, icon liberado e, se bater a bad, um 'me core' 🖤. Beijos do Nick, bora começar!! 💌_

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
];

export function canalOn(seed) { return pick(CANAL_ON, seed); }
export function canalOff(seed) { return pick(CANAL_OFF, seed); }

const TIPO_LANCAMENTO = { single: 'um single novo', album: 'um álbum novo', ep: 'um EP novo', compile: 'uma coletânea nova' };

function dataBR(d) {
  const t = Date.parse(d);
  return Number.isNaN(t) ? '' : new Date(t).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

export function formatarItem(item) {
  switch (item.tipo) {
    case 'youtube':
      return item.shorts
        ? `💜 *SHORTS NOVO DA LAUFEY!* 📱✨\n\n_${item.titulo}_\n\nCorre ver que é rapidinho 🏃‍♀️💨\n▶️ ${item.link}`
        : `💜 *VÍDEO NOVO DA LAUFEY!* 🎬🎻\n\n_${item.titulo}_\n\nDá o play e já volta aqui pra comentar 👀\n▶️ ${item.link}`;
    case 'lancamento':
      return `💜 *LANÇAMENTO NOVO!* 💿🎶\n\nA Laufey acabou de soltar ${TIPO_LANCAMENTO[item.formato] || 'música nova'}:\n*${item.titulo}*\n📅 ${dataBR(item.data)}\n\nJá pode chorar/dançar/surtar 😭💃\n🎧 ${item.link}`;
    case 'noticia':
      return `💜 *NOTÍCIA DO DIA* 📰☕\n\n*${item.titulo}*${item.fonte ? `\n🗞️ Fonte: ${item.fonte}` : ''}\n\n🔗 ${item.link}`;
    case 'reddit':
      return `💜 *DIRETO DO r/laufey* 💬\n\n_${item.titulo}_${item.score ? `\n⬆️ ${item.score} votos` : ''}\n\n🔗 ${item.link}`;
    default:
      return `💜 ${item.titulo}\n${item.link || ''}`;
  }
}

export const ICON_LEGENDAS = [
  `💜 *ICON LIBERADO!* 🖼️✨\n\n_Pode salvar e usar à vontade! Só não esquece de dar os créditos pro canal, tá? 😌🎀_`,
  `💜 *ICON DO DIA!* 🖼️🎻\n\n_Esse aqui tá a sua cara, confessa 👀 Salva antes que alguém roube! 💕_`,
  `💜 *ICON LIBERADO!* 🌷\n\n_Troca a foto de perfil agora e manda print pra gente (mentira, não manda, mas usa 😂)_`,
];

export function enqueteTexto(e) {
  // fallback em texto, caso a enquete nativa falhe
  const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '#️⃣', '*️⃣'];
  return `💜 *ENQUETE DO DIA* 🗳️\n\n*${e.pergunta}*\n\n${e.opcoes.map((o, i) => `${nums[i]} ${o}`).join('\n')}\n\n_Reage com o número da sua escolha!_ 👇`;
}

export function meCoreTexto(texto) {
  return `💜 *ME CORE* 🖤\n\n${texto}`;
}
