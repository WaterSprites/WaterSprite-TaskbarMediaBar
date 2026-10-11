const {spawnSync}=require('node:child_process'),fs=require('fs'),path=require('path'),cache=require('./cache-media.cjs');
(async()=>{for(const source of ['QQMusic.exe','汽水音乐']){
 const command=path.join(__dirname,'test-cache-select.json');fs.writeFileSync(command,JSON.stringify({action:'select',source}));
 const p=spawnSync(path.join(process.env.SystemRoot,'System32/WindowsPowerShell/v1.0/powershell.exe'),['-NoProfile','-ExecutionPolicy','Bypass','-File',path.join(__dirname,'media-bridge.ps1'),'-CommandFile',command,'-Once'],{windowsHide:true,encoding:'utf8',maxBuffer:10e6});
 const state=JSON.parse(p.stdout.trim());const result=source==='QQMusic.exe'?await cache.readQQ(state):cache.readSoda(state);
 console.log(JSON.stringify({source:state.source,title:state.title,artist:state.artist,lyrics:result.lyrics.length,systemCover:state.cover?.length||0,cachedCover:result.cover.length,matched:!!result.lyricFile}));
 }})().catch(e=>{console.error(e.message);process.exitCode=1});
