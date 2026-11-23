from pathlib import Path
import sys

from PIL import Image, ImageDraw

folder = Path(sys.argv[1])
output = Path(sys.argv[2])
files = sorted(folder.glob("page-*.png"))
thumbs = []
for file in files:
    image = Image.open(file).convert("RGB")
    image.thumbnail((420, 594))
    thumbs.append((file.name, image.copy()))

cols = 2
cell_w, cell_h = 450, 640
rows = (len(thumbs) + cols - 1) // cols
sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), "#dfe7e2")
draw = ImageDraw.Draw(sheet)
for index, (name, image) in enumerate(thumbs):
    x = (index % cols) * cell_w + (cell_w - image.width) // 2
    y = (index // cols) * cell_h + 30
    sheet.paste(image, (x, y))
    draw.text((x, 8 + (index // cols) * cell_h), name, fill="#063d2c")
output.parent.mkdir(parents=True, exist_ok=True)
sheet.save(output)
print(output)
