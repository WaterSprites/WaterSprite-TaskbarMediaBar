const https=require('node:https'),dns=require('node:dns'),net=require('node:net');
function publicAddress(address){
 if(net.isIP(address)===4){const [a,b]=address.split('.').map(Number);return a>0&&a<224&&a!==10&&a!==127&&a!==169&&!(a===172&&b>=16&&b<=31)&&!(a===192&&(b===168||b===0))&&!(a===100&&b>=64&&b<=127)&&!(a===198&&(b===18||b===19));}
 if(net.isIP(address)===6)return !/^(::|fc|fd|fe8|fe9|fea|feb|ff)/i.test(address);
 return false;
}
function allowedUrl(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&(!u.port||u.port==='443')&&!/localhost|\.local$|\.internal$/i.test(u.hostname)&&(!net.isIP(u.hostname.replace(/^\[|\]$/g,''))||publicAddress(u.hostname.replace(/^\[|\]$/g,'')));}catch{return false;}}
function normalizeArtworkUrl(value){try{const u=new URL(value);if(u.protocol==='http:'&&/(^|\.)xhscdn\.com$/i.test(u.hostname)&&!u.username&&!u.password&&!u.port){u.protocol='https:';return u.href;}}catch{}return value;}
function imageMime(bytes){
 // AVIF uses an ISO BMFF ftyp box; verify its declared bounds and brand slots.
 if(bytes.length>=16&&bytes.subarray(4,8).toString()==='ftyp'){
  const size=bytes.readUInt32BE(0);
  if(size>=16&&size<=bytes.length&&size<=256){
   const brands=[bytes.subarray(8,12).toString()];
   for(let offset=16;offset+4<=size;offset+=4)brands.push(bytes.subarray(offset,offset+4).toString());
   if(brands.some(brand=>brand==='avif'||brand==='avis'))return 'image/avif';
  }
 }
 if(bytes.length>8&&bytes[0]===137&&bytes.subarray(1,4).toString()==='PNG')return 'image/png';
 if(bytes.length>3&&bytes[0]===255&&bytes[1]===216)return 'image/jpeg';
 if(bytes.subarray(0,3).toString()==='GIF')return 'image/gif';
 if(bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP')return 'image/webp';
 if(bytes.length>6&&bytes.readUInt32LE(0)===65536)return 'image/x-icon';
 const svg=bytes.toString('utf8');if(/<svg[\s>]/i.test(svg)&&!/<!(?:DOCTYPE|ENTITY)|<script|<foreignObject|\bon\w+\s*=/i.test(svg))return 'image/svg+xml';
 return '';
}
function download(value,redirects=0){return new Promise(resolve=>{
 if(!allowedUrl(value)||redirects>3){resolve('');return;}
 const request=https.get(value,{headers:{Accept:'image/*','User-Agent':'Mozilla/5.0',...(/(^|\.)sinaimg\.cn$/.test(new URL(value).hostname)?{Referer:'https://weibo.com/'}:{})},lookup:(host,options,callback)=>dns.lookup(host,{family:4},(error,address,family)=>{if(error){callback(error);return;}if(!publicAddress(address)){callback(Error('Private image address'));return;}if(options.all)callback(null,[{address,family}]);else callback(null,address,family);})},response=>{
  if(response.statusCode>=300&&response.statusCode<400&&response.headers.location){response.resume();try{resolve(download(new URL(response.headers.location,value).href,redirects+1));}catch{resolve('');}return;}
  if(response.statusCode!==200||Number(response.headers['content-length']||0)>1048576){response.resume();resolve('');return;}
  let size=0;const chunks=[];
  response.on('data',chunk=>{size+=chunk.length;if(size>1048576){request.destroy();resolve('');return;}chunks.push(chunk);});
  response.on('end',()=>{const bytes=Buffer.concat(chunks),mime=imageMime(bytes);resolve(mime?'data:'+mime+';base64,'+bytes.toString('base64'):'');});
  response.on('error',()=>resolve(''));
 });request.setTimeout(3000,()=>{request.destroy();resolve('');});request.on('error',()=>resolve(''));
});}
class WebArtwork {
 constructor(fetchImage=download){this.fetchImage=fetchImage;this.cache=new Map();}
 async read(candidates){
 const results=candidates.slice(0,6).map(async item=>{
  item={...item,src:normalizeArtworkUrl(item.src)};
  if(!allowedUrl(item.src))return null;
  let cached=this.cache.get(item.src);if(!cached||Date.now()-cached.at>30000){cached={at:Date.now(),promise:this.fetchImage(item.src)};this.cache.set(item.src,cached);if(this.cache.size>48)this.cache.delete(this.cache.keys().next().value);}
  const cover=await cached.promise;return cover?{cover,coverKind:item.kind||'image'}:null;
 }).map(p=>p.catch(()=>null));for(const pending of results){const result=await pending;if(result)return result;}return {cover:'',coverKind:''};
 }
}
module.exports={WebArtwork,allowedUrl,publicAddress,imageMime,normalizeArtworkUrl};
