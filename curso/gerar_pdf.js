// Gera o PDF da apostila (A4) com número de página no rodapé e fundo lavanda até a borda.
const { chromium } = require("playwright");
const path = require("path");
const { execFileSync } = require("child_process");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto("file://" + path.resolve(__dirname, "apostila.html"), { waitUntil: "networkidle" });
  await p.evaluate(async () => { await Promise.all(['800 40px "Baloo 2"', '700 40px "Baloo 2"', "900 40px Nunito", "400 40px Nunito", "700 40px Nunito"].map((f) => document.fonts.load(f))); await document.fonts.ready; });
  const tmp = path.resolve(__dirname, "_conteudo.pdf");
  await p.pdf({
    path: tmp,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate:
      '<div style="width:100%;font-size:8px;color:#8a83a8;font-family:sans-serif;padding:0 17mm;display:flex;justify-content:space-between"><span>Estúdio de Bolso · crie vídeos animados com IA</span><span class="pageNumber"></span></div>',
  });
  await b.close();
  // fundo lavanda nas margens (o Chrome deixa a margem da página em branco)
  execFileSync("python3", [path.resolve(__dirname, "fundo.py"), tmp, path.resolve(__dirname, "Estudio-de-Bolso-apostila.pdf")], { stdio: "inherit" });
})();
