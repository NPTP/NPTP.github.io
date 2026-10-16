// Makes HLS streams for the MP4 of every item listed in carousels.js, so videos can start playing after
// their first 1-second segment: some-name.mp4 -> hls/some-name/{360,540,720}/index.m3u8 + segments
// Run via  node carousels/build.js  (needs ffmpeg on your PATH). Videos whose streams are newer
// than the MP4 are skipped; each new video takes a minute or two.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = __dirname;
const CAROUSELS = new Function(fs.readFileSync(path.join(root, "carousels.js"), "utf8") + "; return CAROUSELS;")();
// [height, target bitrate, max bitrate, buffer size]. Sizes must match startHlsVideo in index.js.
const SIZES = [
  [720, "1200k", "1500k", "2400k"],
  [540, "650k", "800k", "1300k"],
  [360, "300k", "380k", "600k"],
];

for (const [name, entries] of Object.entries(CAROUSELS)) {
  const dir = path.join(root, name);
  for (const entry of entries) {
    let file;
    try {
      file = JSON.parse(fs.readFileSync(path.join(dir, `${entry}.json`), "utf8")).media;
    } catch {
      continue; // build.js reports bad JSON
    }
    if (!/\.mp4$/i.test(file || "")) continue;
    const src = path.join(dir, file);
    const out = path.join(dir, "hls", file.replace(/\.mp4$/i, ""));
    const done = path.join(out, "360", "index.m3u8");
    if (fs.existsSync(done) && fs.statSync(done).mtimeMs >= fs.statSync(src).mtimeMs) continue;
    fs.rmSync(out, { recursive: true, force: true });
    fs.mkdirSync(out, { recursive: true });
    const split = SIZES.map((_, i) => `[s${i}]`).join("");
    const scales = SIZES.map(([h], i) => `[s${i}]scale=${h}:${h}[v${i}]`).join(";");
    execFileSync("ffmpeg", [
      "-v", "error", "-y", "-i", src,
      // Videos here are already square (see the README); every size gets the same frames
      "-filter_complex", `[0:v]fps=30,split=${SIZES.length}${split};${scales}`,
      ...SIZES.flatMap((_, i) => ["-map", `[v${i}]`]),
      "-c:v", "libx264", "-preset", "slow", "-pix_fmt", "yuv420p",
      "-g", "30", "-keyint_min", "30", "-sc_threshold", "0", // a keyframe every second
      ...SIZES.flatMap(([, b, max, buf], i) => [`-b:v:${i}`, b, `-maxrate:v:${i}`, max, `-bufsize:v:${i}`, buf]),
      "-an",
      "-f", "hls", "-hls_time", "1", "-hls_playlist_type", "vod", "-hls_flags", "independent_segments",
      "-hls_segment_filename", path.join(out, "%v", "seg%03d.ts"),
      "-var_stream_map", SIZES.map(([h], i) => `v:${i},name:${h}`).join(" "),
      path.join(out, "%v", "index.m3u8"),
    ]);
    console.log(path.relative(root, out));
  }
}
