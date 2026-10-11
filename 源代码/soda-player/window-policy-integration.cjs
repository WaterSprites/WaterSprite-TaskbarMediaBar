const {app,BrowserWindow}=require('electron');
const {protectWindow}=require('./window-policy.cjs');
const {spawnSync}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
app.setName('WaterSprite Window Policy Test');
app.setPath('userData',path.join(__dirname,'window-policy-test-cache'));
function flags(window){
 const handle=window.getNativeWindowHandle().readBigUInt64LE().toString();
 const script=`Add-Type 'using System;using System.Runtime.InteropServices;public class StyleProbe{[DllImport("user32.dll",EntryPoint="GetWindowLongPtrW")]public static extern IntPtr Read(IntPtr h,int i);}'\n[StyleProbe]::Read([IntPtr]([long]${handle}),-20).ToInt64()`;
 const r=spawnSync('powershell.exe',['-NoProfile','-Command',script],{encoding:'utf8',windowsHide:true});
 if(r.status!==0)throw Error(r.stderr);return Number(r.stdout.trim());
}
app.whenReady().then(async()=>{
 const windows=[];const checks=[];
 try{
  for(const kind of ['player','menu','hint']){
   const w=new BrowserWindow({width:180,height:40,show:false,frame:false,transparent:true,skipTaskbar:true,type:'toolbar'});windows.push(w);
   protectWindow(w,{exe:app.getPath('exe'),appDirectory:__dirname,packaged:false});
   if(kind==='menu')w.setParentWindow(windows[0]);
   for(let i=0;i<3;i++){w.showInactive();w.setAlwaysOnTop(true,'screen-saver');await new Promise(r=>setTimeout(r,50));const style=flags(w);assert.ok(style&0x80,`${kind}: missing TOOLWINDOW`);assert.equal(style&0x40000,0,`${kind}: APPWINDOW set`);checks.push({kind,cycle:i,style});w.hide();}
  }
  const old=windows[0];old.destroy();const replacement=new BrowserWindow({show:false,skipTaskbar:true,type:'toolbar'});windows.push(replacement);protectWindow(replacement,{exe:app.getPath('exe'),appDirectory:__dirname,packaged:false});replacement.showInactive();assert.ok(flags(replacement)&0x80);
  fs.writeFileSync(path.join(__dirname,'window-policy-integration-result.json'),JSON.stringify({passed:true,checks,recreated:true},null,2));
 }catch(error){fs.writeFileSync(path.join(__dirname,'window-policy-integration-result.json'),JSON.stringify({passed:false,error:error.stack}));process.exitCode=1;}
 finally{for(const w of windows)if(!w.isDestroyed())w.destroy();app.exit(process.exitCode||0)}
});
