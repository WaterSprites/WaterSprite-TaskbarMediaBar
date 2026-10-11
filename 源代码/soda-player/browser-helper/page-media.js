(function(root){
 const clean=value=>String(value||'').replace(/\s+/g,' ').trim().slice(0,320);
 const rules=[
  {host:/(^|\.)x\.com$|(^|\.)twitter\.com$/,name:'X',card:'article,[data-testid="tweet"]',title:'[data-testid="tweetText"]',author:'[data-testid="User-Name"]',image:'[data-testid="tweetPhoto"] img',avatar:'[data-testid="Tweet-User-Avatar"] img'},
  {host:/(^|\.)weibo\.(com|cn)$/,name:'微博',card:'article,[mid],[data-mid],[class*="Feed_wrap"],[class*="WB_feed_type"],[class*="card-wrap"]',title:'[class*="detail_wbtext"],[class*="wbpro-feed-content"],[class*="feed-content"],[class*="Feed_text"],[node-type="feed_list_content"],[class*="Feed_body"],[class*="WB_text"],[class*="Feed_content"]',author:'[class*="head_name"],[class*="Head_name"],[class*="WB_name"]',image:'[class*="Video"] img,[class*="video"] img',avatar:'[class*="avatar"] img,[class*="Avatar"] img'},
  {host:/(^|\.)douyin\.com$/,name:'抖音',card:'[data-e2e="feed-active-video"],[data-e2e="feed-video"],[data-e2e="video-detail"],[data-e2e="aweme-detail"],[class*="swiper-slide-active"]',title:'[data-e2e="video-desc"],[data-e2e="feed-video-title"],[data-e2e="feed-video-desc"],[data-e2e="video-detail-title"],[data-e2e="video-info-desc"],[class*="video-info"] [class*="desc"]',author:'[data-e2e="video-author-name"],[data-e2e="feed-video-author"]',image:'[data-e2e="video-cover"] img',avatar:'[data-e2e="video-author-avatar"] img'},
  {host:/(^|\.)kuaishou\.com$/,name:'快手',card:'[class*="video-card"],[class*="video-detail"],[class*="player-container"],[class*="swiper-slide-active"]',title:'[class*="caption"],[class*="video-info-title"],[class*="video-desc"],[class*="video-description"]',author:'[class*="author-name"],[class*="user-name"]',image:'[class*="cover"] img',avatar:'[class*="avatar"] img'}
 ];
 function instagramContext(video,doc){
  const site='Instagram',images=[];
  let card=video.closest('article'),reelCaption='';
  if(!card){const dialog=video.closest('[role="dialog"]');if(dialog&&dialog.querySelectorAll('video').length===1)card=dialog;}
  // Reels wraps each video in many divs; stop at the nearest single-video caption container.
  if(!card){let node=video.parentElement;for(let i=0;node&&i<24;i++,node=node.parentElement){if(node===document.body||node===document.documentElement||node.querySelectorAll('video').length!==1)break;const caption=[...node.querySelectorAll('div[dir="auto"]')].find(el=>{const r=el.getBoundingClientRect(),text=clean(el.innerText||el.textContent);return r.width>0&&r.height>0&&text.length>3&&!el.querySelector('video')&&!/^(?:[•·]\s*)?(?:AI 内容|AI content|关注|已关注|follow|following|查看翻译|see translation|[\d,.]+[万千kmb]?)$/i.test(text);});if(caption){card=node;reelCaption=clean(caption.innerText||caption.textContent);break;}}}
  if(!card)return {site,title:'',author:'',images};
  const authorLink=card.querySelector('header a[href],h2 a[href],h3 a[href]');
  let author=clean(authorLink?.innerText||authorLink?.textContent);
  if(!author){const link=[...card.querySelectorAll('a[href]')].find(el=>/^\/[A-Za-z0-9._]+\/?$/.test(el.getAttribute('href')||'')&&!/^\/(?:reels|explore|accounts|direct)\/?$/.test(el.getAttribute('href')||''));author=clean(link?.innerText||link?.textContent);}
  let title=reelCaption;
  const excluded=/^(?:[•·]|[\d,.]+[万千kmb]?|more|less|follow|following|(?:[•·]\s*)?AI (?:content|内容)|see translation|view all.*|add a comment.*|liked by.*|\d[\d,.]* (?:likes|comments)|关注|已关注|更多|展开|收起|查看翻译|查看全部.*|添加评论.*|赞|点赞|评论)$/i;
  for(const selector of ['[data-testid="post-caption"]','h1','div[dir="auto"]','span[dir="auto"]']){
   if(title)break;
   for(const el of [...card.querySelectorAll(selector)].slice(0,60)){
    if(el.closest('header,h2,h3,button,nav,time')||el.closest('ul')&&/^(div|span)/.test(selector))continue;
    const text=clean(el.innerText||el.textContent);if(!text||text===author||excluded.test(text))continue;
    if(el.querySelector('video')||el.querySelector('input,textarea'))continue;
    if(el.closest('a')&&!el.closest('a')?.getAttribute('href')?.startsWith('/explore/tags/'))continue;
    title=text;break;
   }
   if(title)break;
  }
  // Only images covering the current video count as thumbnails; profile pictures and other posts do not.
  const r=video.getBoundingClientRect(),area=r.width*r.height;
  if(area>0)for(const img of [...card.querySelectorAll('img')].slice(0,60)){
   if(img.closest('header,h2,h3')||/profile|avatar|头像|个人资料/i.test(img.alt||''))continue;
   const ir=img.getBoundingClientRect(),overlap=Math.max(0,Math.min(r.right,ir.right)-Math.max(r.left,ir.left))*Math.max(0,Math.min(r.bottom,ir.bottom)-Math.max(r.top,ir.top));
   if(ir.width<120||ir.height<120||overlap/area<.6)continue;
   if(img.currentSrc||img.src)images.push({src:img.currentSrc||img.src,kind:'thumbnail'});
  }
  return {site,title:title||(author?author+' · 视频':''),author,images};
 }
 function visibleArea(video,doc){const r=video.getBoundingClientRect(),w=doc.defaultView.innerWidth,h=doc.defaultView.innerHeight;return Math.max(0,Math.min(r.right,w)-Math.max(r.left,0))*Math.max(0,Math.min(r.bottom,h)-Math.max(r.top,0));}
 function choose(list,remembered,doc){const ranked=list.filter(v=>!v.ended&&(!v.paused||v===remembered)).map(v=>({v,area:visibleArea(v,doc),score:(!v.paused?1e9:0)+(v===remembered&&visibleArea(v,doc)>0?3e8:0)+(!v.muted&&v.volume>0?1e8:0)+visibleArea(v,doc)})).filter(x=>x.area>0||(!x.v.paused&&!x.v.muted&&x.v.volume>0));ranked.sort((a,b)=>b.score-a.score);return ranked[0]?.v||(remembered&&doc.contains(remembered)?remembered:list[0]);}
 function context(video,doc= document){if(!video)return null;if(/(^|\.)instagram\.com$/i.test(doc.location.hostname))return instagramContext(video,doc);const rule=rules.find(r=>r.host.test(doc.location.hostname));if(!rule)return null;let card=video.closest(rule.card),node=video.parentElement;
  // Some players live in a wrapper below the text; take the nearest common card, never the whole feed.
  for(let i=0;node&&i<12;i++,node=node.parentElement){if(node===doc.body||node===doc.documentElement)break;if(node.querySelector(rule.title)&&node.querySelectorAll('video').length<=2){card=node;break}}
  if(!card){const r=video.getBoundingClientRect();const nearby=[...doc.querySelectorAll(rule.title)].map(el=>({el,r:el.getBoundingClientRect()})).filter(x=>x.r.width>0&&x.r.bottom>=r.top-320&&x.r.top<=r.bottom&&Math.min(x.r.right,r.right)>Math.max(x.r.left,r.left)).sort((a,b)=>Math.abs(a.r.bottom-r.top)-Math.abs(b.r.bottom-r.top));if(nearby.length){const el=nearby[0].el;return {site:rule.name,title:clean(el.innerText||el.textContent),author:'',images:[]}}return {site:rule.name,title:'',author:'',images:[]};}
  const text=selector=>{for(const el of card.querySelectorAll(selector)){const t=clean(el.innerText||el.textContent);if(t)return t}return ''};
  let title=text(rule.title),author=text(rule.author);if(!title&&author)title=author+' · 视频';const generic=/^(主页\s*\/\s*X|精彩推荐|记录美好生活|随时随地发现新鲜事|首页|推荐|微博)$/;
  if(rule.name==='微博')title=title.replace(/\s*(?:(?:\.{3}|…)?展开\s+播放视频|(?:暂停|播放)\s+当前时间)[\s\S]*$/,'').trim();if(generic.test(title))title='';const images=[];for(const [selector,kind] of [[rule.image,'thumbnail'],[rule.avatar,'avatar']]){const img=card.querySelector(selector);if(img?.currentSrc||img?.src)images.push({src:img.currentSrc||img.src,kind})}
  if(!video.poster&&!images.some(i=>i.kind==='thumbnail')){for(const el of [video.parentElement,...card.querySelectorAll('[class*="cover"],[class*="poster"]')]){if(!el)continue;const bg=doc.defaultView.getComputedStyle(el).backgroundImage;const match=/url\(["']?([^"')]+)["']?\)/.exec(bg);if(match&&/^https?:/.test(match[1])){images.unshift({src:match[1],kind:'thumbnail'});break;}}}
  return {site:rule.name,title,author,images};
 }
 const api={choose,context,clean};root.TaskbarPageMedia=api;if(typeof module==='object')module.exports=api;
})(globalThis);
