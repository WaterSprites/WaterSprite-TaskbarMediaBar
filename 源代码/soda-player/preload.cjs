const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('playerBridge',{
  command:(action)=>ipcRenderer.invoke('command',action),
  menu:()=>ipcRenderer.invoke('menu'),
  close:()=>ipcRenderer.invoke('hide'),
  dragStart:()=>ipcRenderer.invoke('dragStart'),
  onState:(callback)=>{const listener=(_,state)=>callback(state);ipcRenderer.on('state',listener);return()=>ipcRenderer.removeListener('state',listener)}
});

// Report the Chromium viewport; native minimum window size can differ after DPI changes.
const reportViewport=()=>ipcRenderer.send('viewport-metrics',{height:innerHeight,ratio:devicePixelRatio});
window.addEventListener('DOMContentLoaded',reportViewport);window.addEventListener('resize',reportViewport);
