using System;
using System.Runtime.InteropServices;
using System.Runtime.InteropServices.ComTypes;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Diagnostics;
public static class PlayerCoverReader {
 [StructLayout(LayoutKind.Sequential)] struct Size {public int X,Y;}
 [ComImport,Guid("bcc18b79-ba16-442f-80c4-8a59c30c463b"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)] interface IThumbnail {
  [PreserveSig] int GetImage(Size size,uint flags,out IntPtr bitmap);
 }
 [DllImport("shell32.dll",CharSet=CharSet.Unicode,PreserveSig=true)] static extern int SHCreateItemFromParsingName(string path,IntPtr bind,ref Guid iid,out IThumbnail item);
 [DllImport("gdi32.dll")] static extern bool DeleteObject(IntPtr obj);
 public static byte[] FromFile(string path){
  Guid id=new Guid("bcc18b79-ba16-442f-80c4-8a59c30c463b");IThumbnail item=null;IntPtr bitmap=IntPtr.Zero;
  try {Marshal.ThrowExceptionForHR(SHCreateItemFromParsingName(path,IntPtr.Zero,ref id,out item));Marshal.ThrowExceptionForHR(item.GetImage(new Size{X=128,Y=128},8,out bitmap));using(var image=Image.FromHbitmap(bitmap))using(var stream=new MemoryStream()){image.Save(stream,ImageFormat.Png);return stream.ToArray();}}
  finally{if(bitmap!=IntPtr.Zero)DeleteObject(bitmap);if(item!=null)Marshal.ReleaseComObject(item);}
 }
 [DllImport("shcore.dll",EntryPoint="CreateStreamOverRandomAccessStream",PreserveSig=true)]
 static extern int SHCreateStreamOverRandomAccessStream(IntPtr random,ref Guid iid,out IStream stream);
 public static byte[] Read(object raw) {
  IntPtr unk=Marshal.GetIUnknownForObject(raw),random=IntPtr.Zero;
  IStream stream=null;
  try {
   Guid rid=new Guid("905a0fe1-bc53-11df-8c49-001e4fc686da");
   Marshal.ThrowExceptionForHR(Marshal.QueryInterface(unk,ref rid,out random));
   Guid iid=new Guid("0000000c-0000-0000-c000-000000000046");
   Marshal.ThrowExceptionForHR(SHCreateStreamOverRandomAccessStream(random,ref iid,out stream));
   System.Runtime.InteropServices.ComTypes.STATSTG stat;stream.Stat(out stat,1);
   if(stat.cbSize<=0||stat.cbSize>4000000)throw new Exception("封面大小无效");
   stream.Seek(0,0,IntPtr.Zero);
   var bytes=new byte[(int)stat.cbSize];
   IntPtr read=Marshal.AllocCoTaskMem(4);
   try{stream.Read(bytes,bytes.Length,read);int count=Marshal.ReadInt32(read);if(count!=bytes.Length)Array.Resize(ref bytes,count);}
   finally{Marshal.FreeCoTaskMem(read);}
   return bytes;
  } finally {if(stream!=null)Marshal.ReleaseComObject(stream);if(random!=IntPtr.Zero)Marshal.Release(random);Marshal.Release(unk);}
 }
}
public static class PlayerMpcControl {
 [DllImport("user32.dll",CharSet=CharSet.Unicode)] static extern IntPtr SendMessageTimeout(IntPtr hwnd,uint message,IntPtr w,IntPtr l,uint flags,uint timeout,out IntPtr result);
 public static bool Send(int pid,string action){var p=Process.GetProcessById(pid);if(!p.ProcessName.StartsWith("mpc-hc",StringComparison.OrdinalIgnoreCase))return false;int command=action=="toggle"?889:action=="previous"?921:action=="next"?922:0;if(command==0)return false;IntPtr result;return SendMessageTimeout(p.MainWindowHandle,0x111,new IntPtr(command),IntPtr.Zero,2,500,out result)!=IntPtr.Zero;}
}
