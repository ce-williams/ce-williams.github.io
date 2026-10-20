"""Generate the public CV from the same LinkedIn-sourced data as the website."""
import json,shutil
from pathlib import Path
from html import escape
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,PageBreak,KeepTogether,HRFlowable
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
ROOT=Path(__file__).resolve().parent.parent
info=json.loads((ROOT/'data/experience.json').read_text())
out=ROOT/'output/pdf/curtis-williams-cv.pdf';out.parent.mkdir(parents=True,exist_ok=True)
ink=colors.HexColor('#202b20');muted=colors.HexColor('#59644f');accent=colors.HexColor('#536c3e');line=colors.HexColor('#d9ded2')
styles={
 'name':ParagraphStyle('name',fontName='Helvetica',fontSize=29,leading=34,textColor=ink,spaceAfter=6),
 'title':ParagraphStyle('title',fontName='Helvetica',fontSize=12,leading=17,textColor=accent,spaceAfter=8),
 'body':ParagraphStyle('body',fontName='Helvetica',fontSize=9.7,leading=14.5,textColor=ink,spaceAfter=9),
 'small':ParagraphStyle('small',fontName='Helvetica',fontSize=8,leading=12,textColor=muted,spaceAfter=11),
 'section':ParagraphStyle('section',fontName='Helvetica-Bold',fontSize=9.5,leading=14,textColor=accent,spaceBefore=17,spaceAfter=10),
 'role':ParagraphStyle('role',fontName='Helvetica-Bold',fontSize=12,leading=16,textColor=ink,spaceAfter=4),
 'meta':ParagraphStyle('meta',fontName='Helvetica',fontSize=8.5,leading=12,textColor=muted,spaceAfter=10),
 'bullet':ParagraphStyle('bullet',fontName='Helvetica',fontSize=9.4,leading=14.2,textColor=ink,leftIndent=10,firstLineIndent=-10,spaceAfter=6),
}
def text(s):
 return escape(s.replace('–','-').replace('—','-').replace('’',"'").replace('↔',' / '))
def para(s,k='body'):return Paragraph(s,styles[k])
story=[para(text(info['name']),'name'),para(text(info['title'])+' | Applied AI &amp; Revenue Systems','title'),para('Denver, Colorado | <link href="https://ce-williams.github.io/">ce-williams.github.io</link> | <link href="https://www.linkedin.com/in/ce-williams/">LinkedIn</link>','small'),HRFlowable(width='100%',thickness=.6,color=line),Spacer(1,14),para(text(info['summary'])),para('PLATFORMS & TOOLS','section'),para(text(' / '.join(info['skills'])),'small'),para('PROFESSIONAL EXPERIENCE','section')]
def add_role(r,extra=True):
 title=para(text(r['title'])+' | '+text(r['company']),'role')
 meta=para(text(r['dates'])+' / '+text(r['location']),'meta')
 bullets=[para('- '+text(x),'bullet') for x in r['highlights']+(r.get('cvExtra',[]) if extra else [])]
 story.append(KeepTogether([title,meta,bullets[0]]));story.extend(bullets[1:]);story.append(Spacer(1,12))
for r in info['roles'][:2]:add_role(r)
story.extend([PageBreak(),para('EARLIER EXPERIENCE','section')])
for r in info['roles'][2:]:add_role(r,extra=False)
story.extend([para('EDUCATION','section')])
for e in info['education']:story.append(para('<b>'+text(e['credential'])+'</b><br/>'+text(e['institution']),'body'))
story.extend([para('CERTIFICATIONS','section'),para('<br/>'.join(text(c) for c in info['certifications']),'body'),para('INDEPENDENT PROJECTS','section'),para('Market Intelligence, Referral, Powderline, EasyEcom, and SimpleSLP. Screenshots, implementation details, source repositories, and prototype boundaries at <link href="https://ce-williams.github.io/">ce-williams.github.io</link>.','body')])
def page_footer(canvas,doc):
 canvas.saveState();canvas.setStrokeColor(line);canvas.line(46,39,566,39);canvas.setFont('Helvetica',7.5);canvas.setFillColor(muted);canvas.drawString(46,25,'Curtis Williams | Career details from LinkedIn | October 2026');canvas.drawRightString(566,25,str(doc.page));canvas.restoreState()
doc=SimpleDocTemplate(str(out),pagesize=(612,792),leftMargin=46,rightMargin=46,topMargin=38,bottomMargin=52,title='Curtis Williams - Professional CV',author='Curtis Williams')
doc.build(story,onFirstPage=page_footer,onLaterPages=page_footer)
shutil.copy2(out,ROOT/'assets/curtis-williams-cv.pdf')
print(out)
