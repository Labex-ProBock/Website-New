const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const SRC = "public/brands";
const OUT = "public/brands/transparent";
fs.mkdirSync(OUT, { recursive: true });
const files = fs.readdirSync(SRC).filter(f => f.endsWith(".png")).sort();

(async () => {
  for (const f of files) {
    const { data, info } = await sharp(path.join(SRC, f)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width: W, height: H, channels: ch } = info;
    for (let i = 0; i < W*H; i++) {
      const o = i*ch;
      const minc = Math.min(data[o], data[o+1], data[o+2]);
      let a = 255 - minc;
      if (a < 12) a = 0; else if (a > 235) a = 255;
      data[o+3] = a;
    }
    // encode keyed, then trim the transparent margin so the mark fills the frame
    const keyed = await sharp(Buffer.from(data), { raw: { width: W, height: H, channels: ch } }).png().toBuffer();
    await sharp(keyed).trim({ threshold: 10 }).png().toFile(path.join(OUT, f));
  }
  // report trimmed dimensions (aspect ratios) so we can size tiles sensibly
  let maxAR = 0;
  for (const f of files) {
    const m = await sharp(path.join(OUT, f)).metadata();
    const ar = (m.width / m.height).toFixed(2);
    if (m.width/m.height > maxAR) maxAR = m.width/m.height;
    process.stdout.write(`${f.replace('.png','').padEnd(14)} ${m.width}x${m.height} ar=${ar}\n`);
  }
  console.log("widest aspect ratio:", maxAR.toFixed(2));
})();
