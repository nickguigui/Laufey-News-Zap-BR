// Relógio de Brasília e "slots" diários do canal.
import { CONFIG } from './config.js';

export function agoraBR(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: CONFIG.timezone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(date).map((p) => [p.type, p.value]),
  );
  return { dia: `${parts.year}-${parts.month}-${parts.day}`, min: Number(parts.hour) * 60 + Number(parts.minute) };
}

export const hm = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };

export function diaAnterior(dia) {
  const d = new Date(`${dia}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Número estável por dia (para sortear variações sem repetir no mesmo dia). */
export function seedDoDia(dia) {
  return Math.floor(Date.parse(`${dia}T00:00:00Z`) / 86_400_000);
}
