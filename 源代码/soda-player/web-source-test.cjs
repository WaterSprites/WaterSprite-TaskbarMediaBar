const assert=require('node:assert/strict'),{SourceRouter}=require('./source-router.cjs'),{MediaState}=require('./media-state.cjs'),{sessionEntries}=require('./source-names.cjs');
const page={source:'web:current',label:'快手（Chrome）',browser:'Chrome',playing:true};const state={source:'',sessions:[{...page}],audio:[],webSources:[page]};
const router=new SourceRouter();assert.equal(router.choose(state,1000),page.source);assert.equal(sessionEntries(state.sessions,[])[0].label,'快手（Chrome）');
assert.equal(router.choose({...state,selected:page.source},1100),null);
const media=new MediaState();assert.equal(media.accept({...state,source:page.source,title:'当前视频',cover:'真实图片',browserControl:true,canToggle:true}).source,page.source);
const closed=media.accept({...state,source:'',sessions:[],webSources:[]});assert.equal(closed.cover,'');assert.equal(closed.canToggle,false);
assert.equal(router.choose({...state,sessions:[],webSources:[]},2000),null);
console.log('无系统媒体会话的网页可列出和路由；关闭后清空图片和控制。');
