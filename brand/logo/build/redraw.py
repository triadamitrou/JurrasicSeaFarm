import numpy as np, cv2, json
from scipy import ndimage as ndi
from PIL import Image
im=np.asarray(Image.open("illustration.png")).astype(np.float32)
RGB=im[...,:3]; A=im[...,3]/255; H,W=A.shape
LUM=RGB@np.array([.299,.587,.114])
yy,xx=np.mgrid[0:H,0:W]
def P(v): return ("%.1f"%v).rstrip("0").rstrip(".")
def smooth_path(c):
    p=c[:,0,:].astype(float); n=len(p)
    if n<3: return ""
    s="M%s %s"%(P(p[0][0]),P(p[0][1]))
    for i in range(n):
        p0,p1,p2,p3=p[i-1],p[i],p[(i+1)%n],p[(i+2)%n]
        c1=p1+(p2-p0)/6; c2=p2-(p3-p1)/6
        s+="C%s %s %s %s %s %s"%(P(c1[0]),P(c1[1]),P(c2[0]),P(c2[1]),P(p2[0]),P(p2[1]))
    return s+"Z"
def m2p(m,minarea=30,eps=1.0,open_=False):
    m=np.ascontiguousarray(m.astype(np.uint8))
    cnts,_=cv2.findContours(m,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE)
    out=[]
    for c in cnts:
        if abs(cv2.contourArea(c))<minarea: continue
        out.append(smooth_path(cv2.approxPolyDP(c,eps,True)))
    return "".join(out)
def soft(m,s): return cv2.GaussianBlur(m.astype(np.float32),(0,0),s)>0.5
def hexc(c): c=np.clip(np.asarray(c),0,255).round().astype(int); return "#%02x%02x%02x"%tuple(c)
sil=cv2.GaussianBlur(A,(0,0),2.5)>0.45
lab,n=ndi.label(sil); sz=ndi.sum(sil,lab,range(1,n+1)); order=np.argsort(-sz)
oy_comp=lab==order[0]+1; hd_comp=lab==order[1]+1
# ---------- headland / reflection split
cut=np.full(W,H)
for x in range(W):
    col=hd_comp[:,x]
    if not col.any(): continue
    if x<880: cut[x]=H; continue
    seg=LUM[230:330,x]*hd_comp[230:330,x]
    cut[x]=230+int(np.argmin(seg+np.where(hd_comp[230:330,x],0,999)))
cs=ndi.median_filter(cut.astype(float),31); cs=ndi.uniform_filter1d(cs,41)
head=hd_comp&(yy<cs[None,:])
head=ndi.binary_fill_holes(head); refl=hd_comp&~head&(yy>200)
LH=dict(x0=1255,x1=1320,y1=192)   # lighthouse box; removed from the headland trace
headbody=head&~((xx>900)&(yy>282)); headbody[:LH['y1']-12,LH['x0']:LH['x1']]=False
headbody=cv2.morphologyEx(headbody.astype(np.uint8),cv2.MORPH_OPEN,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(19,19)))
lh_,nh_=ndi.label(headbody); headbody=lh_==(np.argmax(ndi.sum(headbody,lh_,range(1,nh_+1)))+1)
headbody[:LH['y1']-12,LH['x0']:LH['x1']]|=False
headbody=soft(headbody,6)
# ---------- oysters vs water
body=cv2.morphologyEx(oy_comp.astype(np.uint8),cv2.MORPH_OPEN,np.ones((31,3),np.uint8))
l2,n2=ndi.label(body); s2=ndi.sum(body,l2,range(1,n2+1)); body=l2==(np.argmax(s2)+1)
body=cv2.morphologyEx(body.astype(np.uint8),cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(21,21)))
oys=soft(ndi.binary_fill_holes(body),4)
water=(A>0.35)&~cv2.dilate(oys.astype(np.uint8),np.ones((5,5),np.uint8)).astype(bool)&~hd_comp
out={}
np.save('m_oys.npy',oys); np.save('m_water.npy',water); np.save('m_head.npy',headbody)
# ---------- headland paths
out['head']=m2p(headbody,200,1.6)
# ridge streaks: darker diagonal hints inside headland
hb=cv2.GaussianBlur(LUM,(0,0),3); hbig=cv2.GaussianBlur(LUM,(0,0),14)
ridge=(hbig-hb>6)&cv2.erode(headbody.astype(np.uint8),np.ones((15,15),np.uint8)).astype(bool)
out['head_shade']=m2p(soft(ridge,3),400,1.2)
out['head_base']=m2p(soft(headbody&(yy>cs[None,:]-34)&(LUM<205),4),300,1.2)
# ---------- reflection & water as horizontal tapered strokes
def streaks(m,sx=7,sy=1.6,th=0.42):
    f=cv2.GaussianBlur(m.astype(np.float32),(0,0),sigmaX=sx,sigmaY=sy)
    return m2p(f>th,120,1.0)
out['refl']=streaks(refl&(LUM>70))
out['water']=streaks(water&(LUM>40),8,1.4,0.45)
# highlights on water: brighter core
out['water_hi']=streaks(water&(LUM>150),9,1.0,0.5)
# ---------- oysters: colour regions then tone bands
Ls=cv2.GaussianBlur(LUM,(0,0),4.5)
labc=cv2.cvtColor((cv2.GaussianBlur(RGB,(0,0),6)/255).astype(np.float32),cv2.COLOR_RGB2Lab)
warm=(labc[...,2]-labc[...,1]*0.3)
cool=labc[...,2]<-1.5
meat=soft(oys&(warm>9)&(Ls>150),7)
lm,nm=ndi.label(meat); 
if nm: meat=lm==(np.argmax(ndi.sum(meat,lm,range(1,nm+1)))+1)
meat=ndi.binary_fill_holes(meat)
wet=soft(oys&cool&(yy>800)&~meat,6)
regions=[("shell",oys,14),("wet",wet,7),("meat",meat,9)]
out['bands']=[]
for name,reg,N in regions:
    vals=Ls[reg]
    if vals.size==0: continue
    lv=np.percentile(vals,np.linspace(4,97,N+1))
    for i in range(N):
        m=reg&(Ls>=lv[i]) if i else reg
        if i: m=soft(m,1.5)&reg
        band=reg&(Ls>=lv[i])&(Ls<lv[i+1]+1e9 if i==N-1 else Ls<lv[i+1])
        c=np.median(RGB[band&(A>0.9)],0) if (band&(A>0.9)).sum()>50 else np.median(RGB[band],0)
        out['bands'].append((name,hexc(c),m2p(m,40,0.9)))
# engraved contour lines from a finer field
Lf=cv2.GaussianBlur(LUM,(0,0),2.2)
inner=cv2.erode(oys.astype(np.uint8),np.ones((7,7),np.uint8)).astype(bool)
lines=[]
for t in np.linspace(70,215,14):
    m=soft(Lf>t,1.0)
    cnts,_=cv2.findContours(m.astype(np.uint8),cv2.RETR_LIST,cv2.CHAIN_APPROX_NONE)
    for c in cnts:
        if len(c)<40: continue
        c=cv2.approxPolyDP(c,0.9,True); p=c[:,0,:]
        keep=inner[p[:,1].clip(0,H-1),p[:,0].clip(0,W-1)]
        # split into open runs inside the oysters
        run=[]
        for q,k in zip(p,keep):
            if k: run.append(q)
            elif len(run)>6: lines.append(np.array(run)); run=[]
            else: run=[]
        if len(run)>6: lines.append(np.array(run))
def open_path(p):
    p=p.astype(float); s="M%s %s"%(P(p[0][0]),P(p[0][1]))
    for i in range(len(p)-1):
        p0=p[max(i-1,0)];p1=p[i];p2=p[i+1];p3=p[min(i+2,len(p)-1)]
        c1=p1+(p2-p0)/6; c2=p2-(p3-p1)/6
        s+="C%s %s %s %s %s %s"%(P(c1[0]),P(c1[1]),P(c2[0]),P(c2[1]),P(p2[0]),P(p2[1]))
    return s
out['lines']="".join(open_path(l) for l in lines)
out['oys']=m2p(oys,200,1.2)
out['meat']=m2p(meat,200,1.2)
json.dump(out,open("redraw.json","w"))
print({k:(len(v) if isinstance(v,str) else len(v)) for k,v in out.items()})
