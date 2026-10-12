// Encodes the scroll-world clips and stop posters from the Higgsfield masters.
//
//   node scripts/encode-world.mjs            # everything
//   node scripts/encode-world.mjs 3          # only clip 3 (and the posters it touches)
//
// Desktop: 1920x1080 H.264 (keyframe every 6 frames) + VP9 fallback.
// Phones:  480x1040 portrait crop of the same master, every frame a keyframe (`-g 1`),
//          so a seek never decodes more than one frame. The crop pans from the stop's
//          framing at the start of the clip to the next stop's framing at its end.
// Posters: stop N is the first frame of clip N+1 (stop 0) or the last frame of clip N,
//          taken from the encoded clips so poster and video match exactly.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const MASTERS = [
  'media/transitions/clip1-v4-entrada-caballete.mp4',
  'media/transitions/clip2-v4-caballete-comision.mp4',
  'media/transitions/clip3-v5-comision-personales.mp4',
  'media/transitions/clip4-v7-personales-caballete.mp4',
];
// Horizontal framing of each stop on phones, as a fraction of the 16:9 width.
const STOP_X = [0.42, 0.4, 0.45, 0.72, 0.4];
const PORTRAIT = { width: 480, height: 1040 };

const only = process.argv[2] ? Number(process.argv[2]) : null;
const run = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
const duration = (file) =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]));

const work = mkdtempSync(join(tmpdir(), 'world-'));

for (const [index, master] of MASTERS.entries()) {
  const n = index + 1;
  if (only && n !== only) continue;
  const seconds = duration(master);
  const base = `public/video/clip-${n}`;
  const landscape = 'scale=1920:1080:flags=lanczos,fps=24';
  const cropWidth = `ih*${PORTRAIT.width}/${PORTRAIT.height}`;
  const pan = `(iw-${cropWidth})*(${STOP_X[index]}+(${STOP_X[n]}-${STOP_X[index]})*t/${seconds})`;
  const portrait = `${landscape},crop=${cropWidth}:ih:${pan}:0,scale=${PORTRAIT.width}:${PORTRAIT.height}:flags=lanczos`;

  run(['-i', master, '-an', '-vf', landscape, '-c:v', 'libx264', '-profile:v', 'high', '-crf', '22', '-g', '6',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${base}-1080.mp4`]);
  run(['-i', master, '-an', '-vf', landscape, '-c:v', 'libvpx-vp9', '-crf', '33', '-b:v', '0', '-g', '6',
    '-deadline', 'good', '-cpu-used', '4', '-row-mt', '1', `${base}-1080.webm`]);
  run(['-i', master, '-an', '-vf', portrait, '-c:v', 'libx264', '-profile:v', 'main', '-crf', '26', '-g', '1',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${base}-portrait.mp4`]);
  run(['-i', master, '-an', '-vf', portrait, '-c:v', 'libvpx-vp9', '-crf', '45', '-b:v', '0', '-g', '1',
    '-deadline', 'good', '-cpu-used', '5', '-row-mt', '1', `${base}-portrait.webm`]);

  const frames = n === 1 ? [['first', 0]] : [];
  frames.push(['last', n]);
  for (const [which, stop] of frames) {
    for (const [suffix, size] of [['', '1080'], ['-portrait', 'portrait']]) {
      const png = join(work, `stop-${stop}${suffix}.png`);
      const select = which === 'first' ? ['-frames:v', '1'] : ['-sseof', '-0.05', '-update', '1', '-frames:v', '1'];
      const input = `${base}-${size}.mp4`;
      run(which === 'first' ? ['-i', input, ...select, png] : [...select.slice(0, 2), '-i', input, ...select.slice(2), png]);
      await sharp(png).webp({ quality: 82 }).toFile(`public/world/stop-${stop}${suffix}.webp`);
    }
  }
  console.log(`clip ${n}: ${seconds.toFixed(1)} s`);
}

rmSync(work, { recursive: true, force: true });
