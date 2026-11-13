import {Config} from '@remotion/cli/config';
import fs from 'fs';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);

// Em ambientes sem acesso ao download do Chrome do Remotion, usa um Chromium local.
// Você também pode definir REMOTION_BROWSER=/caminho/do/chrome
const candidates = [
  process.env.REMOTION_BROWSER,
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
].filter(Boolean) as string[];
const found = candidates.find((p) => fs.existsSync(p));
if (found) {
  Config.setBrowserExecutable(found);
}
