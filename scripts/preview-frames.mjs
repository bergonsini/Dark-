// Gera PNGs de quadros-chave para revisão rápida: node scripts/preview-frames.mjs 30 120 300
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'fs';
import path from 'path';

const frames = process.argv.slice(2).map(Number);
const browser = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browserExecutable = process.env.REMOTION_BROWSER ?? (fs.existsSync(browser) ? browser : null);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'HomemDasCavernas', browserExecutable});
const dir = process.env.OUT_DIR ?? 'out/frames';
fs.mkdirSync(dir, {recursive: true});
for (const frame of frames) {
  await renderStill({composition, serveUrl, frame, output: `${dir}/f${String(frame).padStart(4, '0')}.png`, browserExecutable, scale: 0.5});
  console.log('ok', frame);
}
