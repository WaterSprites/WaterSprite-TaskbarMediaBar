const {app,BrowserWindow,ipcMain,Tray,nativeImage,screen,dialog,nativeTheme,powerMonitor,shell:electronShell}=require('electron');
const {spawn}=require('child_process');
const fs=require('fs'),path=require('path'),readline=require('readline');
const {iconNames}=require('./icon-theme.cjs');
const {makeTargets,chooseTarget}=require('./dock.cjs');
const {DockHint}=require('./dock-hint.cjs');
const {webLabels}=require('./web-labels.cjs');
const {webState}=require('./web-state.cjs');
const {sourceName,sessionEntries,excludedSource}=require('./source-names.cjs');
const mpc=require('./mpc-adapter.cjs');
const {windowTrack}=require('./legacy-media.cjs');
const {LegacyState}=require('./legacy-state.cjs');
const {MediaState,emptyMedia}=require('./media-state.cjs');
const mediaState=new MediaState();
const {SourceRouter}=require('./source-router.cjs');
const sourceRouter=new SourceRouter();let followSource='',followAt=0;
const {displayOptions}=require('./display-options.cjs');
const {SoftMenu}=require('./soft-menu.cjs');let softMenu;
const {supervise}=require('./bridge-supervisor.cjs');
const {BrowserMedia}=require('./browser-media.cjs');let browserMedia;
const desktopClient=require('./desktop-client.cjs');let desktopStates=[],desktopAt=0,desktopTimer,desktopBusy=false,desktopTarget=null;
const {DouyuRoom}=require('./douyu-room.cjs');const douyuRoom=new DouyuRoom();let douyuState=null,douyuAt=0,douyuTimer,douyuBusy=false;
const {YYRoom}=require('./yy-room.cjs');const yyRoom=new YYRoom();let yyState=null,yyAt=0,yyTimer,yyBusy=false;
const neteaseClient=require('./netease-client.cjs');let neteaseState=null,neteaseAt=0,neteaseTimer,neteaseBusy=false;
const legacyState=new LegacyState();let legacy,rawMedia;
const {Worker}=require('node:worker_threads');
let cacheWorker,cacheRequestId=0;const cacheRequests=new Map();
function readCache(state){return new Promise(resolve=>{if(!cacheWorker){resolve({lyrics:'',cover:''});return}const id=++cacheRequestId;cacheRequests.set(id,resolve);cacheWorker.postMessage({id,state:{source:state.source,sourceName:state.sourceName,title:state.title,artist:state.artist,album:state.album,filepath:state.filepath,duration:state.duration,neteaseSongId:state.neteaseSongId,kuwoCoverCache:path.join(cacheConfig.folders.data,'酷我封面'),mediaRoots:[app.getPath('music'),app.getPath('downloads')]}})})}
let cacheKey='',cacheResult={},cachePending=false,cacheAt=0,cacheChangedAt=0;
let mpcState={},mpcBusy=false,mpcFile='',mpcCover='',mpcTimer;
app.setName('WaterSprite TaskbarMediaBar');
app.setAppUserModelId('WaterSprite.TaskbarMediaBar');
const {protectWindow}=require('./window-policy.cjs');
const {trayImage}=require('./tray-image.cjs');
app.on('browser-window-created',(_,window)=>setImmediate(()=>protectWindow(window,{exe:app.getPath('exe'),appDirectory:__dirname,packaged:app.isPackaged})));
const hintPool=new Map();
const HEIGHT=40;
function width(){return 344}
let win,media,shell,tray,hint,lastState={},shellState={},taskbars=[],dock=null,dockUnavailable=false,freeBounds,drag=null,dragTimer,manualHidden=false,suppressed=false,menuOpen=false,dialogOpen=false,pending=null,theme,trayIconName;
const smoke=process.argv.includes('--menu-regression-test')||process.argv.includes('--smoke-test')||process.argv.includes('--menu-layout-test');
let appleCoverTestPending=smoke&&process.argv.includes('--apple-cover-test');
const uiTest=process.argv.includes('--ui-test');
const managed=process.argv.includes('--windhawk-managed');
// Configure every writable runtime path before Electron creates browser sessions.
const {configureCache,ensureWritable,planCacheMigration}=require('./cache-paths.cjs');
const previousData=path.join(app.getPath('appData'),'WaterSprite TaskbarMediaBar');
const legacyData=path.join(app.getPath('appData'),'任务栏播放器 - Taskbar Media Player 柔雾黑丝');
const installBase=app.isPackaged?path.dirname(path.dirname(app.getPath('exe'))):path.join(__dirname,'开发运行');
const testBase=path.join(app.getPath('appData'),'WaterSprites-TaskbarMediaPlayer-Test');
const cacheConfig=configureCache(app,{base:(smoke||uiTest)?testBase:installBase,defaultCacheFolder:app.isPackaged&&!smoke&&!uiTest?path.join(path.dirname(app.getPath('exe')),'缓存'):undefined,configFolder:(smoke||uiTest)?path.join(testBase,'设置'):undefined,test:smoke||uiTest,legacy:(smoke||uiTest)?[]:[previousData,legacyData]});
const data=cacheConfig.folders.data;
let initialPlacementPending=true,rendererReady=false;
let rendererHeightPhysical=0;
ipcMain.on('viewport-metrics',(event,value)=>{if(!win||win.isDestroyed()||event.sender!==win.webContents)return;const pixels=Number(value?.height)*Number(value?.ratio);if(!Number.isFinite(pixels)||pixels<1||pixels>2000)return;rendererHeightPhysical=Math.round(pixels);shellControl()});
let windowScale,dockHeight=HEIGHT,lastDockGeometry='',lastShellAt=Date.now(),wakeTimer,watchdog,lastBridgeRefresh=0,lastIdleSeconds=0;const rendererErrors=[];
const commandFile=path.join(data,'media-command.json'),shellFile=path.join(data,'shell-control.json'),settingsFile=cacheConfig.settingsFile;
let settings=cacheConfig.settings;
function send(value){if(win&&!win.isDestroyed())win.webContents.send('state',value)}
function save(){if(!smoke&&!uiTest&&win)fs.writeFileSync(settingsFile,JSON.stringify({...settings,dock,bounds:freeBounds||win.getBounds()}))}
function recordRecovery(event,details={}){try{const file=path.join(cacheConfig.folders.logs,'常驻恢复.log');if(fs.existsSync(file)&&fs.statSync(file).size>262144)fs.renameSync(file,file+'.previous');fs.appendFileSync(file,JSON.stringify({at:new Date().toISOString(),event,...details})+'\n');}catch{}}
function recoverPlayer(reason,reconnect=false){
 if(app.isQuitting)return;recordRecovery(reason,{manualHidden});
 if(reconnect&&Date.now()-lastBridgeRefresh>1000){lastBridgeRefresh=Date.now();media?.restart();legacy?.restart();shell?.restart();lastShellAt=Date.now();}
 if(drag)return;suppressed=false;
 if(!win||win.isDestroyed()){const area=screen.getPrimaryDisplay().workArea;createPlayerWindow({x:area.x+50,y:area.y+50,width:width(),height:HEIGHT});}
 const target=stableDockTarget(dock&&targets().find(t=>t.displayId===dock.displayId&&t.side===dock.side));
 if(target)applyDock(target);else if(dock){recordRecovery('dock-target-temporarily-unavailable',{dock});shellControl();}else if(!initialPlacementPending){dock=null;const b=win.getBounds(),display=screen.getDisplayMatching(b),a=display.workArea;const bounds={x:Math.max(a.x,Math.min(b.x,a.x+a.width-width())),y:Math.max(a.y,Math.min(b.y,a.y+a.height-HEIGHT)),width:width(),height:HEIGHT};movePlayer(bounds,display);send({docked:false});}
 updateTheme();restore();
}
function scheduleRecovery(reason,reconnect=false){recoverPlayer(reason,reconnect);clearTimeout(wakeTimer);wakeTimer=setTimeout(()=>recoverPlayer(reason+'-settled'),2500);}
function stableDockTarget(target){const previous=lastDockTarget;if(!target||!previous||target.displayId!==previous.displayId||target.side!==previous.side||!target.bar?.physical||!previous.bar?.physical)return target;const display=screen.getAllDisplays().find(d=>d.id===target.displayId);if(display?.scaleFactor===windowScale&&JSON.stringify(target.bar.physical)===JSON.stringify(previous.bar.physical))return {...target,bounds:previous.bounds};return target;}
function nativeDockRect(t){const p=t.bar.physical,b=t.bar,r=t.bounds;return p?{x:Math.round(p.x+(r.x-b.x)*p.width/b.width),y:Math.round(p.y+(r.y-b.y)*p.height/b.height),width:Math.round(r.width*p.width/b.width),height:Math.round(r.height*p.height/b.height)}:null}
let lastShellControl='',lastDockTarget=null,missingDockSince=0,missingDisplaySince=0,pendingDockGeometry='',pendingDockSince=0;
function shellControl(){if(win&&!win.isDestroyed()&&!app.isQuitting){const target=stableDockTarget(dock&&(shellState.startOpen?lastDockTarget:(targets().find(t=>t.side===dock.side&&t.displayId===dock.displayId)||lastDockTarget)));const control=JSON.stringify({menuHandles:softMenu?.handles()||[],menuWindows:softMenu?.styleWindows()||[],menuRaiseHandles:softMenu?.raiseHandles()||[],handle:win.getNativeWindowHandle().readBigUInt64LE().toString(),rendererHeight:rendererHeightPhysical,raise:!!dock&&!suppressed&&!manualHidden&&!menuOpen&&!dialogOpen&&!drag,rect:target?nativeDockRect(target):null,nativeHints:targets().filter(t=>hintPool.get(t.displayId)?.ready&&!hintPool.get(t.displayId).window.isDestroyed()).map(t=>({displayId:t.displayId,side:t.side,handle:hintPool.get(t.displayId).window.getNativeWindowHandle().readBigUInt64LE().toString(),rect:nativeDockRect(t),bar:t.bar.physical,scale:screen.getAllDisplays().find(d=>d.id===t.displayId)?.scaleFactor||1})),hint:drag&&hint?.target&&hint.window&&!hint.window.isDestroyed()?{handle:hint.window.getNativeWindowHandle().readBigUInt64LE().toString(),rect:nativeDockRect(hint.target)}:null});if(control!==lastShellControl){fs.writeFileSync(shellFile,control);lastShellControl=control}}}
function restore(){if(win&&!win.isDestroyed())win.setSkipTaskbar(true);if(app.isQuitting||!win||win.isDestroyed()||!rendererReady||initialPlacementPending||manualHidden||suppressed)return;if(menuOpen||dialogOpen){shellControl();return;}if(!win.isVisible()){win.showInactive();win.setAlwaysOnTop(true,'screen-saver');win.moveTop()}shellControl()}
function updateTheme(){
 if(nativeTheme.themeSource!==settings.themeMode)nativeTheme.themeSource=settings.themeMode;
 theme=settings.themeMode==='system'?(nativeTheme.shouldUseDarkColorsForSystemIntegratedUI?'dark':'light'):settings.themeMode;
 send({theme});softMenu?.setTheme(theme);
 if(tray){trayIconName=iconNames(theme,nativeTheme.shouldUseDarkColorsForSystemIntegratedUI).tray;tray.setImage(trayImage(nativeImage,path.join(__dirname,'icons'),trayIconName))}
}
function targets(){return makeTargets(screen.getAllDisplays(),taskbars,width(),HEIGHT)}
function createPlayerWindow(b,display=screen.getDisplayMatching({...b,width:width(),height:b.height||HEIGHT})){
 rendererReady=false;
 const current=new BrowserWindow({x:display.workArea.x+50,y:display.workArea.y+50,width:width(),height:b.height||HEIGHT,minWidth:1,minHeight:1,frame:false,thickFrame:false,transparent:true,alwaysOnTop:true,skipTaskbar:true,type:'toolbar',resizable:false,show:false,icon:path.join(__dirname,'icons','app.ico'),title:'WaterSprite TaskbarMediaBar',webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true,backgroundThrottling:false}});
 win=current;softMenu?.setOwner(current);windowScale=display.scaleFactor;current.setBounds(b);
 current.webContents.on('console-message',(_,level,message)=>{if(level>=2)rendererErrors.push(message)});
 current.loadFile(path.join(__dirname,'dist/index.html'));
 current.webContents.on('did-finish-load',()=>{if(win!==current)return;rendererReady=true;updateTheme();send({...lastState,docked:!!dock,dockHeight});restore()});
 current.webContents.on('render-process-gone',(_,details)=>{recordRecovery('renderer-exit',details);if(win!==current)return;rendererReady=false;current.hide();setTimeout(()=>{if(!app.isQuitting&&!current.isDestroyed())current.reload()},1000)});
 current.on('will-move',(_,bounds)=>{if(win!==current||(!shellState.nativeDragging&&shellState.leftDown!==true))return;if(!drag)startDrag();drag.lastMoveAt=Date.now();updateDragTarget(bounds);});
 current.on('close',e=>{if(!app.isQuitting){e.preventDefault();manualHidden=true;current.hide();shellControl()}});
 return current;
}
function applyDock(target){
 dockUnavailable=false;missingDockSince=0;lastDockTarget=target||null;
 lastDockGeometry=target?JSON.stringify({bounds:target.bounds,physical:nativeDockRect(target)}):'';
 if(!target){dock=null;if(freeBounds){const bounds={...freeBounds,width:width(),height:HEIGHT};movePlayer(bounds,screen.getDisplayMatching(bounds));}send({docked:false});restore();save();return}
 if(!dock)freeBounds=win.getBounds();dock={side:target.side,displayId:target.displayId};
 const display=screen.getAllDisplays().find(d=>d.id===target.displayId),scale=display?.scaleFactor;
 if(scale&&scale!==windowScale){const old=win;old.hide();createPlayerWindow(target.bounds,display);old.destroy();windowScale=scale;}
 dockHeight=nativeDockRect(target).height/(scale||1);win.setBounds(target.bounds);send({docked:true,dockHeight});restore();save();
}
function movePlayer(bounds,display){
 if(display.scaleFactor!==windowScale){const old=win;old.hide();createPlayerWindow(bounds,display);old.destroy();windowScale=display.scaleFactor;}
 win.setBounds(bounds);
}
function reconcileShell(s){
 if(app.isQuitting||!win||win.isDestroyed())return;
 lastShellAt=Date.now();shellState=s;softMenu?.checkPointer(Array.isArray(s.pointer)&&s.pointer.length===2?screen.screenToDipPoint({x:s.pointer[0],y:s.pointer[1]}):screen.getCursorScreenPoint(),s.leftDown===true,s.rightDown===true,s.escapeDown===true);
 const bars=[];for(let i=0;i<(s.taskbars||[]).length;i+=4){const a=s.taskbars;const physical={x:a[i],y:a[i+1],width:a[i+2],height:a[i+3]};const b=screen.screenToDipRect(null,physical),e=s.trayEdges||[];for(let j=0;j<e.length;j+=3){if(e[j]===physical.x&&e[j+1]===physical.y)b.trayLeft=b.x+(e[j+2]-physical.x)*b.width/physical.width}const occupied=[];const spans=s.occupied||[];for(let j=0;j<spans.length;j+=4)if(spans[j]===physical.x&&spans[j+1]===physical.y)occupied.push({x:b.x+(spans[j+2]-physical.x)*b.width/physical.width,width:spans[j+3]*b.width/physical.width});bars.push({...b,physical,occupied,occupiedReady:s.occupiedReady!==false})}taskbars=bars;prepareHints();
 if(s.nativeDragging){if(!drag)startDrag();drag.lastMoveAt=Date.now();const target=s.nativeTarget&&targets().find(t=>t.displayId===s.nativeTarget.displayId&&t.side===s.nativeTarget.side);drag.target=target;showHint(target||null);}else if(drag&&!drag.test&&s.leftDown===false)finishDrag();
 if(dock&&!drag){const displayPresent=screen.getAllDisplays().some(d=>d.id===dock.displayId);if(displayPresent)missingDisplaySince=0;else if(!missingDisplaySince)missingDisplaySince=Date.now();let target=s.startOpen&&displayPresent?lastDockTarget:targets().find(t=>t.displayId===dock.displayId&&t.side===dock.side);target=stableDockTarget(target);if(target){missingDockSince=0;const geometry=JSON.stringify({bounds:target.bounds,physical:nativeDockRect(target)});if(dockUnavailable)applyDock(target);else if(lastDockGeometry!==geometry){if(pendingDockGeometry!==geometry){pendingDockGeometry=geometry;pendingDockSince=Date.now()}else if(Date.now()-pendingDockSince>=600){applyDock(target);pendingDockGeometry=''}}else{pendingDockGeometry='';lastDockTarget=target;shellControl();}}else if(!dockUnavailable){pendingDockGeometry='';if(!missingDockSince)missingDockSince=Date.now();if(!displayPresent&&Date.now()-missingDisplaySince>=2500){recordRecovery('dock-display-removed',{dock});dockUnavailable=true;lastDockTarget=null;const d=screen.getDisplayMatching(win.getBounds()),a=d.workArea;movePlayer({x:a.x+50,y:a.y+a.height-HEIGHT-60,width:width(),height:HEIGHT},d);send({docked:false});restore();}}}
 const next=false;
 if(next!==suppressed){suppressed=next;if(next)win.hide();else restore();shellControl()}
 if(uiTest)fs.writeFileSync(path.join(__dirname,'ui-state.json'),JSON.stringify({visible:win.isVisible(),dock,startOpen:s.startOpen,foreground:s.foreground,menuOpen,suppressed,manualHidden,bounds:win.getBounds()}));
}
function poolHint(target){
 let item=hintPool.get(target.displayId);
 if(!item){item=new DockHint(BrowserWindow,id=>screen.getAllDisplays().find(d=>d.id===id)?.scaleFactor||1,shellControl,id=>screen.getAllDisplays().find(d=>d.id===id));hintPool.set(target.displayId,item);}
 return item;
}
function prepareHints(){for(const target of targets().filter(t=>t.side==='left')){const item=poolHint(target);if(!item.window||item.window.isDestroyed())item.prepare(target);}}
function showHint(target){
 if(!target){hint?.show(null);return;}
 const next=poolHint(target);if(hint&&hint!==next)hint.show(null);hint=next;hint.show(target);
}
function finishDrag(){if(!drag)return;const target=drag.target;clearInterval(dragTimer);drag=null;showHint(null);if(target)applyDock(target);else{dock=null;freeBounds=win.getBounds();windowScale=screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).scaleFactor;send({docked:false});save();restore()}}
function updateDragTarget(bounds=win.getBounds()){
 if(!drag)return;const target=chooseTarget(targets(),screen.getCursorScreenPoint(),bounds);
 const changed=target?.displayId!==drag.target?.displayId||target?.side!==drag.target?.side;
 drag.target=target;if(changed)showHint(target);
}
function startDrag(){
 if(drag)return;dock=null;dockUnavailable=false;suppressed=false;send({docked:false});
 drag={started:Date.now(),lastMoveAt:Date.now(),target:null};shellControl();
 dragTimer=setInterval(()=>{updateDragTarget();if(drag&&Date.now()-drag.lastMoveAt>200&&shellState.leftDown===false)finishDrag();},50);
}

function setAutostart(on){settings.autostart=on;if(!smoke)app.setLoginItemSettings({openAtLogin:managed?false:on,path:process.execPath,args:[],name:'WaterSprite TaskbarMediaBar'});save()}
async function changeCache(folder){
 dialogOpen=true;shellControl();
 try{
  if(!folder){const choice=await dialog.showOpenDialog(win,{title:'选择缓存位置',defaultPath:cacheConfig.cacheFolder,properties:['openDirectory','createDirectory']});if(choice.canceled||!choice.filePaths.length)return;folder=choice.filePaths[0];}
  ensureWritable(folder);if(path.resolve(folder)===path.resolve(cacheConfig.cacheFolder))return;
  settings.cacheMigration=planCacheMigration(cacheConfig.cacheFolder,folder,cacheConfig.configFolder);save();app.relaunch();app.quit();
 }catch(error){await dialog.showMessageBox(win,{type:'error',message:'无法使用这个缓存文件夹',detail:error.message});}
 finally{dialogOpen=false;restore();}
}
function openCacheFolder(){const child=spawn(path.join(process.env.SystemRoot,'explorer.exe'),[cacheConfig.cacheFolder],{detached:true,stdio:'ignore',windowsHide:false});child.on('error',error=>{recordRecovery('cache-folder-open-result',{folder:cacheConfig.cacheFolder,error:error.message});dialog.showMessageBox(win,{type:'error',message:'无法打开缓存文件夹',detail:error.message})});child.unref();}
function menu(preview=false,anchor=null){
 if(menuOpen)return;menuOpen=true;setImmediate(shellControl);
 const displays=screen.getAllDisplays(),sessions=sessionEntries(lastState.sessions||[],(lastState.audio||[]).filter(a=>a.active));
 if(!sessions.some(s=>s.label==='MPC-HC'))for(const p of lastState.mpc||[])sessions.push({source:'mpc:'+p.pid,label:'MPC-HC'});
 if(lastState.source&&!excludedSource(lastState.sourceName||lastState.source)&&!sessions.some(s=>s.source===lastState.source))sessions.push({source:lastState.source,label:sourceName(lastState.sourceName||lastState.source)});
 const items=[
 {label:'媒体来源',submenu:[{label:'自动选择',type:'radio',checked:!lastState.source,click:()=>command('select','')},...sessions.map(s=>({label:s.label,type:'radio',checked:s.source===(lastState.selected||lastState.source),click:()=>command('select',s.source)}))]},
 {label:'外观',submenu:[['system','跟随系统'],['dark','深色'],['light','浅色']].map(([mode,label])=>({label,type:'radio',checked:settings.themeMode===mode,click:()=>{settings.themeMode=mode;updateTheme();save()}}))},
 {label:'多显示器',submenu:displayOptions(displays,screen.getPrimaryDisplay().id).map(d=>({label:d.label,fullLabel:true,submenu:['left','right'].map(side=>({label:side==='left'?'左端':'右端',type:'radio',checked:dock?.displayId===d.id&&dock?.side===side,click:()=>{const t=targets().find(t=>t.displayId===d.id&&t.side===side);if(t)applyDock(t);else dialog.showMessageBox(win,{message:'这个屏幕没有检测到横向任务栏',detail:'请在 Windows 任务栏设置中打开“在所有显示器上显示任务栏”。'})}}))}))},
 {label:managed?'由 Windhawk 启动':'开机启动',enabled:!managed,type:'checkbox',checked:managed||!!settings.autostart,click:item=>setAutostart(item.checked)},
 {label:'缓存位置',submenu:[{label:cacheConfig.cacheFolder,enabled:false},{label:'选择缓存文件夹…',click:()=>changeCache()},{label:'打开缓存文件夹',click:()=>openCacheFolder()},{label:'恢复默认位置',enabled:path.resolve(cacheConfig.cacheFolder)!==path.resolve(cacheConfig.defaultFolder),click:()=>changeCache(cacheConfig.defaultFolder)}]},
 {type:'separator'},{label:'退出',click:()=>app.quit()}];
 const settingLabels=['外观','多显示器',managed?'由 Windhawk 启动':'开机启动','缓存位置'];const settingsItems=settingLabels.map(label=>items.find(item=>item.label===label)).filter(Boolean);settingsItems.push({label:'更新',click:()=>electronShell.openExternal('https://github.com/WaterSprites/WaterSprite-TaskbarMediaBar').catch(error=>dialog.showErrorBox('无法打开更新页面',error.message))},{label:'版本号 '+app.getVersion(),enabled:false});
 softMenu.popup([items[0],{label:'设置',submenu:settingsItems},{type:'separator'},items.at(-1)],theme,preview===true,anchor);
}
function command(action,source){
 if(action==='open'&&lastState.source?.startsWith('web:')){browserMedia?.open(lastState.source.slice(4));return;}
 if(action==='toggle'&&lastState.desktopControl&&desktopTarget&&Date.now()-desktopAt<3000){const target=desktopTarget;desktopClient.control(target,action).then(async ok=>{if(!ok)throw Error('客户端播放按钮不可用');desktopStates=await desktopClient.read();desktopAt=Date.now();if(rawMedia)acceptMedia(rawMedia)}).catch(error=>{recordRecovery('desktop-control-error',{message:error.message});send({type:'error',message:error.message})});return;}
 if(lastState.neteaseControl&&['toggle','next','previous'].includes(action)){neteaseClient.control(action).then(async ok=>{if(!ok)throw Error('网易云按钮不可用');neteaseState=await neteaseClient.read();neteaseAt=Date.now();if(rawMedia)acceptMedia(rawMedia)}).catch(error=>{recordRecovery('netease-control-error',{message:error.message});send({type:'error',message:error.message})});return;}
 if(action==='toggle'&&lastState.browserControl){if(pending){clearTimeout(pending.timer);pending=null;}const desired=browserMedia?.toggle(lastState.source.startsWith('web:')?lastState.source.slice(4):undefined);if(typeof desired==='boolean'){send({playing:desired,commandPending:false});}return;}
 const previousDesired=pending&&pending.source===lastState.source?pending.desired:lastState.playing;
 if(action==='toggle'&&pending){clearTimeout(pending.timer);pending=null;}
 const id=Date.now().toString();
 if(action==='toggle'){const desired=!previousDesired;pending={id,desired,old:lastState.playing,source:lastState.source,accepted:false};send({playing:desired,commandPending:true});pending.timer=setTimeout(()=>{pending=null;send({playing:lastState.playing,commandPending:false})},3500)}
 fs.writeFileSync(commandFile,JSON.stringify({action,source:['select','follow','open'].includes(action)?source:lastState.source,id,desiredPlaying:action==='toggle'?pending.desired:undefined}),'utf8');
}
function acceptMedia(s){
 if(s.type==='state'){
  const excludedAudio=(s.audio||[]).filter(a=>excludedSource(a.name,a.description));
  const excludedIds=new Set(excludedAudio.map(a=>'audio:'+a.pid));
  const selectedExcluded=excludedIds.has(s.selected)||excludedSource(s.selected);
  s={...s,audio:(s.audio||[]).filter(a=>!excludedIds.has('audio:'+a.pid)),sessions:(s.sessions||[]).filter(a=>!excludedSource(a.source,a.description))};
  if(excludedIds.has(s.source)||excludedSource(s.sourceName||s.source))s=emptyMedia(s);
  if(selectedExcluded)command('select','');
 }
 if(s.type==='ack'){
  if(s.action==='open')recordRecovery('cover-open-result',{ok:s.ok,diagnostic:s.diagnostic});
  if(pending?.id===s.id){if(s.ok){pending.accepted=true;}else{clearTimeout(pending.timer);pending=null;send({playing:lastState.playing,commandPending:false});send({type:'error',message:s.message})}}return;
 }
 if(s.type==='state'){if(appleCoverTestPending){const apple=(s.sessions||[]).find(entry=>/applemusic/i.test(entry.source));if(apple){appleCoverTestPending=false;command('select',apple.source)}}rawMedia=s;s=legacyState.merge(s);const webSources=(browserMedia?.available()||[]).map(page=>({...page,source:'web:'+page.id,label:(page.siteName||webLabels(page.title,page.url,page.browser).name)+'（'+page.browser+'）'}));s.webSources=webSources;s.sessions=[...(s.sessions||[]),...webSources.map(page=>({source:page.source,label:page.label,description:page.browser,playing:page.playing}))];s.neteaseControl=false;if(neteaseState&&Date.now()-neteaseAt<2000&&/cloudmusic/i.test(s.sourceName||s.source)){Object.assign(s,neteaseState,{neteaseSongId:neteaseState.id,source:s.source,sourceName:'cloudmusic',neteaseControl:true});}if(s.selected?.startsWith('mpc:')){const p=(s.mpc||[]).find(p=>'mpc:'+p.pid===s.selected);s=p?{...s,source:s.selected,title:p.title||'MPC-HC',artist:'',...mpcState}:emptyMedia(s);if(!s.title||s.title==='Media Player Classic Home Cinema')s.title='MPC-HC';}
 if(s.audioMode&&!s.sourceName){const audio=(s.audio||[]).find(a=>'audio:'+a.pid===s.source);const track=windowTrack(audio);if(track)Object.assign(s,track);else s.title=sourceName(audio?.name||s.title);}
 s.browserControl=false;s.web=false;s.webName='';s.webDetail='';
 const browserName=sourceName(s.sourceName||(s.audio||[]).find(a=>'audio:'+a.pid===s.source)?.name||s.source);
 if(['Chrome','Edge','Brave','Opera','Firefox','QQ浏览器','360浏览器'].includes(browserName)){
  Object.assign(s,webState(s,browserMedia?.current(browserName),browserName));
 }
 s.foregroundName=sourceName(shellState.foreground||'');
 const routed=sourceRouter.choose(s);
 const webSelected=s.selected?.startsWith('web:')?s.selected:(!s.selected&&routed?.startsWith('web:')?routed:'');const webPage=webSources.find(page=>page.source===webSelected);if(webPage){Object.assign(s,{source:webPage.source,sourceName:webPage.browser,position:0,duration:0,canToggle:false,...webState(s,webPage,webPage.browser),browserControl:true,playing:webPage.desired??webPage.playing,canToggle:true,canNext:false,canPrevious:false,timelineKnown:false,coverKnown:true});}
 if(!pending&&routed&&routed!==s.source&&(routed!==followSource||Date.now()-followAt>700)&&!fs.existsSync(commandFile)){followSource=routed;followAt=Date.now();command('follow',routed);}
 if(routed&&routed!==s.source&&!mediaState.current){send({sessions:s.sessions,audio:s.audio});return;}
 if(routed&&routed!==s.source&&mediaState.current){const present=(s.sessions||[]).some(x=>x.source===lastState.source)||(s.audio||[]).some(x=>'audio:'+x.pid===lastState.source);if(present){const update={sessions:s.sessions,audio:s.audio};Object.assign(lastState,update);send(update);return;}s=emptyMedia(s);}
 if(routed===s.source)followSource='';
 s.audibleSelected=!!routed&&routed===s.source;
 const previousDesktopTarget=desktopTarget;s.desktopControl=false;desktopTarget=null;
 if(sourceName(s.sourceName||(s.audio||[]).find(a=>'audio:'+a.pid===s.source)?.name||s.source)==='YY'&&yyState&&Date.now()-yyAt<3000)Object.assign(s,{title:yyState.title,artist:'',cover:yyState.cover,coverKnown:true,coverOrigin:yyState.cover?'desktop':'',web:true,webName:'YY',webDetail:yyState.title,lyrics:''});
 if(sourceName(s.sourceName||(s.audio||[]).find(a=>'audio:'+a.pid===s.source)?.name||s.source)==='斗鱼'&&douyuState&&Date.now()-douyuAt<3000)Object.assign(s,{title:douyuState.title,artist:'',cover:douyuState.cover,coverKnown:true,coverOrigin:douyuState.cover?'desktop':'',web:true,webName:'斗鱼',webDetail:douyuState.title,lyrics:''});
 if(sourceName(s.sourceName||(s.audio||[]).find(a=>'audio:'+a.pid===s.source)?.name||s.source)==='哔哩哔哩'&&Date.now()-desktopAt<3000){const chosen=desktopClient.choose(desktopStates,s.title,lastState.source===s.source?previousDesktopTarget:null);if(chosen){const {target,key,clip,at,live,...metadata}=chosen;Object.assign(s,metadata,{web:true,webName:'哔哩哔哩',webDetail:metadata.title||'',lyrics:'',canNext:false,canPrevious:false,coverKnown:true});desktopTarget=target;}}
 if(s.audibleSelected&&!s.browserControl&&!s.neteaseControl&&!s.desktopControl)s.playing=sourceRouter.playing(s);
 s=mediaState.accept(s);
 if(pending&&s.source!==pending.source&&!(s.sessions||[]).some(x=>x.source===pending.source)&&!(s.audio||[]).some(a=>'audio:'+a.pid===pending.source)){clearTimeout(pending.timer);pending=null;send({commandPending:false});}
 if(pending&&pending.accepted&&s.source===pending.source&&s.playing===pending.desired){clearTimeout(pending.timer);pending=null;send({commandPending:false});}
 const trackKey=[s.source,s.title,s.artist||''].join('|');
 if(trackKey!==cacheKey){cacheKey=trackKey;cacheResult={};cacheAt=0;cacheChangedAt=Date.now();s.lyrics='';s.lyricTrack=trackKey;}
 if(cacheResult.lyrics){s.lyrics=s.timelineKnown===false?'':cacheResult.lyrics;s.lyricTrack=trackKey;}
 if(!s.web&&!s.cover&&cacheResult.cover){s.cover=cacheResult.cover;s.coverError='';}
 if(/applemusic/i.test(s.source)&&cacheResult.canonicalArtist)s.artist=cacheResult.canonicalArtist;
 lastState={...lastState,...s};
 if(/kugou|酷狗|qqmusic|汽水|sodamusic|kwmusic|kuwo|applemusic|cloudmusic/i.test(s.sourceName||s.source)&&s.title&&!cachePending&&Date.now()-cacheAt>(/qqmusic/i.test(s.sourceName||s.source)&&!cacheResult.lyrics&&Date.now()-cacheChangedAt<30000?1000:10000)){
  cachePending=true;cacheAt=Date.now();const key=trackKey;
  readCache(s).then(result=>{if(cacheKey===key){result={...cacheResult,...result,lyrics:result.lyrics||cacheResult.lyrics||'',cover:result.cover||cacheResult.cover||''};cacheResult=result;const lyrics=lastState.timelineKnown===false?'':result.lyrics;const artist=/applemusic/i.test(lastState.source)&&result.canonicalArtist?{artist:result.canonicalArtist}:{};const cover=!lastState.cover&&result.cover?{cover:result.cover,coverError:''}:{};Object.assign(lastState,{lyrics,lyricFile:result.lyricFile||'',cacheError:result.cacheError||'',localFile:result.localFile||'',...artist,...cover});send({lyrics,lyricTrack:key,...artist,...cover});}}).finally(()=>cachePending=false);
 }
 send(pending?{...s,playing:pending.desired}:s);
 }else{send(s)}
}
function spawnBridge(name,args,handle){
 const proc=spawn(path.join(process.env.SystemRoot,'System32/WindowsPowerShell/v1.0/powershell.exe'),['-NoProfile','-ExecutionPolicy','Bypass','-File',path.join(__dirname,name),...args],{windowsHide:true});
 readline.createInterface({input:proc.stdout}).on('line',line=>{try{handle(JSON.parse(line))}catch(error){recordRecovery('bridge-packet-error',{bridge:name,message:error.message})}});
 proc.stderr.on('data',data=>send({type:'error',message:data.toString()}));proc.on('error',e=>send({type:'error',message:e.message}));return proc;
}
async function smokeTest(errors){
 await new Promise(r=>setTimeout(r,8000));
 if(process.argv.includes('--menu-regression-test')){
  media.kill();legacy?.kill();clearInterval(desktopTimer);clearInterval(neteaseTimer);clearInterval(mpcTimer);
  const wait=ms=>new Promise(r=>setTimeout(r,ms));const until=async(test,label)=>{const end=Date.now()+2000;while(!test()){if(Date.now()>end)throw Error(label+' timeout');await wait(5)}};
  await until(()=>softMenu.pool.every(p=>p.ready),'menu pool');
  const result={version:app.getVersion(),samplesMs:[],sourceCommands:[],settingsOpened:0,exit:false,actualMouse:false};
  lastState={source:'QQMusic.exe',sessions:[{source:'QQMusic.exe',label:'QQ音乐'},{source:'cloudmusic.exe',label:'网易云音乐'}],audio:[]};
  for(let i=0;i<8;i++){
   const at=Date.now();if(i%2)menu(false,{point:{x:screen.getPrimaryDisplay().workArea.x+160,y:screen.getPrimaryDisplay().workArea.y+200},tray:true});else await win.webContents.executeJavaScript('window.playerBridge.menu()');
   await until(()=>softMenu.window?.isVisible(),'root visible');result.samplesMs.push(Date.now()-at);
   if(result.samplesMs.at(-1)>500)throw Error('Menu opening exceeds 500ms: '+result.samplesMs.at(-1));
   const root=softMenu.window;await root.webContents.executeJavaScript('document.querySelectorAll("button")[0].click()');await until(()=>softMenu.panels[1]?.window.isVisible(),'source submenu');
   const index=i%2+1;await softMenu.panels[1].window.webContents.executeJavaScript('document.querySelectorAll("button")['+index+'].click()');await until(()=>!menuOpen,'source action closes menu');await wait(30);const sent=JSON.parse(fs.readFileSync(commandFile));if(sent.action!=='select')throw Error('Source command missing');result.sourceCommands.push(sent.source);
   menu(false,{point:{x:screen.getPrimaryDisplay().workArea.x+160,y:screen.getPrimaryDisplay().workArea.y+200}});await until(()=>softMenu.window?.isVisible(),'settings root');await softMenu.window.webContents.executeJavaScript('document.querySelectorAll("button")[1].click()');await until(()=>softMenu.panels[1]?.window.isVisible(),'settings submenu');result.settingsOpened++;softMenu.close();
  }
  menu(false,{point:{x:screen.getPrimaryDisplay().workArea.x+160,y:screen.getPrimaryDisplay().workArea.y+200},tray:true});await until(()=>softMenu.window?.isVisible(),'exit root');
  app.once('before-quit',()=>{result.exit=true;fs.writeFileSync(path.join(__dirname,'verified-actual-player-menu-0.6.29.json'),JSON.stringify(result,null,2))});await softMenu.window.webContents.executeJavaScript('Array.from(document.querySelectorAll("button")).find(b=>b.textContent.includes("退出")).click()');return;
 }
 if(process.argv.includes('--menu-layout-test')){
  media.kill();legacy?.kill();send({type:'state',source:'',cover:'',lyrics:''});settings.themeMode='dark';updateTheme();await new Promise(r=>setTimeout(r,200));
  const result={idleIcon:await win.webContents.executeJavaScript(`!!document.querySelector('.cover-idle img')?.naturalWidth`)};if(!result.idleIcon)throw Error('无音源图标缺失');fs.writeFileSync(path.join(__dirname,'smoke-idle.png'),(await win.webContents.capturePage()).toPNG());
  menu(true);await new Promise(r=>setTimeout(r,300));const root=softMenu.window;result.main=await root.webContents.executeJavaScript(`Array.from(document.querySelectorAll('button .label')).map(b=>b.textContent)`);if(result.main.join('|')!=='媒体来源|设置|退出')throw Error('主菜单结构错误');
  await root.webContents.executeJavaScript(`Array.from(document.querySelectorAll('button')).find(b=>b.textContent.includes('设置')).click()`);await new Promise(r=>setTimeout(r,350));if(softMenu.panels.length!==2)throw Error('设置子菜单没有旁开');const settingsMenu=softMenu.panels[1].window;result.settings=await settingsMenu.webContents.executeJavaScript(`Array.from(document.querySelectorAll('button .label')).map(b=>b.textContent)`);if(result.settings.join('|')!=='外观|多显示器|开机启动|缓存位置|更新|版本号 '+app.getVersion())throw Error('设置项目错误');
  await settingsMenu.webContents.executeJavaScript(`Array.from(document.querySelectorAll('button')).find(b=>b.textContent.includes('缓存位置')).click()`);await new Promise(r=>setTimeout(r,500));if(softMenu.panels.length!==3||softMenu.window!==root)throw Error('多级子菜单覆盖了主菜单');result.rootBounds=root.getBounds();result.settingsBounds=settingsMenu.getBounds();result.cacheBounds=softMenu.panels[2].window.getBounds();const boxes=[result.rootBounds,result.settingsBounds,result.cacheBounds];for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];if(a.x<b.x+b.width&&b.x<a.x+a.width&&a.y<b.y+b.height&&b.y<a.y+a.height)throw Error('旁开菜单互相覆盖');}result.darkBackground=await root.webContents.executeJavaScript('getComputedStyle(document.body).backgroundColor');result.menuBlur=shellState.menuBlur;if(!result.menuBlur)throw Error('菜单玻璃效果没有接通');if(Math.abs(result.rootBounds.width-192)>1)throw Error('菜单宽度错误');
  for(let i=0;i<softMenu.panels.length;i++)fs.writeFileSync(path.join(__dirname,'smoke-menu-'+i+'.png'),(await softMenu.panels[i].window.webContents.capturePage()).toPNG());
  softMenu.close();const area=screen.getDisplayMatching(win.getBounds()).workArea;const click={x:area.x+area.width-260,y:area.y+Math.min(180,area.height-30)};menu(true,{tray:true,point:click});await new Promise(r=>setTimeout(r,350));result.trayAnchor={click,bounds:softMenu.window.getBounds()};const tb=result.trayAnchor.bounds;if(Math.abs(tb.x-click.x)>1||Math.abs(tb.y+tb.height-click.y)>1)throw Error('托盘菜单没有贴着右键点击位置');
  softMenu.close();result.colorChecks=[];result.cornerChecks=[];
  for(const mode of ['light','dark']){settings.themeMode=mode;updateTheme();await new Promise(r=>setTimeout(r,120));const colors=await win.webContents.executeJavaScript(`({mode:document.querySelector('.wrapper').dataset.theme,title:getComputedStyle(document.querySelector('.title')).color,idle:getComputedStyle(document.querySelector('.idle-lyric')).color})`);if(colors.title!==colors.idle)throw Error('无媒体两行文字颜色不一致');result.colorChecks.push(colors);
   menu(true);await new Promise(r=>setTimeout(r,300));const root=softMenu.window;await root.webContents.executeJavaScript(`Array.from(document.querySelectorAll('button')).find(b=>b.textContent.includes('设置')).click()`);await new Promise(r=>setTimeout(r,300));const settingsPanel=softMenu.panels[1].window;await settingsPanel.webContents.executeJavaScript(`Array.from(document.querySelectorAll('button')).find(b=>b.textContent.includes('多显示器')).click()`);await new Promise(r=>setTimeout(r,450));const displayPanel=softMenu.panels[2].window;result.displayLabels=await displayPanel.webContents.executeJavaScript(`Array.from(document.querySelectorAll('.label')).map(b=>b.textContent)`);if(result.displayLabels.length!==screen.getAllDisplays().length||result.displayLabels.some(l=>!screen.getAllDisplays().some(d=>l.includes(d.label))))throw Error('系统显示器名称或数量不一致');
   await displayPanel.webContents.executeJavaScript(`document.querySelector('button').click()`);await new Promise(r=>setTimeout(r,400));const options=await softMenu.panels[3].window.webContents.executeJavaScript(`Array.from(document.querySelectorAll('.label')).map(b=>b.textContent)`);if(options.join('|')!=='左端|右端')throw Error('两端选项名称错误');const handles=softMenu.styleWindows().map(p=>p.handle);const corners=handles.every(h=>(shellState.menuStyled||[]).includes(h));result.cornerChecks.push({mode,corners,panels:handles.length});if(!corners)throw Error('菜单窗口圆角没有完整裁剪');softMenu.close();
  }
  result.menuLatencyMs=[];result.menuFullLatencyMs=[];result.menuRootHandles=[];
  for(let i=0;i<6;i++){const requestedAt=Date.now();menu(false);const panel=softMenu.panels[0];await new Promise(r=>setTimeout(r,40));const latency=panel.shownAt-panel.openedAt;result.menuLatencyMs.push(latency);result.menuFullLatencyMs.push(panel.shownAt-requestedAt);result.menuRootHandles.push(panel.window.getNativeWindowHandle().toString('hex'));if(!panel.window.isVisible()||!Number.isFinite(latency))throw Error('菜单没有显示');softMenu.close();await new Promise(r=>setTimeout(r,40));}
  fs.writeFileSync(path.join(__dirname,'smoke-menu-speed.json'),JSON.stringify(result.menuLatencyMs));if(Math.max(...result.menuLatencyMs)>250)throw Error('主菜单仍有可感知延迟 '+result.menuLatencyMs.join(','));
  if(new Set(result.menuRootHandles).size!==1)throw Error('菜单没有复用预加载窗口');
  fs.writeFileSync(path.join(__dirname,'smoke-menu-layout.json'),JSON.stringify(result));softMenu.close();app.quit();return;
 }

 const result={media:{source:lastState.source,title:lastState.title,position:lastState.position,timelineKnown:lastState.timelineKnown,coverBytes:lastState.cover?.length||0,coverError:lastState.coverError,lyricCharacters:lastState.lyrics?.length||0,lyricFile:lastState.lyricFile,cacheError:lastState.cacheError},taskbars,displays:screen.getAllDisplays().map(d=>({id:d.id,bounds:d.bounds,scale:d.scaleFactor})),errors};
 result.realLyricText=await win.webContents.executeJavaScript(`document.querySelector('.lyric--base')?.textContent.trim()`);
 result.realLyricsVisible=await win.webContents.executeJavaScript(`!!document.querySelector('.lyric-wrapper')`);
 media.kill();legacy?.kill();
 send({type:'state',source:'',title:'暂无媒体会话',artist:'请在播放器或网页中播放',cover:'',lyrics:''});await new Promise(r=>setTimeout(r,100));
 result.idle=await win.webContents.executeJavaScript(`({title:document.querySelector('.title').textContent.trim(),lyric:document.querySelector('.lyric-slot').textContent.trim()})`);if(result.idle.title!=='WaterSprite'||result.idle.lyric!=='柔雾黑丝')throw Error('无媒体品牌文字错误');
 result.idleIcon=await win.webContents.executeJavaScript(`(()=>{const image=document.querySelector('.cover-idle img');return {present:!!image,loaded:!!image?.complete&&image.naturalWidth>0}})()`);if(!result.idleIcon.loaded)throw Error('无音源软件图标没有显示');
 result.idleBounds=await win.webContents.executeJavaScript(`(()=>{const slot=document.querySelector('.lyric-slot').getBoundingClientRect(),range=document.createRange();range.selectNodeContents(document.querySelector('.idle-lyric'));const text=range.getBoundingClientRect();return {slotTop:slot.top,slotBottom:slot.bottom,textTop:text.top,textBottom:text.bottom}})()`);if(result.idleBounds.textTop<result.idleBounds.slotTop-.5||result.idleBounds.textBottom>result.idleBounds.slotBottom+.5)throw Error('无媒体第二行文字被裁切');fs.writeFileSync(path.join(__dirname,'smoke-idle.png'),(await win.webContents.capturePage()).toPNG());
 send({type:'state',source:'Chrome',web:true,webName:'抖音',webDetail:'记录美好生活',title:'抖音-记录美好生活',lyrics:'',cover:''});await new Promise(r=>setTimeout(r,100));
 result.webRows=await win.webContents.executeJavaScript(`({title:document.querySelector('.title').textContent.trim(),detail:document.querySelector('.lyric-slot').textContent.trim()})`);if(result.webRows.title!=='抖音'||result.webRows.detail!=='记录美好生活')throw Error('网页两行显示错误');
 result.webFallback=await win.webContents.executeJavaScript(`(()=>{const image=document.querySelector('.cover-fallback img');return {present:!!image,opacity:image&&getComputedStyle(image).opacity,width:image?.getBoundingClientRect().width}})()`);if(!result.webFallback.present||Math.abs(Number(result.webFallback.opacity)-.62)>.001)throw Error('网页回退图标透明度错误');
 settings.themeMode='dark';updateTheme();await new Promise(r=>setTimeout(r,100));const darkFallback=await win.webContents.executeJavaScript(`document.querySelector('.cover-fallback img').src`);fs.writeFileSync(path.join(__dirname,'smoke-web-fallback-dark.png'),(await win.webContents.capturePage()).toPNG());
 settings.themeMode='light';updateTheme();await new Promise(r=>setTimeout(r,100));const lightFallback=await win.webContents.executeJavaScript(`document.querySelector('.cover-fallback img').src`);if(darkFallback===lightFallback)throw Error('网页回退图标没有切换黑白');fs.writeFileSync(path.join(__dirname,'smoke-web-fallback-light.png'),(await win.webContents.capturePage()).toPNG());
 send({cover:'data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'icons','cover-dark.png')).toString('base64')});await new Promise(r=>setTimeout(r,100));if(await win.webContents.executeJavaScript(`!!document.querySelector('.cover-fallback')`))throw Error('真实封面没有替换回退图标');
 send({source:'WeChatAppEx.exe',title:'视频号',artist:'',web:false,cover:''});await new Promise(r=>setTimeout(r,100));result.wechatFallback=await win.webContents.executeJavaScript(`({loaded:!!document.querySelector('.cover-fallback img')?.naturalWidth,title:document.querySelector('.title').textContent.trim()})`);if(!result.wechatFallback.loaded||!result.wechatFallback.title.includes('视频号')){fs.writeFileSync(path.join(__dirname,'wechat-check-error.json'),JSON.stringify({value:result.wechatFallback,html:await win.webContents.executeJavaScript('document.body.innerHTML')}));throw Error('微信视频号缺少软件回退图标');}
 send({web:false,webName:'',webDetail:''});
 const pauseFixture={type:'state',source:'pause-test',selected:'pause-test',title:'暂停保留测试',artist:'测试',playing:true,position:3,duration:10,timelineKnown:true,canToggle:true,cover:'data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'icons','cover-dark.png')).toString('base64'),lyrics:'[00:00.00]暂停后仍然保留这一句歌词\n[00:08.00]下一句',sessions:[{source:'pause-test',playing:true}],audio:[]};
 acceptMedia(pauseFixture);await new Promise(r=>setTimeout(r,150));
 acceptMedia({...pauseFixture,playing:false,cover:'',artist:'',lyrics:undefined});await new Promise(r=>setTimeout(r,150));
 result.pausePreserved=await win.webContents.executeJavaScript(`({cover:!!document.querySelector('.cover'),lyric:document.querySelector('.lyric--base').textContent.trim(),title:document.querySelector('.title').textContent.trim()})`);
 if(!result.pausePreserved.cover||!result.pausePreserved.lyric)throw Error('暂停时歌曲信息消失');
 const fixedLayout=`(()=>({actions:document.querySelector('.action-wrapper').getBoundingClientRect().x,info:document.querySelector('.info-wrapper').getBoundingClientRect().x,titleY:document.querySelector('.title').getBoundingClientRect().y,lyricY:document.querySelector('.lyric-slot').getBoundingClientRect().y,lyricText:document.querySelector('.lyric--base').textContent.trim(),lyric:!!document.querySelector('.lyric-wrapper'),cover:!!document.querySelector('.cover')}))()`;
 send({cover:'data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'icons','cover-dark.png')).toString('base64'),lyrics:''});await new Promise(r=>setTimeout(r,100));result.withCover=await win.webContents.executeJavaScript(fixedLayout);
 send({cover:'',lyrics:''});await new Promise(r=>setTimeout(r,100));result.withoutCover=await win.webContents.executeJavaScript(fixedLayout);
 if(result.withCover.actions!==result.withoutCover.actions||result.withCover.info!==result.withoutCover.info||result.withCover.titleY!==result.withoutCover.titleY||result.withoutCover.lyricText||!result.withoutCover.lyric)throw Error('封面固定布局或歌词空行检查失败');
 send({type:'test',title:'这是一首用于验证长标题滚动并固定播放按钮位置的测试歌曲',artist:'测试',position:3,playing:false,canToggle:true,lyrics:'[00:00.00]这是一句足够长的歌词用于验证普通同步歌词会逐渐向左滚动并且不与按钮重叠\n[00:08.00]下一行歌词',lyricTrack:'test'});
 const js=`(()=>{const rect=s=>{const b=document.querySelector(s).getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height}};return {info:rect('.info-wrapper'),actions:rect('.action-wrapper'),cover:document.querySelector('.cover')?rect('.cover'):null,lyricScroll:document.querySelector('.lyric-viewport').scrollLeft,titleTransform:getComputedStyle(document.querySelector('.marquee-text')).transform,theme:document.querySelector('.wrapper').dataset.theme}})()`;
 await new Promise(r=>setTimeout(r,2200));result.layout=await win.webContents.executeJavaScript(js);result.withLyrics=await win.webContents.executeJavaScript(fixedLayout);if(result.withLyrics.titleY!==result.withoutCover.titleY||result.withLyrics.lyricY!==result.withoutCover.lyricY)throw Error('歌词加载导致纵向位置改变');fs.writeFileSync(path.join(__dirname,'smoke-window.png'),(await win.webContents.capturePage()).toPNG());
 await win.webContents.executeJavaScript(`document.querySelector('.wrapper').dispatchEvent(new MouseEvent('mouseenter'))`);await new Promise(r=>setTimeout(r,200));result.hover=await win.webContents.executeJavaScript(js);fs.writeFileSync(path.join(__dirname,'smoke-hover.png'),(await win.webContents.capturePage()).toPNG());
 settings.themeMode='light';updateTheme();await new Promise(r=>setTimeout(r,180));fs.writeFileSync(path.join(__dirname,'smoke-light.png'),(await win.webContents.capturePage()).toPNG());
 result.allScreenTrayChecks=[];
 if(!targets().length)throw Error('未读取到任务栏，不能跳过停靠验证');
 for(const target of targets().filter(t=>t.side==='right')){
  applyDock(target);await new Promise(r=>setTimeout(r,2500));
  const content=await win.webContents.executeJavaScript(`(()=>{const b=document.querySelector('.container').getBoundingClientRect();const children=[...document.querySelectorAll('.cover-wrapper,.title,.action-wrapper')].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom}});return {ratio:devicePixelRatio,x:b.x,y:b.y,width:b.width,height:b.height,children}})()`);
  const rect=shellState.visiblePlayerRect,edge=target.bar.physical.x+(target.bar.trayLeft-target.bar.x)*target.bar.physical.width/target.bar.width;
  const safe=rect?.length===4&&rect[0]+rect[2]<=edge+1&&rect[1]>=target.bar.physical.y-1&&rect[1]+rect[3]<=target.bar.physical.y+target.bar.physical.height+1;
  result.allScreenTrayChecks.push({displayId:target.displayId,physical:rect,content,fitDebug:shellState.fitDebug,nativeDpi:shellState.nativeDpi,trayLeft:edge,safe});
  if(!safe||Math.abs(shellState.nativeDpi-content.ratio*96)>1||content.children.some(r=>r.x<content.x-1||r.right>content.x+content.width+1||r.y<content.y-1||r.bottom>content.y+content.height+1)||Math.abs(content.width*content.ratio-rect[2])>3||Math.abs(content.height*content.ratio-rect[3])>3){fs.writeFileSync(path.join(__dirname,'smoke-error-result.json'),JSON.stringify(result,null,2));throw Error('副屏播放器可见区域或托盘边界错误')}
 }
 const t=targets().find(t=>t.displayId===screen.getPrimaryDisplay().id&&t.side==='right');if(t){applyDock(t);await new Promise(r=>setTimeout(r,750));result.docked={dock,bounds:win.getBounds(),physical:shellState.playerRect,expectedPhysical:nativeDockRect(t),trayLeft:t.bar.trayLeft};reconcileShell({...shellState,startOpen:true});result.startStayedVisible=win.isVisible();if(!result.startStayedVisible)throw Error('开始菜单打开时播放器不应隐藏');const startBounds=win.getBounds();reconcileShell({...shellState,startOpen:true,taskbars:[],trayEdges:[],occupied:[]});result.startRetainedDock=JSON.stringify(win.getBounds())===JSON.stringify(startBounds);if(!result.startRetainedDock)throw Error('开始菜单打开时任务栏暂时不可见导致悬浮');reconcileShell({...shellState,startOpen:false});result.startRestored=win.isVisible();menuOpen=true;shellControl();menuOpen=false;restore();result.menuRestored=win.isVisible();applyDock(null)}
 result.hintChecks=[];
 for(let pass=0;pass<2;pass++)for(const target of targets().filter(t=>t.side==='left')){
  drag={test:true};showHint(target);const hintDeadline=Date.now()+4000;do{await new Promise(r=>setTimeout(r,100));}while(Date.now()<hintDeadline&&(!shellState.hintRect||shellState.hintAboveTaskbar!==true||Math.abs(shellState.hintRect[0]-nativeDockRect(target).x)>2||Math.abs(shellState.hintRect[1]-nativeDockRect(target).y)>2));
  const text=await hint.window.webContents.executeJavaScript('document.body.textContent');
  const check={pass,displayId:target.displayId,visible:hint.window.isVisible(),text,aboveTaskbar:shellState.hintAboveTaskbar,physical:shellState.hintRect,expected:nativeDockRect(target)};result.hintChecks.push(check);
  if(!check.visible||!text.includes('将播控移动到此处')||check.aboveTaskbar!==true||Math.abs(check.physical[2]-check.expected.width)>2||Math.abs(check.physical[3]-check.expected.height)>2){check.content=await hint.window.webContents.executeJavaScript('({ratio:devicePixelRatio,width:innerWidth,height:innerHeight})');fs.writeFileSync(path.join(__dirname,'smoke-error-result.json'),JSON.stringify(result,null,2));throw Error('吸附提示层级或跨屏缩放错误');}
  if(pass===0)fs.writeFileSync(path.join(__dirname,'smoke-hint-'+target.displayId+'.png'),(await hint.window.webContents.capturePage()).toPNG());
  drag=null;showHint(null);applyDock(target);
 }
 result.dragScaleChecks=[];
 const displaySequence=screen.getAllDisplays().sort((a,b)=>b.scaleFactor-a.scaleFactor);displaySequence.push(screen.getPrimaryDisplay());
 for(const display of displaySequence){
  dock=null;const bounds={x:display.workArea.x+50,y:display.workArea.y+50,width:width(),height:HEIGHT};movePlayer(bounds,display);send({docked:false});shellControl();await new Promise(r=>setTimeout(r,1000));
  const content=await win.webContents.executeJavaScript(`(()=>{const b=document.querySelector('.container').getBoundingClientRect();return {ratio:devicePixelRatio,width:b.width,height:b.height,titleSize:getComputedStyle(document.querySelector('.title')).fontSize}})()`);
  result.dragScaleChecks.push({displayId:display.id,expectedScale:display.scaleFactor,content});
  if(Math.abs(content.ratio-display.scaleFactor)>.01||Math.abs(content.width-width())>2||Math.abs(content.height-HEIGHT)>1)throw Error('拖动跨屏后播放器缩放不正确');
 }
 result.recoveryChecks=[];
 for(const event of ['resume','unlock-screen']){manualHidden=false;win.hide();powerMonitor.emit(event);await new Promise(r=>setTimeout(r,200));result.recoveryChecks.push({event,visible:win.isVisible()});if(!win.isVisible())throw Error('唤醒恢复后播放器没有显示');}
 manualHidden=true;win.hide();powerMonitor.emit('resume');await new Promise(r=>setTimeout(r,100));result.manualHiddenPreserved=!win.isVisible();if(!result.manualHiddenPreserved)throw Error('唤醒误取消用户主动隐藏');manualHidden=false;restore();
 rendererReady=false;win.hide();const loaded=new Promise(r=>win.webContents.once('did-finish-load',r));win.reload();await loaded;await new Promise(r=>setTimeout(r,300));result.rendererReloadRestored=rendererReady&&win.isVisible();if(!result.rendererReloadRestored)throw Error('渲染重载后没有恢复显示');
 menu(true);await new Promise(r=>setTimeout(r,400));result.softMenu=await softMenu.window.webContents.executeJavaScript(`({theme:document.body.dataset.theme,items:document.querySelectorAll('button').length,background:getComputedStyle(document.body).backgroundColor})`);if(result.softMenu.items!==3)throw Error('柔雾菜单项目缺失');fs.writeFileSync(path.join(__dirname,'smoke-menu.png'),(await softMenu.window.webContents.capturePage()).toPNG());softMenu.close();
 result.autostart=smoke?'skipped for developer tests':settings.autostart;
 fs.writeFileSync(path.join(__dirname,'smoke-result.json'),JSON.stringify(result,null,2));app.quit();
}
if(!app.requestSingleInstanceLock())app.quit();else{
 app.whenReady().then(()=>{
  if(settings.cacheMigrationWarning){recordRecovery('cache-migration-warning',{message:settings.cacheMigrationWarning});dialog.showMessageBox({type:'warning',message:'缓存迁移提示',detail:settings.cacheMigrationWarning});delete settings.cacheMigrationWarning;}
  softMenu=new SoftMenu(()=>{menuOpen=false;restore()},error=>recordRecovery('menu-error',{message:error.message}),shellControl,handle=>(shellState.menuStyled||[]).includes(handle),()=>win);
  fs.mkdirSync(data,{recursive:true});try{fs.unlinkSync(commandFile)}catch{}
  if(!smoke&&!uiTest)browserMedia=new BrowserMedia(data,43829,app.isPackaged?path.join(path.dirname(path.dirname(app.getPath('exe'))),'WaterSprite TaskbarMediaBar 浏览器插件'):null,undefined,()=>({version:app.getVersion(),trayIconName,cacheFolder:cacheConfig.cacheFolder,configFolder:cacheConfig.configFolder,runtimePaths:cacheConfig.folders,source:lastState.source,title:lastState.title,browserControl:lastState.browserControl,coverOrigin:lastState.coverOrigin,canToggle:lastState.canToggle,neteaseControl:lastState.neteaseControl,desktopControl:lastState.desktopControl,position:lastState.position,timelineKnown:lastState.timelineKnown,lyricCharacters:lastState.lyrics?.length||0,coverBytes:lastState.cover?.length||0,pending:!!pending,playing:lastState.playing,bounds:win?.getBounds(),dock,scale:windowScale,physical:shellState.visiblePlayerRect,nativeDpi:shellState.nativeDpi,nativeRaw:shellState.nativeRaw,clientRect:shellState.clientRect,taskbarExcluded:shellState.taskbarExcluded,taskbarOwner:shellState.taskbarOwner,aboveTaskbar:shellState.aboveTaskbar,nativeDragging:shellState.nativeDragging,preparedHints:[...hintPool.values()].filter(h=>h.ready).length,menus:softMenu?.panels.map(p=>({level:p.level,bounds:p.window.getBounds(),visible:p.window.isVisible(),tray:!!p.tray})),placement:(displayId,side)=>{const display=screen.getAllDisplays().find(d=>d.id===displayId);if(!display)return false;if(side==='free'){dock=null;freeBounds={x:display.workArea.x+50,y:display.workArea.y+50,width:width(),height:HEIGHT};movePlayer(freeBounds,display);send({docked:false});restore();save();return true;}const target=targets().find(t=>t.displayId===displayId&&t.side===side);if(!target)return false;applyDock(target);return true;},layout:()=>win.webContents.executeJavaScript("(()=>{const rect=s=>{const b=document.querySelector(s).getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height}};return {displayTitle:document.querySelector('.title')?.textContent,displayDetail:document.querySelector('.web-detail')?.textContent,webFallback:!!document.querySelector('.cover-fallback'),tooltips:document.querySelectorAll('[title]').length,accessibleButtons:[...document.querySelectorAll('button')].map(b=>b.getAttribute('aria-label')),ratio:devicePixelRatio,viewport:{width:innerWidth,height:innerHeight},body:rect('body'),wrapper:rect('.wrapper'),container:rect('.container'),actions:rect('.action-wrapper'),dragRegion:getComputedStyle(document.querySelector('.drag-handler-wrapper')).webkitAppRegion,dragRect:rect('.drag-handler-wrapper'),docked:document.querySelector('.wrapper').dataset.docked!==undefined}})()")}),()=>{if(!lastState.canToggle)return undefined;command('toggle');return pending?.desired??browserMedia.current()?.desired??!lastState.playing;},cacheConfig.tokenPath);
  cacheWorker=new Worker(path.join(__dirname,'cache-worker.cjs'));cacheWorker.on('message',({id,result})=>{cacheRequests.get(id)?.(result);cacheRequests.delete(id)});cacheWorker.on('error',()=>{for(const resolve of cacheRequests.values())resolve({lyrics:'',cover:''});cacheRequests.clear();cacheWorker=null});
  const area=screen.getPrimaryDisplay().workArea;
  const b=settings.bounds||{x:area.x+Math.round((area.width-width())/2),y:area.y+area.height-140};
  createPlayerWindow({...b,y:Math.min(b.y,area.y+area.height-HEIGHT)});
  const errors=rendererErrors;
  if(!smoke&&!uiTest){tray=new Tray(trayImage(nativeImage,path.join(__dirname,'icons'),iconNames(theme,nativeTheme.shouldUseDarkColorsForSystemIntegratedUI).tray),'27764c12-56e8-4980-a69f-32a8491bc369');tray.setToolTip('');tray.on('click',()=>{manualHidden=false;restore()});tray.on('right-click',(_,bounds)=>menu(false,{point:screen.getCursorScreenPoint(),tray:true,iconBounds:bounds}));}
  updateTheme();nativeTheme.on('updated',updateTheme);
  media=supervise(()=>spawnBridge('media-bridge.ps1',['-CommandFile',commandFile],acceptMedia),details=>recordRecovery('media-bridge-exit',details));
  legacy=supervise(()=>spawnBridge('legacy-progress.ps1',[],packet=>{if(packet.type==='legacy'){legacyState.update(packet);if(rawMedia)acceptMedia(rawMedia)}}),details=>recordRecovery('legacy-bridge-exit',details));
  shell=supervise(()=>spawnBridge('shell-bridge.ps1',['-ControlFile',shellFile],s=>{if(s.type==='shell'){reconcileShell(s);if(initialPlacementPending&&targets().length){const available=targets();const t=available.find(t=>t.side===settings.dock?.side&&t.displayId===settings.dock?.displayId)||available.find(t=>t.displayId===screen.getPrimaryDisplay().id&&t.side==='left')||available[0];initialPlacementPending=false;applyDock(t)}}}),details=>recordRecovery('shell-bridge-exit',details));
  shellControl();if(!smoke&&!uiTest)setAutostart(settings.autostart);
  setTimeout(()=>{if(initialPlacementPending&&!app.isQuitting){initialPlacementPending=false;dock=null;send({docked:false});restore();recordRecovery('no-safe-dock-at-startup')}},5000);
  if(uiTest)setTimeout(()=>{const t=targets().find(t=>t.displayId===screen.getPrimaryDisplay().id&&t.side==='left');if(t)applyDock(t)},2800);
  spawnBridge('client-launch.ps1',['-BackupFolder',path.join(cacheConfig.configFolder,'客户端启动备份')],packet=>recordRecovery('automatic-client-launch',packet));
  desktopTimer=setInterval(async()=>{if(desktopBusy||app.isQuitting)return;desktopBusy=true;try{desktopStates=await desktopClient.read();desktopAt=Date.now();if(rawMedia)acceptMedia(rawMedia)}catch{desktopStates=[];desktopTarget=null;}finally{desktopBusy=false}},1000);
  if(!smoke&&!uiTest)yyTimer=setInterval(async()=>{if(yyBusy||app.isQuitting||!rawMedia)return;yyBusy=true;try{if((rawMedia.audio||[]).some(a=>sourceName(a.name)==='YY'))yyState=await yyRoom.read();else{yyState=null;yyRoom.reset();}yyAt=Date.now();acceptMedia(rawMedia);}catch{yyState=null;}finally{yyBusy=false}},1000);
  if(!smoke&&!uiTest)douyuTimer=setInterval(async()=>{if(douyuBusy||app.isQuitting||!rawMedia)return;douyuBusy=true;try{if((rawMedia.audio||[]).some(a=>sourceName(a.name)==='斗鱼'))douyuState=await douyuRoom.read();else{douyuState=null;douyuRoom.reset();}douyuAt=Date.now();acceptMedia(rawMedia);}catch{douyuState=null;}finally{douyuBusy=false}},1000);
  neteaseTimer=setInterval(async()=>{if(neteaseBusy||app.isQuitting)return;neteaseBusy=true;try{neteaseState=await neteaseClient.read();neteaseAt=Date.now();if(rawMedia)acceptMedia(rawMedia)}catch{neteaseState=null}finally{neteaseBusy=false}},500);
  mpcTimer=setInterval(async()=>{if(!lastState.selected?.startsWith('mpc:')||mpcBusy)return;mpcBusy=true;try{mpcState=await mpc.read();const file=mpcState.filepath||'';if(file!==mpcFile){mpcFile=file;mpcCover='';if(file&&!/\.(mp4|mkv|avi|mov|webm|wmv|mpeg|mpg|m4v)$/i.test(file))readCache({source:'mpc',filepath:file}).then(result=>{if(mpcFile===file){mpcCover=result.cover||'';mpcState.cover=mpcCover;if(rawMedia)acceptMedia(rawMedia)}});}if(!/\.(mp4|mkv|avi|mov|webm|wmv|mpeg|mpg|m4v)$/i.test(file))mpcState.cover=mpcCover;mpcState.coverKnown=true;}catch(e){mpcState={error:e.message,cover:'',canToggle:false,canNext:false,canPrevious:false}}finally{mpcBusy=false}},1000);
  for(const event of ['resume','unlock-screen'])powerMonitor.on(event,()=>scheduleRecovery(event,true));
  for(const event of ['display-added','display-removed','display-metrics-changed'])screen.on(event,()=>{softMenu?.close();scheduleRecovery(event)});
  watchdog=setInterval(()=>{if(app.isQuitting)return;const idle=powerMonitor.getSystemIdleTime();if(lastIdleSeconds>60&&idle<5)scheduleRecovery('idle-return',true);lastIdleSeconds=idle;if(Date.now()-lastShellAt>12000){shell?.restart();lastShellAt=Date.now();recordRecovery('shell-watchdog');}if(!win||win.isDestroyed()){recoverPlayer('window-watchdog');return;}if(win&&!win.isDestroyed()&&rendererReady&&!initialPlacementPending&&!manualHidden&&!suppressed&&!win.isVisible())restore();},3000);
  recordRecovery('started',{version:app.getVersion()});
  if(smoke)win.webContents.once('did-finish-load',()=>smokeTest(errors).catch(e=>{fs.writeFileSync(path.join(__dirname,'smoke-error.txt'),e.stack);app.quit()}));
 });
 app.on('window-all-closed',()=>{if(!app.isQuitting)setTimeout(()=>recoverPlayer('window-lost'),500)});
 app.on('second-instance',()=>{manualHidden=false;restore()});
 app.on('before-quit',()=>{app.isQuitting=true;softMenu?.dispose();softMenu?.close();clearInterval(watchdog);clearTimeout(wakeTimer);browserMedia?.close();tray?.destroy();tray=null;clearInterval(dragTimer);clearInterval(mpcTimer);clearInterval(neteaseTimer);clearInterval(desktopTimer);clearInterval(douyuTimer);clearInterval(yyTimer);cacheWorker?.terminate();if(pending)clearTimeout(pending.timer);media?.kill();legacy?.kill();shell?.kill();for(const item of hintPool.values())item.destroy();hintPool.clear()});
 ipcMain.handle('command',(_,action)=>{if(!['toggle','next','previous','open'].includes(action))throw Error('Unknown command');command(action,action==='open'?lastState.source:undefined)});
 ipcMain.handle('menu',menu);ipcMain.handle('dragStart',startDrag);
 ipcMain.handle('hide',()=>{manualHidden=true;win.hide();shellControl()});
}
