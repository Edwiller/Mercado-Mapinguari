from __future__ import annotations

import html
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Image,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "relatorio-final-ga4.md"
OUTPUT = ROOT / "output" / "pdf" / "relatorio-final-mercado-mapinguari-ga4.pdf"

GREEN = colors.HexColor("#063D2C")
MID_GREEN = colors.HexColor("#126B4E")
PALE_GREEN = colors.HexColor("#E9F5EF")
YELLOW = colors.HexColor("#F7C83E")
INK = colors.HexColor("#1F2925")
MUTED = colors.HexColor("#667069")
LINE = colors.HexColor("#D9E2DD")


def register_fonts() -> None:
    candidates = [
        ("Arial", Path("C:/Windows/Fonts/arial.ttf"), Path("C:/Windows/Fonts/arialbd.ttf")),
        ("DejaVu", Path("C:/Windows/Fonts/DejaVuSans.ttf"), Path("C:/Windows/Fonts/DejaVuSans-Bold.ttf")),
    ]
    for family, regular, bold in candidates:
        if regular.exists() and bold.exists():
            pdfmetrics.registerFont(TTFont(family, str(regular)))
            pdfmetrics.registerFont(TTFont(f"{family}-Bold", str(bold)))
            pdfmetrics.registerFontFamily(family, normal=family, bold=f"{family}-Bold")
            return
    raise FileNotFoundError("Nenhuma fonte Unicode compatível foi encontrada.")


register_fonts()
FONT = "Arial" if "Arial" in pdfmetrics.getRegisteredFontNames() else "DejaVu"
FONT_BOLD = f"{FONT}-Bold"


def inline(text: str) -> str:
    text = html.escape(text.strip())
    text = re.sub(r"`([^`]+)`", r'<font name="%s" color="#126B4E">\1</font>' % FONT_BOLD, text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(https?://[^\s<]+)", r'<link href="\1" color="#126B4E">\1</link>', text)
    return text


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleGreen", fontName=FONT_BOLD, fontSize=28, leading=32, textColor=colors.white, alignment=TA_LEFT, spaceAfter=8))
styles.add(ParagraphStyle(name="Subtitle", fontName=FONT, fontSize=13, leading=18, textColor=colors.HexColor("#D8EFE4"), spaceAfter=10))
styles.add(ParagraphStyle(name="H1Custom", fontName=FONT_BOLD, fontSize=18, leading=23, textColor=GREEN, spaceBefore=12, spaceAfter=8, keepWithNext=True))
styles.add(ParagraphStyle(name="H2Custom", fontName=FONT_BOLD, fontSize=14, leading=18, textColor=MID_GREEN, spaceBefore=10, spaceAfter=5, keepWithNext=True))
styles.add(ParagraphStyle(name="H3Custom", fontName=FONT_BOLD, fontSize=11, leading=15, textColor=GREEN, spaceBefore=8, spaceAfter=3, keepWithNext=True))
styles.add(ParagraphStyle(name="BodyCustom", fontName=FONT, fontSize=9.2, leading=13.6, textColor=INK, spaceAfter=6))
styles.add(ParagraphStyle(name="Small", fontName=FONT, fontSize=7.8, leading=10.5, textColor=MUTED))
styles.add(ParagraphStyle(name="BulletCustom", fontName=FONT, fontSize=9, leading=13, textColor=INK, leftIndent=10, firstLineIndent=0, spaceAfter=2))
styles.add(ParagraphStyle(name="Caption", fontName=FONT, fontSize=7.5, leading=10, textColor=MUTED, alignment=TA_CENTER, spaceBefore=3, spaceAfter=7))


def header_footer(canvas, doc) -> None:
    canvas.saveState()
    width, height = A4
    if doc.page > 1:
        canvas.setFillColor(GREEN)
        canvas.rect(0, height - 1.05 * cm, width, 1.05 * cm, fill=1, stroke=0)
        canvas.setFont(FONT_BOLD, 8)
        canvas.setFillColor(colors.white)
        canvas.drawString(1.55 * cm, height - 0.68 * cm, "MERCADO MAPINGUARI  •  GOOGLE ANALYTICS 4")
        canvas.setStrokeColor(LINE)
        canvas.line(1.55 * cm, 1.25 * cm, width - 1.55 * cm, 1.25 * cm)
        canvas.setFont(FONT, 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawString(1.55 * cm, 0.82 * cm, "Relatório acadêmico — dados de teste controlado")
        canvas.drawRightString(width - 1.55 * cm, 0.82 * cm, f"Página {doc.page}")
    canvas.restoreState()


def title_page(story: list) -> None:
    box = Table(
        [[Paragraph("MERCADO<br/>MAPINGUARI", styles["TitleGreen"]), Paragraph("GA4", ParagraphStyle(name="Badge", fontName=FONT_BOLD, fontSize=32, leading=34, textColor=YELLOW, alignment=TA_CENTER))]],
        colWidths=[12.3 * cm, 4.0 * cm],
        rowHeights=[5.4 * cm],
    )
    box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GREEN),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (0, 0), 24),
        ("BOX", (0, 0), (-1, -1), 0, GREEN),
    ]))
    story.extend([
        Spacer(1, 2.2 * cm),
        box,
        Spacer(1, 1.1 * cm),
        Paragraph("Relatório de implementação e validação", ParagraphStyle(name="CoverH", fontName=FONT_BOLD, fontSize=22, leading=27, textColor=GREEN)),
        Spacer(1, 0.3 * cm),
        Paragraph("Google Analytics 4 aplicado a uma jornada completa de comércio eletrônico", ParagraphStyle(name="CoverSub", fontName=FONT, fontSize=12, leading=18, textColor=MUTED)),
        Spacer(1, 2.2 * cm),
        Table([
            [Paragraph("ALUNO", styles["Small"]), Paragraph("Edwiller de Lima", styles["BodyCustom"])],
            [Paragraph("INSTITUIÇÃO", styles["Small"]), Paragraph("Instituto Federal do Acre — Campus Rio Branco", styles["BodyCustom"])],
            [Paragraph("PROFESSOR", styles["Small"]), Paragraph("Valdenir Junior", styles["BodyCustom"])],
            [Paragraph("VALIDAÇÃO", styles["Small"]), Paragraph("22 de novembro de 2026", styles["BodyCustom"])],
            [Paragraph("SITE", styles["Small"]), Paragraph('<link href="https://mercado-mapinguari.vercel.app" color="#126B4E">mercado-mapinguari.vercel.app</link>', styles["BodyCustom"])],
        ], colWidths=[3.1 * cm, 12.4 * cm], style=TableStyle([
            ("LINEBELOW", (0, 0), (-1, -1), 0.4, LINE),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ])),
        Spacer(1, 2 * cm),
        Paragraph("PROJETO ACADÊMICO DEMONSTRATIVO", ParagraphStyle(name="CoverTag", fontName=FONT_BOLD, fontSize=8, leading=10, textColor=MID_GREEN, alignment=TA_CENTER, borderColor=LINE, borderWidth=0.7, borderPadding=7)),
        PageBreak(),
    ])


def image_block(path: Path, caption: str):
    from PIL import Image as PILImage

    with PILImage.open(path) as source:
        w, h = source.size
    max_w, max_h = 16.2 * cm, 10.2 * cm
    scale = min(max_w / w, max_h / h)
    img = Image(str(path), width=w * scale, height=h * scale)
    img.hAlign = "CENTER"
    return KeepTogether([img, Paragraph(caption, styles["Caption"])])


def build_story() -> list:
    story: list = []
    title_page(story)
    lines = SOURCE.read_text(encoding="utf-8").splitlines()
    i = 0
    seen_content = False
    while i < len(lines):
        line = lines[i].strip()
        if not line or line == "---":
            i += 1
            continue
        if line.startswith("# Mercado Mapinguari") or line.startswith("## Relatório") or line.startswith("**Aluno:") or line.startswith("**Projeto:") or line.startswith("**Instituição:") or line.startswith("**Professor:") or line.startswith("**Data da validação:"):
            i += 1
            continue
        if line.startswith("!["):
            match = re.match(r"!\[(.*?)\]\((.*?)\)", line)
            if match:
                story.append(image_block(SOURCE.parent / match.group(2), match.group(1)))
            i += 1
            continue
        if line.startswith("### "):
            story.append(Paragraph(inline(line[4:]), styles["H2Custom"]))
            i += 1
            continue
        if line.startswith("## "):
            if seen_content:
                story.append(Spacer(1, 2))
            story.append(Paragraph(inline(line[3:]), styles["H1Custom"]))
            seen_content = True
            i += 1
            continue
        if line.startswith("# "):
            story.append(Paragraph(inline(line[2:]), styles["H1Custom"]))
            i += 1
            continue
        if line.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                if not all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
                    rows.append(cells)
                i += 1
            data = [[Paragraph(inline(c), styles["Small"] if r else ParagraphStyle(name=f"TableHead{len(story)}", parent=styles["Small"], fontName=FONT_BOLD, textColor=colors.white)) for c in row] for r, row in enumerate(rows)]
            if data:
                table = Table(data, repeatRows=1, hAlign="LEFT", colWidths=[16.2 * cm / len(data[0])] * len(data[0]))
                table.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (-1, 0), GREEN),
                    ("GRID", (0, 0), (-1, -1), 0.35, LINE),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 5),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PALE_GREEN]),
                ]))
                story.extend([table, Spacer(1, 7)])
            continue
        if re.match(r"^[-*] ", line):
            items = []
            while i < len(lines) and re.match(r"^[-*] ", lines[i].strip()):
                items.append(ListItem(Paragraph(inline(lines[i].strip()[2:]), styles["BulletCustom"]), leftIndent=9))
                i += 1
            story.append(ListFlowable(items, bulletType="bullet", start="circle", leftIndent=16, bulletFontName=FONT, bulletFontSize=6, bulletColor=MID_GREEN, spaceAfter=5))
            continue
        if re.match(r"^\d+\. ", line):
            items = []
            while i < len(lines) and re.match(r"^\d+\. ", lines[i].strip()):
                body = re.sub(r"^\d+\. ", "", lines[i].strip())
                items.append(ListItem(Paragraph(inline(body), styles["BulletCustom"]), leftIndent=12))
                i += 1
            story.append(ListFlowable(items, bulletType="1", leftIndent=19, bulletFontName=FONT_BOLD, bulletFontSize=8, bulletColor=MID_GREEN, spaceAfter=5))
            continue
        paragraph = line
        i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r"^(#|\||[-*] |\d+\. |!\[|---)", lines[i].strip()):
            paragraph += " " + lines[i].strip()
            i += 1
        story.append(Paragraph(inline(paragraph), styles["BodyCustom"]))
    return story


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=1.55 * cm,
        leftMargin=1.55 * cm,
        topMargin=1.55 * cm,
        bottomMargin=1.55 * cm,
        title="Mercado Mapinguari — Relatório GA4",
        author="Edwiller de Lima",
        subject="Implementação e validação do Google Analytics 4",
    )
    doc.build(build_story(), onFirstPage=header_footer, onLaterPages=header_footer)
    print(OUTPUT)


if __name__ == "__main__":
    main()
