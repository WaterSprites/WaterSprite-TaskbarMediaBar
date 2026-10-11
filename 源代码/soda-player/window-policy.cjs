const APP_ID='WaterSprite.TaskbarMediaBar';
const APP_NAME='WaterSprite TaskbarMediaBar';
function protectWindow(window,{exe,appDirectory,packaged=true,platform=process.platform}={}){
 if(!window||window.isDestroyed())return;
 const apply=()=>{if(!window.isDestroyed())window.setSkipTaskbar(true)};
 if(platform==='win32'&&exe){
  window.setAppDetails({appId:APP_ID,appIconPath:exe,appIconIndex:0,
   relaunchCommand:packaged?`"${exe}"`:`"${exe}" "${appDirectory}"`,
   relaunchDisplayName:APP_NAME});
 }
 apply();
 // Electron's Windows skipTaskbar removes a tab once. Reapply after reveal
 // and focus, while type:toolbar supplies persistent WS_EX_TOOLWINDOW.
 for(const event of ['show','focus','restore'])window.on(event,apply);
 return apply;
}
module.exports={APP_ID,APP_NAME,protectWindow};
