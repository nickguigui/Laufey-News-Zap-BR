// Diagnóstico de envio ao canal: node src/diag.js [texto|imagem|enquete]
import fs from 'node:fs';
import { paths, sleep } from './config.js';
import { unpackDir, packDir } from './crypto.js';
import { connect } from './whatsapp.js';
import { enviarCanal } from './canal.js';

const modo = process.argv[2] || 'texto';
const jid = process.env.CHANNEL_JID;
unpackDir(paths.authEnc, paths.authRuntime, process.env.AUTH_KEY);
const { sock, wasChanged } = await connect(paths.authRuntime);
console.log('conectado');
await sleep(3000);

const rejeicoes = [];
sock.ws.on('CB:ack,class:message', (n) => { if (n.attrs?.error) rejeicoes.push(n.attrs); });

let msg;
if (modo === 'texto') msg = { text: '💜 teste de texto do bot' };
if (modo === 'imagem') msg = { image: fs.readFileSync(paths.assets + '/canal-on.png'), caption: '💜 teste de imagem do bot' };
if (modo === 'audio') msg = { audio: Buffer.from(await (await fetch((await (await fetch('https://api.deezer.com/track/2105158337')).json()).preview)).arrayBuffer()), mimetype: 'audio/mpeg', seconds: 30 };
if (modo === 'enquete') msg = { poll: { name: '💜 teste de enquete', values: ['Sim', 'Não'], selectableCount: 1 } };
try { console.log('resultado:', await enviarCanal(sock, jid, msg)); } catch (e) { console.log('ERRO:', e.message); }
if (wasChanged()) packDir(paths.authRuntime, paths.authEnc, process.env.AUTH_KEY);
sock.end(undefined);
fs.rmSync(paths.authRuntime, { recursive: true, force: true });
process.exit(0);
