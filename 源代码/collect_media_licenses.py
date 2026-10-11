from pathlib import Path
import json
root=Path('soda-player')
meta=json.loads((root/'local-media-bundle-meta.json').read_text(encoding='utf-8'))
packages=set()
for file in meta['inputs']:
    parts=Path(file).parts
    if not parts or parts[0]!='node_modules':continue
    packages.add(Path(*parts[:3 if parts[1].startswith('@') else 2]))
out=root/'vendor/local-media-licenses';out.mkdir(exist_ok=True)
index=[]
for package in sorted(packages,key=str):
    folder=root/package
    info=json.loads((folder/'package.json').read_text(encoding='utf-8'))
    names=[p for p in folder.iterdir() if p.is_file() and p.name.lower().startswith(('license','licence','copying','notice'))]
    if not names:raise RuntimeError(f'Missing license: {package}')
    target=out/info['name'].replace('/','__');target.mkdir(exist_ok=True)
    for file in names:(target/file.name).write_bytes(file.read_bytes())
    index.append({'name':info['name'],'version':info['version'],'license':info.get('license','')})
(out/'packages.json').write_text(json.dumps(index,ensure_ascii=False,indent=2),encoding='utf-8')
print('Bundled media dependency notices:',len(index))
