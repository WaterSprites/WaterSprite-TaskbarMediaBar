const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {configureCache}=require('./cache-paths.cjs');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'watersprite-config-test-'));
const originalEnv={TEMP:process.env.TEMP,TMP:process.env.TMP};
try{
 const old=path.join(root,'任务栏播放器 WaterSprite TaskbarMediaBar 缓存','用户配置');
 fs.mkdirSync(path.join(old,'客户端启动备份'),{recursive:true});
 fs.writeFileSync(path.join(old,'window.json'),JSON.stringify({themeMode:'dark',autostart:false,dock:{side:'right',displayId:12}}));
 fs.writeFileSync(path.join(old,'browser-token'),'test-only-token');
 fs.writeFileSync(path.join(old,'客户端启动备份','original.lnk'),'test shortcut');
 const calls={},app={setPath:(name,value)=>calls[name]=value,setAppLogsPath:value=>calls.logs=value};
 const defaultCacheFolder=path.join(root,'WaterSprite TaskbarMediaBar','缓存');
 const first=configureCache(app,{base:root,defaultCacheFolder});
 assert.equal(first.cacheFolder,defaultCacheFolder);
 assert.equal(first.configFolder,path.join(path.dirname(defaultCacheFolder),'用户配置'));
 assert.equal(first.settings.themeMode,'dark');assert.equal(first.settings.autostart,false);
 assert.equal(fs.readFileSync(first.tokenPath,'utf8'),'test-only-token');
 assert.equal(fs.readFileSync(path.join(first.configFolder,'客户端启动备份','original.lnk'),'utf8'),'test shortcut');
 const custom=path.join(root,'自定义缓存');
 fs.writeFileSync(first.settingsFile,JSON.stringify({...first.settings,cachePath:custom}));
 const second=configureCache(app,{base:root,defaultCacheFolder});
 assert.equal(second.cacheFolder,custom);assert.equal(second.configFolder,first.configFolder);
 assert.ok(!second.configFolder.startsWith(defaultCacheFolder+path.sep));
 assert.ok(!second.configFolder.startsWith(custom+path.sep));
 assert.equal(second.settings.dock.displayId,12);
 assert.equal(fs.readFileSync(second.tokenPath,'utf8'),'test-only-token');
 for(const folder of Object.values(second.folders))assert.ok(folder.startsWith(custom+path.sep));
 console.log('Default cache inside program, legacy migration, shortcut backups, custom cache and token preservation passed.');
}finally{
 for(const name of ['TEMP','TMP'])if(originalEnv[name]===undefined)delete process.env[name];else process.env[name]=originalEnv[name];
 fs.rmSync(root,{recursive:true,force:true});
}
