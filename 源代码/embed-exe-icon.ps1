param([Parameter(Mandatory=$true)][string]$Exe,[Parameter(Mandatory=$true)][string]$Icon,[string]$VersionResource)
$ErrorActionPreference='Stop'
Add-Type @'
using System;using System.IO;using System.Collections.Generic;using System.Runtime.InteropServices;using System.ComponentModel;
public static class IconResources {
 delegate bool Names(IntPtr h,IntPtr type,IntPtr name,IntPtr l);
 delegate bool Languages(IntPtr h,IntPtr type,IntPtr name,ushort lang,IntPtr l);
 [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern IntPtr LoadLibraryEx(string file,IntPtr h,uint flags);
 [DllImport("kernel32.dll")] static extern bool FreeLibrary(IntPtr h);
 [DllImport("kernel32.dll",CharSet=CharSet.Unicode)] static extern bool EnumResourceNames(IntPtr h,IntPtr type,Names callback,IntPtr l);
 [DllImport("kernel32.dll",CharSet=CharSet.Unicode)] static extern bool EnumResourceLanguages(IntPtr h,IntPtr type,IntPtr name,Languages callback,IntPtr l);
 [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern IntPtr BeginUpdateResource(string file,bool delete);
 [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern bool UpdateResource(IntPtr h,IntPtr type,IntPtr name,ushort lang,byte[] bytes,uint size);
 [DllImport("kernel32.dll",SetLastError=true)] static extern bool EndUpdateResource(IntPtr h,bool discard);
 [DllImport("kernel32.dll",CharSet=CharSet.Unicode)] static extern IntPtr FindResource(IntPtr h,IntPtr name,IntPtr type);
 [DllImport("kernel32.dll")] static extern uint SizeofResource(IntPtr h,IntPtr r);
 [DllImport("kernel32.dll")] static extern IntPtr LoadResource(IntPtr h,IntPtr r);
 [DllImport("kernel32.dll")] static extern IntPtr LockResource(IntPtr r);
 class Group {public int Id;public string Name;public List<ushort> Langs=new List<ushort>();}
 public static void ApplyVersion(string exe,string file){
 var bytes=File.ReadAllBytes(file);var langs=new List<ushort>();var module=LoadLibraryEx(exe,IntPtr.Zero,2);
 if(module==IntPtr.Zero)throw new Win32Exception();try{EnumResourceLanguages(module,new IntPtr(16),new IntPtr(1),(a,b,c,lang,d)=>{langs.Add(lang);return true;},IntPtr.Zero);}finally{FreeLibrary(module);}
 if(langs.Count==0)langs.Add(0x409);var update=BeginUpdateResource(exe,false);if(update==IntPtr.Zero)throw new Win32Exception();bool done=false;
 try{foreach(var lang in langs)if(!UpdateResource(update,new IntPtr(16),new IntPtr(1),lang,bytes,(uint)bytes.Length))throw new Win32Exception();done=true;}finally{if(!EndUpdateResource(update,!done))throw new Win32Exception();}
 }
 public static int Apply(string exe,string icon){
 var bytes=File.ReadAllBytes(icon);int n=BitConverter.ToUInt16(bytes,4);if(n<1||n>32||BitConverter.ToUInt16(bytes,2)!=1)throw new Exception("Invalid ICO");var groups=new List<Group>();var module=LoadLibraryEx(exe,IntPtr.Zero,2);if(module==IntPtr.Zero)throw new Win32Exception();
 try {EnumResourceNames(module,new IntPtr(14),(h,t,name,l)=>{var g=new Group();long v=name.ToInt64();if(v<=65535)g.Id=(int)v;else g.Name=Marshal.PtrToStringUni(name);EnumResourceLanguages(h,t,name,(a,b,c,lang,d)=>{g.Langs.Add(lang);return true;},IntPtr.Zero);groups.Add(g);return true;},IntPtr.Zero);}finally{FreeLibrary(module);}
 if(groups.Count==0)groups.Add(new Group{Id=1,Langs=new List<ushort>{0}});
 var group=new byte[6+14*n];Array.Copy(bytes,group,6);var images=new List<byte[]>();
 for(int i=0;i<n;i++){int offset=6+16*i,length=BitConverter.ToInt32(bytes,offset+8),start=BitConverter.ToInt32(bytes,offset+12);if(length<1||start<0||start>bytes.Length-length)throw new Exception("Invalid image bounds");var image=new byte[length];Array.Copy(bytes,start,image,0,length);images.Add(image);Array.Copy(bytes,offset,group,6+14*i,12);Array.Copy(BitConverter.GetBytes((ushort)(500+i)),0,group,6+14*i+12,2);}
 var update=BeginUpdateResource(exe,false);if(update==IntPtr.Zero)throw new Win32Exception();bool done=false;
 try{foreach(var g in groups){var name=g.Name==null?new IntPtr(g.Id):Marshal.StringToHGlobalUni(g.Name);try{foreach(ushort lang in g.Langs){for(int i=0;i<n;i++)if(!UpdateResource(update,new IntPtr(3),new IntPtr(500+i),lang,images[i],(uint)images[i].Length))throw new Win32Exception();if(!UpdateResource(update,new IntPtr(14),name,lang,group,(uint)group.Length))throw new Win32Exception();}}finally{if(g.Name!=null)Marshal.FreeHGlobal(name);}}done=true;}finally{if(!EndUpdateResource(update,!done))throw new Win32Exception();}
 module=LoadLibraryEx(exe,IntPtr.Zero,2);try{var r=FindResource(module,new IntPtr(500),new IntPtr(3));var size=SizeofResource(module,r);if(size!=images[0].Length)throw new Exception("Icon verification failed");var loaded=new byte[size];Marshal.Copy(LockResource(LoadResource(module,r)),loaded,0,loaded.Length);for(int i=0;i<loaded.Length;i++)if(loaded[i]!=images[0][i])throw new Exception("Icon mismatch");}finally{FreeLibrary(module);}return groups.Count;
 }
}
'@
$groups=[IconResources]::Apply((Resolve-Path -LiteralPath $Exe).Path,(Resolve-Path -LiteralPath $Icon).Path)
if($VersionResource){[IconResources]::ApplyVersion((Resolve-Path -LiteralPath $Exe).Path,(Resolve-Path -LiteralPath $VersionResource).Path)}
Write-Output "EXE icon embedded and verified ($groups resource group)"
