const fs=require('node:fs');
const {libraryTracks}=require('./apple-library.cjs');
const {readLocal}=require('./vendor/local-media.cjs');
(async()=>{
 const mediaRoots=[String.raw`D:\桌面\音乐`];
 const library=libraryTracks(mediaRoots);if(!library.tracks.length)throw Error(library.error||'没有找到 Apple Music 资料库');
 const results=[];
 for(const t of library.tracks){
  const result=await readLocal({source:'AppleInc.AppleMusicWin_nzyj5cx40ttqa!App',title:t.title,artist:t.artist+' — '+t.album,duration:t.duration,mediaRoots});
  if(result.localFile!==t.file)throw Error('实际文件路径匹配失败: '+t.title);
  results.push({title:t.title,artist:result.canonicalArtist,fileFound:fs.existsSync(t.file),coverBytes:result.cover?.length||0});
 }
 fs.writeFileSync('local-cover-result.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results));
})().catch(error=>{console.error(error.message);process.exitCode=1});
