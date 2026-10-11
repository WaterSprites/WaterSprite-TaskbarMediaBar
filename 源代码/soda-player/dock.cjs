function makeTargets(displays,bars,width,height){
 return bars.filter(b=>b.width>b.height && b.width>=width).flatMap(bar=>{
  const display=displays.find(d=>bar.x>=d.bounds.x-2&&bar.x<d.bounds.x+d.bounds.width&&bar.y>=d.bounds.y-2&&bar.y<d.bounds.y+d.bounds.height);
  if(!display)return [];
  const h=Math.min(height,bar.height),y=bar.y+Math.round((bar.height-h)/2);
  const right=Math.min(bar.x+bar.width,Number.isFinite(bar.trayLeft)?bar.trayLeft:bar.x+bar.width-200);
  if(bar.occupiedReady===false)return [];
  const start=bar.x+4,end=right-4;
  const obstacles=(bar.occupied||[]).filter(r=>Number.isFinite(r.x)&&r.width>0&&r.x<end&&r.x+r.width>start).map(r=>({left:Math.max(start,r.x-4),right:Math.min(end,r.x+r.width+4)})).sort((a,b)=>a.left-b.left);
  const gaps=[];let cursor=start;
  for(const r of obstacles){if(r.left>cursor)gaps.push({left:cursor,right:r.left});cursor=Math.max(cursor,r.right);}
  if(cursor<end)gaps.push({left:cursor,right:end});
  const available=gaps.filter(g=>g.right-g.left>=width);
  if(!available.length)return [];
  return ['left','right'].map(side=>{const gap=side==='left'?available[0]:available.at(-1);return {displayId:display.id,side,bar,bounds:{x:side==='left'?gap.left:gap.right-width,y,width,height:h}}});
 });
}
function chooseTarget(targets,cursor,bounds){
 return targets.filter(t=>cursor.x>=t.bar.x&&cursor.x<=t.bar.x+t.bar.width && (bounds?bounds.y+bounds.height>=t.bar.y-32&&bounds.y<=t.bar.y+t.bar.height+15:cursor.y>=t.bar.y-50&&cursor.y<=t.bar.y+t.bar.height+15))
  .sort((a,b)=>Math.abs(cursor.x-(a.bounds.x+a.bounds.width/2))-Math.abs(cursor.x-(b.bounds.x+b.bounds.width/2)))[0];
}
module.exports={makeTargets,chooseTarget};
