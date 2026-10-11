const assert=require('node:assert/strict');const {webState}=require('./web-state.cjs');
const raw={title:'测试视频',cover:'CHROME-ICON',canToggle:true,playing:true};assert.equal(webState(raw,null,'Chrome').cover,'');assert.equal(webState(raw,{title:'视频 - YouTube',url:'https://www.youtube.com/watch?v=test',cover:''},'Chrome').cover,'');
for(const kind of ['thumbnail','icon','avatar']){const result=webState(raw,{title:'视频 - YouTube',url:'https://www.youtube.com/watch?v=test',cover:'WEBSITE-IMAGE',coverKind:kind},'Chrome');assert.equal(result.cover,'WEBSITE-IMAGE');assert.equal(result.webName,'YouTube');assert.equal(result.webDetail,'视频');assert.equal(result.browserControl,false);}
console.log('浏览器自身图标永不回退、网页缺图回退本软件、网站和视频图片优先、YouTube名称检查通过');
