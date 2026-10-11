param([string]$ControlFile, [switch]$Once)
$ErrorActionPreference='Stop'
[Console]::OutputEncoding=New-Object System.Text.UTF8Encoding($false)
Add-Type -AssemblyName UIAutomationClient,UIAutomationTypes,WindowsBase
$taskAutomationReferences=@([System.Windows.Automation.AutomationElement].Assembly.Location,[System.Windows.Automation.ControlType].Assembly.Location,[System.Windows.Rect].Assembly.Location)
Add-Type @'
using System;
using System.Text;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Windows.Automation;
using System.Threading.Tasks;
public class PlayerShell {
 public delegate bool EnumProc(IntPtr h, IntPtr p);
 [StructLayout(LayoutKind.Sequential)] public struct Rect {public int Left,Top,Right,Bottom;}
 [DllImport("user32.dll")] public static extern bool EnumChildWindows(IntPtr h,EnumProc cb,IntPtr p); [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc cb,IntPtr p);
 [DllImport("user32.dll")] public static extern int GetClassName(IntPtr h,StringBuilder s,int n);
 [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h,out Rect r);
 [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
 [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
 [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h,out uint p);
 [DllImport("user32.dll",SetLastError=true)] public static extern bool SetWindowPos(IntPtr h,IntPtr after,int x,int y,int w,int hgt,uint flags);
 [DllImport("user32.dll")] public static extern short GetAsyncKeyState(int key);
 [DllImport("user32.dll")] public static extern IntPtr SetThreadDpiAwarenessContext(IntPtr value);
 [DllImport("user32.dll")] public static extern uint GetDpiForWindow(IntPtr h);
 [DllImport("dwmapi.dll")] public static extern int DwmGetWindowAttribute(IntPtr h,int attribute,out Rect rect,int size);
 [DllImport("gdi32.dll")] static extern IntPtr CreateRectRgn(int left,int top,int right,int bottom);
 [DllImport("gdi32.dll")] static extern bool DeleteObject(IntPtr region);
 [DllImport("gdi32.dll")] static extern int GetRgnBox(IntPtr region,out Rect rect);
 [DllImport("user32.dll")] static extern int SetWindowRgn(IntPtr h,IntPtr region,bool redraw);
 [DllImport("user32.dll")] static extern int GetWindowRgn(IntPtr h,IntPtr region);
 [StructLayout(LayoutKind.Sequential)] public struct GuiInfo {public uint cbSize,flags;public IntPtr active,focus,capture,menuOwner,moveSize,caret;public Rect caretRect;}
 [StructLayout(LayoutKind.Sequential)] public struct Point {public int X,Y;}
 [DllImport("user32.dll")] static extern bool GetGUIThreadInfo(uint id,ref GuiInfo info);
 [DllImport("user32.dll")] static extern bool GetCursorPos(out Point point);
 [DllImport("user32.dll")] static extern bool ShowWindow(IntPtr h,int command);
 public static bool Moving(long handle){uint pid;var thread=GetWindowThreadProcessId(new IntPtr(handle),out pid);var info=new GuiInfo{cbSize=(uint)Marshal.SizeOf(typeof(GuiInfo))};return GetGUIThreadInfo(thread,ref info)&&(info.flags&2)!=0&&info.moveSize.ToInt64()==handle;}
 public static int[] Cursor(){SetThreadDpiAwarenessContext(new IntPtr(-4));Point p;GetCursorPos(out p);return new int[]{p.X,p.Y};}
 public static void HintVisible(long h,bool visible){ShowWindow(new IntPtr(h),visible?4:0);if(visible)Raise(h);}
 [StructLayout(LayoutKind.Sequential,CharSet=CharSet.Unicode)] struct MonitorInfo {public uint Size;public Rect Monitor,Work;public uint Flags;[MarshalAs(UnmanagedType.ByValTStr,SizeConst=32)] public string Device;}
 delegate bool MonitorProc(IntPtr monitor,IntPtr dc,ref Rect rect,IntPtr data);
 [DllImport("user32.dll")] static extern bool EnumDisplayMonitors(IntPtr dc,IntPtr clip,MonitorProc callback,IntPtr data);
 [DllImport("user32.dll",CharSet=CharSet.Unicode)] static extern bool GetMonitorInfo(IntPtr monitor,ref MonitorInfo info);
 public class MonitorSource {public string device;public int number;public int[] rect;}
 public static MonitorSource[] MonitorSources(){SetThreadDpiAwarenessContext(new IntPtr(-4));var result=new List<MonitorSource>();EnumDisplayMonitors(IntPtr.Zero,IntPtr.Zero,(IntPtr h,IntPtr dc,ref Rect r,IntPtr data)=>{var info=new MonitorInfo{Size=(uint)Marshal.SizeOf(typeof(MonitorInfo))};if(GetMonitorInfo(h,ref info)){int number=0;var index=info.Device.LastIndexOf("DISPLAY",StringComparison.OrdinalIgnoreCase);if(index>=0)int.TryParse(info.Device.Substring(index+7),out number);result.Add(new MonitorSource{device=info.Device,number=number,rect=new int[]{info.Monitor.Left,info.Monitor.Top,info.Monitor.Right-info.Monitor.Left,info.Monitor.Bottom-info.Monitor.Top}});}return true;},IntPtr.Zero);return result.ToArray();}
 public static int[] Taskbars() {
  SetThreadDpiAwarenessContext(new IntPtr(-4));
  var list=new List<int>();
  EnumWindows((h,p)=>{var s=new StringBuilder(256);GetClassName(h,s,256);
   if((s.ToString()=="Shell_TrayWnd"||s.ToString()=="Shell_SecondaryTrayWnd")&&IsWindowVisible(h)) {
    Rect r;if(GetWindowRect(h,out r)){list.Add(r.Left);list.Add(r.Top);list.Add(r.Right-r.Left);list.Add(r.Bottom-r.Top);}
   }return true;},IntPtr.Zero);return list.ToArray();
 }
 public static int PlayerProcessId=0;
 public static void IgnorePlayer(long h){uint processId;GetWindowThreadProcessId(new IntPtr(h),out processId);if(PlayerProcessId!=(int)processId){PlayerProcessId=(int)processId;alignmentVersion++;occupiedReady=false;trayAt=DateTime.MinValue;}}
 static int[] occupiedCache=new int[0];static bool occupiedReady=false;static int alignment=-1,alignmentVersion=0;public static int[] Occupied(){return occupiedCache;}public static bool OccupiedReady(){return occupiedReady;}
 static Task<int[]> trayProbe;static int[] trayCache;static DateTime trayAt=DateTime.MinValue;
 static int NativeLeft(IntPtr bar,Rect b){int left=b.Right;EnumChildWindows(bar,(child,q)=>{var s=new StringBuilder(256);GetClassName(child,s,256);if(IsWindowVisible(child)&&(s.ToString()=="TrayNotifyWnd"||s.ToString()=="TrayClockWClass"||s.ToString()=="ClockButton")){Rect r;if(GetWindowRect(child,out r)&&r.Right>r.Left&&r.Left>=b.Left&&r.Left<b.Right)left=Math.Min(left,r.Left);}return true;},IntPtr.Zero);return left;}
 static int[] FindTrayEdges(bool accessible){
  int version=alignmentVersion;
  SetThreadDpiAwarenessContext(new IntPtr(-4));var bars=new List<IntPtr>();double primaryWidth=200;
  EnumWindows((bar,p)=>{var c=new StringBuilder(256);GetClassName(bar,c,256);if((c.ToString()=="Shell_TrayWnd"||c.ToString()=="Shell_SecondaryTrayWnd")&&IsWindowVisible(bar)){bars.Add(bar);Rect b;if(c.ToString()=="Shell_TrayWnd"&&GetWindowRect(bar,out b)){int left=NativeLeft(bar,b);if(left<b.Right)primaryWidth=Math.Max(200,(b.Right-left)*96.0/Math.Max(96,GetDpiForWindow(bar)));}}return true;},IntPtr.Zero);
  var occupied=new List<int>();var edges=new List<int>();foreach(var bar in bars){Rect b;if(!GetWindowRect(bar,out b))continue;int left=NativeLeft(bar,b);
   if(accessible)try{var root=AutomationElement.FromHandle(bar);var elements=root.FindAll(TreeScope.Descendants,Condition.TrueCondition);foreach(AutomationElement element in elements){try{var current=element.Current;if(current.IsOffscreen||current.ProcessId==PlayerProcessId)continue;var id=current.AutomationId+" "+current.ClassName;var r=current.BoundingRectangle;if(r.Width<=0||r.Left<b.Left||r.Left>=b.Right||r.Bottom<=b.Top||r.Top>=b.Bottom)continue;
    if(id.IndexOf("SystemTray",StringComparison.OrdinalIgnoreCase)>=0||id.IndexOf("Clock",StringComparison.OrdinalIgnoreCase)>=0||id.IndexOf("DateTime",StringComparison.OrdinalIgnoreCase)>=0)left=Math.Min(left,(int)Math.Floor(r.Left));
    bool button=current.ControlType==ControlType.Button||id.IndexOf("TaskListButton",StringComparison.OrdinalIgnoreCase)>=0||id.IndexOf("StartButton",StringComparison.OrdinalIgnoreCase)>=0||id.IndexOf("SearchBox",StringComparison.OrdinalIgnoreCase)>=0;
    if(button&&r.Width<(b.Right-b.Left)/2.0){occupied.Add(b.Left);occupied.Add(b.Top);occupied.Add((int)Math.Floor(r.Left));occupied.Add((int)Math.Ceiling(r.Right)-(int)Math.Floor(r.Left));}
   }catch{}}}catch{}
   // XAML clocks on secondary taskbars have no TrayClockWClass. Reserve the primary tray's scaled width if inaccessible.
   if(left==b.Right)left=Math.Max(b.Left,b.Right-(int)Math.Ceiling(primaryWidth*Math.Max(96,GetDpiForWindow(bar))/96.0));
   edges.Add(b.Left);edges.Add(b.Top);edges.Add(left);
  }if(accessible&&version==alignmentVersion){occupiedCache=occupied.ToArray();occupiedReady=true;}return edges.ToArray();
 }
 public static int[] TrayEdges(){
  int currentAlignment=Convert.ToInt32(Microsoft.Win32.Registry.GetValue(@"HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced","TaskbarAl",1));if(currentAlignment!=alignment){alignment=currentAlignment;alignmentVersion++;occupiedReady=false;trayAt=DateTime.MinValue;}
  if(trayProbe!=null&&trayProbe.IsCompleted){try{trayCache=trayProbe.Result;}catch{}trayProbe=null;trayAt=occupiedReady?DateTime.UtcNow:DateTime.MinValue;}
  if(trayProbe==null&&(trayCache==null||(DateTime.UtcNow-trayAt).TotalSeconds>2))trayProbe=Task.Run(()=>FindTrayEdges(true));
  if(trayCache==null){if(trayProbe!=null&&trayProbe.Wait(1200)){trayCache=trayProbe.Result;trayProbe=null;trayAt=occupiedReady?DateTime.UtcNow:DateTime.MinValue;}else return FindTrayEdges(false);}
  return trayCache;
 }
 public static int[] Bounds(long h){SetThreadDpiAwarenessContext(new IntPtr(-4));Rect r;IntPtr handle=new IntPtr(h);if(DwmGetWindowAttribute(handle,9,out r,Marshal.SizeOf(typeof(Rect)))!=0)GetWindowRect(handle,out r);return new int[]{r.Left,r.Top,r.Right-r.Left,r.Bottom-r.Top};} public static uint ForegroundPid(){uint p;GetWindowThreadProcessId(GetForegroundWindow(),out p);return p;}
 public static int[] RawBounds(long h){SetThreadDpiAwarenessContext(new IntPtr(-4));Rect r;GetWindowRect(new IntPtr(h),out r);return new int[]{r.Left,r.Top,r.Right-r.Left,r.Bottom-r.Top};}
 public static void Raise(long h){SetWindowPos(new IntPtr(h),new IntPtr(-1),0,0,0,0,0x13);}
 public static bool AboveTaskbar(long h,int x,int y){int index=0,hint=-1,bar=-1;EnumWindows((window,p)=>{if(window.ToInt64()==h&&IsWindowVisible(window))hint=index;var name=new StringBuilder(256);GetClassName(window,name,256);if(name.ToString()=="Shell_TrayWnd"||name.ToString()=="Shell_SecondaryTrayWnd"){Rect r;if(GetWindowRect(window,out r)&&x>=r.Left&&x<r.Right&&y>=r.Top&&y<r.Bottom)bar=index;}index++;return true;},IntPtr.Zero);return hint>=0&&bar>=0&&hint<bar;}
 [DllImport("user32.dll")] static extern bool GetClientRect(IntPtr h,out Rect rect);
 [DllImport("user32.dll")] static extern bool ClientToScreen(IntPtr h,ref Point point);
 [DllImport("user32.dll",EntryPoint="GetWindowLongPtrW")] static extern IntPtr GetWindowLongPtr(IntPtr h,int index);
 public static int[] ClientBounds(long h){SetThreadDpiAwarenessContext(new IntPtr(-4));var handle=new IntPtr(h);Rect rect;var origin=new Point();GetClientRect(handle,out rect);ClientToScreen(handle,ref origin);return new int[]{origin.X,origin.Y,rect.Right-rect.Left,rect.Bottom-rect.Top};}
 public static string Owner(long h){return GetWindowLongPtr(new IntPtr(h),-8).ToInt64().ToString();}
 public static bool TaskbarExcluded(long h){long style=GetWindowLongPtr(new IntPtr(h),-20).ToInt64();return (style&0x80)!=0&&(style&0x40000)==0;}
 public static string FitLast="";
 public static void Fit(long h,int x,int y,int w,int height,int rendererHeight){
  SetThreadDpiAwarenessContext(new IntPtr(-4));
  var visible=VisibleBounds(h);var client=ClientBounds(h);
  if(visible[0]==x&&visible[1]==y&&visible[2]==w&&visible[3]==height&&client[0]==x&&client[1]+(rendererHeight>0?rendererHeight:client[3])==y+height){if(!AboveTaskbar(h,x+1,y+1))Raise(h);return;}
  var handle=new IntPtr(h);var raw=RawBounds(h);bool ok=true;if(raw[2]!=w||raw[3]<height){ok=SetWindowPos(handle,new IntPtr(-1),x,y,w,Math.Max(height,raw[3]),0x10);}int error=ok?0:Marshal.GetLastWin32Error();raw=RawBounds(h);client=ClientBounds(h);
  // Align the rendered client area, not the minimum-sized outer frame.
  int offsetX=client[0]-raw[0],clientBottom=client[1]-raw[1]+(rendererHeight>0?rendererHeight:client[3]);
  for(int attempt=0;attempt<3;attempt++){SetWindowPos(handle,new IntPtr(-1),x-offsetX,y+height-clientBottom,0,0,0x11);raw=RawBounds(h);client=ClientBounds(h);offsetX=client[0]-raw[0];clientBottom=client[1]-raw[1]+(rendererHeight>0?rendererHeight:client[3]);if(client[0]==x&&client[1]+(rendererHeight>0?rendererHeight:client[3])==y+height)break;}
  IntPtr region=CreateRectRgn(x-raw[0],y-raw[1],x-raw[0]+w,y-raw[1]+height);if(SetWindowRgn(handle,region,true)==0)DeleteObject(region);
  FitLast=ok+" err="+error+" dpi="+GetDpiForWindow(handle)+" raw="+string.Join(",",raw)+" client="+string.Join(",",ClientBounds(h));
 }
 [StructLayout(LayoutKind.Sequential)] struct Accent {public int State,Flags,Color,Animation;}
 [StructLayout(LayoutKind.Sequential)] struct CompositionData {public int Attribute;public IntPtr Data;public int Size;}
 [DllImport("user32.dll")] static extern bool SetWindowCompositionAttribute(IntPtr h,ref CompositionData data);
 [DllImport("gdi32.dll")] static extern IntPtr CreateRoundRectRgn(int l,int t,int r,int b,int width,int height);
 [StructLayout(LayoutKind.Sequential)] struct BlurBehind {public uint Flags;[MarshalAs(UnmanagedType.Bool)] public bool Enable;public IntPtr Region;[MarshalAs(UnmanagedType.Bool)] public bool Transition;}
 [DllImport("dwmapi.dll")] static extern int DwmSetWindowAttribute(IntPtr h,int attribute,ref int value,int size);
 [DllImport("dwmapi.dll")] static extern int DwmEnableBlurBehindWindow(IntPtr h,ref BlurBehind blur);
 [DllImport("gdi32.dll")] static extern bool PtInRegion(IntPtr region,int x,int y);
 static Dictionary<long,string> menuClips=new Dictionary<long,string>();
 [DllImport("dwmapi.dll")] static extern int DwmGetWindowAttribute(IntPtr h,int attribute,out int value,int size);
 static Dictionary<long,bool> menuBorderApplied=new Dictionary<long,bool>();
 public static bool MenuBorderApplied(long h){return menuBorderApplied.ContainsKey(h)&&menuBorderApplied[h];}
 public static bool MenuCorners(long h){int value;return DwmGetWindowAttribute(new IntPtr(h),33,out value,4)==0&&value==2;}
 public static bool MenuStyle(long h,bool dark){
  var handle=new IntPtr(h);int noAnimation=1;DwmSetWindowAttribute(handle,3,ref noAnimation,4);
  var rect=RawBounds(h);var key=rect[2]+","+rect[3]+","+GetDpiForWindow(handle)+","+dark;
  if(menuClips.ContainsKey(h)&&menuClips[h]==key&&MenuCorners(h))return true;
  SetWindowRgn(handle,IntPtr.Zero,true);
  int corner=2,theme=dark?1:0,material=1,border=unchecked((int)0xfffffffe);
  menuBorderApplied[h]=DwmSetWindowAttribute(handle,34,ref border,4)==0;
  bool ok=DwmSetWindowAttribute(handle,33,ref corner,4)==0;
  DwmSetWindowAttribute(handle,20,ref theme,4);
  ok=DwmSetWindowAttribute(handle,38,ref material,4)==0&&ok;
  var accent=new Accent{State=3};var memory=Marshal.AllocHGlobal(Marshal.SizeOf(typeof(Accent)));try{Marshal.StructureToPtr(accent,memory,false);var data=new CompositionData{Attribute=19,Data=memory,Size=Marshal.SizeOf(typeof(Accent))};ok=SetWindowCompositionAttribute(handle,ref data)&&ok;}finally{Marshal.FreeHGlobal(memory);}
  if(ok&&MenuCorners(h))menuClips[h]=key;return ok&&MenuCorners(h);
 }
 public static void ClearClip(long h){IntPtr region=CreateRectRgn(0,0,0,0);try{if(GetWindowRgn(new IntPtr(h),region)>0)SetWindowRgn(new IntPtr(h),IntPtr.Zero,true);}finally{DeleteObject(region);}}
 public static int[] VisibleBounds(long h){var bounds=RawBounds(h);IntPtr region=CreateRectRgn(0,0,0,0);try{Rect r;if(GetWindowRgn(new IntPtr(h),region)>0&&GetRgnBox(region,out r)>0)return new int[]{bounds[0]+r.Left,bounds[1]+r.Top,r.Right-r.Left,r.Bottom-r.Top};return bounds;}finally{DeleteObject(region);}}
}
'@ -ReferencedAssemblies $taskAutomationReferences
if($Once){[PlayerShell]::TrayEdges()|Out-Null;Start-Sleep -Milliseconds 1000}
$taskTick=0
$taskNativeWasMoving=$false
$taskRaisedMenus=''
$taskMenuRaises=0
while($true){
 try {
  if($ControlFile -and (Test-Path -LiteralPath $ControlFile)){$taskControl=Get-Content -LiteralPath $ControlFile -Raw -Encoding UTF8|ConvertFrom-Json}; $taskForeground='';try{$taskForeground=(Get-Process -Id ([PlayerShell]::ForegroundPid()) -ErrorAction Stop).ProcessName}catch{}
  $taskMenuKey=@($taskControl.menuRaiseHandles) -join ','
  if($taskMenuKey -ne $taskRaisedMenus){foreach($taskMenuHandle in $taskControl.menuRaiseHandles){[PlayerShell]::Raise([long]$taskMenuHandle);$taskMenuRaises++};$taskRaisedMenus=$taskMenuKey}
  $taskMenuBordersHidden=$true;$taskMenuBlur=$true;$taskMenuStyled=@();foreach($taskMenuWindow in $taskControl.menuWindows){if([PlayerShell]::MenuStyle([long]$taskMenuWindow.handle,[bool]$taskMenuWindow.dark)){$taskMenuStyled+=[string]$taskMenuWindow.handle;if(-not [PlayerShell]::MenuBorderApplied([long]$taskMenuWindow.handle)){$taskMenuBordersHidden=$false}}else{$taskMenuBlur=$false}}
  $taskNativeMoving=$taskControl -and [PlayerShell]::Moving([long]$taskControl.handle)
  $taskNativeTarget=$null
  if($taskNativeMoving){
   $taskCursor=[PlayerShell]::Cursor();$taskRaw=[PlayerShell]::RawBounds([long]$taskControl.handle)
   $taskNativeTarget=@($taskControl.nativeHints | Where-Object {$taskCursor[0] -ge $_.bar.x -and $taskCursor[0] -le ($_.bar.x+$_.bar.width) -and ($taskRaw[1]+$taskRaw[3]) -ge ($_.bar.y-32*$_.scale) -and $taskRaw[1] -le ($_.bar.y+$_.bar.height+15*$_.scale)} | Sort-Object { [Math]::Abs($taskCursor[0]-($_.rect.x+$_.rect.width/2)) } | Select-Object -First 1)[0]
   foreach($taskHint in $taskControl.nativeHints){[PlayerShell]::HintVisible([long]$taskHint.handle,($taskNativeTarget -and $taskHint.handle -eq $taskNativeTarget.handle))}
   if($taskNativeTarget){$r=$taskNativeTarget.rect;$hb=[PlayerShell]::RawBounds([long]$taskNativeTarget.handle);[PlayerShell]::SetWindowPos([IntPtr]([long]$taskNativeTarget.handle),[IntPtr](-1),$r.x,($r.y+$r.height-$hb[3]),$r.width,$hb[3],0x10)|Out-Null}
  }elseif($taskNativeWasMoving){foreach($taskHint in $taskControl.nativeHints){[PlayerShell]::HintVisible([long]$taskHint.handle,$false)}}
  $taskNativeWasMoving=$taskNativeMoving
  if($taskControl.handle){[PlayerShell]::IgnorePlayer([long]$taskControl.handle)}
  $taskBars=[PlayerShell]::Taskbars()
  $taskStart=($taskForeground -match '^(StartMenuExperienceHost|SearchHost|SearchApp|ShellExperienceHost)$')
  $taskTrayEdges=@([PlayerShell]::TrayEdges())
  $taskPointer=[PlayerShell]::Cursor()
  $taskLeftDown=(([PlayerShell]::GetAsyncKeyState(1) -band 0x8000) -ne 0)
  $taskRightDown=(([PlayerShell]::GetAsyncKeyState(2) -band 0x8000) -ne 0)
  $taskEscapeDown=(([PlayerShell]::GetAsyncKeyState(27) -band 0x8001) -ne 0)
  $taskState=@{type='shell';menuRaiseCount=$taskMenuRaises;pointer=$taskPointer;occupied=@([PlayerShell]::Occupied());occupiedReady=[PlayerShell]::OccupiedReady();monitorSources=@([PlayerShell]::MonitorSources());menuStyled=@($taskMenuStyled);menuBorderSuppressionApplied=[bool]$taskMenuBordersHidden;menuBlur=[bool]$taskMenuBlur;nativeDragging=[bool]$taskNativeMoving;nativeTarget=$(if($taskNativeTarget){@{displayId=$taskNativeTarget.displayId;side=$taskNativeTarget.side}}else{$null});nativeDpi=$(if($taskControl){[PlayerShell]::GetDpiForWindow([IntPtr]([long]$taskControl.handle))}else{0});taskbarExcluded=$(if($taskControl){[PlayerShell]::TaskbarExcluded([long]$taskControl.handle)}else{$false});taskbarOwner=$(if($taskControl){[PlayerShell]::Owner([long]$taskControl.handle)}else{'0'});aboveTaskbar=$(if($taskControl.rect){[PlayerShell]::AboveTaskbar([long]$taskControl.handle,$taskControl.rect.x+1,$taskControl.rect.y+1)}else{$false});clientRect=$(if($taskControl){[PlayerShell]::ClientBounds([long]$taskControl.handle)}else{@()});nativeRaw=$(if($taskControl){[PlayerShell]::RawBounds([long]$taskControl.handle)}else{@()});visiblePlayerRect=$(if($taskControl){[PlayerShell]::VisibleBounds([long]$taskControl.handle)}else{@()});fitDebug=[PlayerShell]::FitLast;trayEdges=@($taskTrayEdges);playerRect=$(if($taskControl){[PlayerShell]::Bounds([long]$taskControl.handle)}else{@()});taskbars=@($taskBars);startOpen=$taskStart;foreground=$taskForeground;leftDown=$taskLeftDown;rightDown=$taskRightDown;escapeDown=$taskEscapeDown}
  if($taskControl.hint){$r=$taskControl.hint.rect;$taskState.hintAboveTaskbar=[PlayerShell]::AboveTaskbar([long]$taskControl.hint.handle,$r.x+1,$r.y+1);$taskHintBounds=[PlayerShell]::RawBounds([long]$taskControl.hint.handle);$taskState.hintRect=@($taskHintBounds[0],($taskHintBounds[1]+$taskHintBounds[3]-$r.height),$taskHintBounds[2],$r.height)}
  [Console]::WriteLine(($taskState|ConvertTo-Json -Compress -Depth 5))
  if($ControlFile -and ($taskTick % 3 -eq 0) -and (Test-Path -LiteralPath $ControlFile)){
   $taskControl=Get-Content -LiteralPath $ControlFile -Raw -Encoding UTF8|ConvertFrom-Json
   if($taskNativeMoving -or -not $taskControl.rect){[PlayerShell]::ClearClip([long]$taskControl.handle)}
   if($taskControl.raise -and -not $taskNativeMoving){if($taskControl.rect){$r=$taskControl.rect;[PlayerShell]::Fit([long]$taskControl.handle,$r.x,$r.y,$r.width,$r.height,[int]$taskControl.rendererHeight)}else{[PlayerShell]::Raise([long]$taskControl.handle)}}
   if($taskControl.hint){[PlayerShell]::Raise([long]$taskControl.hint.handle)}
  }
 } catch { [Console]::WriteLine((@{type='shellError';message=$_.Exception.Message}|ConvertTo-Json -Compress)) }
 if($Once){break}
 $taskTick++;Start-Sleep -Milliseconds $(if($taskNativeMoving){40}elseif($taskControl -and @($taskControl.menuRaiseHandles).Count -gt 0){15}else{150})
}
