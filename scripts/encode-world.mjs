// Encodes the scroll-world clips and stop posters from the 2K masters (Kling 1080p output
// upscaled to 2560x1440 in Higgsfield, see media/transitions/PROMPTS.md).
//
//   node scripts/encode-world.mjs            # everything
//   node scripts/encode-world.mjs 3          # only clip 3 (and the posters it touches)
//   node scripts/encode-world.mjs posters    # only the posters, from the existing clips
//
// Wide:    2560x1440 H.264 (keyframe every 6 frames), for screens wider than 1800 CSS px or
//          hi-DPI desktops; the 1080 tier is the same stream downscaled. MP4 only: every
//          current browser decodes H.264, and Cloudflare caps a file at 25 MiB.
// Phones:  664x1440 portrait crop of the same master at its native height, a keyframe every
//          4 frames, so a seek decodes at most 4 frames. The crop pans from the stop's
//          framing at the start of the clip to the next stop's framing at its end.
// Posters: stop N is the first frame of clip N+1 (stop 0) or the last frame of clip N,
//          taken from the encoded clips so poster and video match exactly. Phones never
//          play the clips (scroll-world.js), so their posters come from the master instead
//          and skip the clip's compression.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const MASTERS = [
  'media/transitions/clip1-v4-entrada-caballete-2k.mp4',
  'media/transitions/clip2-v4-caballete-comision-2k.mp4',
  'media/transitions/clip3-v5-comision-personales-2k.mp4',
  'media/transitions/clip4-v7-personales-caballete-2k.mp4',
];
// Horizontal framing of each stop on phones, as a fraction of the 16:9 width.
const STOP_X = [0.42, 0.4, 0.45, 0.72, 0.4];
const PORTRAIT = { width: 664, height: 1440 };
const TIERS = [
  // setsar=1: the upscaler returns 2580x1440 / 2546x1440 with a compensating pixel aspect
  // ratio, which would otherwise leak into the encodes and the reported videoWidth.
  { suffix: '1440', filter: 'scale=2560:1440:flags=lanczos,setsar=1,fps=24', posterSuffix: '-1440', crf: 26 },
  { suffix: '1080', filter: 'scale=1920:1080:flags=lanczos,setsar=1,fps=24', posterSuffix: '', crf: 24 },
];

const postersOnly = process.argv[2] === 'posters';
const only = process.argv[2] && !postersOnly ? Number(process.argv[2]) : null;
const run = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
const duration = (file) =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]));
const h264 = (profile, crf, gop) => ['-c:v', 'libx264', '-profile:v', profile, '-crf', String(crf), '-g', String(gop),
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];

const work = mkdtempSync(join(tmpdir(), 'world-'));

for (const [index, master] of MASTERS.entries()) {
  const n = index + 1;
  if (only && n !== only) continue;
  const seconds = duration(master);
  const base = `public/video/clip-${n}`;

  const cropWidth = `ih*${PORTRAIT.width}/${PORTRAIT.height}`;
  const portraitCrop = (x) => `crop=${cropWidth}:ih:(iw-${cropWidth})*(${x}):0,scale=${PORTRAIT.width}:${PORTRAIT.height}:flags=lanczos`;

  if (!postersOnly) {
    for (const tier of TIERS) {
      run(['-i', master, '-an', '-vf', tier.filter, ...h264('high', tier.crf, 6), `${base}-${tier.suffix}.mp4`]);
    }
    const pan = `${STOP_X[index]}+(${STOP_X[n]}-${STOP_X[index]})*t/${seconds}`;
    const portrait = `scale=2560:1440:flags=lanczos,setsar=1,fps=24,${portraitCrop(pan)}`;
    run(['-i', master, '-an', '-vf', portrait, ...h264('main', 26, 4), `${base}-portrait.mp4`]);
  }

  const frames = n === 1 ? [['first', 0]] : [];
  frames.push(['last', n]);
  for (const [which, stop] of frames) {
    const sources = [
      ...TIERS.map((t) => [t.posterSuffix, `${base}-${t.suffix}.mp4`, null]),
      ['-portrait', master, `scale=2560:1440:flags=lanczos,setsar=1,${portraitCrop(STOP_X[stop])}`],
    ];
    for (const [suffix, input, filter] of sources) {
      const png = join(work, `stop-${stop}${suffix}.png`);
      const vf = filter ? ['-vf', filter] : [];
      if (which === 'first') run(['-i', input, ...vf, '-frames:v', '1', png]);
      else run(['-sseof', '-0.05', '-i', input, ...vf, '-update', '1', '-frames:v', '1', png]);
      await sharp(png).webp({ quality: 90 }).toFile(`public/world/stop-${stop}${suffix}.webp`);
    }
  }
  console.log(`clip ${n}: ${seconds.toFixed(1)} s`);
}

rmSync(work, { recursive: true, force: true });
