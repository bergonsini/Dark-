"""Monta a apostila: junta as partes, renderiza, descobre a página de cada módulo e preenche o sumário."""
import glob, re, subprocess, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
partes = "".join(open(p, encoding="utf-8").read() for p in sorted(glob.glob("partes/*.html")))
def render(paginas):
    html = re.sub(r"\{\{P:(\w+)\}\}", lambda m: str(paginas.get(m.group(1), "··")), partes)
    open("apostila.html", "w", encoding="utf-8").write(html)
    subprocess.run(["node", "gerar_pdf.js"], check=True)
render({})
txt = subprocess.run(["pdftotext", "-layout", "Estudio-de-Bolso-apostila.pdf", "-"], capture_output=True, text=True).stdout
paginas = {}
for i, pg in enumerate(txt.split("\f"), start=1):
    for k in re.findall(r"§(\w+)§", pg):
        paginas.setdefault(k, i)
print("páginas:", paginas)
render(paginas)
if os.path.exists("_conteudo.pdf"):
    os.remove("_conteudo.pdf")
