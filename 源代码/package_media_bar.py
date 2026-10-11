from pathlib import Path
import json,shutil,zipfile,struct,zlib,os,subprocess
from exe_version_resource import version_resource
os.chdir(Path(__file__).resolve().parent)

root=Path('soda-player')
out=Path('WaterSprite TaskbarMediaBar')
out.mkdir(exist_ok=True)
shutil.copytree(root/'node_modules/electron/dist',out,dirs_exist_ok=True)
target=out/'resources/app';target.mkdir(parents=True,exist_ok=True)
for name in ['main.cjs','icon-theme.cjs','display-options.cjs','bridge-supervisor.cjs','soft-menu.cjs','menu-preload.cjs','menu.html','menu.css','menu.js','cache-paths.cjs','preload.cjs','media-bridge.ps1','media-state.cjs','source-router.cjs','browser-media.cjs','web-artwork.cjs','web-labels.cjs','web-state.cjs','window-control.cs','netease-control.cs','shell-bridge.ps1','cover-reader.cs','audio-sessions.cs','dock.cjs','dock-hint.cjs','source-names.cjs','mpc-adapter.cjs','cache-media.cjs','cache-worker.cjs','kuwo-artwork.cjs','kugou-lyrics.cjs','netease-media.cjs','netease-client.cjs','desktop-client.cjs','douyu-room.cjs','yy-room.cjs','yy-endpoint.ps1','client-launch.ps1','legacy-media.cjs','legacy-state.cjs','legacy-progress.ps1','legacy-frame.cs','thumbnail.ps1']:
    shutil.copy2(root/name,target/name)
for obsolete in ['cache-folder.cs','cache-folder.ps1','douyin-control.cs']:
    stale=target/obsolete
    if stale.is_file():stale.unlink()
icon_names={'cover-light.png','cover-dark.png','tray-light.png','tray-dark.png','app.ico'} | {p.name for p in (root/'icons').glob('tray-*-small*.png')}
icon_names |= {p.name for p in (root/'icons').glob('tray-*-native.ico')}
icon_target=target/'icons';icon_target.mkdir(exist_ok=True)
assert icon_target.resolve().is_relative_to(out.resolve())
for p in icon_target.iterdir():
    if p.is_file() and p.name not in icon_names:p.unlink()
for name in icon_names:shutil.copy2(root/'icons'/name,icon_target/name)
for name in ['tray-white.png','tray-black.png']:
    obsolete=target/name
    if obsolete.is_file():obsolete.unlink()
shutil.copytree(root/'browser-helper',target/'browser-helper',dirs_exist_ok=True)
for name in ['window-policy.cjs','tray-image.cjs']:shutil.copy2(root/name,target/name)
dist_target=target/'dist'
assert dist_target.resolve().is_relative_to(out.resolve())
if dist_target.exists():shutil.rmtree(dist_target)
shutil.copytree(root/'dist',dist_target)
shutil.copytree(root/'vendor',target/'vendor',dirs_exist_ok=True)
for p in target.glob('smoke-*'):
    if p.is_file():p.unlink()
version=json.loads((root/'package.json').read_text(encoding='utf-8'))['version']
(target/'package.json').write_text(json.dumps({'name':'watersprite-taskbar-media-bar','version':version,'main':'main.cjs','productName':'WaterSprite TaskbarMediaBar'},ensure_ascii=False),encoding='utf-8')
exe=out/'electron.exe'
if exe.exists():exe.replace(out/'WaterSprite TaskbarMediaBar.exe')
for obsolete in ['任务栏播放器.exe','独立播控.exe']:
    if (out/obsolete).exists(): (out/obsolete).unlink()
resource=Path('watersprite-version-resource.bin');resource.write_bytes(version_resource(version))
subprocess.run(['powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-File',str(Path('embed-exe-icon.ps1').resolve()),'-Exe',str((out/'WaterSprite TaskbarMediaBar.exe').resolve()),'-Icon',str((root/'icons/app.ico').resolve()),'-VersionResource',str(resource.resolve())],check=True)
with zipfile.ZipFile('WaterSprite-TaskbarMediaBar.zip','w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for p in out.rglob('*'):
        if p.is_file() and p.name!='auth.js':z.write(p,p.relative_to(out.parent))
# Provide the companion extension beside the application in the release archive.
with zipfile.ZipFile('WaterSprite-TaskbarMediaBar.zip','a',zipfile.ZIP_DEFLATED) as z:
    prefix='WaterSprite TaskbarMediaBar 浏览器插件/'
    for p in (root/'browser-helper').rglob('*'):
        if p.is_file() and p.name!='auth.js':z.write(p,prefix+p.relative_to(root/'browser-helper').as_posix())
    z.writestr(prefix+'auth.js','globalThis.taskbarMediaToken="";\n')

print('Portable folder ready:',out.resolve())
print('ZIP bytes:',Path('WaterSprite-TaskbarMediaBar.zip').stat().st_size)
with zipfile.ZipFile('WaterSprite-TaskbarMediaBar.zip') as z:
    assert z.testzip() is None
    assert str(out/'WaterSprite TaskbarMediaBar.exe').replace('\\','/') in z.namelist()
print('Archive integrity verified')
