const sharp=require("/Users/triadamitrou/Downloads/Website Chef/jurassicseafarms/node_modules/sharp");
(async()=>{for(const w of ["light-bg","dark-bg"]){
 const f=`jurassic-seafarms-mark-${w}`; const H=2400;
 await sharp(f+".svg",{density:72*H/890}).resize({height:H}).png({compressionLevel:9}).toFile(f+".png");
 const m=await sharp(f+".png").metadata(); console.log(f,m.width,m.height,m.hasAlpha);}
})();
