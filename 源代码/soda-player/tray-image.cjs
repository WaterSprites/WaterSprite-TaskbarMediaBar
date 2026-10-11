const path=require('node:path');
function trayImage(nativeImage,folder,name){
 if(name.endsWith('.ico'))return nativeImage.createFromPath(path.join(folder,name));
 const image=nativeImage.createFromPath(path.join(folder,name));
 const base=name.replace(/\.png$/,'');
 for(const scaleFactor of [1.25,1.5,2,2.5,3,4]){
  const representation=nativeImage.createFromPath(path.join(folder,`${base}@${scaleFactor}x.png`));
  if(!representation.isEmpty())image.addRepresentation({scaleFactor,buffer:representation.toPNG()});
 }
 return image;
}
module.exports={trayImage};
