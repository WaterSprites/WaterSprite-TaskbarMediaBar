# Read only player installation metadata; never alter player settings.
$ErrorActionPreference='SilentlyContinue'
[Console]::OutputEncoding=New-Object Text.UTF8Encoding($false)
$taskResult=@{qq=New-Object 'System.Collections.Generic.List[string]';kuwo=New-Object 'System.Collections.Generic.List[string]'}
function Add-PlayerPath([string]$taskKind,[string]$taskValue){
 if(-not $taskValue){return}
 $taskValue=[Environment]::ExpandEnvironmentVariables($taskValue.Trim('"'))
 if([IO.Path]::IsPathRooted($taskValue) -and (Test-Path -LiteralPath $taskValue)){$taskResult[$taskKind].Add($taskValue)}
}
foreach($taskKind in @('qq','kuwo')){
 $taskExe=if($taskKind -eq 'qq'){'QQMusic.exe'}else{'KwMusic.exe'}
 Get-Process -Name ([IO.Path]::GetFileNameWithoutExtension($taskExe)) | ForEach-Object {Add-PlayerPath $taskKind $_.Path}
 foreach($taskHive in @('HKCU:\Software','HKLM:\Software','HKLM:\Software\WOW6432Node')){
  $taskAppKey=Join-Path $taskHive ('Microsoft\Windows\CurrentVersion\App Paths\'+$taskExe)
  if(Test-Path -LiteralPath $taskAppKey){$taskKey=Get-Item -LiteralPath $taskAppKey;Add-PlayerPath $taskKind ($taskKey.GetValue(''));Add-PlayerPath $taskKind ($taskKey.GetValue('Path'))}
  $taskProductKey=if($taskKind -eq 'qq'){Join-Path $taskHive 'Tencent\QQMusic'}else{Join-Path $taskHive 'kuwo'}
  if(Test-Path -LiteralPath $taskProductKey){$taskKey=Get-Item -LiteralPath $taskProductKey;foreach($taskName in $taskKey.GetValueNames()){if($taskName -match '(?i)(path|dir|cache)'){Add-PlayerPath $taskKind ([string]$taskKey.GetValue($taskName))}}}
 }
}
foreach($taskHive in @('HKCU:\Software','HKLM:\Software','HKLM:\Software\WOW6432Node')){
 Get-ChildItem -LiteralPath (Join-Path $taskHive 'Microsoft\Windows\CurrentVersion\Uninstall') | ForEach-Object {
  $taskInfo=Get-ItemProperty -LiteralPath $_.PSPath
  $taskKind=if($taskInfo.DisplayName -match '(?i)QQMusic|QQ音乐'){'qq'}elseif($taskInfo.DisplayName -match '(?i)Kuwo|酷我'){'kuwo'}else{''}
  if($taskKind){Add-PlayerPath $taskKind $taskInfo.InstallLocation; if($taskInfo.DisplayIcon -match '^"?(.+?\.exe)'){Add-PlayerPath $taskKind $Matches[1]}}
 }
}
$taskShortcutRoots=@([Environment]::GetFolderPath('StartMenu'),[Environment]::GetFolderPath('CommonStartMenu'),[Environment]::GetFolderPath('Desktop'))
$taskShell=$null
foreach($taskRoot in $taskShortcutRoots){
 if(-not $taskRoot){continue}
 Get-ChildItem -LiteralPath $taskRoot -Filter '*.lnk' -Recurse -File | Where-Object {$_.BaseName -match '(?i)QQMusic|QQ音乐|Kuwo|酷我'} | Select-Object -First 100 | ForEach-Object {
  if(-not $taskShell){$taskShell=New-Object -ComObject WScript.Shell}
  $taskTarget=$taskShell.CreateShortcut($_.FullName).TargetPath
  $taskKind=if([IO.Path]::GetFileName($taskTarget) -eq 'QQMusic.exe'){'qq'}elseif([IO.Path]::GetFileName($taskTarget) -eq 'KwMusic.exe'){'kuwo'}else{''}
  if($taskKind){Add-PlayerPath $taskKind $taskTarget}
 }
}
@{qq=@($taskResult.qq | Select-Object -Unique);kuwo=@($taskResult.kuwo | Select-Object -Unique)} | ConvertTo-Json -Compress
