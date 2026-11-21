import json, math, numpy as np
from oyster import build as build_oysters, P
d=json.load(open("redraw.json"))
rng=np.random.default_rng(21)
OX,OY,K=117.625,205.5,8.0          # illustration grid: 8 units per source px, origin at source (117.625,205.5)
def src(x,y): return ((x-OX)*K,(y-OY)*K)
# ---- crescent arc (same geometry as before, now in illustration units)
CX,CY,R=203.09,223.62,87.45; th0,th1,tmax=150.5,302.5,2.5
p=math.log(0.5)/math.log((212-th0)/(th1-th0)); outer=[];inner=[]
for i in range(261):
    u=i/260; th=math.radians(th0+(th1-th0)*u); t=tmax*math.sin(math.pi*(u**p))**0.6
    for lst,rr in ((outer,R+t/2),(inner,R-t/2)): lst.append(src(CX+rr*math.cos(th),CY+rr*math.sin(th)))
ARC="M"+" L".join("%s %s"%(P(a),P(b)) for a,b in outer+inner[::-1])+"Z"
def lens(x0,x1,y,t,bend=0):
    xm=(x0+x1)/2
    return "M%s %sC%s %s %s %s %s %sC%s %s %s %s %s %sZ"%(P(x0),P(y),P(x0+(x1-x0)*.25),P(y-t+bend),P(x1-(x1-x0)*.25),P(y-t+bend),P(x1),P(y),
        P(x1-(x1-x0)*.25),P(y+t*.8+bend),P(x0+(x1-x0)*.25),P(y+t*.8+bend),P(x0),P(y))
def ripple_row(y,x0,x1,t,nseg):
    cuts=np.sort(rng.uniform(x0,x1,nseg*2-2)); xs=[x0,*cuts,x1]; out=[]
    for i in range(0,len(xs)-1,2):
        a,b=xs[i],xs[i+1]
        if b-a>40: out.append((a,b,y+rng.uniform(-2,2),t*rng.uniform(.75,1.1)))
    return out
BACK=[(864,90,1236,11,2),(892,10,1383,13,2),(923,40,1310,13,2)]
FRONT=[(955,150,1250,12,2),(980,105,1325,14,2),(1008,125,1200,13,2),(1036,160,1230,13,2),(1062,330,1210,12,2),(1094,490,1000,11,1),(1132,610,825,9,1)]
REFL=[(290,930,1490,8,2),(306,960,1440,7,2),(322,1010,1420,6,2),(338,1080,1390,5,1),(352,1150,1360,4,1)]
def rows(spec,fill,hi):
    s=[]
    for r in spec:
        for a,b,y,t in ripple_row(*r):
            s.append('<path fill="%s" d="%s"/>'%(fill,lens(a,b,y,t)))
            s.append('<path fill="%s" d="%s"/>'%(hi,lens(a+(b-a)*.18,b-(b-a)*.22,y-t*.35,t*.32)))
    return "".join(s)
def mark(way):
    arc_col={"light-bg":"#a59b90","dark-bg":"#d6cec5"}[way]
    odefs,oys=build_oysters()
    defs='''<linearGradient id="hd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ebe7e2"/><stop offset=".55" stop-color="#e9e4de"/><stop offset=".72" stop-color="#dfd4ca"/><stop offset="1" stop-color="#d9ccc1"/></linearGradient>
<linearGradient id="hdv" x1="0" y1="0" x2="0" y2="1"><stop offset=".5" stop-color="#8a7d72" stop-opacity="0"/><stop offset="1" stop-color="#8a7d72" stop-opacity=".3"/></linearGradient>
<linearGradient id="hdd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".5"/><stop offset=".5" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<linearGradient id="lh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d6cdc5"/><stop offset=".35" stop-color="#f1ede8"/><stop offset=".7" stop-color="#e2dad2"/><stop offset="1" stop-color="#b9aea4"/></linearGradient>
<linearGradient id="wt" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1527" y2="0"><stop offset="0" stop-color="#55667a"/><stop offset=".45" stop-color="#8797a6"/><stop offset="1" stop-color="#55667a"/></linearGradient>
<linearGradient id="wl" x1="0" y1="930" x2="0" y2="1010" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#6d7d8c" stop-opacity="0"/><stop offset="1" stop-color="#6d7d8c" stop-opacity=".55"/></linearGradient>
<clipPath id="cHead"><path d="%s"/></clipPath>'''%d['head']+odefs
    g=[]
    g.append('<path id="arc" fill="%s" d="%s"/>'%(arc_col,ARC))
    # headland
    g.append('<g id="headland"><path fill="url(#hd)" d="%s"/><g clip-path="url(#cHead)"><path fill="url(#hdv)" d="M0 0H1527V360H0Z"/><path fill="url(#hdd)" d="M300 0L700 0L420 330L0 330Z"/>'%d['head'])
    for x0,y0,x1,y1 in ((520,60,330,300),(620,95,470,300),(760,140,640,300),(900,175,820,300)):
        g.append('<path fill="none" stroke="#b8ada2" stroke-opacity=".2" stroke-width="3" stroke-linecap="round" d="M%d %dQ%d %d %d %d"/>'%(x0,y0,(x0+x1)/2+20,(y0+y1)/2,x1,y1))
    g.append('</g><path fill="none" stroke="#9b8f84" stroke-opacity=".6" stroke-width="2" d="%s"/></g>'%d['head'])
    g.append('''<g id="lighthouse">
<path fill="url(#lh)" d="M1266 196 L1277 46 H1295 L1306 196 Z"/>
<path fill="#8f847a" opacity=".3" d="M1268 172 H1304 L1306 196 H1266 Z"/>
<rect x="1271" y="40" width="30" height="7" rx="1.5" fill="url(#lh)"/>
<rect x="1278" y="24" width="16" height="17" fill="url(#lh)"/>
<rect x="1282" y="27" width="8" height="11" fill="#7f766e" opacity=".55"/>
<path fill="url(#lh)" d="M1276 25 Q1286 6 1296 25 Z"/>
<rect x="1285" y="6" width="2" height="7" fill="#cfc6bd"/>
<path fill="none" stroke="#8d8278" stroke-opacity=".6" stroke-width="1.6" d="M1266 196 L1277 46 H1295 L1306 196 M1271 47 H1301 M1278 24 V40 M1294 24 V40"/>
</g>''')
    g.append('<g id="reflection" opacity=".8">%s</g>'%rows(REFL,"#b9afa5","#e6e0d9"))
    g.append('<g id="water-back">%s</g>'%rows(BACK,"url(#wt)","#c3ccd5"))
    g.append('<g id="oysters">%s</g>'%oys)
    g.append('<path fill="url(#wl)" d="M100 930H1300V1010H100Z" clip-path="url(#cOpen)"/><path fill="url(#wl)" d="M100 930H1300V1010H100Z" clip-path="url(#cClosed)"/>')
    g.append('<g id="water-front">%s</g>'%rows(FRONT,"url(#wt)","#c9d2da"))
    vb=(-60,-600,1640,1780)
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="%d %d %d %d" width="%d" height="%d">
<title>Jurassic Seafarms mark</title>
<!-- All vector: crescent arc, headland, lighthouse, reflection, oysters and water, redrawn over the outlines of the original logo. -->
<defs>%s</defs>
%s
</svg>
'''%(*vb,vb[2]/2,vb[3]/2,defs,"\n".join(g))
for way in ("light-bg","dark-bg"):
    rng=np.random.default_rng(21)
    s=mark(way); open("jurassic-seafarms-mark-%s.svg"%way,"w").write(s); print(way,len(s)//1024,"KB")
