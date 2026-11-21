const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto("file://" + __dirname + "/prototipos.html");
  await p.evaluate(async () => { await Promise.all(["800 40px \"Baloo 2\"", "700 40px \"Baloo 2\"", "900 40px Nunito"].map((f) => document.fonts.load(f))); await document.fonts.ready; });
  await p.waitForTimeout(500);
  for (const id of ["f4", "f5", "f6", "f7", "f8"]) {
    await (await p.$("#" + id)).screenshot({ path: __dirname + "/" + id + ".png" });
  }
  await b.close();
})();
