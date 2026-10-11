const https=require('node:https');
const {normalize,originalLrc}=require('./cache-media.cjs');
const {imageMime}=require('./web-artwork.cjs');
const cache=new Map();
function request(url){return new Promise((resolve,reject)=>{
 const u=new URL(url);if(u.protocol!=='https:'||!(/^(music\.163\.com|p\d+\.music\.126\.net)$/.test(u.hostname)))return reject(Error('Unsupported NetEase host'));
 const req=https.get(u,{headers:{'User-Agent':'Mozilla/5.0',Referer:'https://music.163.com/'}},res=>{
  if(res.statusCode!==200){res.resume();reject(Error('NetEase HTTP '+res.statusCode));return;}
  let size=0;const chunks=[];res.on('data',chunk=>{size+=chunk.length;if(size>4e6)req.destroy(Error('NetEase response too large'));else chunks.push(chunk)});
  res.on('end',()=>resolve(Buffer.concat(chunks)));res.on('error',reject);
 });req.setTimeout(5000,()=>req.destroy(Error('NetEase request timeout')));req.on('error',reject);
});}
async function json(url){return JSON.parse((await request(url)).toString('utf8'));}
function selectSong(state,songs){
 const title=normalize(state.title),artist=normalize(state.artist);if(!title||!artist)return;
 const matches=songs.filter(s=>normalize(s.name)===title&&normalize((s.artists||s.ar||[]).map(a=>a.name).join(''))===artist&&(!state.duration||Math.abs((s.duration||s.dt)/1000-state.duration)<4));
 return matches.length===1?matches[0]:undefined;
}
async function fetchTrack(state){
 const search=state.neteaseSongId&&/^\d+$/.test(state.neteaseSongId)?{result:{songs:[{id:state.neteaseSongId,name:state.title,duration:state.duration*1000,artists:state.artist.split(/\s*\/\s*/).map(name=>({name}))}]}}:await json('https://music.163.com/api/search/get?type=1&limit=30&s='+encodeURIComponent(state.title+' '+state.artist));
 const song=selectSong(state,search.result?.songs||[]);if(!song)return {lyrics:'',cover:'',cacheError:'网易云未找到唯一匹配的歌曲'};
 const [detail,lyric]=await Promise.allSettled([json('https://music.163.com/api/song/detail/?ids='+encodeURIComponent(JSON.stringify([song.id]))),json('https://music.163.com/api/song/lyric?id='+song.id+'&lv=-1&kv=-1&tv=-1')]);
 let cover='';const track=detail.status==='fulfilled'?selectSong(state,detail.value.songs||[]):undefined;
 const image=track?.album?.picUrl||track?.al?.picUrl;
 if(image){try{const bytes=await request(image.replace(/^http:/,'https:')+'?param=192y192'),mime=imageMime(bytes);if(mime)cover='data:'+mime+';base64,'+bytes.toString('base64')}catch{}}
 return {cover,lyrics:lyric.status==='fulfilled'?originalLrc(lyric.value.lrc?.lyric||''):'',lyricFile:'网易云官方歌词 · '+song.id,neteaseSongId:String(song.id)};
}
async function readNetease(state){
 const key=normalize(state.title)+'|'+normalize(state.artist);if(!state.title||!state.artist)return {lyrics:'',cover:''};
 let entry=cache.get(key);if(!entry||Date.now()-entry.at>60000){entry={at:Date.now(),promise:fetchTrack(state).catch(error=>({lyrics:'',cover:'',cacheError:error.message}))};cache.set(key,entry);if(cache.size>24)cache.delete(cache.keys().next().value)}return entry.promise;
}
module.exports={readNetease,selectSong};
