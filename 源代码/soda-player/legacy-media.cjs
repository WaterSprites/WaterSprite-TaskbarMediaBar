const {normalize}=require('./cache-media.cjs');
function windowTrack(source){
 const raw=String(source?.windowTitle||'').trim();
 const kuwo=/kwmusic|kuwo/i.test(source?.name||''),netease=/cloudmusic/i.test(source?.name||'');
 if(!kuwo&&!netease)return null;
 const doubled=raw+raw,marker=doubled.indexOf('酷我音乐');
 if(kuwo&&marker<0)return null;
 const text=kuwo?doubled.slice(marker+4,marker+raw.length).replace(/^-|-\s*$/gu,'').trim():raw.replace(/\s*[-—]\s*网易云音乐\s*$/u,'').trim();
 const separator=netease?text.lastIndexOf(' - '):text.lastIndexOf('-');
 if(separator<1)return null;
 const title=text.slice(0,separator).trim(),artist=text.slice(separator+(netease?3:1)).trim();
 return title&&artist?{title,artist,sourceName:source.name}:null;
}
module.exports={windowTrack};
