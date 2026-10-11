function displayOptions(displays,primaryId){return displays.map((display,index)=>({id:display.id,label:`屏幕 ${index+1} · ${display.label||'显示器'}${display.id===primaryId?'（主屏）':''}`}));}
module.exports={displayOptions};
