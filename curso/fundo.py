"""Pós-processa o PDF: fundo lavanda até a borda e rodapé (texto + número) só nas páginas de conteúdo.
Páginas de fundo inteiro (capa, sumário, aberturas de módulo) ficam sem rodapé."""
import sys
from pypdf import PdfReader, PdfWriter, PageObject
from pypdf.generic import DecodedStreamObject, NameObject, DictionaryObject, ArrayObject

src, dst = sys.argv[1], sys.argv[2]
r = PdfReader(src)
w = PdfWriter()
fonte = DictionaryObject({NameObject("/Type"): NameObject("/Font"), NameObject("/Subtype"): NameObject("/Type1"),
                          NameObject("/BaseFont"): NameObject("/Helvetica"), NameObject("/Encoding"): NameObject("/WinAnsiEncoding")})
fref = w._add_object(fonte)

def txt(s):
    b = s.encode("cp1252")
    return b.replace(b"\\", b"\\\\").replace(b"(", b"\\(").replace(b")", b"\\)")

MM = 72 / 25.4
for i, pg in enumerate(r.pages):
    t = pg.extract_text() or ""
    cheia = i == 0 or "§" in t or "O que tem dentro" in t
    wd, ht = float(pg.mediabox.width), float(pg.mediabox.height)
    if cheia:
        w.add_page(pg)
        continue
    base = PageObject.create_blank_page(width=wd, height=ht)
    s = DecodedStreamObject()
    s.set_data(f"0.965 0.949 1 rg 0 0 {wd} {ht} re f".encode())
    base[NameObject("/Contents")] = w._add_object(s)
    base.merge_page(pg)
    # rodapé (página transparente sobreposta)
    num = str(i + 1)
    y = 9 * MM
    esq = b"BT /FR 7.5 Tf 0.54 0.51 0.66 rg " + f"{17*MM:.1f} {y:.1f} Td (".encode() + txt("Estúdio de Bolso · crie vídeos animados com IA") + b") Tj ET\n"
    dir_ = b"BT /FR 8 Tf 0.69 0.09 0.44 rg " + f"{wd-17*MM-len(num)*4.6:.1f} {y:.1f} Td (".encode() + txt(num) + b") Tj ET\n"
    linha = f"0.87 0.84 0.93 RG 0.6 w {17*MM:.1f} {y+10:.1f} m {wd-17*MM:.1f} {y+10:.1f} l S\n".encode()
    ov = PageObject.create_blank_page(width=wd, height=ht)
    rod = DecodedStreamObject(); rod.set_data(linha + esq + dir_)
    ov[NameObject("/Contents")] = w._add_object(rod)
    ov[NameObject("/Resources")] = DictionaryObject({NameObject("/Font"): DictionaryObject({NameObject("/FR"): fref})})
    base.merge_page(ov)
    w.add_page(base)
w.write(dst)
