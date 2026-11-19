// Converte a prévia MP3 em mensagem de voz do WhatsApp (OGG/Opus mono 48 kHz)
// e calcula a "ondinha" (waveform) que aparece no player.
import { spawn } from 'node:child_process';

function ffmpeg(args, entrada) {
  return new Promise((resolve, reject) => {
    const p = spawn(process.env.FFMPEG || 'ffmpeg', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    const out = []; let err = '';
    p.stdout.on('data', (d) => out.push(d));
    p.stderr.on('data', (d) => { err += d; });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve(Buffer.concat(out)) : reject(new Error(`ffmpeg saiu com ${code}: ${err.slice(-300)}`))));
    p.stdin.end(entrada);
  });
}

export async function paraMensagemDeVoz(mp3) {
  const ogg = await ffmpeg(['-hide_banner', '-loglevel', 'error', '-i', 'pipe:0', '-vn', '-ac', '1', '-ar', '48000',
    '-c:a', 'libopus', '-b:a', '64k', '-application', 'audio', '-f', 'ogg', 'pipe:1'], mp3);
  // amostras PCM 8 kHz pra desenhar a ondinha (64 barras de 0 a 100)
  const pcm = await ffmpeg(['-hide_banner', '-loglevel', 'error', '-i', 'pipe:0', '-ac', '1', '-ar', '8000', '-f', 's16le', 'pipe:1'], mp3);
  const amostras = pcm.length / 2;
  const segundos = Math.max(1, Math.round(amostras / 8000));
  const barras = 64, bloco = Math.max(1, Math.floor(amostras / barras));
  const picos = [];
  for (let b = 0; b < barras; b++) {
    let soma = 0;
    for (let i = 0; i < bloco; i++) soma += Math.abs(pcm.readInt16LE(Math.min(pcm.length - 2, (b * bloco + i) * 2)));
    picos.push(soma / bloco);
  }
  const max = Math.max(...picos, 1);
  return { ogg, segundos, waveform: Buffer.from(picos.map((v) => Math.round((v / max) * 100))) };
}
