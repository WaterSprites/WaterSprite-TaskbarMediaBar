const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {Unpackr}=require('./vendor/msgpackr/unpack.cjs');
const SODA_INDEX=path.join(process.env.APPDATA||'', 'SodaMusic/LunaCacheV2/entries.db');
const QQ_LYRICS=String.raw`A:\Apps\播放器\QQ音乐\QQ音乐 缓存\QQMusicLyricNew`;
const QQ_PICTURES=String.raw`A:\Apps\播放器\QQ音乐\QQ音乐 缓存\QQMusicPicture`;
const KUWO_LYRICS=String.raw`A:\Apps\播放器\酷我音乐\酷我音乐 缓存\歌词`;
const normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
let index=[],pictures=[],updated=0,decoder;
function refresh(force=false){if(!force&&Date.now()-updated<10000)return;updated=Date.now();try{index=fs.readdirSync(QQ_LYRICS).filter(n=>n.endsWith('_qm.qrc')).flatMap(name=>{const m=name.match(/^(.*?) - (.*?) - (\d+) - (.*)_qm\.qrc$/);return m?[{name,artist:m[1],title:m[2],duration:Number(m[3]),album:m[4]}]:[]})}catch{index=[]}try{pictures=fs.readdirSync(QQ_PICTURES).filter(n=>/\.(jpg|png|webp)$/i.test(n)&&!/^Albumdefault\./i.test(n))}catch{pictures=[]}}
function matchSong(state,entries=index){const title=normalize(state.title),artist=normalize(state.artist);if(!title)return;const candidates=entries.filter(e=>normalize(e.title)===title&&(!artist||normalize(e.artist)===artist)&&(!state.duration||Math.abs(e.duration-state.duration)<4));return candidates.length===1?candidates[0]:undefined}
function matchQQSong(state,entries=index){
 const exact=matchSong(state,entries);if(exact)return exact;
 if(!Number.isFinite(state.duration)||![30,60].some(seconds=>Math.abs(state.duration-seconds)<1)||!normalize(state.artist))return;
 const title=normalize(state.title),artist=normalize(state.artist);if(!title)return;
 const same=entries.filter(e=>normalize(e.title)===title&&normalize(e.artist)===artist);
 if(same.some(e=>Math.abs(e.duration-state.duration)<4))return;
 const candidates=same.filter(e=>e.duration>state.duration+4);
 return candidates.length===1?candidates[0]:undefined;
}
function timedText(lines){return lines.filter(l=>Number.isFinite(l.start)&&l.text).map(l=>l.words.length?`[${l.start},${l.duration}]`+l.words.map(w=>`<${Math.max(0,w.start-l.start)},${w.duration},0>${w.text}`).join(''):`[${String(Math.floor(l.start/60000)).padStart(2,'0')}:${(l.start%60000/1000).toFixed(3).padStart(6,'0')}]${l.text}`).join('\n')}
function originalQrc(xml){const first=String(xml).match(/LyricContent\s*=\s*"[^"]*"/);return first?'<Lyric '+first[0]+'/>':xml;}
function originalLrc(text){const seen=new Set();return String(text).replace(/\r/g,'').split('\n').filter(line=>{const match=line.match(/^\[(\d+):(\d+(?:\.\d+)?)\](.*)$/);if(!match)return !/^\[(?:tr|translation|translate):/i.test(line);const time=Number(match[1])*60+Number(match[2]);if(!match[3].trim())return false;if(seen.has(time))return false;seen.add(time);return true}).join('\n');}
function readKuwo(state){
 try{const wanted=normalize(state.artist+'-'+state.title),files=fs.readdirSync(KUWO_LYRICS).filter(name=>/\.lrc$/i.test(name)&&normalize(name.slice(0,-4))===wanted);if(files.length!==1)return {lyrics:'',cover:'',lyricFile:''};const bytes=fs.readFileSync(path.join(KUWO_LYRICS,files[0]));let text;try{text=new TextDecoder('utf-8',{fatal:true}).decode(bytes)}catch{text=new TextDecoder('gb18030').decode(bytes)}return {lyrics:originalLrc(text),cover:'',lyricFile:files[0]};}catch{return {lyrics:'',cover:'',lyricFile:''}}
}
async function readQQ(state){refresh(true);const song=matchQQSong(state);let lyrics='',cover='';if(song){try{decoder ||= import(pathToFileURL(path.join(__dirname,'vendor/qq-lyrics/qrc2lrc.js')).href);const d=await decoder;lyrics=timedText(d.parseQrcXml(originalQrc(d.decryptQrc(fs.readFileSync(path.join(QQ_LYRICS,song.name))))))}catch{}}
 const artist=normalize(state.artist||song?.artist),album=normalize(state.album||song?.album);if(artist&&album){const matches=pictures.filter(name=>normalize(name.replace(/_\d+\.(jpg|png|webp)$/i,''))===artist+album);if(matches.length===1){try{const p=matches[0],bytes=fs.readFileSync(path.join(QQ_PICTURES,p));if(bytes.length<=4e6)cover='data:image/'+(/\.png$/i.test(p)?'png':/\.webp$/i.test(p)?'webp':'jpeg')+';base64,'+bytes.toString('base64')}catch{}}}
 return {lyrics,cover,lyricFile:song?.name||''};}
let sodaStamp='',sodaSongs=[];
function readSoda(state){
 try{const stat=fs.statSync(SODA_INDEX),stamp=stat.size+'|'+stat.mtimeMs;if(stamp!==sodaStamp){
  const data=fs.readFileSync(SODA_INDEX),marker=Buffer.from('d47240','hex'),tracks=new Map();
  for(let at=data.indexOf(marker);at>=0;at=data.indexOf(marker,at+3)){
   try{let record;new Unpackr({mapsAsObjects:true}).unpackMultiple(data.subarray(at),value=>{record=value;return false});const md=record?.info?.mediaDetail,p=md?.playable,t=p?.track||p;if(!t?.name||!md.lyrics?.content)continue;
    tracks.set(String(t.id||p.key),{title:t.name,artist:(t.artists||[]).map(a=>a.name).join(''),duration:Number(t.duration)/1000,lyrics:md.lyrics.content});
   }catch{}
  }sodaSongs=[...tracks.values()];sodaStamp=stamp;
 }
 const song=matchSong(state,sodaSongs);return {lyrics:song?.lyrics||'',cover:'',lyricFile:song?'汽水音乐本地缓存':''};
 }catch{return {lyrics:'',cover:'',lyricFile:''}}
}
module.exports={readQQ,readSoda,readKuwo,originalQrc,originalLrc,matchSong,matchQQSong,timedText,normalize,QQ_LYRICS,SODA_INDEX};
