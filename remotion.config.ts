import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);

// Opcional: usar um Chrome/Chromium já instalado (ex.: ambientes sem internet).
// Ex.: REMOTION_CHROME=/caminho/chrome-headless-shell npm run render
if (process.env.REMOTION_CHROME) {
  Config.setBrowserExecutable(process.env.REMOTION_CHROME);
}
