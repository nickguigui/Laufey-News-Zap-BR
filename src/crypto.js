// Empacota a pasta de autenticação do WhatsApp num único arquivo criptografado
// (AES-256-GCM) para poder ficar no repositório sem expor a sessão.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

function keyFrom(hex) {
  if (!hex || !/^[0-9a-f]{64}$/i.test(hex)) {
    throw new Error('AUTH_KEY ausente ou inválida (precisa ter 64 caracteres hex). Rode "npm run login".');
  }
  return Buffer.from(hex, 'hex');
}

export function newKey() {
  return crypto.randomBytes(32).toString('hex');
}

export function packDir(dir, outFile, hexKey) {
  const files = {};
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isFile()) files[name] = fs.readFileSync(p).toString('base64');
  }
  const plain = zlib.gzipSync(Buffer.from(JSON.stringify(files)));
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyFrom(hexKey), iv);
  const enc = Buffer.concat([cipher.update(plain), cipher.final()]);
  fs.writeFileSync(outFile, Buffer.concat([iv, cipher.getAuthTag(), enc]));
  return Object.keys(files).length;
}

export function unpackDir(inFile, dir, hexKey) {
  const buf = fs.readFileSync(inFile);
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyFrom(hexKey), buf.subarray(0, 12));
  decipher.setAuthTag(buf.subarray(12, 28));
  const plain = Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]);
  const files = JSON.parse(zlib.gunzipSync(plain).toString());
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, b64] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), Buffer.from(b64, 'base64'));
  }
  return Object.keys(files).length;
}
