function iconNames(widgetTheme,systemDark){
 return {cover:widgetTheme==='dark'?'cover-dark.png':'cover-light.png',tray:systemDark?'tray-dark-native.ico':'tray-light-native.ico',application:'app.ico'};
}
module.exports={iconNames};
