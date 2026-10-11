using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;
public static class PlayerWindowControl {
 delegate bool Callback(IntPtr window,IntPtr parameter);
 [StructLayout(LayoutKind.Sequential)] struct Rect {public int left,top,right,bottom;}
 [DllImport("user32.dll")] static extern bool GetClientRect(IntPtr window,out Rect rect);
 [DllImport("user32.dll")] static extern uint GetDpiForWindow(IntPtr window);
 [DllImport("user32.dll")] static extern bool EnumWindows(Callback callback,IntPtr parameter);
 [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr window,out uint pid);
 [DllImport("user32.dll",CharSet=CharSet.Unicode)] static extern int GetWindowText(IntPtr window,StringBuilder text,int size);
 [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr window);
 [DllImport("user32.dll")] static extern bool ShowWindowAsync(IntPtr window,int command);
 [DllImport("user32.dll")] static extern bool SetForegroundWindow(IntPtr window);
 [DllImport("user32.dll")] static extern IntPtr GetForegroundWindow();
 [DllImport("user32.dll")] static extern bool IsIconic(IntPtr window);
 [DllImport("user32.dll")] static extern bool IsHungAppWindow(IntPtr window);
 [DllImport("kernel32.dll")] static extern uint GetCurrentThreadId();
 [DllImport("user32.dll")] static extern bool AttachThreadInput(uint from,uint to,bool attach);
 [DllImport("user32.dll")] static extern bool SetWindowPos(IntPtr window,IntPtr after,int x,int y,int width,int height,uint flags);
 [DllImport("user32.dll")] static extern bool BringWindowToTop(IntPtr window);
 [StructLayout(LayoutKind.Sequential)] struct Message {public IntPtr window;public uint message;public UIntPtr wParam;public IntPtr lParam;public uint time;public int x,y;public uint extra;}
 [DllImport("user32.dll")] static extern bool PeekMessage(out Message message,IntPtr window,uint min,uint max,uint remove);
 [DllImport("user32.dll")] static extern void keybd_event(byte key,byte scan,uint flags,UIntPtr extra);
 [DllImport("user32.dll")] static extern IntPtr SendMessageTimeout(IntPtr window,uint message,IntPtr wParam,IntPtr lParam,uint flags,uint timeout,out IntPtr result);
 public static IntPtr Window(int pid){IntPtr best=IntPtr.Zero;int score=-1;EnumWindows((window,parameter)=>{uint owner;GetWindowThreadProcessId(window,out owner);if(owner!=(uint)pid)return true;var title=new StringBuilder(1024);GetWindowText(window,title,title.Capacity);if(title.Length==0)return true;int value=(IsWindowVisible(window)?10000:0)+title.Length;if(value>score){score=value;best=window;}return true;},IntPtr.Zero);return best;}
 public static bool Visible(int pid){IntPtr window=Window(pid);return window!=IntPtr.Zero&&IsWindowVisible(window);}
 public static string LastOpenDiagnostic="";
 public static bool Open(int pid){
  LastOpenDiagnostic="pid="+pid;
  IntPtr window=Window(pid);LastOpenDiagnostic+=";window="+window.ToInt64();if(window==IntPtr.Zero||IsHungAppWindow(window)){LastOpenDiagnostic+=";missing-or-hung";return false;}
  // Restore minimized windows, but preserve the size of visible/maximized windows.
  if(IsIconic(window)){ShowWindowAsync(window,9);System.Threading.Thread.Sleep(80);}
  else if(!IsWindowVisible(window))ShowWindowAsync(window,5);
  // Raise once without enabling persistent topmost; never move or resize the window.
  SetWindowPos(window,IntPtr.Zero,0,0,0,0,0x0001|0x0002|0x0010|0x0040|0x4000);
  if(SetForegroundWindow(window)&&GetForegroundWindow()==window){LastOpenDiagnostic+=";direct=true";return true;}
  IntPtr foreground=GetForegroundWindow();uint owner;
  uint foregroundThread=GetWindowThreadProcessId(foreground,out owner),currentThread=GetCurrentThreadId();
  uint targetThread=GetWindowThreadProcessId(window,out owner);
  bool attached=false,targetAttached=false;
  try{
   // The bridge runs on a background thread; share the foreground input context only for this user-requested activation.
   Message message;PeekMessage(out message,IntPtr.Zero,0,0,0);
   if(foreground!=IntPtr.Zero&&!IsHungAppWindow(foreground)&&foregroundThread!=0&&foregroundThread!=currentThread)
    attached=AttachThreadInput(currentThread,foregroundThread,true);
   if(targetThread!=0&&targetThread!=currentThread&&targetThread!=foregroundThread)
    targetAttached=AttachThreadInput(currentThread,targetThread,true);
   BringWindowToTop(window);
   bool result=SetForegroundWindow(window);
   LastOpenDiagnostic+=";attached="+attached+";targetAttached="+targetAttached+";activate="+result+";foreground="+GetForegroundWindow().ToInt64();
   return GetForegroundWindow()==window;
  }finally{if(targetAttached)AttachThreadInput(currentThread,targetThread,false);if(attached)AttachThreadInput(currentThread,foregroundThread,false);}
 }
 public static bool Send(int pid,string action){
  int command=action=="toggle"?14:action=="next"?11:action=="previous"?12:0;
  if(command==0)return false;IntPtr window=Window(pid),result;
  if(window==IntPtr.Zero)return false;
  if(!Process.GetProcessById(pid).ProcessName.Equals("kwmusic",StringComparison.OrdinalIgnoreCase))return SendMessageTimeout(window,0x319,window,new IntPtr(command<<16),2,1000,out result)!=IntPtr.Zero && result!=IntPtr.Zero;
  Rect bounds;
  if(GetClientRect(window,out bounds)){
   double scale=Math.Max(1,GetDpiForWindow(window)/96.0);
   if(bounds.right/scale>=900&&bounds.bottom/scale>=500){
    int x=(int)((action=="toggle"?100:action=="next"?150:50)*scale),y=bounds.bottom-(int)(30*scale);
    IntPtr point=new IntPtr((y<<16)|(x&65535));
    if(SendMessageTimeout(window,0x201,new IntPtr(1),point,2,1000,out result)==IntPtr.Zero)return false;
    return SendMessageTimeout(window,0x202,IntPtr.Zero,point,2,1000,out result)!=IntPtr.Zero;
   }
  }
  // Kuwo's own default configuration binds F5 and Ctrl+Left/Right.
  if(!Process.GetProcessById(pid).ProcessName.Equals("kwmusic",StringComparison.OrdinalIgnoreCase))return false;
  IntPtr previous=GetForegroundWindow();ShowWindowAsync(window,9);SetForegroundWindow(window);
  System.Threading.Thread.Sleep(80);
  if(GetForegroundWindow()!=window)return false;
  byte key=action=="toggle"?(byte)0x74:action=="next"?(byte)0x27:(byte)0x25;
  try{if(action!="toggle")keybd_event(0x11,0,0,UIntPtr.Zero);keybd_event(key,0,0,UIntPtr.Zero);keybd_event(key,0,2,UIntPtr.Zero);if(action!="toggle")keybd_event(0x11,0,2,UIntPtr.Zero);return true;}
  finally{if(previous!=IntPtr.Zero)SetForegroundWindow(previous);}
 }
}
