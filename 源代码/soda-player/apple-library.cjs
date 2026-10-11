const fs=require('node:fs'),path=require('node:path');
const {createDecipheriv}=require('node:crypto');
const {inflateSync}=require('node:zlib');
const {fileURLToPath}=require('node:url');
// Format references (library metadata only):
// https://home.vollink.com/gary/playlister/musicdb.html
// https://github.com/jsharkey13/musicdb-to-json
// https://github.com/rinsuki/musicdb2sqlite
function unpackLibrary(bytes){
 if(bytes.length<100||bytes.toString('ascii',0,4)!=='hfma')throw Error('Apple Music 资料库格式不支持');
 const header=bytes.readUInt32LE(4),body=bytes.subarray(header);
 if(header<100||header>bytes.length)throw Error('Apple Music 资料库头部不完整');
 let encrypted=bytes.readUInt32LE(84);if(encrypted>body.length)encrypted=body.length-body.length%16;
 if(encrypted%16)throw Error('Apple Music 资料库正在写入');
 let prefix=Buffer.alloc(0);
 if(encrypted){const decipher=createDecipheriv('aes-128-ecb',Buffer.from('BHUILuilfghuila3'),null);decipher.setAutoPadding(false);prefix=Buffer.concat([decipher.update(body.subarray(0,encrypted)),decipher.final()]);}
 return inflateSync(Buffer.concat([prefix,body.subarray(encrypted)]),{maxOutputLength:128*1024*1024});
}
function parseTracks(bytes){
 const data=unpackLibrary(bytes),tracks=[];
 for(let at=data.indexOf('itma');at>=0;at=data.indexOf('itma',at+4)){
  if(at+16>data.length)continue;
  const header=data.readUInt32LE(at+4),count=data.readUInt32LE(at+12);
  if(header<24||header>4096||count>256||at+header>data.length)continue;
  const track={title:'',artist:'',album:'',file:'',duration:0};let offset=at+header;
  for(let n=0;n<count;n++){
   if(offset+20>data.length||data.toString('ascii',offset,offset+4)!=='boma')break;
   const size=data.readUInt32LE(offset+8),kind=data.readUInt32LE(offset+12);
   if(size<20||offset+size>data.length)break;
   const chunk=data.subarray(offset,offset+size);
   if(kind===1&&size>=180)track.duration=chunk.readUInt32LE(176)/1000;
   const field={2:'title',3:'album',4:'artist',11:'file',67:'file'}[kind];
   if(field&&size>=36){const encoding=chunk.readUInt32LE(20),length=chunk.readUInt32LE(24);if(length<=size-36&&(encoding===1||encoding===2)){const text=chunk.subarray(36,36+length).toString(encoding===1?'utf16le':'utf8').replace(/\0+$/,'');if(text)track[field]=text;}}
   offset+=size;
  }
  if(/^file:/i.test(track.file)){try{track.file=fileURLToPath(track.file)}catch{track.file=''}}
  if(track.title&&path.isAbsolute(track.file))tracks.push(track);
 }
 return tracks;
}
let loaded=new Map();
function libraryTracks(roots){
 const locations=roots.flatMap(root=>[path.join(root,'Apple Music/Apple Music Library.musiclibrary/Library.musicdb'),path.join(root,'iTunes/iTunes Library.musiclibrary/Library.musicdb')]);
 const tracks=[];let error='';
 for(const location of locations){try{const info=fs.statSync(location),stamp=info.size+'|'+info.mtimeMs;let cached=loaded.get(location);if(cached?.stamp!==stamp){cached={stamp,tracks:parseTracks(fs.readFileSync(location))};loaded.set(location,cached);}tracks.push(...cached.tracks);}catch(e){if(e.code!=='ENOENT')error=e.message}}
 return {tracks,error};
}
module.exports={unpackLibrary,parseTracks,libraryTracks};
