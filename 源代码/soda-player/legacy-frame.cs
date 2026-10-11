using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
public static class LegacyMediaFrame {
 delegate bool Callback(IntPtr handle,IntPtr parameter);
 [StructLayout(LayoutKind.Sequential)] struct Rect { public int left,top,right,bottom; }
 [DllImport("user32.dll")] static extern bool EnumWindows(Callback callback,IntPtr parameter);
 [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr handle,out uint pid);
 [DllImport("user32.dll",CharSet=CharSet.Unicode)] static extern int GetWindowText(IntPtr handle,StringBuilder text,int count);
 [DllImport("user32.dll")] static extern bool GetWindowRect(IntPtr handle,out Rect rect);
 [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr handle);
 [DllImport("user32.dll")] static extern bool PrintWindow(IntPtr handle,IntPtr hdc,uint flags);
 [DllImport("user32.dll")] static extern uint GetDpiForWindow(IntPtr handle);
 public static IntPtr Handle(int pid){IntPtr result=IntPtr.Zero;int score=0;bool netease=Process.GetProcessById(pid).ProcessName.Equals("cloudmusic",StringComparison.OrdinalIgnoreCase);EnumWindows((hwnd,parameter)=>{uint owner;GetWindowThreadProcessId(hwnd,out owner);if(owner!=(uint)pid)return true;var text=new StringBuilder(1024);GetWindowText(hwnd,text,text.Capacity);var value=text.ToString();if(netease?(!value.Contains("网易云音乐")&&!value.Contains(" - ")):!value.Contains("酷我音乐"))return true;int candidate=value.Length+(IsWindowVisible(hwnd)?10000:0);if(candidate>score){score=candidate;result=hwnd;}return true;},IntPtr.Zero);return result;}
 [DllImport("user32.dll",CharSet=CharSet.Unicode)] static extern int GetClassName(IntPtr h,StringBuilder text,int count);
 public static IntPtr ClassWindow(int pid,string wanted){IntPtr found=IntPtr.Zero;EnumWindows((h,p)=>{uint owner;GetWindowThreadProcessId(h,out owner);var c=new StringBuilder(256);GetClassName(h,c,256);if(owner==(uint)pid&&IsWindowVisible(h)&&c.ToString()==wanted){found=h;return false;}return true;},IntPtr.Zero);return found;}
 public static byte[] Capture(IntPtr handle){Rect r;if(handle==IntPtr.Zero||!GetWindowRect(handle,out r))return null;int w=r.right-r.left,h=r.bottom-r.top;if(w<10||h<10||w>10000||h>10000)return null;using(var b=new Bitmap(w,h,PixelFormat.Format32bppArgb))using(var g=Graphics.FromImage(b))using(var stream=new MemoryStream()){IntPtr dc=g.GetHdc();bool ok;try{ok=PrintWindow(handle,dc,2);}finally{g.ReleaseHdc(dc);}if(!ok)return null;b.Save(stream,ImageFormat.Png);return stream.ToArray();}}
 public static bool Visible(int pid){var window=Handle(pid);return window!=IntPtr.Zero&&IsWindowVisible(window);}
 public static string Title(int pid){var text=new StringBuilder(1024);GetWindowText(Handle(pid),text,text.Capacity);return text.ToString();}
 public static byte[] Footer(int pid,bool timerOnly){
  IntPtr handle=Handle(pid);Rect rect;if(handle==IntPtr.Zero||!GetWindowRect(handle,out rect))return null;
  int width=rect.right-rect.left,height=rect.bottom-rect.top;if(width<100||height<100||width>10000||height>10000)return null;
  double scale=Math.Max(1,GetDpiForWindow(handle)/96.0);int cropHeight=Math.Min(height,(int)(120*scale));
  using(var full=new Bitmap(width,height,PixelFormat.Format32bppArgb)){
   using(var graphics=Graphics.FromImage(full)){IntPtr hdc=graphics.GetHdc();bool ok;try{ok=PrintWindow(handle,hdc,2);}finally{graphics.ReleaseHdc(hdc);}if(!ok)return null;}
   int left=timerOnly?(int)(width*.35):0,cropWidth=timerOnly?(int)(width*.45):width;
   double zoom=timerOnly?Math.Min(2,2400.0/cropWidth):Math.Min(1,2400.0/cropWidth);
   using(var footer=new Bitmap((int)(cropWidth*zoom),(int)(cropHeight*zoom),PixelFormat.Format24bppRgb))
   using(var graphics=Graphics.FromImage(footer))
   using(var stream=new MemoryStream()){graphics.Clear(Color.Black);graphics.DrawImage(full,new Rectangle(0,0,footer.Width,footer.Height),new Rectangle(left,height-cropHeight,cropWidth,cropHeight),GraphicsUnit.Pixel);footer.Save(stream,ImageFormat.Png);return stream.ToArray();}
  }
 }
}
