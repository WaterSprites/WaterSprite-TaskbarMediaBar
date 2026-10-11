import fs from 'node:fs';
import path from 'node:path';
import {parseFile} from 'music-metadata';
import {libraryTracks} from './apple-library.cjs';
const normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
function textTag(text){if(!text||!/[\u0080-\u00ff]/.test(text)||[...text].some(c=>c.charCodeAt(0)>255))return text||'';try{return new TextDecoder('gb18030',{fatal:true}).decode(Buffer.from(text,'latin1'))}catch{return text}}
let entries=[],rootKey='',lastScan=0;
async function scan(roots){
 const key=roots.join('|');if(key===rootKey&&Date.now()-lastScan<300000)return;
 rootKey=key;lastScan=Date.now();const files=[],visited=new Set();
 function walk(dir,depth){if(depth>4||files.length>=10000)return;let items;try{const real=fs.realpathSync(dir);if(visited.has(real))return;visited.add(real);items=fs.readdirSync(dir,{withFileTypes:true})}catch{return}for(const item of items){if(item.isSymbolicLink())continue;const file=path.join(dir,item.name);if(item.isDirectory())walk(file,depth+1);else if(/\.(mp3|flac|m4a|aac|ogg|opus|wav|aiff|ape)$/i.test(item.name))files.push(file);if(files.length>=10000)break;}}
 roots.forEach(root=>walk(root,0));const next=[];
 for(const file of files){try{const metadata=await parseFile(file,{skipCovers:true,duration:false});next.push({file,title:textTag(metadata.common.title),artist:textTag(metadata.common.artist),duration:metadata.format.duration||0});}catch{}}
 entries=next;
}
export async function readLocal(state){
 const roots=(state.mediaRoots||[]).filter(Boolean);if(!roots.length||!state.title||!state.artist)return {cover:''};
 const title=normalize(state.title),artist=normalize(state.artist);
 let available;
 if(/applemusic/i.test(state.sourceName||state.source)){const library=libraryTracks(roots);available=library.tracks;if(library.error&&!available.length)return {cover:'',cacheError:library.error};}
 else{await scan(roots);available=entries;}
 const matches=available.filter(e=>normalize(e.title)===title&&(normalize(e.artist)===artist||(/applemusic/i.test(state.sourceName||state.source)&&normalize(e.artist+' — '+e.album)===artist))&&(!state.duration||!e.duration||Math.abs(e.duration-state.duration)<4));
 // Ambiguous editions must not borrow each other's artwork.
 if(matches.length!==1)return {cover:''};
 try{const metadata=await parseFile(matches[0].file);const picture=metadata.common.picture?.find(p=>p.type==='Cover (front)')||metadata.common.picture?.[0];const details={localFile:matches[0].file,canonicalArtist:matches[0].artist,album:matches[0].album||''};if(!picture||picture.data.length>4e6)return {cover:'',...details};return {cover:'data:'+picture.format+';base64,'+Buffer.from(picture.data).toString('base64'),...details};}catch{return {cover:''}}
}

export async function readExact(file){
 try{const metadata=await parseFile(file,{duration:false});const picture=metadata.common.picture?.find(p=>p.type==='Cover (front)')||metadata.common.picture?.[0];return {cover:picture&&picture.data.length<=4e6?'data:'+picture.format+';base64,'+Buffer.from(picture.data).toString('base64'):'',localFile:file};}catch{return {cover:'',localFile:file}}
}
