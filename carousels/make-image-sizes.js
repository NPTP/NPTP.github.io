// Makes smaller WebP copies of every JPG/PNG in the carousel folders, for the page to pick
// from by screen size: some-name.jpg -> some-name.360.webp, .540.webp, .720.webp
// Run from the site folder after adding or replacing an image:  node carousels/make-image-sizes.js
// Needs ffmpeg on your PATH. Copies that are already newer than their image are skipped.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const WIDTHS = [360, 540, 720]; // keep in sync with IMAGE_WIDTHS in index.js
const root = __dirname;

for (const folder of fs.readdirSync(root, { withFileTypes: true })) {
  if (!folder.isDirectory()) continue;
  const dir = path.join(root, folder.name);
  for (const file of fs.readdirSync(dir)) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue;
    const src = path.join(dir, file);
    const base = src.replace(/\.(jpe?g|png)$/i, "");
    const lossless = /\.png$/i.test(file); // PNGs here are flat-colour art: keep them exact
    // (Quality must be -q:v: this encoder ignores -quality)
    for (const w of WIDTHS) {
      const out = `${base}.${w}.webp`;
      if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) continue;
      execFileSync("ffmpeg", [
        "-v", "error", "-y", "-i", src,
        "-vf", `scale='min(iw,${w})':-2:flags=lanczos`,
        ...(lossless ? ["-lossless", "1"] : ["-q:v", "80", "-preset", "photo"]),
        "-frames:v", "1", out,
      ]);
      console.log(path.relative(root, out));
    }
  }
}
