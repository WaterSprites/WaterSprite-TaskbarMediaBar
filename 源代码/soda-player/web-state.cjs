const {webLabels}=require('./web-labels.cjs');
function webState(state,browser,browserName){
 const labels=webLabels(browser?.title||state.title,browser?.url||'',browserName);
 const value={web:true,webName:labels.name,webDetail:labels.detail,lyrics:'',cover:browser?.cover||'',coverOrigin:browser?.cover?'web':'',coverError:''};
 if(browser){const direct=browser.live||!state.canToggle;Object.assign(value,{browserControl:direct,title:browser.title,artist:'',...(direct?{playing:browser.desired??browser.playing,canToggle:true,canNext:false,canPrevious:false,timelineKnown:false}:{})});}
 return value;
}
module.exports={webState};
