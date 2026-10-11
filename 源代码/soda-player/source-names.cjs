const aliases=[[/mpc-hc/i,'MPC-HC'],[/applemusic|apple.*music|AMPLibraryAgent/i,'Apple Music'],[/qqmusic|qq音乐/i,'QQ音乐'],[/kugou|酷狗/i,'酷狗音乐'],[/kuwo|kwmusic|酷我/i,'酷我音乐'],[/cloudmusic|netease|网易云/i,'网易云音乐'],[/sodamusic|汽水|luna/i,'汽水音乐'],[/^yy(?:\.exe)?$|yyclient|yyexternal/i,'YY'],[/douyin|抖音/i,'抖音'],[/douyu|RpcMediaDecoderEx|斗鱼/i,'斗鱼'],[/huya|虎牙/i,'虎牙'],[/bilibili|哔哩/i,'哔哩哔哩'],[/msedge|microsoftedge/i,'Edge'],[/chrome/i,'Chrome'],[/firefox/i,'Firefox'],[/brave/i,'Brave'],[/opera/i,'Opera'],[/qqbrowser/i,'QQ浏览器'],[/360se|360chrome/i,'360浏览器'],[/vlc/i,'VLC'],[/potplayer/i,'PotPlayer'],[/wmplayer|mediaplayer/i,'媒体播放器']];
function sourceName(source,description=''){
 for(const [pattern,name] of aliases)if(pattern.test(source))return name;
 const text=description||source.split('!')[0].split(/[\\/]/).pop().replace(/\.exe$/i,'');
 return text.length>18?text.slice(0,17)+'…':text;
}
function excludedSource(source='',description=''){if(!source.startsWith('web:')&&/(?:^|[\\/!])(?:douyin(?:_lynx)?|抖音)(?:\.exe)?(?:!.*)?$/i.test(source))return true;return /(?:^|[\\/!\s])(dnplayer|ldplayer|ld9boxheadless|ldvboxheadless|ldvboxsvc|ldboxheadless|ldboxsvc|leidian)(?:[.!\s]|$)|雷电模拟器/i.test(source+' '+description)}
function sessionEntries(media,audio){
 const list=media.filter(s=>!excludedSource(s.source,s.description)).map(s=>({...s,label:s.label||sourceName(s.source,s.description),kind:'media'}));
 for(const a of audio){if(excludedSource(a.name,a.description)||/^(nvcontainer|svchost|audiodg|dllhost|rundll32|system|taskhostw|textinputhost|sihost|dwm)$/i.test(a.name))continue;const label=sourceName(a.name,a.description);if(list.some(s=>s.label===label))continue;list.push({source:'audio:'+a.pid,label,kind:'audio',playing:a.active,muted:a.muted})}
 const counts={};for(const s of list)counts[s.label]=(counts[s.label]||0)+1;
 const seen={};return list.map(s=>({...s,label:counts[s.label]>1?s.label+' '+(seen[s.label]=(seen[s.label]||0)+1):s.label}));
}
module.exports={sourceName,sessionEntries,excludedSource};
