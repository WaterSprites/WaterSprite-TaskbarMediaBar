// Copyright 2026 WaterSprites. MIT.
const timestamp=value=>{
 const m=value.match(/^(\d+):(\d{1,2})(?:[.:](\d{1,3}))?$/);
 return m?Number(m[1])*60000+Number(m[2])*1000+Number((m[3]||'').padEnd(3,'0')):NaN;
};
export function parseLyrics(content=''){
 const lines=[];let offset=0;
 for(const raw of content.split(/\r?\n/)){
  const line=raw.trim(),adjust=line.match(/^\[offset:([+-]?\d+)\]$/i);
  if(adjust){offset=Number(adjust[1]);continue}
  const timed=line.match(/^\[(\d+),(\d+)\](.*)$/);
  if(timed){
   const chars=[];
   for(const word of timed[3].matchAll(/<(\d+),(\d+)(?:,[^>]*)?>([^<]*)/g)){
    const letters=Array.from(word[3]),step=Number(word[2])/Math.max(1,letters.length);
    letters.forEach((char,i)=>chars.push({char,startTime:Number(word[1])+i*step,duration:step}));
   }
   if(chars.length)lines.push({startTime:Number(timed[1]),duration:Number(timed[2]),chars,isKRC:true});
   continue;
  }
  const headers=[...line.matchAll(/\[(\d+:\d{1,2}(?:[.:]\d{1,3})?)\]/g)];
  if(!headers.length)continue;
  const text=line.slice(headers.at(-1).index+headers.at(-1)[0].length);if(!text.trim())continue;
  for(const header of headers){
   const startTime=timestamp(header[1]);if(Number.isFinite(startTime))lines.push({startTime,duration:10000,isLRC:true,chars:Array.from(text,char=>({char,startTime:-1,duration:-1}))});
  }
 }
 lines.sort((a,b)=>a.startTime-b.startTime);
 for(const line of lines)line.startTime=Math.max(0,line.startTime+offset);
 for(let i=0;i<lines.length;i++)if(lines[i].isLRC)lines[i].duration=Math.max(1000,(lines[i+1]?.startTime??lines[i].startTime+10000)-lines[i].startTime);
 return lines;
}
export function lineAt(lines,milliseconds){
 if(!lines.length)return undefined;let low=0,high=lines.length-1;
 while(low<high){const middle=Math.ceil((low+high)/2);if(lines[middle].startTime<=milliseconds)low=middle;else high=middle-1}
 return lines[low];
}
export function highlightedWidth(line,widths,milliseconds){
 if(!line||milliseconds<=line.startTime)return 0;
 if(line.isLRC)return widths.reduce((a,b)=>a+b,0);
 return line.chars.reduce((sum,char,i)=>{const elapsed=milliseconds-line.startTime-char.startTime,fraction=char.duration>0?Math.min(1,Math.max(0,elapsed/char.duration)):(elapsed>=0?1:0);return sum+(widths[i]||0)*fraction},0);
}
