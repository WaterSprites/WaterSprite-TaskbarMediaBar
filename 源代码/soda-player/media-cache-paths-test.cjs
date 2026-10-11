const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {discover,createLocator,configPaths}=require('./media-cache-paths.cjs');
const root=fs.mkdtempSync(path.join(__dirname,'.cache-path-discovery-test-'));
function dir(relative){const p=path.join(root,relative);fs.mkdirSync(p,{recursive:true});return p}
(async()=>{
 const install=dir('QQMusic/18.1'),newInstall=dir('QQMusic/19.2');
 const lyric=dir('Moved Cache/QQMusicLyricNew'),pictures=dir('Moved Cache/QQMusicPicture');
 const nextLyric=dir('Second Cache/QQMusicLyricNew'),nextPictures=dir('Second Cache/QQMusicPicture');
 const config=path.join(install,'config.ini');
 fs.writeFileSync(config,'CachePath='+path.dirname(lyric));
 const kuwo=dir('Kuwo'),kuwoLyric=dir('Kuwo Cache/歌词');
 fs.writeFileSync(path.join(kuwo,'config.json'),JSON.stringify({lyricPath:kuwoLyric}));
 let current=install,time=0,calls=0;
 const locator=createLocator({env:{},now:()=>time,loadRoots:async()=>{calls++;return {qq:[current],kuwo:[kuwo]}},ttl:1000});
 const first=await locator.get();
 assert(first.qqLyrics.includes(lyric));assert(first.qqPictures.includes(pictures));assert(first.kuwoLyrics.includes(kuwoLyric));
 await locator.get();assert.equal(calls,1,'Repeated reads must reuse discovery');
 fs.writeFileSync(path.join(newInstall,'config.ini'),'CachePath='+path.dirname(nextLyric));fs.unlinkSync(config);
 current=newInstall;time=1500;
 const updated=await locator.get();assert(updated.qqLyrics.includes(nextLyric));assert(updated.qqPictures.includes(nextPictures));assert.equal(calls,2);
 assert.equal(configPaths(JSON.stringify({CachePath:path.dirname(nextLyric)}),root,{})[0],path.dirname(nextLyric));
 const none=discover({qq:[path.join(root,'missing')],kuwo:[]},{});
 assert.deepEqual(none,{qqLyrics:[],qqPictures:[],kuwoLyrics:[]});
 const defaults=dir('User/QQMusic/QQMusicLyricNew');
 const standard=createLocator({env:{APPDATA:path.dirname(path.dirname(defaults))},loadRoots:async()=>({qq:[],kuwo:[]})});
 assert((await standard.get()).qqLyrics.includes(defaults));
 // Verify the consumer still reads lyrics after discovery, not only directory matching.
 process.env.APPDATA=path.join(root,'User');
 dir('User/kuwodata/kwmusic2013/lyrics');
 fs.writeFileSync(path.join(root,'User/kuwodata/kwmusic2013/lyrics/歌手-歌曲.lrc'),'[00:01.00]歌词测试');
 const cache=require('./cache-media.cjs');
 assert((await cache.readKuwo({title:'歌曲',artist:'歌手'})).lyrics.includes('歌词测试'));
 assert.equal((await cache.readQQ({title:'不存在',artist:'测试'})).lyrics,'');
 console.log(JSON.stringify({configurationRedirect:true,versionFolderChange:true,cachedDiscovery:true,missingFoldersSafe:true,defaultUserFolder:true,consumerReadsLyrics:true}));
 // Delete only this test's verified workspace folder.
 assert(root.startsWith(path.resolve(__dirname)+path.sep+'.cache-path-discovery-test-'));
 fs.rmSync(root,{recursive:true});
})().catch(e=>{console.error(e);process.exitCode=1});
