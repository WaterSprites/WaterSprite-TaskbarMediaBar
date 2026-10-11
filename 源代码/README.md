# WaterSprite TaskbarMediaBar

任务栏播放器源码整理副本。主程序版本 1.0.0；浏览器插件版本以 `soda-player/browser-helper/manifest.json` 为准。

本目录不含 node_modules、Electron 下载包、旧安装包、运行缓存、个人设置、连接令牌和签名私钥。

## 目录

- `soda-player/src`：Vue 界面源码与素材。
- `soda-player/*.cjs`、`*.ps1`、`*.cs`：主程序、媒体适配、窗口及系统桥接代码，含回归测试。
- `soda-player/browser-helper`：浏览器插件源码及图标。
- `soda-player/icons`：正式图标和原图。
- `soda-player/vendor`：随程序使用的第三方代码与已有许可声明。
- 根目录脚本：打包与版本、图标资源处理工具。

## 构建

需要 Windows、Node.js/npm、Python 3 和 Windows PowerShell。Vite 7 对 Node.js 有版本要求，建议使用满足其要求的 Node.js 22.12 或更新兼容版本。

```powershell
cd soda-player
npm ci
npm run build
cd ..
python package_media_bar.py
```

构建会下载依赖与 Electron，需要网络连接。生成 release-output 目录中的主程序、Chrome 插件和 Edge 插件三个 ZIP。

主程序与插件独立发布。将主程序 ZIP 与对应浏览器的插件 ZIP 解压到同一位置，合并主程序文件夹；先启动主程序，再加载其中的 `浏览器插件` 目录。插件包不携带 `auth.js`，更新时保留本机原文件。

不要只执行 `npm start` 就认定首次运行已验证；界面需要先构建到 dist。部分回归脚本会启动窗口或操控媒体，阅读脚本后按需运行。

主程序包：WaterSprite-TaskbarMediaBar-1.0.0-x64.zip。
浏览器插件包：WaterSprite-TaskbarMediaBar-Extension-1.1.18-Chrome.zip 或 WaterSprite-TaskbarMediaBar-Extension-1.1.18-Edge.zip。

项目代码采用 MIT，第三方组件与 MiSans 字体适用各自许可证，详见 THIRD_PARTY_NOTICES.md。
