const sharp=require("/Users/triadamitrou/Downloads/Website Chef/jurassicseafarms/node_modules/sharp");
const fs=require("fs");
(async()=>{
 for (const way of ["light-bg","dark-bg"]){
  const svg=fs.readFileSync(`jurassic-seafarms-logo-${way}.svg`);
  const H=+process.argv[2]||2400, svgH=401;
  await sharp(svg,{density:72*H/svgH}).resize({height:H}).png({compressionLevel:9}).toFile(`jurassic-seafarms-logo-${way}${process.argv[3]||""}.png`);
  const m=await sharp(`jurassic-seafarms-logo-${way}${process.argv[3]||""}.png`).metadata(); console.log(way,m.width,m.height,m.hasAlpha);
 }
})();
