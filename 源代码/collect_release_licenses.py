from pathlib import Path
import json,shutil,urllib.request,hashlib

root=Path('soda-player');out=root/'third-party-licenses';out.mkdir(exist_ok=True)
lock=json.loads((root/'package-lock.json').read_text(encoding='utf-8'))
inventory=[];missing=[]
for relative,metadata in lock['packages'].items():
 if not relative or metadata.get('dev') or metadata.get('optional'):continue
 folder=root/relative
 if not folder.is_dir():missing.append(relative);continue
 package=json.loads((folder/'package.json').read_text(encoding='utf-8'))
 name=package['name'];version=package['version']
 licenses=[p for p in folder.iterdir() if p.is_file() and p.name.lower().startswith(('license','licence','copying','notice'))]
 if not licenses:
  readme=folder/'README.md'
  if readme.exists() and 'Permission is hereby granted' in readme.read_text(encoding='utf-8'):licenses=[readme]
  else:missing.append(name);continue
 target=out/'npm'/name.replace('/','__');target.mkdir(parents=True,exist_ok=True)
 for p in licenses:shutil.copy2(p,target/p.name)
 inventory.append({'name':name,'version':version,'license':package.get('license',metadata.get('license','')),'path':'npm/'+name.replace('/','__')})
assert not missing,missing
(out/'npm-packages.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf-8')
font=out/'MiSans';font.mkdir(exist_ok=True)
url='https://hyperos.mi.com/font-download/MiSans%E5%AD%97%E4%BD%93%E7%9F%A5%E8%AF%86%E4%BA%A7%E6%9D%83%E8%AE%B8%E5%8F%AF%E5%8D%8F%E8%AE%AE.pdf'
licenseFile=font/'MiSans-License.pdf'
if not licenseFile.exists():
 data=urllib.request.urlopen(url,timeout=45).read()
 assert data.startswith(b'%PDF')
 licenseFile.write_bytes(data)
(font/'README.md').write_text('''# MiSans

本软件使用 MiSans 字体。字体权利归小米及相关权利人所有，不适用本项目 MIT 许可证。

字体随本应用作为界面字体使用；不作为独立字体产品分发，不修改字体文件。
使用、修改与分发限制以随附的官方 MiSans-License.pdf 为准。

官方字体页面：https://hyperos.mi.com/font/zh/
官方许可来源：https://hyperos.mi.com/font-download/MiSans字体知识产权许可协议.pdf
核对日期：2026-10-11
''',encoding='utf-8')
print(json.dumps({'npmPackages':len(inventory),'fontLicenseSha256':hashlib.sha256(licenseFile.read_bytes()).hexdigest(),'missingLicenses':missing}))
