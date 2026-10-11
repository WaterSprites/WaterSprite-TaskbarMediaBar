const fs=require('node:fs'),path=require('node:path');
const normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const decode=b=>{try{return new TextDecoder('utf-8',{fatal:true}).decode(b)}catch{return new TextDecoder('gb18030').decode(b)}};
const entity=s=>s.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[0-9a-f]+);/gi,m=>({ '&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>' }[m.toLowerCase()]||String.fromCodePoint(parseInt(m.slice(2,-1).replace(/^x/i,''),/^&#x/i.test(m)?16:10))));
const env=name=>process.env[Object.keys(process.env).find(key=>key.toUpperCase()===name)];
function roots(){return [...new Set([env('PROGRAMDATA')&&path.join(env('PROGRAMDATA'),'kuwodata','kwmusic2013'),env('LOCALAPPDATA')&&path.join(env('LOCALAPPDATA'),'kuwodata','kwmusic2013'),env('APPDATA')&&path.join(env('APPDATA'),'kuwodata','kwmusic2013')].filter(Boolean))]}
function records(text){const result=[];for(const match of text.matchAll(/<so\s+((?:"[^"]*"|'[^']*'|[^'">])*)>/g)){const row={};for(const a of match[1].matchAll(/(\w+)\s*=\s*(["'])(.*?)\2/g))row[a[1]]=entity(a[3]);if(/^MUSIC_\d+$/.test(row.musicrid||''))result.push(row)}return result}
function songId(state,dataRoots=roots()){
 const title=normalize(state.title),artist=normalize(state.artist);if(!title)return '';
 const matches=new Set();for(const root of dataRoots){for(const folder of ['ModuleData/ModPlayList/playstat','ModuleData/ModPlayList','ModuleData/ModDownload','ModuleData/ModLocalLibrary']){const dir=path.join(root,folder);let names;try{names=fs.readdirSync(dir).filter(n=>/\.pl(?:\.temp)?$/i.test(n)).slice(0,150)}catch{continue}
 for(const name of names)try{const file=path.join(dir,name);if(fs.statSync(file).size>8e6)continue;for(const row of records(decode(fs.readFileSync(file))))if(normalize(row.name)===title&&(!artist||normalize(row.artist)===artist))matches.add(row.musicrid.slice(6))}catch{}}}
 // Online selections are cached by the client's web UI rather than saved in .pl files.
 if(matches.size)return matches.size===1?[...matches][0]:'';
 for(const root of dataRoots){const dir=path.join(root,'Cache/webcache');let names;try{names=fs.readdirSync(dir).filter(n=>n.endsWith('.dat')).slice(0,150)}catch{continue}
 for(const name of names)try{const file=path.join(dir,name);if(fs.statSync(file).size>8e6)continue;const bytes=fs.readFileSync(file),start=bytes.indexOf(123);if(start<0)continue;const text=decode(bytes.subarray(start)),end=text.lastIndexOf('}');if(end<0)continue;const data=JSON.parse(text.slice(0,end+1));
 const visit=(node,depth=0)=>{if(!node||typeof node!=='object'||depth>8)return;if(Array.isArray(node)){for(const row of node){if(row&&normalize(row.name)===title&&(!artist||normalize(row.artist)===artist)&&/^\d+$/.test(String(row.id||'')))matches.add(String(row.id));visit(row,depth+1)}}else for(const key of ['data','musiclist','list','abslist'])visit(node[key],depth+1)};visit(data);
 }catch{}}
 return matches.size===1?[...matches][0]:'';
}
function imageType(b){if(b.length>=3&&b[0]===255&&b[1]===216&&b[2]===255)return 'image/jpeg';if(b.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')))return 'image/png';if(b.length>=12&&b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP')return 'image/webp';return ''}
function image(b){const type=imageType(b);return type&&b.length<=4e6?'data:'+type+';base64,'+b.toString('base64'):''}
const memo=new Map();
async function readKuwoArtwork(state,options={}){
 const rid=songId(state,options.roots||roots());if(!rid)return {cover:''};const old=memo.get(rid);if(old&&Date.now()-old.at<(old.cover?1800000:60000))return old;
 const folder=state.kuwoCoverCache,file=folder&&path.join(folder,rid+'.image');
 if(file)try{const cover=image(fs.readFileSync(file));if(cover){const result={cover,coverOrigin:'酷我歌曲ID封面缓存',kuwoSongId:rid,at:Date.now()};memo.set(rid,result);return result}}catch{}
 let result={cover:'',kuwoSongId:rid,at:Date.now()};
 try{
 const request=options.fetch||fetch;
 // The client's shipped singleComment.js uses these exact rid_pic parameters.
 const response=await request('http://artistpic.kwcdn.kuwo.cn/pic.web?type=rid_pic&pictype=url&size=500&rid='+rid,{signal:AbortSignal.timeout(5000)});if(!response.ok)throw Error('酷我封面地址请求失败');
 const text=(await response.text()).trim();if(text.length>2048)throw Error('酷我封面地址无效');const url=new URL(text);if(!['http:','https:'].includes(url.protocol)||!/(^|\.)kwcdn\.kuwo\.cn$/i.test(url.hostname)||url.username||url.password)throw Error('酷我封面不是客户端图片地址');
 const picture=await request(url.href,{signal:AbortSignal.timeout(6000)});if(!picture.ok||Number(picture.headers.get('content-length'))>4e6)throw Error('酷我封面图片请求失败');
 const reader=picture.body.getReader(),chunks=[];let count=0;for(;;){const part=await reader.read();if(part.done)break;count+=part.value.length;if(count>4e6){await reader.cancel();throw Error('酷我封面过大')}chunks.push(Buffer.from(part.value))}
 const bytes=Buffer.concat(chunks),cover=image(bytes);if(!cover)throw Error('酷我返回的内容不是图片');
 result={cover,coverOrigin:'酷我歌曲ID专辑封面',kuwoSongId:rid,at:Date.now()};if(file)try{fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(file,bytes)}catch{}
 }catch(error){result.coverError=error.message}
 memo.set(rid,result);if(memo.size>128)memo.delete(memo.keys().next().value);return result;
}
module.exports={readKuwoArtwork,songId,records,imageType};
