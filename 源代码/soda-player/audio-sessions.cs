using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;
namespace PlayerAudio {
 [ComImport,Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")] class DeviceEnumerator {}
 [ComImport,Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)] interface IDevices {
  [PreserveSig] int EnumAudioEndpoints(int flow,int mask,out IDeviceCollection devices);
  [PreserveSig] int GetDefaultAudioEndpoint(int flow,int role,out IDevice device);
 }
 [ComImport,Guid("0BD7A1BE-7A1A-44DB-8397-CC5392387B5E"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)] interface IDeviceCollection {
  [PreserveSig] int GetCount(out uint n);[PreserveSig] int Item(uint i,out IDevice device);
 }
 [ComImport,Guid("D666063F-1587-4E43-81F1-B948E807363F"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)] interface IDevice {
  [PreserveSig] int Activate(ref Guid id,int ctx,IntPtr args,[MarshalAs(UnmanagedType.IUnknown)]out object obj);
 }
 [ComImport,Guid("77AA99A0-1BD6-484F-8BC7-2C654C9A9B6F"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)] interface IManager {
  [PreserveSig] int GetAudioSessionControl(IntPtr id,uint flags,out IntPtr obj);
  [PreserveSig] int GetSimpleAudioVolume(IntPtr id,uint flags,out IntPtr obj);
  [PreserveSig] int GetSessionEnumerator(out ISessions sessions);
 }
 [ComImport,Guid("E2F5BB11-0570-40CA-ACDD-3AA01277DEE8"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)] interface ISessions {
  [PreserveSig] int GetCount(out int count);[PreserveSig] int GetSession(int i,out IControl control);
 }
 [ComImport,Guid("f4b1a599-7266-4319-a8ca-e70acb11e8cd"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)] interface IControl {
  [PreserveSig] int GetState(out int state);[PreserveSig] int GetDisplayName([MarshalAs(UnmanagedType.LPWStr)]out string name);
  [PreserveSig] int SetDisplayName(string n,IntPtr c);[PreserveSig] int GetIconPath(out IntPtr p);[PreserveSig] int SetIconPath(string n,IntPtr c);
  [PreserveSig] int GetGroupingParam(out Guid g);[PreserveSig] int SetGroupingParam(ref Guid g,IntPtr c);[PreserveSig] int RegisterAudioSessionNotification(IntPtr c);[PreserveSig] int UnregisterAudioSessionNotification(IntPtr c);
 }
 [ComImport,Guid("bfb7ff88-7239-4fc9-8fa2-07c950be9c6d"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)] interface IControl2 {
  [PreserveSig] int GetState(out int state);[PreserveSig] int GetDisplayName([MarshalAs(UnmanagedType.LPWStr)]out string name);
  [PreserveSig] int SetDisplayName(string n,IntPtr c);[PreserveSig] int GetIconPath(out IntPtr p);[PreserveSig] int SetIconPath(string n,IntPtr c);
  [PreserveSig] int GetGroupingParam(out Guid g);[PreserveSig] int SetGroupingParam(ref Guid g,IntPtr c);[PreserveSig] int RegisterAudioSessionNotification(IntPtr c);[PreserveSig] int UnregisterAudioSessionNotification(IntPtr c);
  [PreserveSig] int GetSessionIdentifier(out IntPtr id);[PreserveSig] int GetSessionInstanceIdentifier(out IntPtr id);[PreserveSig] int GetProcessId(out uint pid);[PreserveSig] int IsSystemSoundsSession();[PreserveSig] int SetDuckingPreference(bool b);
 }
 [ComImport,Guid("87CE5498-68D6-44E5-9215-6DA47EF883D8"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)] interface IVolume {
  [PreserveSig] int SetMasterVolume(float value,ref Guid ctx);[PreserveSig] int GetMasterVolume(out float value);[PreserveSig] int SetMute([MarshalAs(UnmanagedType.Bool)]bool muted,ref Guid ctx);[PreserveSig] int GetMute([MarshalAs(UnmanagedType.Bool)]out bool muted);
 }
 [ComImport,Guid("C02216F6-8C67-4B5B-9D00-D008E73E0064"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)] interface IMeter {[PreserveSig] int GetPeakValue(out float peak);}
 public class Source {public int pid;public string name,description,windowTitle;public bool active,muted;public float peak;}
 public static class Sessions {
  delegate bool WindowCallback(IntPtr hwnd,IntPtr data);
  [DllImport("user32.dll")] static extern bool EnumWindows(WindowCallback callback,IntPtr data);
  [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr hwnd,out uint pid);
  [DllImport("user32.dll",CharSet=CharSet.Unicode)] static extern int GetWindowText(IntPtr hwnd,StringBuilder text,int size);
  static string WindowTitle(int pid){string result="";EnumWindows((hwnd,data)=>{uint owner;GetWindowThreadProcessId(hwnd,out owner);if(owner!=(uint)pid)return true;var text=new StringBuilder(1024);GetWindowText(hwnd,text,text.Capacity);var value=text.ToString();if((value.Contains("酷我音乐")||value.Contains("网易云音乐")||value.Contains(" - "))&&value.Length>result.Length)result=value;return true;},IntPtr.Zero);return result;}
  static void Visit(Action<IControl> action){
   var enumerator=(IDevices)(object)new DeviceEnumerator();IDeviceCollection devices=null;
   try{enumerator.EnumAudioEndpoints(0,1,out devices);uint count;devices.GetCount(out count);
    for(uint i=0;i<count;i++){IDevice device=null;object manager=null;ISessions sessions=null;
     try{devices.Item(i,out device);Guid id=new Guid("77AA99A0-1BD6-484F-8BC7-2C654C9A9B6F");device.Activate(ref id,23,IntPtr.Zero,out manager);((IManager)manager).GetSessionEnumerator(out sessions);int n;sessions.GetCount(out n);
      for(int j=0;j<n;j++){IControl control=null;try{sessions.GetSession(j,out control);action(control);}catch{}finally{if(control!=null)Marshal.ReleaseComObject(control);}}
     }catch{}finally{if(sessions!=null)Marshal.ReleaseComObject(sessions);if(manager!=null)Marshal.ReleaseComObject(manager);if(device!=null)Marshal.ReleaseComObject(device);}
    }
   }finally{if(devices!=null)Marshal.ReleaseComObject(devices);Marshal.ReleaseComObject(enumerator);}
  }
  public static Source[] List(){var results=new Dictionary<int,Source>();Visit(c=>{var two=(IControl2)c;uint pid;two.GetProcessId(out pid);int state;c.GetState(out state);if(pid==0||state==2)return;var p=Process.GetProcessById((int)pid);if(p.ProcessName.Equals("KwService",StringComparison.OrdinalIgnoreCase)){var owners=Process.GetProcessesByName("kwmusic");if(owners.Length==1){p=owners[0];pid=(uint)p.Id;}}bool mute;((IVolume)c).GetMute(out mute);float peak=0;try{((IMeter)c).GetPeakValue(out peak);}catch{}string desc="";try{desc=p.MainModule.FileVersionInfo.FileDescription;}catch{}Source existing;if(results.TryGetValue((int)pid,out existing)){existing.active|=state==1;existing.peak=Math.Max(existing.peak,peak);return;}results[(int)pid]=new Source{pid=(int)pid,name=p.ProcessName,description=desc,windowTitle=(p.ProcessName=="kwmusic"||p.ProcessName=="cloudmusic")?WindowTitle((int)pid):"",active=state==1,muted=mute,peak=peak};});return new List<Source>(results.Values).ToArray();}
  public static bool ToggleMute(int pid){bool found=false;Visit(c=>{uint value;((IControl2)c).GetProcessId(out value);if(value!=pid)return;bool muted;var volume=(IVolume)c;volume.GetMute(out muted);Guid ctx=Guid.Empty;volume.SetMute(!muted,ref ctx);found=true;});return found;}
 }
}
