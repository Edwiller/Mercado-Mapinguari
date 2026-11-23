from pathlib import Path
import sys

import pypdfium2 as pdfium

source = Path(sys.argv[1]).resolve()
target = Path(sys.argv[2]).resolve()
target.mkdir(parents=True, exist_ok=True)

pdf = pdfium.PdfDocument(str(source))
for index, page in enumerate(pdf):
    bitmap = page.render(scale=1.6)
    bitmap.to_pil().save(target / f"page-{index + 1:02d}.png")

print(f"{len(pdf)} páginas renderizadas em {target}")
