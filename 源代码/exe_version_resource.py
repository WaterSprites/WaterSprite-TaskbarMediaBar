"""Build Windows VERSIONINFO for the portable application's executable."""
import struct

def block(key, value=b'', children=(), text=False):
    key_bytes = (key + '\0').encode('utf-16le')
    head = struct.pack('<HHH', 0, len(value)//2 if text else len(value), int(text)) + key_bytes
    head += b'\0' * (-len(head) % 4)
    data = head + value
    for child in children:
        data += b'\0' * (-len(data) % 4) + child
    return struct.pack('<H', len(data)) + data[2:]

def version_resource(version):
    parts = [int(p) for p in version.split('.')]
    parts += [0] * (4-len(parts))
    major, minor, patch, build = parts[:4]
    ms, ls = (major << 16) | minor, (patch << 16) | build
    fixed = struct.pack('<13I', 0xFEEF04BD, 0x10000, ms, ls, ms, ls, 0x3F, 0, 0x40004, 1, 0, 0, 0)
    fields = {'CompanyName':'WaterSprites', 'FileDescription':'WaterSprite TaskbarMediaBar',
              'ProductName':'WaterSprite TaskbarMediaBar', 'InternalName':'WaterSprite TaskbarMediaBar',
              'OriginalFilename':'WaterSprite TaskbarMediaBar.exe', 'FileVersion':version,
              'ProductVersion':version}
    strings = [block(k, (v+'\0').encode('utf-16le'), text=True) for k,v in fields.items()]
    table = block('040904B0', children=strings, text=True)
    return block('VS_VERSION_INFO', fixed, [block('StringFileInfo', children=[table], text=True),
        block('VarFileInfo', children=[block('Translation', struct.pack('<HH',0x409,1200))], text=True)])
