// Copyright 2026 WaterSprites. MIT.
let context:CanvasRenderingContext2D|null;
const measured=new Map<string,number>();
export function getTextWidth(text:string,font?:string){
 if(!font)return {width:0,subWidths:Array.from(text,()=>0)};
 context??=document.createElement('canvas').getContext('2d');
 if(!context)return {width:0,subWidths:Array.from(text,()=>0)};
 context.font=font;
 const subWidths=Array.from(text,char=>{
  const key=font+'\0'+char;let width=measured.get(key);
  if(width===undefined){width=context!.measureText(char).width;measured.set(key,width);if(measured.size>8192)measured.delete(measured.keys().next().value!)}
  return width;
 });
 return {width:subWidths.reduce((total,value)=>total+value,0),subWidths};
}
