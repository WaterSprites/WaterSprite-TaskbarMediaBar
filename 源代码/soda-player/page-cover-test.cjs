const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
class Node {}
class HTMLVideoElement extends Node {constructor(){super();this.attrs={};}getAttribute(k){return this.attrs[k];}setAttribute(k,v){this.attrs[k]=v;}}
let handler;const body=new Node(),card=new Node(),video=new HTMLVideoElement();video.parentElement=card;card.parentElement=body;
Object.defineProperty(card,'__vueParentComponent',{value:{props:{photo:{caption:'当前播放的视频',coverUrl:'https://example.com/current.jpg'},other:{caption:'邻近视频',coverUrl:'https://example.com/wrong.jpg'}}},enumerable:false});
vm.runInNewContext(fs.readFileSync(__dirname+'/browser-helper/page-cover.js','utf8'),{Node,HTMLVideoElement,window:{},document:{body,addEventListener:(name,fn)=>handler=fn}});
video.setAttribute('data-watersprite-cover-query',JSON.stringify({key:'one',title:'当前播放的视频 #话题'}));handler({target:video});const result=JSON.parse(video.getAttribute('data-watersprite-cover-result'));assert.deepEqual(result.images,[{src:'https://example.com/current.jpg',kind:'thumbnail'}]);
video.setAttribute('data-watersprite-cover-query',JSON.stringify({key:'two',title:'另一个尚未取得封面的标题'}));handler({target:video});assert.equal(JSON.parse(video.getAttribute('data-watersprite-cover-result')).images.length,0);
const root=new Node(),second=new HTMLVideoElement();root.parentElement=body;second.parentElement=root;root.nodeType=1;root.contains=()=>true;
Object.defineProperty(root,'__vue_app__',{value:{_container:{_vnode:{component:{subTree:{el:root,children:[{component:{props:{photo:{caption:'生产版当前视频',coverUrl:'https://example.com/production.jpg'}},subTree:{el:{nodeType:1,contains:v=>v===second}}}}]}}}}},enumerable:false});
second.setAttribute('data-watersprite-cover-query',JSON.stringify({key:'three',title:'生产版当前视频'}));handler({target:second});assert.deepEqual(JSON.parse(second.getAttribute('data-watersprite-cover-result')).images,[{src:'https://example.com/production.jpg',kind:'thumbnail'}]);
console.log('Vue 隐藏属性及生产版组件可读取；邻近视频图片不会误用。');
