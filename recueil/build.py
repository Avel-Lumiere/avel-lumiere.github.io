import json
from reportlab.lib.pagesizes import A5
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.platypus import (Table, TableStyle, BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    PageBreak, KeepTogether, NextPageTemplate, CondPageBreak)
from reportlab.platypus.tableofcontents import TableOfContents
F='/usr/share/fonts/truetype/dejavu/'
pdfmetrics.registerFont(TTFont('S',F+'DejaVuSerif.ttf'))
pdfmetrics.registerFont(TTFont('SI',F+'DejaVuSerif-Italic.ttf'))
pdfmetrics.registerFont(TTFont('SB',F+'DejaVuSerif-Bold.ttf'))
pdfmetrics.registerFontFamily('S',normal='S',italic='SI',bold='SB',boldItalic='SI')
INK=HexColor('#242424'); BLUE=HexColor('#2F3E4D'); GREY=HexColor('#8A8A8A'); SOFT=HexColor('#5B6B7B')
W,H=A5; M=62.7
d=json.load(open(__import__('os').path.join(__import__('os').path.dirname(__file__),'recueil.json'),encoding='utf-8'))
body=ParagraphStyle('b',fontName='S',fontSize=10.5,leading=15.5,textColor=INK)
dayT=ParagraphStyle('t',fontName='S',fontSize=15,leading=19,textColor=BLUE,spaceBefore=0,spaceAfter=8)
verse=ParagraphStyle('v',parent=body,fontName='SI',leftIndent=17,rightIndent=6,textColor=INK)
ref=ParagraphStyle('r',parent=body,fontSize=9,leading=13,alignment=TA_RIGHT,textColor=SOFT,spaceBefore=3,spaceAfter=10)
lab=ParagraphStyle('l',fontName='S',fontSize=9.5,leading=12,textColor=SOFT,spaceBefore=8,spaceAfter=3)
h1=ParagraphStyle('h1',fontName='S',fontSize=17,leading=22,textColor=BLUE,spaceAfter=14)
toc1=ParagraphStyle('toc',fontName='S',fontSize=9,leading=12.5,textColor=INK,leftIndent=0,rightIndent=20,spaceAfter=5)
center=ParagraphStyle('c',parent=body,alignment=TA_CENTER,leading=17)

class Doc(BaseDocTemplate):
    def afterFlowable(self,f):
        if getattr(f,'_toc',None): self.notify('TOCEntry',(getattr(f,'_toclevel',1),f._toc,self.page))
def deco(c,doc):
    c.saveState(); c.setFont('S',7.5); c.setFillColor(GREY)
    c.drawCentredString(W/2,H-35,'LA SOURCE DU MATIN • AVEL & LUMIÈRE')
    c.drawCentredString(W/2,28,str(doc.page)); c.restoreState()
doc=Doc(__import__('os').path.join(__import__('os').path.dirname(__file__),'La_Source_du_Matin_recueil.pdf'),pagesize=A5,title='La Source du Matin',author='Avel & Lumière')
fr=Frame(M,50,W-2*M,H-50-60,id='f',leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)
doc.addPageTemplates([PageTemplate('p',[fr],onPage=deco)])
s=[Spacer(1,150),
   Paragraph('LA SOURCE<br/>DU MATIN',ParagraphStyle('ct',fontName='S',fontSize=26,leading=31,alignment=TA_CENTER,textColor=BLUE)),
   Spacer(1,14),
   Paragraph('Un recueil de versets, méditations et prières',ParagraphStyle('cs',fontName='S',fontSize=10,alignment=TA_CENTER,textColor=SOFT)),
   Spacer(1,22),
   Paragraph('Avel &amp; Lumière',ParagraphStyle('ca',fontName='S',fontSize=12,alignment=TA_CENTER,textColor=INK)),
   PageBreak(), Paragraph('Sommaire',h1)]
toc0=ParagraphStyle('toc0',parent=toc1,fontSize=10,leading=14,textColor=BLUE,spaceBefore=6,spaceAfter=3)
toc2=ParagraphStyle('toc2',parent=toc1,leftIndent=10,spaceAfter=3)
toc=TableOfContents(); toc.levelStyles=[toc0,toc2]; toc.dotsMinLevel=0
s+=[toc,PageBreak(),Paragraph('Avant de commencer',h1)]
for p in d['avant']: s+=[Paragraph(p,body),Spacer(1,9)]
import re
# Espace insécable avant ; : ! ? » et après « (jamais de ponctuation seule en début de ligne)
NB=lambda t: re.sub(r'« ','«\xa0',re.sub(r' ([;:!?»])','\xa0\\1',t)) if t else t
chapL=ParagraphStyle('chl',fontName='S',fontSize=9.5,leading=12,alignment=TA_CENTER,textColor=SOFT,spaceAfter=10)
chapT=ParagraphStyle('cht',fontName='S',fontSize=20,leading=26,alignment=TA_CENTER,textColor=BLUE,spaceAfter=18)
chapI=ParagraphStyle('chi',parent=center,fontName='SI',fontSize=10.5,leading=16,textColor=INK)
TH={t['id']:t for t in d['themes']}
numch={}
for x in d['days']:
    if x['theme'] not in numch: numch[x['theme']]=len(numch)+1
def boite(e):
    bx=[Paragraph(e['titre'],ParagraphStyle('bt',parent=lab,textColor=BLUE,spaceBefore=0))]+[Paragraph(l,body) for l in e['lignes']]
    tb=Table([[bx]],colWidths=[W-2*M])
    tb.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),HexColor('#EEF2F6')),('BOX',(0,0),(-1,-1),0.6,HexColor('#C9D3DD')),
        ('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),9)]))
    return tb
cur=None
for x in d['days']:
    if x['theme']!=cur:
        cur=x['theme']; th=TH[cur]
        ct=Paragraph(th['titre'],chapT); ct._toc=f"{numch[cur]}. {th['titre']}"; ct._toclevel=0
        s+=[PageBreak(),Spacer(1,120),Paragraph(f"CHAPITRE {numch[cur]}",chapL),ct,Paragraph(NB(th['intro']),chapI)]
    x={k:(NB(v) if isinstance(v,str) and k in ('verse','pensee','priere') else ([NB(p) for p in v] if k=='med' else v)) for k,v in x.items()}
    t=Paragraph(f"Jour {x['n']} — {x['title']}",dayT); t._toclevel=1; t._toc=f"Jour {x['n']} — {x['title']} · <font color='#5B6B7B'>{x['ref']}</font>"
    head=[t,Paragraph(x['verse'],verse),Paragraph(x['ref'],ref)]
    if x.get('encadre'):
        head+=[boite(x['encadre']),Spacer(1,4)]
    med=[Paragraph('Méditation',lab)]+[Paragraph(p,ParagraphStyle('bp',parent=body,spaceAfter=5)) for p in x['med']]
    s.append(PageBreak())
    s.append(KeepTogether(head+med[:2]))
    s+=med[2:]
    for name,key in (('Pensée du jour','pensee'),('Prière','priere')):
        if x[key]: s.append(KeepTogether([Paragraph(name,lab),Paragraph(x[key],body)]))
    if x.get('encadre_fin'):
        s+=[Spacer(1,14),KeepTogether([boite(x['encadre_fin'])])]
s+=[PageBreak(),Paragraph('Clôture',h1),Spacer(1,10)]
s.append(Paragraph('<br/>'.join(d['cloture']),ParagraphStyle('cl',parent=center,fontName='SI')))
doc.multiBuild(s)
