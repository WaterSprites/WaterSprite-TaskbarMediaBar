function supervise(start,report=()=>{}){
 let child,timer,stopped=false,epoch=0;
 function launch(){if(stopped)return;const token=++epoch;child=start();const failed=(code,signal)=>{if(stopped||token!==epoch)return;++epoch;report({code:code instanceof Error?code.message:code,signal});clearTimeout(timer);timer=setTimeout(launch,1000);};child.once('exit',failed);child.once('error',failed);}
 launch();return {kill(){stopped=true;++epoch;clearTimeout(timer);child?.kill()},restart(){if(stopped)return;++epoch;clearTimeout(timer);child?.kill();launch()}};
}
module.exports={supervise};
