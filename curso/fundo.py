"""Põe um fundo lavanda de página inteira atrás de todas as páginas (menos a capa) do PDF."""
import sys
from pypdf import PdfReader, PdfWriter, PageObject, Transformation
from pypdf.generic import DecodedStreamObject, NameObject

src, dst = sys.argv[1], sys.argv[2]
r = PdfReader(src)
w = PdfWriter()
for i, pg in enumerate(r.pages):
    if i == 0:
        w.add_page(pg)
        continue
    wd, ht = float(pg.mediabox.width), float(pg.mediabox.height)
    base = PageObject.create_blank_page(width=wd, height=ht)
    s = DecodedStreamObject()
    s.set_data(f"0.965 0.949 1 rg 0 0 {wd} {ht} re f".encode())
    base[NameObject("/Contents")] = w._add_object(s)
    base.merge_page(pg)
    w.add_page(base)
w.write(dst)
