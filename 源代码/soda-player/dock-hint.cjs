const path=require('path');
class DockHint {
 constructor(BrowserWindow,scaleFor,onChange=()=>{},displayFor=()=>null){this.BrowserWindow=BrowserWindow;this.scaleFor=scaleFor;this.onChange=onChange;this.displayFor=displayFor;this.window=null;this.target=null;this.scale=null;}
 show(target){
  if(!target){this.target=null;this.window?.hide();this.onChange();return;}
  const scale=this.scaleFor(target.displayId);
  this.target=target;
  if(!this.window||this.window.isDestroyed()||this.scale!==scale){
   this.window?.destroy();this.scale=scale;
   const area=this.displayFor(target.displayId)?.workArea;
   const initial=area?{...target.bounds,x:area.x+50,y:area.y+50,height:80}:{...target.bounds,height:80};
   const window=this.window=new this.BrowserWindow({...initial,minWidth:1,minHeight:1,frame:false,thickFrame:false,transparent:true,alwaysOnTop:true,skipTaskbar:true,type:'toolbar',show:false,resizable:true,icon:path.join(__dirname,'icons','app.ico'),webPreferences:{sandbox:true}});
   window.setIgnoreMouseEvents(true);
   window.setAlwaysOnTop(true,'screen-saver',1);
   this.ready=false;
   const loaded=()=>{if(this.window===window){this.ready=true;if(this.target)this.raise();else if(this.prepared){this.position(this.prepared);this.onChange();}}};
   window.once('ready-to-show',loaded);window.webContents.once('did-finish-load',loaded);
   window.loadURL('data:text/html;charset=utf-8,'+encodeURIComponent('<html><body style="margin:0;height:100vh;display:flex;align-items:flex-end"><div id="hint" style="width:344px;flex:0 0 344px;margin-left:0;height:40px;box-sizing:border-box;border:1px dashed #ffffff66;border-radius:7px;background:linear-gradient(90deg,#b5bac080,#8d939c50,#30343c30);display:grid;place-items:center;color:#ffffffa8;font:600 10px Segoe UI">将播控移动到此处</div></body></html>'));
  }
  this.raise();
 }
 prepare(target){this.prepared=target;this.show(target);this.target=null;if(this.ready)this.window?.hide();}
 position(target){this.window.setBounds({...target.bounds,y:target.bounds.y+target.bounds.height-80,height:80});this.window.webContents.executeJavaScript?.(`document.getElementById('hint')?.style.setProperty('height',${JSON.stringify(target.bounds.height+'px')})`).catch(()=>{});}
 raise(){if(!this.ready||!this.target||!this.window||this.window.isDestroyed())return;this.position(this.target);this.window.setAlwaysOnTop(true,'screen-saver',1);this.window.showInactive();this.window.moveTop();this.onChange();}
 destroy(){this.target=null;this.window?.destroy();this.window=null;}
}
module.exports={DockHint};
