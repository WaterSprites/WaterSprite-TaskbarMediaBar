const assert=require('node:assert/strict');const {webLabels}=require('./web-labels.cjs');
assert.deepEqual(webLabels('抖音-记录美好生活','https://www.douyin.com/'),{name:'抖音',detail:'记录美好生活'});
assert.deepEqual(webLabels('小红书 - 你的生活兴趣社区','https://www.xiaohongshu.com/'),{name:'小红书',detail:'你的生活兴趣社区'});
assert.deepEqual(webLabels('视频标题 | 示例网站','https://example.com/'),{name:'示例网站',detail:'视频标题'});
assert.deepEqual(webLabels('Chrome'),{name:'Chrome',detail:''});
const {imageMime,WebArtwork}=require('./web-artwork.cjs');assert.equal(imageMime(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><path/></svg>')),'image/svg+xml');assert.equal(imageMime(Buffer.from('<svg><script>alert(1)</script></svg>')),'');
(async()=>{let finish;const slow=new Promise(r=>finish=r);let requests=0;const reader=new WebArtwork(url=>{requests++;return url.endsWith('poster')?slow:Promise.resolve('data:image/png;base64,icon');});const result=reader.read([{src:'https://example.com/poster',kind:'poster'},{src:'https://example.com/icon',kind:'icon'}]);await new Promise(r=>setImmediate(r));assert.equal(requests,2);finish('');assert.equal((await result).coverKind,'icon');console.log('网页两行标题、分隔符、SVG网站图标、并行封面回退检查通过');})().catch(e=>{console.error(e);process.exitCode=1;});

const avifHeader=Buffer.from('00000020667479706176696600000000617669666d6966316d6961664d413142','hex');
assert.equal(imageMime(avifHeader),'image/avif');
assert.equal(imageMime(Buffer.from('00000020667479706d703432000000006d70343269736f6d6d6961664d413142','hex')),'');
assert.equal(imageMime(avifHeader.subarray(0,16)),'');
