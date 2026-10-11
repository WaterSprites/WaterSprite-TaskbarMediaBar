const assert=require('node:assert/strict'),{EventEmitter}=require('node:events');
const {protectWindow}=require('./window-policy.cjs');
class Window extends EventEmitter {isDestroyed(){return !!this.dead}setSkipTaskbar(value){this.skip=value;this.calls=(this.calls||0)+1}setAppDetails(value){this.details=value}}
const window=new Window();protectWindow(window,{exe:'A:\\Player\\WaterSprite TaskbarMediaBar.exe',platform:'win32'});
assert.equal(window.skip,true);assert.equal(window.details.relaunchDisplayName,'WaterSprite TaskbarMediaBar');
for(const event of ['show','focus','restore']){window.skip=false;window.emit(event);assert.equal(window.skip,true)}
window.dead=true;const calls=window.calls;window.emit('show');assert.equal(window.calls,calls);
console.log('Window taskbar policy lifecycle passed.');
