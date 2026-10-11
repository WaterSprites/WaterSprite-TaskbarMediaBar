using System;
using System.Windows.Automation;
public static class NeteaseControl {
 class Status{public bool supported,playing;}
 static System.Threading.Tasks.Task<Status> query;
 static Status cached=new Status();static int cachePid;static DateTime refreshed=DateTime.MinValue;
 static Status Read(int pid){
  if(query!=null&&query.IsCompleted){try{cached=query.Result;}catch{cached=new Status();}query=null;refreshed=DateTime.UtcNow;}
  if(query==null&&(pid!=cachePid||(DateTime.UtcNow-refreshed).TotalMilliseconds>500)){
   cachePid=pid;query=System.Threading.Tasks.Task.Run(()=>{try{var button=Toggle(pid);return new Status{supported=button!=null,playing=button!=null&&button.Current.Name=="pause"};}catch{return new Status();}});
  }
  return cached;
 }
 static AutomationElement Toggle(int pid){
  IntPtr window=PlayerWindowControl.Window(pid);if(window==IntPtr.Zero)return null;
  var root=AutomationElement.FromHandle(window);
  var document=root.FindFirst(TreeScope.Descendants,new PropertyCondition(AutomationElement.ControlTypeProperty,ControlType.Document));
  if(document==null)return null;
  var child=TreeWalker.RawViewWalker.GetLastChild(document);
  for(int i=0;child!=null&&i<15;i++){
   var toggle=child.FindFirst(TreeScope.Descendants,new PropertyCondition(AutomationElement.AutomationIdProperty,"btn_pc_minibar_play"));
   if(toggle!=null)return toggle;
   child=TreeWalker.RawViewWalker.GetPreviousSibling(child);
  }
  return null;
 }
 public static bool Supported(int pid){return Read(pid).supported;}
 public static bool Playing(int pid){return Read(pid).playing;}
 public static bool Send(int pid,string action){
  var deadline=DateTime.UtcNow.AddMilliseconds(1200);
  var operation=System.Threading.Tasks.Task.Run(()=>SendNow(pid,action,deadline));
  try{return operation.Wait(1300)&&operation.Result;}catch{return false;}
 }
 static bool SendNow(int pid,string action,DateTime deadline){try{
  var toggle=Toggle(pid);if(toggle==null)return false;
  AutomationElement target=toggle;
  if(action!="toggle"){
   var footer=TreeWalker.ControlViewWalker.GetParent(toggle);
   target=footer.FindFirst(TreeScope.Descendants,new AndCondition(new PropertyCondition(AutomationElement.NameProperty,action=="next"?"next":"pre"),new PropertyCondition(AutomationElement.ControlTypeProperty,ControlType.Button)));
  }
  if(target==null||!target.Current.IsEnabled||DateTime.UtcNow>deadline)return false;
  object pattern;
  if(target.TryGetCurrentPattern(InvokePattern.Pattern,out pattern)){((InvokePattern)pattern).Invoke();return true;}
  return false;
 }catch{return false;}}
}
