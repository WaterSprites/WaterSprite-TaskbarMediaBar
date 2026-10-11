const fs=require('node:fs'),path=require('node:path');
const {execFile}=require('node:child_process');
const envValue=(env,key)=>env[Object.keys(env).find(k=>k.toUpperCase()===key)]||'';
const empty=()=>({qqLyrics:[],qqPictures:[],kuwoLyrics:[]});
const folder=p=>{try{return fs.statSync(p).isDirectory()&&!fs.lstatSync(p).isSymbolicLink()}catch{return false}};
const unique=values=>[...new Map(values.filter(Boolean).map(v=>[path.resolve(v).toLowerCase(),path.resolve(v)])).values()];
function systemRoots(env=process.env){
 const homes=[envValue(env,'APPDATA'),envValue(env,'LOCALAPPDATA'),envValue(env,'PROGRAMDATA')].filter(Boolean);
 const user=envValue(env,'USERPROFILE');
 return {qq:unique(homes.flatMap(h=>['QQMusic','Tencent/QQMusic'].map(n=>path.join(h,n))).concat(user?[path.join(user,'Documents/QQMusic'),path.join(user,'Music/QQMusic')]:[])),kuwo:unique(homes.flatMap(h=>['kuwodata/kwmusic2013','Kuwo','KwMusic'].map(n=>path.join(h,n))))};
}
function installationRoots(values){
 return unique(values.flatMap(value=>{
  const p=/\.exe$/i.test(value)?path.dirname(value):value;
  // A version subfolder can change after an update; follow its parent as well.
  const parent=path.dirname(p),roots=[p];
  if(parent!==p && path.dirname(parent)!==parent)roots.push(parent);
  if(/^\d+(?:[._-]\d+){1,}/.test(path.basename(p)))roots.push(path.dirname(parent));
  return roots;
 }));
}
function configPaths(text,base,env){
 const values=[];
 const decode=s=>s.replace(/\\u([0-9a-f]{4})/gi,(_,n)=>String.fromCharCode(parseInt(n,16))).replace(/\\\\/g,'\\').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/%([^%]+)%/g,(m,k)=>envValue(env,k)||m).trim();
 const accept=value=>{const p=decode(value);if(p&&!/[\r\n\0]/.test(p))values.push(path.isAbsolute(p)?p:path.resolve(base,p))};
 for(const line of text.split(/\r?\n/)){
  const ini=line.match(/^\s*([^=<>]+)=\s*(.*?)\s*$/);
  if(ini&&/cache|lyric|picture|download|缓存|歌词/i.test(ini[1]))accept(ini[2].replace(/^['"]|['"]$/g,''));
 }
 for(const m of text.matchAll(/["']([^"']*(?:cache|lyric|picture|download|缓存|歌词)[^"']*)["']\s*:\s*["']((?:\\.|[^"'])*)["']/gi))accept(m[2]);
 for(const m of text.matchAll(/<([\w-]*(?:cache|lyric|picture|download)[\w-]*)[^>]*>([^<>]+)<\/\1>/gi))accept(m[2]);
 for(const m of text.matchAll(/(?:name|key)\s*=\s*["']([^"']*(?:cache|lyric|picture|download)[^"']*)["'][^>]*?(?:value|path)\s*=\s*["']([^"']+)["']/gi))accept(m[2]);
 return unique(values).filter(folder);
}
function discover(roots,env=process.env){
 const result=empty();let directories=0,configs=0;const seen=new Set(),queue=[];
 const scan=(root,kind,depth,allowConfig=true)=>{
  if(!folder(root)||directories>=600)return;
  const key=kind+'|'+path.resolve(root).toLowerCase();if(seen.has(key))return;seen.add(key);directories++;
  const name=path.basename(root);
  if(kind==='qq'&&/^QQMusicLyricNew$/i.test(name))result.qqLyrics.push(root);
  if(kind==='qq'&&/^QQMusicPicture$/i.test(name))result.qqPictures.push(root);
  if(kind==='kuwo'&&/^(?:歌词|lyric|lyrics|lrc)$/i.test(name))result.kuwoLyrics.push(root);
  let children;try{children=fs.readdirSync(root,{withFileTypes:true})}catch{return}
  for(const entry of children){
   if(entry.isSymbolicLink())continue;
   const p=path.join(root,entry.name);
   if(entry.isFile()&&allowConfig&&configs<80&&/\.(?:ini|cfg|xml|json)$/i.test(entry.name)&&!/package(?:-lock)?\.json|desktop\.ini/i.test(entry.name)){
    try{const stat=fs.statSync(p);if(stat.size>1024*1024)continue;configs++;const b=fs.readFileSync(p);let text;if(b[0]===255&&b[1]===254)text=b.subarray(2).toString('utf16le');else try{text=new TextDecoder('utf-8',{fatal:true}).decode(b)}catch{text=new TextDecoder('gb18030').decode(b)};for(const value of configPaths(text,root,env))queue.push([value,kind,2,false])}catch{}
   }
   if(entry.isDirectory()&&depth>0&&!/^(?:node_modules|\.git|logs?|crash|html|qmbrowser|cef|res|resources|skins?|backup)$/i.test(entry.name))queue.push([p,kind,depth-1,allowConfig]);
  }
 };
 for(const kind of ['qq','kuwo']){
  directories=0;configs=0;queue.length=0;
  for(const root of unique(roots[kind]||[]))queue.push([root,kind,3,true]);
  // Breadth-first search prevents a large installation tree from hiding sibling caches.
  for(let i=0;i<queue.length&&directories<600;i++)scan(...queue[i]);
 }
 for(const key of Object.keys(result))result[key]=unique(result[key]);
 return result;
}
function readInstallRoots(){
 if(process.platform!=='win32')return Promise.resolve({qq:[],kuwo:[]});
 return new Promise(resolve=>execFile('powershell.exe',['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',path.join(__dirname,'media-cache-roots.ps1')],{windowsHide:true,timeout:6000,maxBuffer:256*1024,encoding:'utf8'},(error,stdout)=>{if(error){resolve({qq:[],kuwo:[]});return}try{const data=JSON.parse(stdout.replace(/^\uFEFF/,''));resolve({qq:Array.isArray(data.qq)?data.qq:[],kuwo:Array.isArray(data.kuwo)?data.kuwo:[]})}catch{resolve({qq:[],kuwo:[]})}}));
}
function createLocator({env=process.env,loadRoots=readInstallRoots,now=Date.now,ttl=60000}={}){
 let memo=empty(),last=-Infinity,pending,lastKind='';
 return {async get(kind=''){
  if(pending)return pending;
  if(kind!==lastKind){last=-Infinity;lastKind=kind}
  if(now()-last<ttl)return memo;
  pending=(async()=>{
   try{const standard=systemRoots(env),installed=await loadRoots();const roots={qq:[...standard.qq,...installationRoots(installed.qq||[])],kuwo:[...standard.kuwo,...installationRoots(installed.kuwo||[])]};memo=discover(roots,env)}catch{memo=empty()}
   last=now();return memo;
  })().finally(()=>{pending=undefined});return pending;
 }};
}
module.exports={createLocator,discover,configPaths,systemRoots,installationRoots};
