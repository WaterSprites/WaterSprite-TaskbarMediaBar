const assert=require('node:assert/strict');
const {DockHint}=require('./dock-hint.cjs');
const windows=[];
class Window {
 constructor(options){this.options=options;this.visible=false;this.destroyed=false;this.webContents={once:(_,fn)=>this.loaded=fn};windows.push(this);}
 setIgnoreMouseEvents(value){this.clickThrough=value;}
 once(_,fn){this.loaded=fn;}
 setAlwaysOnTop(...level){this.level=level;}
 loadURL(url){this.url=url;}
 setBounds(bounds){this.bounds=bounds;}
 showInactive(){this.visible=true;}
 moveTop(){this.raised=(this.raised||0)+1;}
 hide(){this.visible=false;}
 destroy(){this.destroyed=true;this.visible=false;}
 isDestroyed(){return this.destroyed;}
}
let changed=0;
const hint=new DockHint(Window,id=>id===1?2.25:1.5,()=>changed++);
const primary={displayId:1,bounds:{x:10,y:100,width:344,height:40}},secondary={displayId:2,bounds:{x:1500,y:100,width:344,height:40}};
hint.show(primary);windows[0].loaded();assert.deepEqual(windows[0].level,[true,'screen-saver',1]);assert.equal(windows[0].clickThrough,true);
hint.show(null);assert.equal(windows[0].visible,false);hint.show(primary);assert.equal(windows[0].visible,true);assert.ok(windows[0].raised>=2);
hint.show(secondary);windows[1].loaded();assert.equal(windows[0].destroyed,true);assert.equal(windows[1].visible,true);assert.deepEqual(windows[1].bounds,{...secondary.bounds,y:60,height:80});
hint.show(null);windows[1].loaded();assert.equal(windows[1].visible,false);
hint.show(primary);windows[2].loaded();assert.equal(windows[1].destroyed,true);assert.equal(windows[2].visible,true);assert.ok(changed>=6);
hint.destroy();assert.equal(windows[2].destroyed,true);
const warmed=new DockHint(Window,()=>1);warmed.prepare(primary);const prepared=windows.at(-1);prepared.loaded();assert.equal(prepared.visible,false);assert.equal(warmed.ready,true);assert.deepEqual(prepared.bounds,{...primary.bounds,y:60,height:80});warmed.show(primary);assert.equal(prepared.visible,true);warmed.destroy();
console.log('吸附提示重复显示、主副屏缩放切换、提示置顶和隐藏后加载检查通过');
