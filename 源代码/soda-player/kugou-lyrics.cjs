const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const {normalize}=require('./cache-media.cjs');
// KRC's fixed format constant, not an account credential. Independent decoder.
const key=Buffer.from([64,71,97,119,94,50,116,71,81,54,49,45,206,210,110,105]);
const env=name=>process.env[Object.keys(process.env).find(k=>k.toUpperCase()===name.toUpperCase())]||'';
function text(bytes){if(bytes[0]===255&&bytes[1]===254)return bytes.subarray(2).toString('utf16le');if(bytes[0]===254&&bytes[1]===255){const b=Buffer.from(bytes.subarray(2));b.swap16();return b.toString('utf16le')}try{return new TextDecoder('utf-8',{fatal:true}).decode(bytes)}catch{return new TextDecoder('gb18030').decode(bytes)}}
function lyricDirectories(state={},options={}){
 const list=[];const configRoots=options.configRoots||[env('APPDATA'),env('LOCALAPPDATA')].filter(Boolean).flatMap(r=>['KuGou8','KuGou7','KuGou'].map(n=>path.join(r,n)));
 for(const root of configRoots){for(const name of ['KuGou.ini','config.ini'])try{const file=path.join(root,name);if(fs.statSync(file).size>2e6)continue;const data=text(fs.readFileSync(file));for(const match of data.matchAll(/^\s*(?:LyricPath|LyricsPath|LrcPath)\s*=\s*(.+)$/gim)){let value=match[1].trim().replace(/^"|"$/g,'').replace(/%([^%]+)%/g,(_,n)=>env(n));if(value)list.push(path.isAbsolute(value)?value:path.resolve(root,value))}}catch{}
 list.push(path.join(root,'Lyric'),path.join(root,'Lyrics'));}
 for(const root of state.mediaRoots||[])list.push(path.join(root,'KuGou','Lyric'),path.join(root,'KugouMusic','Lyric'));
 return [...new Set(list.map(p=>path.resolve(p)))].filter(p=>{try{return fs.statSync(p).isDirectory()}catch{return false}});
}
function decodeKrc(bytes){if(bytes.length<5||bytes.subarray(0,4).toString('ascii')!=='krc1'||bytes.length>1e6)throw Error('无效KRC文件');const data=Buffer.allocUnsafe(bytes.length-4);for(let i=0;i<data.length;i++)data[i]=bytes[i+4]^key[i%key.length];return new TextDecoder('utf-8',{fatal:true}).decode(zlib.inflateSync(data,{maxOutputLength:4e6}));}
function parseLyrics(source){const tags={};for(const m of source.matchAll(/^\[(\w+):([^\]]*)\]/gm))tags[m[1].toLowerCase()]=m[2].trim();const offset=Number(tags.offset)||0;
 const lines=[];for(const raw of source.replace(/\r/g,'').split('\n')){const m=raw.match(/^\[(\d+),(\d+)\](.*)$/);if(m){const start=Math.max(0,Number(m[1])+offset);if(m[3].replace(/<\d+,\d+,\d+>/g,'').trim())lines.push('['+start+','+m[2]+']'+m[3]);}else if(/^\[\d+:\d+(?:\.\d+)?\]/.test(raw))lines.push(raw)}
 return {title:tags.ti||'',artist:tags.ar||'',hash:tags.hash||'',lyrics:lines.join('\n')};
}
function fileTrack(name){const stem=name.replace(/\.(?:krc|lrc)$/i,'').replace(/-[a-f\d]{16,32}(?:-\d+-[a-f\d]+)?$/i,'');const at=stem.indexOf(' - ');return at>0?{artist:stem.slice(0,at),title:stem.slice(at+3)}:{artist:'',title:stem};}
const decoded=new Map();
function readFile(file){const stat=fs.statSync(file);if(stat.size>1e6)throw Error('歌词文件过大');const stamp=stat.size+'|'+stat.mtimeMs,old=decoded.get(file);if(old?.stamp===stamp)return old.value;const bytes=fs.readFileSync(file),value=parseLyrics(/\.krc$/i.test(file)?decodeKrc(bytes):text(bytes));decoded.set(file,{stamp,value});if(decoded.size>2000)decoded.delete(decoded.keys().next().value);return value;}
function readKugouLyrics(state,options={}){
 const wantedTitle=normalize(state.title),wantedArtist=normalize(state.artist);if(!wantedTitle)return {lyrics:'',cover:''};const matches=[];
 for(const dir of options.directories||lyricDirectories(state,options)){let files;try{files=fs.readdirSync(dir).filter(n=>/\.(krc|lrc)$/i.test(n)).slice(0,5000)}catch{continue}
 for(const name of files){const inferred=fileTrack(name);const named=normalize(inferred.title)===wantedTitle&&(!wantedArtist||!inferred.artist||normalize(inferred.artist)===wantedArtist);if(!named&&!/^[a-f\d-]+\.(krc|lrc)$/i.test(name))continue;
 try{const file=path.join(dir,name),value=readFile(file),title=value.title||inferred.title,artist=value.artist||inferred.artist;if(normalize(title)!==wantedTitle||(wantedArtist&&normalize(artist)!==wantedArtist)||!value.lyrics)continue;if(state.kugouHash&&value.hash&&state.kugouHash.toLowerCase()!==value.hash.toLowerCase())continue;matches.push({...value,file,name,title,artist})}catch{}}
 }
 // Distinct recordings/texts are ambiguous; never choose the newest unrelated file.
 const groups=new Map();for(const m of matches)groups.set([normalize(m.artist),m.lyrics].join('|'),m);if(groups.size!==1)return {lyrics:'',cover:'',lyricError:groups.size>1?'酷狗歌词候选不唯一':''};const item=[...groups.values()][0];return {lyrics:item.lyrics,cover:'',lyricFile:item.name,lyricOrigin:'酷狗本机歌词缓存'};
}
module.exports={readKugouLyrics,lyricDirectories,decodeKrc,parseLyrics,fileTrack};
