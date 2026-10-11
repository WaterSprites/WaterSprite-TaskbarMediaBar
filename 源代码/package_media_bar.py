from pathlib import Path
import json,shutil,zipfile,os,subprocess,tempfile,hashlib
from exe_version_resource import version_resource
os.chdir(Path(__file__).resolve().parent)
root=Path('soda-player')
version=json.loads((root/'package.json').read_text(encoding='utf-8'))['version']
extensionVersion=json.loads((root/'browser-helper/manifest.json').read_text(encoding='utf-8'))['version']
release=Path('release-output');release.mkdir(exist_ok=True)
work=Path(tempfile.mkdtemp(prefix='build-'+version+'-',dir=release))
appName='WaterSprite TaskbarMediaBar';extensionName=appName+' Extension'
out=work/appName
shutil.copytree(root/'node_modules/electron/dist',out)
target=out/'resources/app';target.mkdir(parents=True,exist_ok=True)
runtime=['main.cjs','icon-theme.cjs','display-options.cjs','bridge-supervisor.cjs','soft-menu.cjs','menu-preload.cjs','menu.html','menu.css','menu.js','cache-paths.cjs','preload.cjs','media-bridge.ps1','media-state.cjs','source-router.cjs','browser-media.cjs','web-artwork.cjs','web-labels.cjs','web-state.cjs','window-control.cs','netease-control.cs','shell-bridge.ps1','cover-reader.cs','audio-sessions.cs','dock.cjs','dock-hint.cjs','source-names.cjs','mpc-adapter.cjs','cache-media.cjs','cache-worker.cjs','kuwo-artwork.cjs','kugou-lyrics.cjs','netease-media.cjs','netease-client.cjs','desktop-client.cjs','douyu-room.cjs','yy-room.cjs','yy-endpoint.ps1','client-launch.ps1','legacy-media.cjs','legacy-state.cjs','legacy-progress.ps1','legacy-frame.cs','thumbnail.ps1','window-policy.cjs','tray-image.cjs','media-cache-paths.cjs','media-cache-roots.ps1','extension-pairing.cjs','desktop-page-media.js']
for name in runtime:shutil.copy2(root/name,target/name)
for name in ['dist','vendor','third-party-licenses']:shutil.copytree(root/name,target/name)
for name in ['LICENSE','THIRD_PARTY_NOTICES.md']:shutil.copy2(root/name,target/name)
icons=target/'icons';icons.mkdir()
for p in (root/'icons').iterdir():
 if p.name in ['cover-light.png','cover-dark.png','tray-light.png','tray-dark.png','app.ico'] or p.match('tray-*-native.ico') or p.match('tray-*-small*.png'):shutil.copy2(p,icons/p.name)
(target/'package.json').write_text(json.dumps({'name':'watersprite-taskbar-media-bar','version':version,'main':'main.cjs','productName':appName,'license':'MIT'},ensure_ascii=False),encoding='utf-8')
(out/'electron.exe').rename(out/(appName+'.exe'))
resource=work/'version-resource.bin';resource.write_bytes(version_resource(version))
subprocess.run(['powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-File',str(Path('embed-exe-icon.ps1').resolve()),'-Exe',str((out/(appName+'.exe')).resolve()),'-Icon',str((root/'icons/app.ico').resolve()),'-VersionResource',str(resource.resolve())],check=True)
extension=work/extensionName
shutil.copytree(root/'browser-helper',extension,ignore=shutil.ignore_patterns('auth.js','*.pem'))
(extension/'auth.js').write_text('globalThis.taskbarMediaToken="";\n',encoding='utf-8',newline='\n')
shutil.copy2(root/'LICENSE',extension/'LICENSE')
(extension/'安装说明.txt').write_text('''浏览器插件安装

1. 将本文件夹放到主程序文件夹旁边，保持名称为 WaterSprite TaskbarMediaBar Extension。
2. 启动或重新启动主程序，生成本机连接文件。
3. 打开 chrome://extensions 或 edge://extensions，开启开发者模式。
4. 加载未打包的扩展程序，选择直接包含 manifest.json 的本文件夹。
5. 刷新已经打开的音视频网页。

此 ZIP 用于解压后手动安装，不是扩展商店自动安装包。安装后保留插件文件夹。
主程序与插件可以独立更新，主程序不会覆盖插件代码或版本。
''',encoding='utf-8')
archives=[(out,release/('WaterSprite-TaskbarMediaBar-'+version+'-x64.zip')),(extension,release/('WaterSprite-TaskbarMediaBar-Extension-'+extensionVersion+'-Chrome.zip'))]
for folder,archive in archives:
 with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for p in folder.rglob('*'):
   if p.is_file():z.write(p,p.relative_to(work))
 with zipfile.ZipFile(archive) as z:
  assert z.testzip() is None
  assert {n.split('/')[0] for n in z.namelist()}=={folder.name}
  assert not any(n.endswith(('.pem','/browser-token')) or '/用户配置/' in n or '/缓存/' in n for n in z.namelist())
  if folder==out:
   assert not any('/browser-helper/' in n or n.endswith('/auth.js') for n in z.namelist())
   assert target.joinpath('media-cache-paths.cjs').is_file()
  else:assert z.read(extensionName+'/auth.js')==b'globalThis.taskbarMediaToken="";\n'
report={'version':version,'extensionVersion':extensionVersion,'appFolder':str(out.resolve()),'extensionFolder':str(extension.resolve()),'archives':[{'file':str(p.resolve()),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for _,p in archives]}
(release/'release-build.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=True))
