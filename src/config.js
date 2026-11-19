import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Carrega secrets.txt (KEY=VALUE) quando roda no PC. No GitHub vem dos Secrets.
const secretsFile = path.join(ROOT, 'secrets.txt');
if (fs.existsSync(secretsFile)) {
  for (const line of fs.readFileSync(secretsFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

export const CONFIG = {
  timezone: 'America/Sao_Paulo',
  youtubeChannelId: 'UChpKl3waLmccNeYH9LGYjUQ',
  deezerArtistId: 12369444,
  subreddit: 'laufey',
  redditMinScore: 40,
  delayBetweenPostsMs: 40_000, // 40 s entre posts (anti-ban)
  figurinhasPorVez: 10,
  maxPostsPerRun: 6,
  maxNewsPerDay: 8,
  maxRedditPerDay: 2,
  maxYoutubeOutrosPerDay: 3,
  // Horários do canal (Brasília). Cada um posta 1x por dia, na 1ª execução depois do horário.
  slots: {
    on: '06:00',          // CANAL ON
    curiosidade: '08:00', // curiosidade do dia
    data: '09:00',        // data especial / contagem regressiva (só quando tem)
    musica: '10:00',      // música do dia (card + prévia 30s)
    icon: '12:00',        // icon liberado
    figurinhas: '16:00',  // hora das figurinhas (10 de uma vez)
    isso: '14:00',        // isso ou aquilo (enquete)
    poll: '15:00',        // enquete do dia
    quiz: '17:00',        // quiz
    resposta: '19:00',    // resposta do quiz
    mecore: '20:00',      // me core
    jogo: '21:30',        // joguinho da noite
    off: '23:30',         // CANAL OFF
  },
};

export const paths = {
  state: path.join(ROOT, 'state.json'),
  authEnc: path.join(ROOT, 'auth.enc'),
  authRuntime: path.join(ROOT, '.auth-runtime'),
  authLocal: path.join(ROOT, 'auth'),
  icons: path.join(ROOT, 'icons'),
  figurinhas: path.join(ROOT, 'figurinhas'),
  assets: path.join(ROOT, 'assets'),
  content: path.join(ROOT, 'content'),
  secrets: secretsFile,
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
