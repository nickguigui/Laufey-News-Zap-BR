# 💜 Bot da Laufey para canal do WhatsApp

Posta sozinho no seu canal do WhatsApp, usando o seu número:

| Horário (Brasília) | Post |
|---|---|
| 06:00 | **CANAL ON‼️**, com o card da Laufey |
| 08:00 | 🧠 **Curiosidade do dia** |
| 09:00 | 🎂 **Datas especiais** (aniversário dela, aniversário dos álbuns, Grammy) ou ⏳ **contagem regressiva** para lançamento anunciado (só quando tem) |
| 10:00 | 🎧 **Música do dia**: card estilo player (capa, nome, artista, álbum), links do Spotify, Deezer e YouTube, e a **prévia oficial de 30s** em áudio |
| 12:00 | 🖼️ **Icon liberado** (da pasta `icons/`) |
| 16:00 | 🎨 **HORA DAS FIGURINHASSS‼️**: 10 figurinhas da Laufey (da pasta `figurinhas/`) |
| 14:00 | 🤔 **Isso ou aquilo** (enquete) |
| 15:00 | 🗳️ **Enquete do dia** |
| 17:00 | 🧠 **Quiz** (enquete) |
| 19:00 | ✅ **Resposta do quiz** |
| 20:00 | 🖤 **Me core** |
| 21:30 | 🎮 **Jogo da noite** (complete a frase, música pelo signo, adivinhe pelos emojis...) |
| 23:30 | **CANAL OFF‼️**, com o card da Laufey |
| o dia todo | 🎬 vídeos/shorts novos do canal dela · 📺 entrevistas e shows em outros canais (com chave do YouTube) · 💿 lançamentos e 📣 anúncios (Deezer) · 📰 notícias · 💬 r/laufey (opcional) |

- **40 segundos entre cada post** e no máximo 6 posts por execução (proteção contra ban).
- No máximo 8 notícias, 3 vídeos de outros canais e 2 posts do Reddit por dia.
- Conteúdo não se repete: enquetes, quiz, curiosidades, me core, jogos e músicas do dia só voltam depois que todos já saíram.
- Na primeira execução ele só registra o que já existe, então não posta o histórico antigo.
- Roda **de graça no GitHub Actions** a cada 30 min, sem precisar do PC ligado.

> ⚠️ **Aviso importante:** o WhatsApp não tem API oficial para postar em canais, então o bot usa o **Baileys**, que se conecta como se fosse um "WhatsApp Web". Isso vai contra os Termos do WhatsApp. O risco de ban é baixo porque o bot só posta no seu próprio canal, com pouco volume e intervalo entre os posts, mas o risco **existe**. Se quiser zero risco para o seu número principal, use um chip secundário como admin do canal.

---

## 1) Conectar seu WhatsApp (uma vez, no PC)

```bash
npm install
```
```bash
npm run login
```

1. Vai aparecer um **QR code**. No celular: WhatsApp > ⋮ > **Aparelhos conectados** > **Conectar um aparelho**, e escaneie.
   - Prefere código em vez de QR? No PowerShell: `$env:PHONE="5511999999999"; npm run login`
2. Cole o **link do seu canal** (no canal: ⋮ > Informações do canal > Compartilhar link).
3. Ele vai mostrar **AUTH_KEY** e **CHANNEL_JID**. Os dois também ficam salvos em `secrets.txt`. **Não compartilhe com ninguém!**

Quer mandar uma mensagem de teste no canal já no login? Rode `node src/login.js --test`.

> Não clique em "Sair" no aparelho "Mac OS" que vai aparecer em Aparelhos conectados, porque é o bot.

## 2) Testar no PC (opcional)

```bash
npm run dry
```
Mostra o que seria postado, **sem enviar nada**.

Para postar **um** teste de verdade no canal (PowerShell):
```bash
$env:FORCE="on"; node src/run.js
```
Opções de `FORCE`: `on`, `off`, `curiosidade`, `data`, `musica`, `icon`, `isso`, `poll`, `quiz`, `resposta`, `mecore`, `jogo`, `news`. Os testes forçados não contam como "já postado hoje".

## 3) Colocar no GitHub para rodar sozinho

1. Crie um repositório **privado** no GitHub (ex.: `laufey-bot`).
2. Envie esta pasta para ele:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/laufey-bot.git
   ```
   ```bash
   git push -u origin main
   ```
3. No repositório: **Settings > Secrets and variables > Actions > New repository secret**, crie:
   - `AUTH_KEY` → valor do `secrets.txt`
   - `CHANNEL_JID` → valor do `secrets.txt`
4. Aba **Actions** > "Bot da Laufey" > **Run workflow** para rodar a primeira vez (dá para escolher um `force` para testar).

Pronto: a partir daí ele roda sozinho a cada 30 min, das 06:00 às 23:30.

> 💸 **Minutos grátis:** repositório privado tem 2.000 min/mês grátis, e com toda a programação o bot fica perto desse limite (uns 1.500 a 2.000). **Recomendo deixar o repositório público**: aí os minutos são ilimitados. A sessão continua segura, porque o `auth.enc` é criptografado e a chave fica só nos Secrets (que ninguém vê, nem em repositório público).
>
> ⏰ O GitHub às vezes atrasa o agendamento em alguns minutos, então o CANAL ON pode sair 06:07 ou 06:20. É normal.

## 4) Icons da Laufey

Salve os icons (do Pinterest etc.) na pasta **`icons/`** (`.jpg`, `.png` ou `.webp`) e envie para o GitHub:
- pelo site: abra a pasta `icons` no repositório > **Add file > Upload files**; ou
- pelo PC: `git add icons; git commit -m "icons"; git push`

O bot posta **1 por dia** e nunca repete. Se a pasta estiver vazia, ele só pula o icon do dia.

### Figurinhas 🎨

Salve imagens da Laufey na pasta **`figurinhas/`** (`.jpg`, `.png` ou `.webp`) e envie pro GitHub do mesmo jeito (pelo GitHub Desktop: Commit + Push).
- Todo dia às **16:00** sai a **HORA DAS FIGURINHASSS‼️**: uma mensagem de abertura e depois **10 figurinhas**, com 40 s entre cada uma.
- O bot transforma cada imagem em figurinha sozinho: 512×512, cantos arredondados e borda branca.
- **PNG com fundo transparente** fica mais bonito, porque vira figurinha recortada com contorno branco.
- Nunca repete. Pra 3 meses, são uns 900 arquivos. Se tiver menos de 10, ele posta as que tiver. Se não tiver nenhuma, pula o dia.

## 5) Personalizar

| O quê | Onde |
|---|---|
| Textos do CANAL ON/OFF, legendas, formato das notícias | `src/format.js` |
| Enquetes | `content/enquetes.json` |
| "Me core" | `content/mecore.json` |
| Curiosidades | `content/curiosidades.json` |
| Quiz | `content/quiz.json` |
| Isso ou aquilo e jogos da noite | `content/jogos.json` |
| Datas especiais | `content/datas.json` |
| Horários, limite de posts, intervalo de 40 s | `src/config.js` |
| Foto dos cards ON/OFF | troque `assets/laufey.jpg` e rode `npm run cards` |

Depois de editar, é só fazer `git push`.

## 6) Vídeos de outros canais do YouTube (entrevistas, TV, ao vivo)

Precisa de uma chave grátis do Google (não precisa de aprovação nem cartão):
1. Entre em https://console.cloud.google.com e crie um projeto (ex.: `laufey-bot`).
2. Menu > **APIs e serviços > Biblioteca**, procure **YouTube Data API v3** e clique em **Ativar**.
3. Menu > **APIs e serviços > Credenciais > Criar credenciais > Chave de API**. Copie a chave.
4. (Recomendado) Clique na chave > **Restrições de API** > escolha só **YouTube Data API v3** > Salvar.
5. No GitHub, crie o secret `YOUTUBE_API_KEY` com essa chave. Pra testar no PC, adicione `YOUTUBE_API_KEY=...` no `secrets.txt`.

O bot só pega vídeos com cara de entrevista, show, sessão ao vivo ou TV, e ignora reacts, covers de fãs e God of War.

## 7) Reddit (opcional)

O Reddit bloqueia acesso sem login. Para ativar o r/laufey:
1. Entre em https://www.reddit.com/prefs/apps > **create app** > tipo **script** (em redirect uri pode colocar `http://localhost`).
2. Crie os secrets `REDDIT_CLIENT_ID` (o código embaixo do nome do app) e `REDDIT_CLIENT_SECRET`.

Sem esses secrets o bot funciona normalmente, só sem o Reddit.

## Problemas comuns

- **"Sessão inválida/desconectada"** no log do Actions: o WhatsApp desconectou o aparelho. Apague a pasta `auth` e rode `npm run login` de novo no PC (use a mesma `AUTH_KEY` do `secrets.txt`, que ele reaproveita) e faça `git add auth.enc; git commit -m login; git push`.
- **Não rode o bot no PC e no GitHub ao mesmo tempo.** Se rodar no PC, depois faça push do `auth.enc` atualizado.
