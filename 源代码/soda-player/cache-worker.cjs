const {parentPort}=require('node:worker_threads');
const cache=require('./cache-media.cjs');
const {readKugouLyrics}=require('./kugou-lyrics.cjs');
const {readKuwoArtwork}=require('./kuwo-artwork.cjs');
const {readNetease}=require('./netease-media.cjs');
const {readLocal,readExact}=require('./vendor/local-media.cjs');
parentPort.on('message',async({id,state})=>{try{if(state.filepath){parentPort.postMessage({id,result:await readExact(state.filepath)});return;}const source=state.sourceName||state.source;let result=/kugou|酷狗/i.test(source)?readKugouLyrics(state):/qqmusic/i.test(source)?await cache.readQQ(state):/kwmusic|kuwo/i.test(source)?{...cache.readKuwo(state),...await readKuwoArtwork(state)}:/汽水|sodamusic/i.test(source)?cache.readSoda(state):/cloudmusic|网易云/i.test(source)?await readNetease(state):{lyrics:'',cover:''};if(!result.cover){const local=await readLocal(state);result={...local,...result,cover:result.cover||local.cover||'',lyrics:result.lyrics||local.lyrics||'',lyricFile:result.lyricFile||local.lyricFile||''};}parentPort.postMessage({id,result})}catch(error){parentPort.postMessage({id,result:{lyrics:'',cover:'',cacheError:error.message}})}});
