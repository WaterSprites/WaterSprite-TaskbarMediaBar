const coverRank=kind=>['media','poster','thumbnail'].includes(kind)?0:kind==='avatar'?1:2;
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function copyExtensionIcons(source,target){fs.mkdirSync(target,{recursive:true});for(const name of fs.readdirSync(source))if(name.endsWith('.png'))fs.copyFileSync(path.join(source,name),path.join(target,name));}
const {WebArtwork,imageMime}=require('./web-artwork.cjs');
const {pairExtension}=require('./extension-pairing.cjs');
class BrowserMedia {
 constructor(profile,port=43829,companionFolder=null,artwork=new WebArtwork(),diagnostics=()=>({}),control=null,persistentTokenPath=null){
  this.transport={mediaRequests:0,unauthorized:0,invalid:0,lastAt:0};this.clients=new Map();this.last='';this.sequence=0;this.artwork=artwork;
  const folder=companionFolder||path.join(profile,'浏览器插件');
  const tokenPath=persistentTokenPath||path.join(profile,'browser-token');this.token=fs.existsSync(tokenPath)?fs.readFileSync(tokenPath,'utf8'):crypto.randomBytes(32).toString('hex');fs.writeFileSync(tokenPath,this.token);
  // Development copies can be generated locally. Release builds only pair a separately installed extension.
  if(!companionFolder){
   fs.mkdirSync(folder,{recursive:true});
   copyExtensionIcons(path.join(__dirname,'browser-helper','icons'),path.join(folder,'icons'));
   for(const name of ['manifest.json','page-media.js','page-cover.js','content.js','background.js'])fs.copyFileSync(path.join(__dirname,'browser-helper',name),path.join(folder,name));
  }
  this.paired=pairExtension(folder,this.token);
  this.folder=folder;
  this.server=http.createServer((req,res)=>{
   res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','Content-Type, X-Taskbar-Token');res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
   if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
   if(req.headers['x-taskbar-token']!==this.token){if(req.url==='/media')this.transport.unauthorized++;res.writeHead(403);res.end();return;}
   if(req.url==='/status'&&req.method==='GET'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({transport:this.transport,clients:[...this.clients.values()].filter(c=>Date.now()-c.at<2500).map(({id,title,videoTitle,siteName,playing,available,cover,coverKind,receivedBytes,coverDebug,artworkKey})=>({id,title,videoTitle,siteName,playing,available,coverBytes:cover?.length||0,coverKind:coverKind||'',receivedBytes:receivedBytes||0,coverDebug,artworkKey})),current:this.current()?.title||'',widget:diagnostics()}));return;}
   if(req.url==='/layout'&&req.method==='GET'){Promise.resolve(diagnostics().layout?.()).then(layout=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(layout||{}));}).catch(()=>{res.writeHead(500);res.end();});return;}
   if(req.url==='/placement'&&req.method==='POST'){let body='';req.on('data',part=>{body+=part;if(body.length>1024)req.destroy();});req.on('end',()=>{try{const value=JSON.parse(body);if(!Number.isInteger(value.displayId)||!['left','right','free'].includes(value.side))throw Error('Invalid placement');const ok=diagnostics().placement?.(value.displayId,value.side);res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:!!ok}));}catch{res.writeHead(400);res.end();}});return;}
   if(req.url==='/cover'&&req.method==='GET'){const cover=this.current()?.cover||'',match=/^data:([^;]+);base64,(.+)$/.exec(cover);if(!match){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',match[1]);res.end(Buffer.from(match[2],'base64'));return;}
   if(req.url==='/control'&&req.method==='POST'){const desired=control?control():this.toggle();res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:typeof desired==='boolean',desired}));return;}
   if(req.url!=='/media'||req.method!=='POST'){res.writeHead(404);res.end();return;}
   this.transport.mediaRequests++;this.transport.lastAt=Date.now();let body='';req.on('data',part=>{body+=part;if(body.length>2097152)req.destroy();});req.on('end',()=>{try{
    const data=JSON.parse(body);if(typeof data.id!=='string'||data.id.length>80)throw Error('Invalid client');
    const old=this.clients.get(data.id),command=old?.command;
    const client={cover:"",coverKind:"",id:data.id,videoTitle:String(data.videoTitle||'').slice(0,320),siteName:String(data.siteName||'').slice(0,32),title:String(data.title||'网页').slice(0,200),url:String(data.url||'').slice(0,2048),browser:String(data.browser||'Chrome'),live:/live\.douyin\.com|douyu\.com|huya\.com|live\.bilibili\.com/.test(data.url||''),playing:!!data.playing,available:!!data.available,at:Date.now(),started:data.playing&&!old?.playing?++this.sequence:old?.started||0};
    if(typeof old?.desired==='boolean'&&client.playing!==old.desired&&Date.now()-old.desiredAt<2500){client.desired=old.desired;client.desiredAt=old.desiredAt;}
    const candidates=(Array.isArray(data.artwork)?data.artwork:[]).filter(item=>item&&typeof item.src==='string'&&item.src.length<2048).slice(0,6).map(item=>({src:item.src,kind:['media','poster','thumbnail','avatar','icon'].includes(item.kind)?item.kind:'image'}));
    let browserCover='';if(typeof data.coverData==='string'&&data.coverData.length<1500000){const match=/^data:application\/octet-stream;base64,([A-Za-z0-9+/=]+)$/.exec(data.coverData);if(match){const bytes=Buffer.from(match[1],'base64'),mime=imageMime(bytes);if(mime&&bytes.length<=1048576)browserCover='data:'+mime+';base64,'+match[1];}}
    client.coverDebug=data.coverDebug;client.receivedBytes=typeof data.coverData==='string'?data.coverData.length:0;client.artworkKey=JSON.stringify([client.videoTitle,candidates]);if(old?.artworkKey===client.artworkKey){client.cover=old.cover;client.coverKind=old.coverKind;}
    if(browserCover&&(!client.cover||coverRank(data.coverKind)<=coverRank(client.coverKind))){client.cover=browserCover;client.coverKind=['media','poster','thumbnail','avatar','icon'].includes(data.coverKind)?data.coverKind:'image';client.browserCover=true;}
    this.clients.set(data.id,client);if(client.playing)this.last=client.id;
    if(old?.artworkKey!==client.artworkKey)this.artwork.read(candidates).then(result=>{const current=this.clients.get(client.id);if(current?.artworkKey===client.artworkKey&&result.cover&&(!current.cover||coverRank(result.coverKind)<coverRank(current.coverKind)))Object.assign(current,result);}).catch(()=>{});
    res.setHeader('Content-Type','application/json');res.end(JSON.stringify({command}));
   }catch{this.transport.invalid++;res.writeHead(400);res.end();}});
  });this.server.on('error',()=>{});this.server.listen(port,'127.0.0.1');
 }
 available(){return [...this.clients.values()].filter(c=>Date.now()-c.at<2500&&c.available);}
 current(browser){const clients=[...this.clients.values()].filter(c=>Date.now()-c.at<2500&&c.available&&(!browser||c.browser===browser));clients.sort((a,b)=>Number(b.playing)-Number(a.playing)||b.started-a.started);return clients.find(c=>c.id===this.last&&c.playing)||clients[0];}
 open(id){const client=id?this.available().find(c=>c.id===id):this.current();if(!client)return false;client.command='open';return true;}
 toggle(id){const current=id?this.available().find(c=>c.id===id):this.current();if(!current)return undefined;const desired=!(current.desired??current.playing);current.desired=desired;current.desiredAt=Date.now();current.command=desired?'play':'pause';this.last=current.id;return desired;}
 close(){this.server.close();}
}
module.exports={BrowserMedia};
