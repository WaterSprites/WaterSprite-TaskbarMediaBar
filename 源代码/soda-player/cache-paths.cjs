const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const cacheNames=['运行数据','界面缓存','临时文件','日志','崩溃记录'];
function within(parent,child){const relative=path.relative(path.resolve(parent),path.resolve(child));return !relative||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative));}
function snapshot(folder){const result=[];function visit(current){for(const entry of fs.readdirSync(current,{withFileTypes:true})){const file=path.join(current,entry.name);if(entry.isSymbolicLink())throw Error('缓存包含链接，不能自动迁移');if(entry.isDirectory())visit(file);else if(entry.isFile())result.push([path.relative(folder,file),fs.statSync(file).size,crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')]);}}if(fs.existsSync(folder))visit(folder);return JSON.stringify(result.sort((a,b)=>a[0].localeCompare(b[0])));}
function planCacheMigration(from,to,configFolder){
 from=path.resolve(from);to=path.resolve(to);ensureWritable(to);
 from=fs.realpathSync(from);to=fs.realpathSync(to);
 if(within(from,to)||within(to,from))throw Error('新旧缓存位置不能相同，也不能互相包含');
 if(within(to,configFolder)||within(configFolder,to))throw Error('缓存位置不能与用户配置重叠');
 for(const name of cacheNames)if(fs.existsSync(path.join(to,name)))throw Error('新位置已有同名缓存，请选择空文件夹，避免覆盖');
 return {from,to};
}
function migrateCache(settings,settingsFile,configFolder){
 const migration=settings.cacheMigration;if(!migration)return;
 const {from,to}=planCacheMigration(migration.from,migration.to,configFolder);
 const stage=fs.mkdtempSync(path.join(to,'.watersprite-cache-'));
 const promoted=[];
 try{
  for(const name of cacheNames){const old=path.join(from,name);if(!fs.existsSync(old))continue;const before=snapshot(old);copyMissing(old,path.join(stage,name));if(snapshot(path.join(stage,name))!==before)throw Error('缓存复制校验失败：'+name);}
  for(const name of cacheNames)if(fs.existsSync(path.join(stage,name))){fs.renameSync(path.join(stage,name),path.join(to,name));promoted.push(name);}
  const next={...settings,cachePath:to};delete next.cacheMigration;
  fs.writeFileSync(settingsFile,JSON.stringify(next));Object.assign(settings,next);delete settings.cacheMigration;
 }catch(error){for(const name of promoted)fs.renameSync(path.join(to,name),path.join(stage,name));delete settings.cacheMigration;fs.writeFileSync(settingsFile,JSON.stringify(settings));settings.cacheMigrationWarning='迁移未完成，仍使用原缓存：'+error.message;return;}
 finally{if(!within(to,stage))throw Error('临时迁移目录路径错误');fs.rmSync(stage,{recursive:true,force:true});}
 const warnings=[];
 for(const name of cacheNames){const old=path.join(from,name);if(!fs.existsSync(old))continue;try{if(!within(from,old)||snapshot(old)!==snapshot(path.join(to,name)))throw Error('源缓存发生变化，保留旧文件');fs.rmSync(old,{recursive:true});}catch(error){warnings.push(name+'：'+error.message);}}
 try{if(fs.readdirSync(from).length===0)fs.rmdirSync(from);}catch(error){warnings.push(error.message);}
 if(warnings.length)settings.cacheMigrationWarning='已切换新缓存，部分旧内容保留：'+warnings.join('；');
}
function ensureWritable(folder){fs.mkdirSync(folder,{recursive:true});const probe=path.join(folder,'.write-check-'+process.pid+'-'+Date.now());try{fs.writeFileSync(probe,'',{flag:'wx'});}finally{if(fs.existsSync(probe))fs.unlinkSync(probe);}}
function copyMissing(source,target){if(!fs.existsSync(source))return;fs.mkdirSync(target,{recursive:true});for(const entry of fs.readdirSync(source,{withFileTypes:true})){const from=path.join(source,entry.name),to=path.join(target,entry.name);if(entry.isDirectory())copyMissing(from,to);else if(entry.isFile()&&!fs.existsSync(to))fs.copyFileSync(from,to);}}
function configureCache(app,{base,configFolder,defaultCacheFolder,test=false,legacy=[]}){
 const defaultFolder=defaultCacheFolder||path.join(base,'缓存');
 configFolder=configFolder||path.join(path.dirname(defaultFolder),'用户配置');
 legacy=[path.join(defaultFolder,'用户配置'),path.join(base,'任务栏播放器 WaterSprite TaskbarMediaBar 缓存','用户配置'),path.join(base,'任务栏播放器 WaterSprite TaskbarMediaBar 设置','配置文件'),...legacy];
 fs.mkdirSync(configFolder,{recursive:true});
 for(const name of ['window.json','browser-token']){const dest=path.join(configFolder,name);if(!fs.existsSync(dest))for(const previous of legacy){const from=path.join(previous,name);if(fs.existsSync(from)){fs.copyFileSync(from,dest);break;}}}
 for(const previous of legacy)copyMissing(path.join(previous,'客户端启动备份'),path.join(configFolder,'客户端启动备份'));
 const settingsFile=path.join(configFolder,'window.json');let settings={themeMode:'system',autostart:true};try{settings={...settings,...JSON.parse(fs.readFileSync(settingsFile,'utf8'))};}catch{}
 if(settings.cacheMigration){try{migrateCache(settings,settingsFile,configFolder);}catch(error){delete settings.cacheMigration;settings.cacheMigrationWarning='无法迁移，仍使用原缓存：'+error.message;fs.writeFileSync(settingsFile,JSON.stringify(settings));}}
 const cacheFolder=test?path.join(base,'测试缓存'):(settings.cachePath||defaultFolder);
 ensureWritable(cacheFolder);const folders={data:path.join(cacheFolder,'运行数据'),session:path.join(cacheFolder,'界面缓存'),temp:path.join(cacheFolder,'临时文件'),logs:path.join(cacheFolder,'日志'),crashes:path.join(cacheFolder,'崩溃记录')};for(const folder of Object.values(folders))fs.mkdirSync(folder,{recursive:true});
 app.setPath('userData',folders.data);app.setPath('sessionData',folders.session);app.setPath('temp',folders.temp);app.setPath('crashDumps',folders.crashes);app.setAppLogsPath(folders.logs);process.env.TEMP=folders.temp;process.env.TMP=folders.temp;
 return {settings,settingsFile,configFolder,cacheFolder,defaultFolder,folders,tokenPath:path.join(configFolder,'browser-token')};
}
module.exports={configureCache,ensureWritable,planCacheMigration};
