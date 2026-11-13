// Renderiza vários quadros de prévia (PNG) de uma vez e monta um "contact sheet".
// Uso: node scripts/preview-frames.mjs out/preview 30 120 300 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [outDir = "out/preview", ...frames] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_CHROME || null;
const composition = await selectComposition({ serveUrl, id: "CavemanLife", browserExecutable });
const list = frames.length ? frames.map(Number) : [30, 150, 300, 450, 600, 750, 900, 1050, 1250];
const files = [];
for (const frame of list) {
  const output = path.join(outDir, `f${String(frame).padStart(4, "0")}.png`);
  await renderStill({ serveUrl, composition, frame, output, scale: 0.4, browserExecutable });
  files.push(output);
  console.log("ok", frame);
}
const cols = Math.min(5, files.length);
const rows = Math.ceil(files.length / cols);
if (files.length > 1) execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...files.flatMap((f) => ["-i", f]),
  "-filter_complex", `${files.map((_, i) => `[${i}:v]`).join("")}xstack=inputs=${files.length}:layout=${files.map((_, i) => `${(i % cols) * 432}_${Math.floor(i / cols) * 768}`).join("|")}:fill=black`,
  path.join(outDir, "sheet.png")].concat([]), { stdio: "inherit" });
console.log("sheet:", path.join(outDir, "sheet.png"), rows, "rows");
