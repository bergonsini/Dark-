// Gera o PDF da apostila (A4) com número de página no rodapé.
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto("file://" + path.resolve(__dirname, "apostila.html"), { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({
    path: path.resolve(__dirname, "Estudio-de-Bolso-apostila.pdf"),
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate:
      '<div style="width:100%;font-size:8px;color:#8a83a8;font-family:sans-serif;padding:0 17mm;display:flex;justify-content:space-between"><span>Estúdio de Bolso · crie vídeos animados com IA</span><span class="pageNumber"></span></div>',
  });
  await b.close();
})();
