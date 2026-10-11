import fs from 'node:fs';
import path from 'node:path';
import {parseFile} from 'music-metadata';
const directory=String.raw`A:\Apps\播放器\酷我音乐\酷我音乐 缓存\缓存`;
for(const name of fs.readdirSync(directory)){
 if(!/\.(mp3|flac|m4a)$/i.test(name))continue;
 try{const m=await parseFile(path.join(directory,name));console.log(JSON.stringify({file:name,title:m.common.title,artist:m.common.artist,duration:m.format.duration,pictures:m.common.picture?.map(p=>({type:p.type,format:p.format,bytes:p.data.length}))||[]}));}catch(e){console.log(JSON.stringify({file:name,error:e.message}));}
}
