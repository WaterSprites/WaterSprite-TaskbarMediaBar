const {app,nativeImage}=require('electron');
const {trayImage}=require('./tray-image.cjs');
const fs=require('node:fs'),path=require('node:path');
app.whenReady().then(()=>{
 const image=trayImage(nativeImage,path.join(__dirname,'icons'),'tray-dark-small.png');
 fs.writeFileSync(path.join(__dirname,'tray-electron-decoded.png'),image.toPNG({scaleFactor:2}));
 fs.writeFileSync(path.join(__dirname,'tray-alpha-check.json'),JSON.stringify({size:image.getSize(),scales:image.getScaleFactors(),template:image.isTemplateImage()}));
 app.exit(0);
});
