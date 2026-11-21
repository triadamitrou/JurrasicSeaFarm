import numpy as np, math
rng=np.random.default_rng(7)
def P(v): return ("%.1f"%v).rstrip("0").rstrip(".")
def cr_closed(p):
    n=len(p); s="M%s %s"%(P(p[0][0]),P(p[0][1]))
    for i in range(n):
        p0,p1,p2,p3=p[i-1],p[i],p[(i+1)%n],p[(i+2)%n]
        c1=p1+(p2-p0)/6; c2=p2-(p3-p1)/6
        s+="C%s %s %s %s %s %s"%(P(c1[0]),P(c1[1]),P(c2[0]),P(c2[1]),P(p2[0]),P(p2[1]))
    return s+"Z"
def cr_open(p):
    s="M%s %s"%(P(p[0][0]),P(p[0][1]))
    for i in range(len(p)-1):
        p0=p[max(i-1,0)];p1=p[i];p2=p[i+1];p3=p[min(i+2,len(p)-1)]
        c1=p1+(p2-p0)/6; c2=p2-(p3-p1)/6
        s+="C%s %s %s %s %s %s"%(P(c1[0]),P(c1[1]),P(c2[0]),P(c2[1]),P(p2[0]),P(p2[1]))
    return s
def resample(ctrl,n=240):
    """closed Catmull-Rom spline through control points, sampled to n points"""
    c=np.asarray(ctrl,float); m=len(c); out=[]
    for i in range(m):
        p0,p1,p2,p3=c[i-1],c[i],c[(i+1)%m],c[(i+2)%m]
        k=max(2,int(n*np.linalg.norm(p2-p1)/sum(np.linalg.norm(c[(j+1)%m]-c[j]) for j in range(m))))
        for t in np.linspace(0,1,k,endpoint=False):
            t2,t3=t*t,t*t*t
            out.append(0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3))
    return np.array(out)
def normals(p):
    d=np.roll(p,-1,0)-np.roll(p,1,0); nrm=np.c_[d[:,1],-d[:,0]]
    return nrm/np.linalg.norm(nrm,axis=1)[:,None]
def frill(p,amp,freq,seed,phase=0):
    """irregular, natural edge: 1/f mix of random-phase harmonics around the base frequency"""
    r=np.random.default_rng(seed); n=len(p); t=np.linspace(0,2*np.pi,n,endpoint=False)
    w=np.zeros(n)
    for f in range(3,int(freq*2.2)):
        a=(f/freq)**-0.6 if f<freq else (f/freq)**-1.5
        w+=a*r.uniform(0.3,1.0)*np.sin(f*t+r.uniform(0,6.3))
    w=w/np.abs(w).max()
    return p+normals(p)*(amp*w)[:,None]
def scale_to(p,c,s): return c+(p-c)*s
def blob(cx,cy,a,b,rot,n=200,amp=0,freq=9,seed=1):
    t=np.linspace(0,2*np.pi,n,endpoint=False); r=math.radians(rot)
    x=a*np.cos(t); y=b*np.sin(t)
    p=np.c_[cx+x*math.cos(r)-y*math.sin(r), cy+x*math.sin(r)+y*math.cos(r)]
    return frill(p,amp,freq,seed) if amp else p

CLOSED=[(500,352),(600,348),(680,372),(745,405),(795,460),(800,520),(720,600),(620,720),(540,860),(470,935),(380,950),(290,945),(210,925),(160,880),(140,800),(145,720),(185,640),(250,560),(320,480),(400,405)]
OPEN=[(830,470),(905,452),(1010,460),(1100,492),(1175,535),(1238,595),(1272,665),(1262,735),(1215,795),(1150,850),(1060,905),(950,950),(830,982),(700,998),(585,996),(495,975),(445,935),(440,870),(470,790),(525,700),(600,615),(690,545),(765,495)]
HC=np.array((790,445.0))   # closed oyster hinge (growth rings shrink toward it)
HO=np.array((455,930.0))   # open oyster hinge
def build():
    defs=[]; g=[]
    # ---------- closed oyster
    cp=frill(resample(CLOSED,320),10,26,3)
    defs.append('<clipPath id="cClosed"><path d="%s"/></clipPath>'%cr_closed(cp))
    defs.append('''<radialGradient id="gClosed" cx="300" cy="700" r="560" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#e2dbd0"/><stop offset=".45" stop-color="#b9b0a4"/><stop offset=".8" stop-color="#7f786f"/><stop offset="1" stop-color="#55524e"/></radialGradient>
<linearGradient id="gClosedShade" x1="250" y1="600" x2="760" y2="560" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2e2d2b" stop-opacity="0"/><stop offset=".7" stop-color="#2e2d2b" stop-opacity=".10"/><stop offset="1" stop-color="#2e2d2b" stop-opacity=".32"/></linearGradient>''')
    g.append('<path fill="url(#gClosed)" d="%s"/>'%cr_closed(cp))
    g.append('<g clip-path="url(#cClosed)">')
    # lamellae: nested frilly growth layers shrinking toward the hinge
    sc=np.cumsum(rng.uniform(0.05,0.1,11)); sc=1-sc/sc[-1]*0.8+0.0
    for i,s in enumerate(sc[:-1]*0.94+0.04):
        q=frill(scale_to(resample(CLOSED,320),HC,s),6+9*s,26,20+i)
        g.append('<path fill="#2a2826" fill-opacity=".16" d="%s"/>'%cr_closed(q+np.array([-5,6])))
        lift=0.10+0.05*(i%2)
        g.append('<path fill="#f3eee6" fill-opacity="%.2f" d="%s"/>'%(lift*(0.6+s*0.5),cr_closed(q)))
        g.append('<path fill="none" stroke="#3b3835" stroke-opacity="%.2f" stroke-width="%.1f" d="%s"/>'%(0.30+0.25*s,1.2+1.4*s,cr_closed(q)))
        hi=q+np.array([3,-3.5])
        g.append('<path fill="none" stroke="#fbf8f2" stroke-opacity=".38" stroke-width="1.2" d="%s"/>'%cr_closed(hi))
    g.append('<path fill="url(#gClosedShade)" d="M0 300H900V1000H0Z"/>')
    g.append('</g>')
    g.append('<path fill="none" stroke="#3a3836" stroke-opacity=".75" stroke-width="2.4" d="%s"/>'%cr_closed(cp))
    # ---------- open oyster
    op=frill(resample(OPEN,360),9,30,11)
    defs.append('<clipPath id="cOpen"><path d="%s"/></clipPath>'%cr_closed(op))
    defs.append('''<radialGradient id="gRim" cx="870" cy="720" r="460" gradientUnits="userSpaceOnUse">
<stop offset=".45" stop-color="#cfd0cf"/><stop offset=".75" stop-color="#f2f0ec"/><stop offset=".92" stop-color="#d9d6d0"/><stop offset="1" stop-color="#9c978f"/></radialGradient>
<radialGradient id="gCup" cx="830" cy="700" r="330" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#9da2a6"/><stop offset=".7" stop-color="#6b6e70"/><stop offset="1" stop-color="#3b3d3f"/></radialGradient>
<radialGradient id="gMantle" cx="800" cy="700" r="280" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#d9d3c9"/><stop offset=".75" stop-color="#b4ada3"/><stop offset="1" stop-color="#7d776f"/></radialGradient>
<radialGradient id="gMeat" cx="760" cy="700" r="230" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#f4ebdd"/><stop offset=".6" stop-color="#e3d5c1"/><stop offset="1" stop-color="#c2b199"/></radialGradient>
<radialGradient id="gMuscle" cx="905" cy="672" r="70" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#e6ded2"/><stop offset=".7" stop-color="#c9beaf"/><stop offset="1" stop-color="#a39684"/></radialGradient>
<linearGradient id="gHingeShade" x1="440" y1="900" x2="760" y2="760" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3a3836" stop-opacity=".38"/><stop offset="1" stop-color="#3a3836" stop-opacity="0"/></linearGradient>''')
    # shadow cast on the closed oyster
    sh=op+np.array([-16,6])
    g.append('<g clip-path="url(#cClosed)"><path fill="#1f1e1d" fill-opacity=".35" d="%s"/></g>'%cr_closed(sh))
    g.append('<path fill="url(#gRim)" d="%s"/>'%cr_closed(op))
    g.append('<g clip-path="url(#cOpen)">')
    # rim growth lines
    for i,s in enumerate(np.sort(rng.uniform(0.70,0.985,14))[::-1]):
        q=frill(scale_to(resample(OPEN,360),HO,s),4+6*(1-s),30,40+i)
        g.append('<path fill="none" stroke="#7b766f" stroke-opacity="%.2f" stroke-width="1.3" d="%s"/>'%(0.22+0.2*(1-s)*4,cr_closed(q)))
        g.append('<path fill="none" stroke="#ffffff" stroke-opacity=".45" stroke-width="1.1" d="%s"/>'%cr_closed(q+np.array([2,-2.5])))
    g.append('<path fill="url(#gHingeShade)" d="M400 600H900V1010H400Z"/>')
    # inner cup (dark frilly mantle edge)
    cup=blob(835,712,298,162,-11,260,8,22,5)
    g.append('<path fill="url(#gCup)" d="%s"/>'%cr_closed(cup))
    g.append('<path fill="none" stroke="#2b2c2d" stroke-opacity=".7" stroke-width="2" d="%s"/>'%cr_closed(cup))
    for i,s in enumerate((0.96,0.92,0.885)):
        q=blob(835,712,298*s,162*s,-11,260,6,24,60+i)
        g.append('<path fill="none" stroke="#1f2021" stroke-opacity=".45" stroke-width="1.6" d="%s"/>'%cr_closed(q))
        g.append('<path fill="none" stroke="#c9ccce" stroke-opacity=".35" stroke-width="1" d="%s"/>'%cr_closed(q+np.array([1.5,-2])))
    mant=blob(820,716,262,138,-10,240,5,22,8)
    g.append('<path fill="url(#gMantle)" d="%s"/>'%cr_closed(mant))
    g.append('<path fill="none" stroke="#5d574f" stroke-opacity=".6" stroke-width="1.6" d="%s"/>'%cr_closed(mant))
    # the oyster itself
    meat=blob(790,735,205,104,-9,220,4,7,9)
    g.append('<path fill="url(#gMeat)" d="%s"/>'%cr_closed(meat))
    for i,s in enumerate((0.9,0.78,0.66)):
        q=blob(780+8*i,748+6*i,205*s,104*s*0.92,-9,220,3,7+i,90+i)
        g.append('<path fill="none" stroke="#9d8c74" stroke-opacity="%.2f" stroke-width="1.4" d="%s"/>'%(0.35-0.07*i,cr_open(q[110:205])))
    g.append('<path fill="none" stroke="#8a7a65" stroke-opacity=".75" stroke-width="1.8" d="%s"/>'%cr_closed(meat))
    # adductor muscle
    mus=blob(908,676,62,47,-15,120,2.2,6,12)
    g.append('<path fill="url(#gMuscle)" d="%s"/>'%cr_closed(mus))
    g.append('<path fill="none" stroke="#7c6f60" stroke-opacity=".75" stroke-width="1.6" d="%s"/>'%cr_closed(mus))
    g.append('<path fill="none" stroke="#fffaf2" stroke-opacity=".6" stroke-width="1.4" d="%s"/>'%cr_open(blob(902,670,44,32,-15,120)[60:110]))
    # highlights on meat
    g.append('<path fill="#fffaf1" fill-opacity=".55" d="%s"/>'%cr_closed(blob(735,705,95,26,-12,120)))
    g.append('</g>')
    g.append('<path fill="none" stroke="#4a4744" stroke-opacity=".7" stroke-width="2.4" d="%s"/>'%cr_closed(op))
    return "\n".join(defs),"\n".join(g)
if __name__=="__main__":
    d,g=build()
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 300 1527 760" width="1527" height="760"><defs>%s</defs>%s</svg>'%(d,g)
    open("oys_test.svg","w").write(s)
