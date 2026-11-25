import { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, fetchLatestBaileysVersion, fetchLatestWaWebVersion } from '@whiskeysockets/baileys';
import pino from 'pino';

/**
 * Conecta ao WhatsApp usando a pasta de auth. Resolve quando a conexão abre.
 * onQr(qr) é chamado no login inicial.
 */
export async function connect(authDir, { onQr, phone } = {}) {
  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  let changed = false;
  let version;
  // versão atual do WhatsApp Web (a lista do Baileys fica desatualizada e o WhatsApp recusa o login)
  try { ({ version } = await fetchLatestWaWebVersion()); } catch {
    try { ({ version } = await fetchLatestBaileysVersion()); } catch { /* usa padrão */ }
  }

  const sock = makeWASocket({
    auth: state,
    version,
    logger: pino({ level: process.env.WA_LOG || 'silent' }),
    browser: Browsers.macOS('Desktop'),
    markOnlineOnConnect: false,
    syncFullHistory: false,
    shouldSyncHistoryMessage: () => false,
  });
  sock.ev.on('creds.update', async () => { changed = true; await saveCreds(); });

  let pairingRequested = false;
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Tempo esgotado conectando ao WhatsApp')), onQr ? 180_000 : 60_000);
    sock.ev.on('connection.update', async (u) => {
      if (u.qr) {
        if (phone && !pairingRequested) {
          pairingRequested = true;
          const code = await sock.requestPairingCode(phone.replace(/\D/g, ''));
          console.log(`\n📱 Código de pareamento: ${code}\n   WhatsApp > Aparelhos conectados > Conectar com número de telefone\n`);
        } else if (!phone && onQr) {
          onQr(u.qr);
        } else if (!onQr) {
          clearTimeout(timer);
          reject(new Error('Sessão inválida/desconectada: rode "npm run login" de novo no PC.'));
        }
      }
      if (u.connection === 'open') { clearTimeout(timer); resolve(); }
      if (u.connection === 'close') {
        const code = u.lastDisconnect?.error?.output?.statusCode;
        if (code === DisconnectReason.restartRequired) {
          // acontece logo após escanear o QR: reconecta
          clearTimeout(timer);
          connect(authDir, { onQr, phone }).then(({ sock: s2 }) => { Object.assign(sock, { _replaced: s2 }); resolve(); }, reject);
          return;
        }
        clearTimeout(timer);
        reject(new Error(code === DisconnectReason.loggedOut
          ? 'O WhatsApp desconectou esta sessão (logout). Rode "npm run login" de novo.'
          : `Conexão fechada (código ${code ?? '?'})`));
      }
    });
  });
  const real = sock._replaced || sock;
  return { sock: real, wasChanged: () => changed || !!sock._replaced };
}
