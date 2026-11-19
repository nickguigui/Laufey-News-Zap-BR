// Transforma uma imagem qualquer em figurinha do WhatsApp:
// webp 512x512, fundo transparente, cantos arredondados e borda branca de adesivo.
import sharp from 'sharp';

const TAM = 512;
const BORDA = 14;   // espessura da borda branca
const RAIO = 60;    // arredondamento dos cantos

export async function criarFigurinha(entrada) {
  const interno = TAM - BORDA * 2;
  const img = sharp(entrada, { animated: false }).rotate();
  const meta = await img.metadata();

  // PNG/WebP com transparência: mantém o recorte original (só encaixa e põe contorno)
  if (meta.hasAlpha) {
    const recorte = await img.resize(interno, interno, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    const alpha = await sharp(recorte).extractChannel('alpha').png().toBuffer();
    // contorno branco: alfa "engordado" com blur + threshold
    const borrado = await sharp(alpha)
      .extend({ top: BORDA, bottom: BORDA, left: BORDA, right: BORDA, background: '#000000' })
      .blur(BORDA / 2).png().toBuffer();
    // threshold numa etapa separada (o sharp aplicaria antes do blur se fosse na mesma)
    const contorno = await sharp(borrado).threshold(10).toColourspace('b-w').png().toBuffer();
    const branco = await sharp({ create: { width: TAM, height: TAM, channels: 3, background: '#ffffff' } })
      .joinChannel(contorno).png().toBuffer();
    return sharp(branco).composite([{ input: recorte, left: BORDA, top: BORDA }]).webp({ quality: 85 }).toBuffer();
  }

  // foto comum: recorta quadrado, arredonda e põe borda branca
  const foto = await img.resize(interno, interno, { fit: 'cover', position: 'attention' }).toBuffer();
  const mascara = Buffer.from(`<svg width="${interno}" height="${interno}"><rect width="${interno}" height="${interno}" rx="${RAIO - BORDA}" fill="#fff"/></svg>`);
  const fotoR = await sharp(foto).composite([{ input: mascara, blend: 'dest-in' }]).png().toBuffer();
  const fundo = Buffer.from(`<svg width="${TAM}" height="${TAM}"><rect width="${TAM}" height="${TAM}" rx="${RAIO}" fill="#fff"/></svg>`);
  return sharp(fundo).composite([{ input: fotoR, left: BORDA, top: BORDA }]).webp({ quality: 85 }).toBuffer();
}
