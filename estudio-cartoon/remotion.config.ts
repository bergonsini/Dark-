/**
 * Configuração de render da skill cartoon-explainer: MP4 H.264 + AAC, pronto para Reels/TikTok/Shorts.
 * Todas as opções: https://remotion.dev/docs/config
 */
import { Config } from "@remotion/cli/config";
import fs from "fs";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");
Config.setAudioCodec("aac");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// Usa um Chromium já instalado se existir (ambientes sem internet); senão o Remotion baixa o dele.
const candidates = [
  process.env.REMOTION_BROWSER,
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell",
].filter(Boolean) as string[];
const browser = candidates.find((p) => fs.existsSync(p));
if (browser) {
  Config.setBrowserExecutable(browser);
}
