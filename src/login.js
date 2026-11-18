// Rode UMA VEZ no seu PC:  npm run login
// (ou com código em vez de QR:  set PHONE=5511999999999 && npm run login)
import fs from 'node:fs';
import readline from 'node:readline/promises';
import qrcode from 'qrcode-terminal';
import { paths, sleep } from './config.js';
import { connect } from './whatsapp.js';
import { newKey, packDir } from './crypto.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('💜 Login do bot da Laufey\n');
console.log('Abra o WhatsApp no celular > Configurações > Aparelhos conectados > Conectar um aparelho.\n');

const { sock } = await connect(paths.authLocal, {
  phone: process.env.PHONE,
  onQr: (qr) => { console.clear(); console.log('Escaneie este QR code com o WhatsApp:\n'); qrcode.generate(qr, { small: true }); },
});
console.log('\n🟢 Conectado com sucesso!\n');

let jid = process.env.CHANNEL_JID || '';
while (!jid) {
  const link = (await rl.question('Cole o link do seu canal (ex.: https://whatsapp.com/channel/0029Va...): ')).trim();
  const code = link.split('/channel/')[1]?.split(/[/?#]/)[0] || link;
  try {
    const meta = await sock.newsletterMetadata('invite', code);
    jid = meta.id;
    console.log(`\n📢 Canal encontrado: "${meta.thread_metadata?.name?.text || meta.name || jid}"\n   JID: ${jid}`);
  } catch (e) {
    console.log(`❌ Não achei esse canal (${e.message}). Tente de novo.`);
  }
}

if (process.argv.includes('--test')) {
  await sock.sendMessage(jid, { text: '💜 Teste do bot: se você está vendo isso, funcionou! ✨' });
  console.log('📤 Mensagem de teste enviada ao canal.');
}

await sleep(5000); // deixa as chaves terminarem de salvar
let key = process.env.AUTH_KEY;
if (!key) key = newKey();
const n = packDir(paths.authLocal, paths.authEnc, key);
fs.writeFileSync(paths.secrets, `AUTH_KEY=${key}\nCHANNEL_JID=${jid}\n`);

console.log(`
✅ Pronto! Sessão salva e criptografada em auth.enc (${n} arquivos).

Agora, no GitHub (repositório > Settings > Secrets and variables > Actions > New repository secret), crie:

  AUTH_KEY     = ${key}
  CHANNEL_JID  = ${jid}

(Esses valores também ficaram salvos em secrets.txt, que NÃO vai pro GitHub.)
⚠️  Não clique em "Sair" desse aparelho no WhatsApp, senão o bot perde o acesso.
`);
try { sock.end(undefined); } catch {}
rl.close();
process.exit(0);
