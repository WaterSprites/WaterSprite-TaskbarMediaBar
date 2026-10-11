const sites=[[/kuaishou\.com|快手/,'快手'],[/weibo\.com|weibo\.cn|微博/,'微博'],[/\b(?:x|twitter)\.com|\/ X$/,'X'],[/douyin\.com|抖音/,'抖音'],[/xiaohongshu\.com|小红书/,'小红书'],[/instagram\.com|Instagram/i,'Instagram'],[/bilibili\.com|哔哩哔哩|bilibili/i,'哔哩哔哩'],[/douyu\.com|斗鱼/,'斗鱼'],[/huya\.com|虎牙/,'虎牙'],[/youtube\.com|youtu\.be|youtube/i,'YouTube']];
function webLabels(title,url='',browser='Chrome'){
 const text=String(title||'').trim(),parts=text.split(/\s*[|｜丨—–·]\s*|\s*-\s*/).filter(Boolean);
 const known=sites.find(([pattern])=>pattern.test(url+' '+text));
 if(known){const name=known[1];const detail=parts.filter(p=>p!==name&&!/^抖音精选电脑版$/.test(p)&&!/^哔哩哔哩.*干杯/.test(p)).join(' · ');return {name,detail:detail===text&&text===name?'':detail};}
 if(parts.length>1){const last=parts.at(-1);if(last.length<=16)return {name:last,detail:parts.slice(0,-1).join(' · ')};if(parts[0].length<=16)return {name:parts[0],detail:parts.slice(1).join(' · ')};}
 let host='';try{host=new URL(url).hostname.replace(/^www\./,'');}catch{}
 return {name:host||browser,detail:text===browser?'':text};
}
module.exports={webLabels};
