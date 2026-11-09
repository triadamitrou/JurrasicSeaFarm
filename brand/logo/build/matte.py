from PIL import Image
import numpy as np, cv2
from scipy import ndimage as ndi
SRC="/Users/triadamitrou/Downloads/Website Chef/jurassicseafarms/brand/logo/source/jurassic-seafarms-logo-original.jpg"
CX,CY,R=203.09,223.62,87.45
X0,Y0,X1,Y1=108,196,314,354   # illustration box in source px
K=8
bgr=cv2.imread(SRC)
# gentle JPEG clean-up before upscaling
bgr=cv2.fastNlMeansDenoisingColored(bgr,None,3,3,5,15)
crop=bgr[Y0:Y1,X0:X1]
up=cv2.resize(crop,None,fx=K,fy=K,interpolation=cv2.INTER_LANCZOS4)
up=cv2.bilateralFilter(up,9,18,6)
blur=cv2.GaussianBlur(up,(0,0),3)
up=cv2.addWeighted(up,1.3,blur,-0.3,0)
up=np.clip(up,0,255).astype(np.float32)
H,W=up.shape[:2]
lum=up.max(2)
# erase the crescent arc (rebuilt as a vector)
yy,xx=np.mgrid[0:H,0:W]
sx=X0+(xx+0.5)/K-0.5; sy=Y0+(yy+0.5)/K-0.5
d=np.hypot(sx-CX,sy-CY)-R
ang=(np.degrees(np.arctan2(sy-CY,sx-CX))+360)%360
arcband=(np.abs(d)<3.4)&(ang>135)&(ang<225)
lum[arcband]=0; up[arcband]=0
# soft alpha from brightness over pure black
# alpha = brightness relative to the local peak, so edge pixels blended with black become partly transparent
M=cv2.dilate(lum,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(27,27)))
M=np.maximum(cv2.GaussianBlur(M,(0,0),5),60)
soft=np.clip((lum-8)/(M-8),0,1)
soft=np.clip(soft*1.08,0,1)
# solid body: oysters + headland, holes filled so shaded interiors stay opaque
body=(lum>28).astype(np.uint8)
body=cv2.morphologyEx(body,cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
# drop thin horizontal water ripples: keep only parts at least ~3 source px tall
body=cv2.morphologyEx(body,cv2.MORPH_OPEN,np.ones((25,3),np.uint8))
lab,n=ndi.label(body); sizes=ndi.sum(body,lab,range(1,n+1))
keep=np.zeros_like(body)
for i in np.where(sizes>20000)[0]:
    comp=(lab==i+1).astype(np.uint8)
    comp=cv2.morphologyEx(comp,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(15,15)))
    keep|=ndi.binary_fill_holes(comp).astype(np.uint8)
keep[(sy>240)&(sy<257)&(sx>200)]=0   # headland reflection stays soft, not solid
keep=cv2.erode(keep,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(19,19)))
solid=cv2.GaussianBlur(keep.astype(np.float32),(0,0),5)
alpha=np.maximum(soft,solid)
# un-premultiply against black so edges carry no dark halo
a3=np.maximum(alpha,1e-3)[...,None]
col=np.clip(up/a3,0,255)
# where the solid matte holds dark shading, keep original colour
col=np.where((solid>0.5)[...,None],up,col)
alpha[alpha<0.03]=0
# remove specks (JPEG noise, arc leftovers)
lab,n=ndi.label(alpha>0.05); sizes=ndi.sum(np.ones_like(alpha),lab,range(1,n+1))
big=np.isin(lab,1+np.where(sizes>=600)[0])
big=cv2.dilate(big.astype(np.uint8),np.ones((7,7),np.uint8)).astype(bool)
alpha[~big]=0
rgba=np.dstack([col[...,::-1],alpha*255]).astype(np.uint8)
# trim
ys,xs=np.where(alpha>0)
y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
Image.fromarray(rgba[y0:y1,x0:x1]).save("illustration.png",optimize=True)
print("illustration px",x1-x0,y1-y0,"placed at source",X0+x0/K,Y0+y0/K,"size",(x1-x0)/K,(y1-y0)/K)
# preview on white and navy
im=Image.fromarray(rgba[y0:y1,x0:x1])
for name,c in (("w",(255,255,255)),("n",(10,31,51)),("k",(0,0,0))):
    bg=Image.new("RGBA",im.size,c+(255,)); bg.alpha_composite(im); bg.convert("RGB").resize((im.width//2,im.height//2)).save("prev_%s.png"%name)
