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

const TIPO_LANCAMENTO = { single: 'um single novo', album: 'um álbum novo', ep: 'um EP novo', compile: 'uma coletânea nova' };

function dataBR(d) {
  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(d));
  if (ymd) return `${ymd[3]}/${ymd[2]}/${ymd[1]}`;
  const t = Date.parse(d);
  return Number.isNaN(t) ? '' : new Date(t).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

export function formatarItem(item) {
  switch (item.tipo) {
    case 'youtube':
      return item.shorts
        ? `💜 *SHORTS NOVO DA LAUFEY!* 📱✨\n\n_${item.titulo}_\n\nCorre ver que é rapidinho 🏃‍♀️💨\n▶️ ${item.link}`
        : `💜 *VÍDEO NOVO DA LAUFEY!* 🎬🎻\n\n_${item.titulo}_\n\nDá o play e já volta aqui pra comentar 👀\n▶️ ${item.link}`;
    case 'youtube_outros':
      return `💜 *LAUFEY POR AÍ* 📺✨\n\n_${item.titulo}_\n📡 Canal: ${item.canal}\n\nEntrevista, show ou apresentação nova, corre ver 🏃‍♀️\n▶️ ${item.link}`;
    case 'lancamento':
      if (item.futuro) return `💜 *VEM AÍ!* 📣💿\n\nA Laufey vai lançar ${TIPO_LANCAMENTO[item.formato] || 'música nova'}:\n*${item.titulo}*\n📅 Sai em ${dataBR(item.data)}\n\nJá pode ir preparando o coração 🫀\n🎧 ${item.link}`;
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
  `💜 *ICON NOVO NA ÁREA!* 🖼️💫\n\n_Quem pegar primeiro é o fã número 1 (regra que eu acabei de inventar) 😌_`,
  `💜 *ICON LIBERADO!* 🎀\n\n_Esse aqui combina com um perfil que só ouve Laufey e chora em silêncio. Ou seja: todo mundo aqui 🥲_`,
  `💜 *ICON DO DIA!* ☕\n\n_Salva, coloca de perfil e espera o crush perguntar 'quem é?' 😏 Aí você manda From The Start_`,
  `💜 *ICON LIBERADO!* 🌙\n\n_Pra quem quer um perfil bonito e misterioso, tipo música de jazz às 2 da manhã 🎷_`,
  `💜 *ICON FRESQUINHO!* 🖼️🍵\n\n_Acabou de sair do forno. Pode pegar, é de graça, igual o amor que a gente sente por ela 💜_`,
  `💜 *ICON LIBERADO!* 🎻\n\n_Usa, abusa e se alguém perguntar de onde é, fala que é do canal mais fofo do WhatsApp 😌✨_`,
  `💜 *ICON DO DIA!* 🌷\n\n_Esse é pra deixar o perfil com cheirinho de chá e livro antigo 📖☕_`,
];

export function enqueteTexto(e) {
  // fallback em texto, caso a enquete nativa falhe
  const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '#️⃣', '*️⃣'];
  return `💜 *ENQUETE DO DIA* 🗳️\n\n*${e.pergunta}*\n\n${e.opcoes.map((o, i) => `${nums[i]} ${o}`).join('\n')}\n\n_Reage com o número da sua escolha!_ 👇`;
}

export function meCoreTexto(texto) {
  return `💜 *ME CORE* 🖤\n\n${texto}`;
}

export function curiosidadeTexto(texto) {
  return `💜 *CURIOSIDADE DO DIA* 🧠✨\n\n${texto}\n\n_Você já sabia? Reage com 🤯 se não sabia!_`;
}

export function quizRespostaTexto(q) {
  return `💜 *RESPOSTA DO QUIZ* ✅\n\n_${q.pergunta.replace(/[*_]/g, '')}_\n\nA resposta certa era: *${q.opcoes[q.correta]}* 🎉\n${q.explicacao}\n\nQuem acertou merece um chá ☕ Quem errou... merece dois 🍵🍵`;
}

export function jogoTexto(texto) {
  return `💜 ${texto}`;
}

export function dataEspecialTexto(d, ano) {
  const anos = ano - d.ano;
  if (d.tipo === 'aniversario') {
    return `💜 *HOJE É DIA DE FESTA!* 🎂🎉\n\nHoje a *Laufey* completa *${anos} anos*! 🥳🎻\n\nDeixa nos comentários... brincadeira, canal não tem comentário 😂 Reage com 🎂 pra mandar parabéns pra ela!\n\n_Feliz aniversário, Laufey! Obrigado por fazer a trilha sonora das nossas crises 💜_`;
  }
  if (d.tipo === 'grammy') {
    return `💜 *HOJE NA HISTÓRIA* 🏆\n\nHá *${anos} ano${anos > 1 ? 's' : ''}*, a Laufey ganhava o *Grammy* de Melhor Álbum Vocal Pop Tradicional com *Bewitched*! ✨\n\nReage com 🏆 se você lembra onde estava nesse dia!`;
  }
  return `💜 *HOJE NA HISTÓRIA* 📅💿\n\nHá *${anos} ano${anos > 1 ? 's' : ''}* saía *${d.titulo}*! 🎶\n\nQual a sua música favorita dele? Reage com 💜 se ele mudou sua vida!`;
}

export function contagemTexto(item, dias) {
  return `💜 *CONTAGEM REGRESSIVA* ⏳\n\n${dias === 1 ? '*FALTA 1 DIA*' : `*FALTAM ${dias} DIAS*`} para *${item.titulo}*! 📣\n📅 ${dataBR(item.data)}\n\n${dias <= 3 ? 'Tá chegando!!! Prepara o fone e os lencinhos 🎧🤧' : 'Vai separando o chá e o coração ☕💜'}`;
}
