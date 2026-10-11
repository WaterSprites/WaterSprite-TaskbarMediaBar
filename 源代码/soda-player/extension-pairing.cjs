const fs=require('node:fs'),path=require('node:path');
function pairExtension(folder,token){
 try{
  if(!fs.statSync(folder).isDirectory()||fs.lstatSync(folder).isSymbolicLink())return false;
  const manifestPath=path.join(folder,'manifest.json');if(fs.lstatSync(manifestPath).isSymbolicLink())return false;
  const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
  if(manifest.manifest_version!==3||!/WaterSprite\s+TaskbarMediaBar|Taskbar Media Player/i.test(manifest.name||''))return false;
  const file=path.join(folder,'auth.js');if(fs.existsSync(file)&&fs.lstatSync(file).isSymbolicLink())return false;
  const data='globalThis.taskbarMediaToken='+JSON.stringify(token)+';\n';
  if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==data)fs.writeFileSync(file,data);
  return true;
 }catch{return false}
}
module.exports={pairExtension};
