const assert=require('node:assert/strict');
const {WebArtwork,normalizeArtworkUrl,allowedUrl}=require('./web-artwork.cjs');
(async()=>{
 const url='http://sns-webpic-qc.xhscdn.com/path/image!webp?key=abc%2Fdef';
 const secure=url.replace('http:','https:');
 assert.equal(normalizeArtworkUrl(url),secure);
 for(const value of ['https://sns-webpic-qc.xhscdn.com/cover','http://example.com/cover','http://xhscdn.com.example.com/cover','http://fake-xhscdn.com/cover','http://user@xhscdn.com/cover','http://xhscdn.com:8080/cover'])assert.equal(normalizeArtworkUrl(value),value);
 assert.equal(allowedUrl('http://example.com/cover'),false);
 assert.equal(allowedUrl('https://127.0.0.1/cover'),false);
 const calls=[];
 const reader=new WebArtwork(async src=>{calls.push(src);return 'data:image/webp;base64,dGVzdA==';});
 assert.deepEqual(await reader.read([{src:url,kind:'thumbnail'}]),{cover:'data:image/webp;base64,dGVzdA==',coverKind:'thumbnail'});
 await reader.read([{src:secure,kind:'thumbnail'}]);
 assert.deepEqual(calls,[secure],'Normalized addresses share the existing cache');
 for(const src of ['https://example.com/douyin.jpg','https://example.com/weibo.jpg','https://example.com/youtube.jpg'])await reader.read([{src,kind:'poster'}]);
 assert.deepEqual(calls.slice(1),['https://example.com/douyin.jpg','https://example.com/weibo.jpg','https://example.com/youtube.jpg']);
 console.log('PASS: XHS HTTPS upgrade, exact host boundary, credentials/port restrictions, cache and other HTTPS addresses.');
})().catch(error=>{console.error(error);process.exitCode=1;});
