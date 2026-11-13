import { Config } from "@remotion/cli/config";
import fs from "fs";

// Saída final: MP4 (H.264 + AAC), ideal para Reels / TikTok
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");
Config.setAudioCodec("aac");
Config.setOverwriteOutput(true);
Config.setConcurrency(null);

// Neste ambiente de nuvem usamos o Chromium já instalado (sem download).
// Em outras máquinas o Remotion baixa o navegador automaticamente.
const localShell =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (!process.env.REMOTION_BROWSER && fs.existsSync(localShell)) {
  Config.setBrowserExecutable(localShell);
} else if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
