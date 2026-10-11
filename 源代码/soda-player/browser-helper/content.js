(()=>{
 const id=crypto.randomUUID();let remembered=null,busy=false;const frames=new WeakMap();
 const media=()=>Array.from(document.querySelectorAll('video,audio'));
 function artwork(active,detail){
  const list=[];
  for(const item of pageCover(active,detail))list.push(item);
  if(active?.poster)list.push({src:active.poster,kind:'poster'});
  for(const item of detail?.images||[])list.push(item);
  if(!detail?.title&&detail?.site!=='Instagram')for(const item of navigator.mediaSession?.metadata?.artwork||[])list.push({src:item.src,kind:'media'});
  const thumbnail=document.querySelector('meta[property="og:image"],meta[name="twitter:image"]')?.content;
  if(thumbnail&&!detail?.title&&detail?.site!=='Instagram')list.push({src:thumbnail,kind:'thumbnail'});
  const author=document.querySelector('ytd-video-owner-renderer #avatar img, #owner #avatar img, img[itemprop="author"]');if(author?.src)list.push({src:author.src,kind:'avatar'});
  for(const icon of document.querySelectorAll('link[rel~="icon"],link[rel="apple-touch-icon"]'))if(icon.href)list.push({src:icon.href,kind:'icon'});
  try{list.push({src:new URL('/favicon.ico',document.baseURI).href,kind:'icon'});}catch{}
  return list.map(item=>{try{return {...item,src:new URL(item.src,document.baseURI).href};}catch{return null;}}).filter(Boolean).filter((item,index,all)=>all.findIndex(other=>other.src===item.src)===index).slice(0,6);
 }
 function pageCover(active,detail){if(!active||!detail?.title)return [];try{const key=detail.title+'|'+active.currentSrc;active.setAttribute('data-watersprite-cover-query',JSON.stringify({key,title:detail.title}));active.dispatchEvent(new Event('watersprite-cover-query',{bubbles:true}));const result=JSON.parse(active.getAttribute('data-watersprite-cover-result')||'{}');return result.key===key&&Array.isArray(result.images)?result.images:[];}catch{return [];}}
 function videoFrame(active,detail){if(!['快手','抖音','微博','Instagram'].includes(detail?.site)||!active?.videoWidth||active.readyState<2)return '';const key=detail.title+'|'+active.currentSrc;let old=frames.get(active);if(old?.key===key&&(old.data||Date.now()-old.at<10000))return old.data;try{const c=document.createElement('canvas');c.width=192;c.height=Math.max(1,Math.round(192*active.videoHeight/active.videoWidth));c.height=Math.min(c.height,320);c.getContext('2d').drawImage(active,0,0,c.width,c.height);const data='data:application/octet-stream;base64,'+c.toDataURL('image/jpeg',.7).split(',')[1];frames.set(active,{key,data});return data;}catch{frames.set(active,{key,data:'',at:Date.now()});return '';}}
 async function poll(){
  if(busy||!globalThis.taskbarMediaToken)return;busy=true;
  try{
   const list=media();if(!list.length&&!remembered)return;if(remembered&&!document.contains(remembered))remembered=null;const active=TaskbarPageMedia.choose(list,remembered,document);const playing=list.filter(m=>!m.paused&&!m.ended);if(active)remembered=active;const detail=TaskbarPageMedia.context(active,document);const metadataTitle=navigator.mediaSession?.metadata?.title||'';const videoTitle=detail?.title||(!detail&&metadataTitle)||'';
   const {command}=await chrome.runtime.sendMessage({type:'taskbar-media-poll',token:globalThis.taskbarMediaToken,state:{id,title:videoTitle||document.title,videoTitle,videoAuthor:detail?.author||'',siteName:detail?.site||'',frameImage:videoFrame(active,detail),coverDebug:{poster:!!active?.poster,dimensions:[active?.videoWidth||0,active?.videoHeight||0],frameReadable:!!frames.get(active)?.data,pageHints:(()=>{try{return JSON.parse(active?.getAttribute('data-watersprite-cover-result')||'{}').hints}catch{return []}})()},url:document.baseURI,browser:/Edg\//.test(navigator.userAgent||'')?'Edge':navigator.brave?'Brave':'Chrome',playing:!!active&&!active.paused&&!active.ended,available:!!(remembered||list.length),artwork:artwork(active,detail)}});
   if(command==='pause'&&active){remembered=active;active.pause();}
   if(command==='play'){const item=remembered||list[0];if(item)Promise.resolve(item.play()).catch(()=>{});}
  }catch{}finally{busy=false;}
 }
 document.addEventListener('play',event=>{if(event.target?.matches?.('video,audio'))remembered=event.target;poll();},true);document.addEventListener('pause',poll,true);document.addEventListener('loadedmetadata',event=>{frames.delete(event.target);poll();},true);setInterval(poll,150);poll();
})();
