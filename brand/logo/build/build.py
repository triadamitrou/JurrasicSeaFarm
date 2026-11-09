import base64, io, math, numpy as np
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from PIL import Image
F="/private/tmp/claude-501/-Users-triadamitrou-Downloads-Website-Chef/f7e1d5f4-96f9-435b-b1f4-b7c223cfa475/scratchpad/fonts/"
S=10  # SVG units per source pixel
AXIS=206.5
def load(fn,w):
    f=TTFont(F+fn); return instancer.instantiateVariableFont(f,{"wght":w})
serif=load("CormorantGaramond%5Bwght%5D.ttf",560)
serif_b=load("CormorantGaramond%5Bwght%5D.ttf",680)
sans=load("Jost%5Bwght%5D.ttf",520)
def glyph(font,ch):
    gs=font.getGlyphSet(); name=font.getBestCmap()[ord(ch)]
    bp=BoundsPen(gs); gs[name].draw(bp)
    return name,gs[name].width,bp.bounds
def line(font,text,cap_px,baseline,ink_left,ink_right):
    upm=font["head"].unitsPerEm; cap=font["OS/2"].sCapHeight
    k=cap_px/cap
    items=[glyph(font,c) for c in text]
    # ink width with zero tracking
    def layout(track):
        x=0; pos=[]
        for (n,adv,b) in items:
            pos.append(x); x+=adv*k+track
        return pos
    def inkw(track):
        p=layout(track); first=[i for i,it in enumerate(items) if it[2]][0]; last=[i for i,it in enumerate(items) if it[2]][-1]
        return p[last]+items[last][2][2]*k-(p[first]+items[first][2][0]*k), p[first]+items[first][2][0]*k
    w0,_=inkw(0); w1,_=inkw(1)
    track=((ink_right-ink_left)-w0)/(w1-w0)
    w,l=inkw(track)
    x0=AXIS-w/2-l
    pos=layout(track); gs=font.getGlyphSet(); d=[]
    for (n,adv,b),p in zip(items,pos):
        if not b: continue
        sp=SVGPathPen(gs, ntos=lambda v: ("%.1f"%v).rstrip("0").rstrip("."))
        tp=TransformPen(sp,(k*S,0,0,-k*S,(x0+p)*S,baseline*S))
        gs[n].draw(tp); d.append(sp.getCommands())
    return " ".join(d), track, k*upm
paths={}
paths["jurassic"],t1,fs1=line(serif,"JURASSIC",30.6,390.6,40.5,373.5)
paths["seafarms"],t2,fs2=line(serif_b,"SEAFARMS",15.2,423.4,104.3,311.8)
paths["l1"],_,_=line(sans,"FINEST QUALITY OYSTERS",7.9,452.6,106.2,302.8)
paths["l2"],_,_=line(sans,"JURASSIC COAST",7.9,480.6,139.0,276.0)
paths["l3"],_,_=line(sans,"DORSET",7.9,508.4,175.0,236.0)
print("JURASSIC size %.1f track %.1f | SEAFARMS size %.1f track %.1f"%(fs1,t1,fs2,t2))
def dot(cx,cy,r=1.25): return '<circle cx="%.1f" cy="%.1f" r="%.1f"/>'%(cx*S,cy*S,r*S)
dots=[dot(123.2,477.0),dot(291.0,477.0),dot(159.2,504.5),dot(253.6,504.5)]
rules=['<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f"/>'%(x0*S,415.9*S,(x1-x0)*S,1.5*S) for x0,x1 in ((49.0,87.6),(327.6,365.6))]
# crescent arc
CX,CY,R=203.09,223.62,87.45
th0,th1,tmax=150.5,302.5,2.5
p=math.log(0.5)/math.log((212-th0)/(th1-th0))
outer=[];inner=[]
N=260
for i in range(N+1):
    u=i/N; th=math.radians(th0+(th1-th0)*u)
    t=tmax*math.sin(math.pi*(u**p))**0.6
    for lst,rr in ((outer,R+t/2),(inner,R-t/2)):
        lst.append(((CX+rr*math.cos(th))*S,(CY+rr*math.sin(th))*S))
pts=outer+inner[::-1]
arc="M"+" L".join("%.1f %.1f"%q for q in pts)+"Z"
# canvas
X0,X1=AXIS-181.5,AXIS+181.5; Y0,Y1=121.0,522.0
VB=(X0*S,Y0*S,(X1-X0)*S,(Y1-Y0)*S)
ILL=dict(x=117.625,y=205.5,w=190.875,h=144.25)
def illus_b64(tone):
    im=Image.open("illustration.png").convert("RGBA")
    if tone=="light":
        a=np.asarray(im).astype(float); rgb=a[...,:3]/255
        rgb=np.power(rgb,1.3)*0.97*255
        im=Image.fromarray(np.dstack([rgb,a[...,3]]).clip(0,255).astype(np.uint8))
    b=io.BytesIO(); im.save(b,"PNG",optimize=True); return base64.b64encode(b.getvalue()).decode()
WAYS={
 "light-bg":dict(word="#3d5975",tag="#5d6875",rule="#7d8692",arc="#a59b90"),
 "dark-bg":dict(word="#7f9bb8",tag="#b3b9c1",rule="#8f97a1",arc="#d6cec5"),
}
for way,c in WAYS.items():
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="{VB[0]:.0f} {VB[1]:.0f} {VB[2]:.0f} {VB[3]:.0f}" width="{VB[2]/10:.0f}" height="{VB[3]/10:.0f}">
<title>Jurassic Seafarms</title>
<!-- Vector: crescent arc, all lettering (Cormorant Garamond and Jost, converted to outlines), rules, bullets. Raster: headland, oysters and water (cleaned and upscaled from the supplied JPEG). -->
<path id="arc" fill="{c['arc']}" d="{arc}"/>
<image id="illustration" x="{ILL['x']*S:.1f}" y="{ILL['y']*S:.1f}" width="{ILL['w']*S:.1f}" height="{ILL['h']*S:.1f}" preserveAspectRatio="none" xlink:href="data:image/png;base64,{illus_b64('light' if way=='light-bg' else 'dark')}"/>
<path id="jurassic" fill="{c['word']}" d="{paths['jurassic']}"/>
<g id="rules" fill="{c['rule']}">{''.join(rules)}</g>
<path id="seafarms" fill="{c['word']}" d="{paths['seafarms']}"/>
<g id="tagline" fill="{c['tag']}"><path d="{paths['l1']}"/><path d="{paths['l2']}"/><path d="{paths['l3']}"/>{''.join(dots)}</g>
</svg>
'''
    open(f"jurassic-seafarms-logo-{way}.svg","w").write(svg)
    print(way,len(svg)//1024,"KB")
