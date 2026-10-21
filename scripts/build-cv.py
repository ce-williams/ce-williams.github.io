"""Generate the public two-page CV from the portfolio experience manifest."""
import json
import shutil
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parent.parent
INFO = json.loads((ROOT / "data/experience.json").read_text())
OUT = ROOT / "output/pdf/curtis-williams-cv.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

INK = colors.HexColor("#16231b")
MUTED = colors.HexColor("#536158")
ACCENT = colors.HexColor("#4f6b42")
LIGHT = colors.HexColor("#d9dfd7")
PALE = colors.HexColor("#f2f5f0")

styles = {
    "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=26, leading=29, textColor=INK, spaceAfter=5),
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=10.2, leading=13, tracking=.4, textColor=ACCENT, spaceAfter=7),
    "links": ParagraphStyle("links", fontName="Helvetica", fontSize=8.1, leading=11, textColor=MUTED, spaceAfter=11),
    "summary": ParagraphStyle("summary", fontName="Helvetica", fontSize=9.6, leading=13.5, textColor=INK, spaceAfter=8),
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=9, leading=11.5, tracking=.7, textColor=ACCENT, spaceBefore=10, spaceAfter=7),
    "role": ParagraphStyle("role", fontName="Helvetica-Bold", fontSize=11.5, leading=14, textColor=INK, spaceAfter=2),
    "meta": ParagraphStyle("meta", fontName="Helvetica", fontSize=8.1, leading=10.5, textColor=MUTED, spaceAfter=6),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=8.7, leading=11.8, textColor=INK, leftIndent=10, firstLineIndent=-9, spaceAfter=3.8),
    "compact": ParagraphStyle("compact", fontName="Helvetica", fontSize=8.6, leading=11.6, textColor=INK, spaceAfter=4),
    "small": ParagraphStyle("small", fontName="Helvetica", fontSize=8, leading=10.5, textColor=MUTED),
}


def clean(value):
    return escape(str(value).replace("–", "-").replace("—", "-").replace("’", "'").replace("↔", " to "))


def p(value, style="summary"):
    return Paragraph(value, styles[style])


def section(label):
    return p(clean(label.upper()), "section")


def role_block(role, bullets):
    heading = p(f"{clean(role['title'])} <font color='#536158'>|</font> {clean(role['company'])}", "role")
    meta = p(f"{clean(role['dates'])}  /  {clean(role['location'])}", "meta")
    items = [p(f"<bullet>&bull;</bullet>{clean(item)}", "bullet") for item in bullets]
    return [KeepTogether([heading, meta, items[0]]), *items[1:], Spacer(1, 5)]


story = [
    p(clean(INFO["name"]), "name"),
    p("SENIOR GTM SYSTEMS ENGINEER  |  AI &amp; REVENUE SYSTEMS ARCHITECT", "title"),
    p(
        "Denver, Colorado&nbsp;&nbsp;|&nbsp;&nbsp;"
        '<link href="https://ce-williams.github.io/">Portfolio</link>&nbsp;&nbsp;|&nbsp;&nbsp;'
        '<link href="https://www.linkedin.com/in/ce-williams/">LinkedIn</link>&nbsp;&nbsp;|&nbsp;&nbsp;'
        '<link href="https://github.com/ce-williams/">GitHub</link>',
        "links",
    ),
    HRFlowable(width="100%", thickness=.7, color=LIGHT),
    Spacer(1, 9),
    p(
        "Senior GTM systems engineer focused on Salesforce, revenue operations, and AI-assisted delivery. "
        "Builds reliable routing, release, integration, and governance systems; uses agents to accelerate development, testing, and operational support."
    ),
    section("Core capabilities"),
    p(
        "Salesforce architecture &amp; CPQ&nbsp;&nbsp;&bull;&nbsp;&nbsp;Apex &amp; Flow&nbsp;&nbsp;&bull;&nbsp;&nbsp;Agent workflows &amp; MCP&nbsp;&nbsp;&bull;&nbsp;&nbsp;"
        "CI/CD&nbsp;&nbsp;&bull;&nbsp;&nbsp;LeanData&nbsp;&nbsp;&bull;&nbsp;&nbsp;API integrations&nbsp;&nbsp;&bull;&nbsp;&nbsp;SQL, BigQuery &amp; dbt&nbsp;&nbsp;&bull;&nbsp;&nbsp;Data governance",
        "small",
    ),
    section("Professional experience"),
]

fivetran = INFO["roles"][0]
story.extend(role_block(fivetran, fivetran["cvHighlights"]))

transcarent = INFO["roles"][1]
vantage = INFO["roles"][2]
boom = INFO["roles"][3]
story.extend(role_block(transcarent, transcarent["cvHighlights"]))
story.append(PageBreak())
story.append(section("Professional experience continued"))
story.extend(role_block(vantage, vantage["highlights"] + vantage.get("cvExtra", [])))
story.extend(role_block(boom, boom["highlights"] + boom.get("cvExtra", [])))

story.extend([
    section("Earlier experience"),
    p("<b>Target</b> - Advanced to Sr Specialist, Space and Presentation; supported three apparel-brand launches across 1,000+ stores, contributing to approximately 20% comp growth and $2M in sales.", "compact"),
    p("<b>SSQTCH, LLC</b> - Co-founded an Emmy Award-winning multimedia production company and led client development, marketing, editing, and production work.", "compact"),
    section("Education & certifications"),
])

education = "<b>B.A., Biological Sciences</b><br/>College of Saint Benedict &amp; Saint John's University<br/><br/><b>Full Stack Web Development Certificate</b><br/>University of Minnesota"
certifications = "<b>Salesforce</b><br/>AI Associate<br/>Platform App Builder<br/>Administrator<br/><br/><b>LeanData</b><br/>Fundamentals"
table = Table(
    [[p(education, "compact"), p(certifications, "compact")]],
    colWidths=[3.55 * inch, 2.45 * inch],
    hAlign="LEFT",
)
table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), PALE),
    ("BOX", (0, 0), (-1, -1), .5, LIGHT),
    ("INNERGRID", (0, 0), (-1, -1), .5, LIGHT),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 10),
    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ("TOPPADDING", (0, 0), (-1, -1), 9),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
]))
story.append(table)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LIGHT)
    canvas.line(42, 36, 570, 36)
    canvas.setFont("Helvetica", 7.2)
    canvas.setFillColor(MUTED)
    canvas.drawString(42, 23, "Curtis Williams  |  GTM Systems Engineering")
    canvas.drawRightString(570, 23, str(doc.page))
    canvas.restoreState()


doc = SimpleDocTemplate(
    str(OUT),
    pagesize=letter,
    leftMargin=42,
    rightMargin=42,
    topMargin=32,
    bottomMargin=47,
    title="Curtis Williams - Senior GTM Systems Engineer",
    author="Curtis Williams",
    subject="Professional CV",
)
doc.build(story, onFirstPage=footer, onLaterPages=footer)
shutil.copy2(OUT, ROOT / "assets/curtis-williams-cv.pdf")
print(OUT)
