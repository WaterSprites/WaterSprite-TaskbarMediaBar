const pageImages=new Map();
function imageCandidate(url){try{const u=new URL(url);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&!/localhost|\.local$|\.internal$|^\[|^\d+\.\d+\.\d+\.\d+$/.test(u.hostname);}catch{return false;}}
function prepareImage(items){
 const valid=items.filter(i=>imageCandidate(i.src)).slice(0,6),key=JSON.stringify(valid);let entry=pageImages.get(key);
 if(!entry||(!entry.data&&Date.now()-entry.at>30000)){entry={at:Date.now(),rank:Infinity};pageImages.set(key,entry);if(pageImages.size>32)pageImages.delete(pageImages.keys().next().value);
  const requests=valid.map(async item=>{try{const r=await fetch(item.src,{credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(4000)});if(!r.ok||Number(r.headers.get('content-length')||0)>1048576)return null;const bytes=new Uint8Array(await r.arrayBuffer());if(bytes.length>1048576)return null;let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return {data:'data:application/octet-stream;base64,'+btoa(binary),kind:item.kind};}catch{return null;}});
  requests.forEach((request,rank)=>request.then(result=>{if(result&&rank<entry.rank)Object.assign(entry,result,{rank});}));
 }
 return entry;
}
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
 if(message?.type!=='taskbar-media-poll'||!sender.tab||sender.id!==chrome.runtime.id)return;
 const images=[...(message.state.artwork||[]),...(sender.tab.favIconUrl?[{src:sender.tab.favIconUrl,kind:'icon'}]:[])];const image=prepareImage(images);
 fetch('http://127.0.0.1:43829/media',{
  method:'POST',headers:{'Content-Type':'application/json','X-Taskbar-Token':message.token},
  body:JSON.stringify({...message.state,title:message.state.videoTitle||sender.tab.title||message.state.title,url:sender.tab.url||message.state.url,coverData:message.state.frameImage||image.data||'',coverKind:message.state.frameImage?'thumbnail':image.kind||'',artwork:[...(message.state.artwork||[]),...(sender.tab.favIconUrl?[{src:sender.tab.favIconUrl,kind:'icon'}]:[])]}),signal:AbortSignal.timeout(2000)
 }).then(response=>{if(!response.ok)throw Error('连接失败');return response.json();})
 .then(async result=>{if(result.command==='open'){await chrome.tabs.update(sender.tab.id,{active:true});if(Number.isInteger(sender.tab.windowId))await chrome.windows.update(sender.tab.windowId,{focused:true});reply({});}else reply(result);}).catch(()=>reply({disconnected:true}));
 return true;
});
