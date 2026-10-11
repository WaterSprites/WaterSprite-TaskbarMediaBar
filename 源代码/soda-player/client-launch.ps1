param([Parameter(Mandatory=$true)][string]$BackupFolder)
$ErrorActionPreference='Stop'
[Console]::OutputEncoding=New-Object Text.UTF8Encoding($false)
$taskPorts=@{'cloudmusic.exe'=43831;'哔哩哔哩.exe'=43833}
$taskShell=New-Object -ComObject WScript.Shell
$taskUserMenu=[Environment]::GetFolderPath('StartMenu')
$taskCommonMenu=[Environment]::GetFolderPath('CommonStartMenu')
$taskRoots=@($taskUserMenu,$taskCommonMenu,[Environment]::GetFolderPath('Desktop'),(Join-Path $env:APPDATA 'Microsoft\Internet Explorer\Quick Launch\User Pinned'))
$taskPaths=New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
foreach($taskRoot in $taskRoots){if($taskRoot -and (Test-Path -LiteralPath $taskRoot)){Get-ChildItem -LiteralPath $taskRoot -Filter '*.lnk' -File -Recurse -ErrorAction SilentlyContinue | ForEach-Object {$null=$taskPaths.Add($_.FullName)}}}
# Include the application's existing collection shortcuts and Dock launchpad shortcuts.
foreach($taskProcess in @(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {$taskPorts.ContainsKey($_.Name) -or $_.Name -eq 'Dock_64.exe'})){
 if(-not $taskProcess.ExecutablePath){continue}
 if($taskProcess.Name -eq 'Dock_64.exe'){$taskFolder=Join-Path (Split-Path $taskProcess.ExecutablePath) 'launchpad';if(Test-Path -LiteralPath $taskFolder){Get-ChildItem -LiteralPath $taskFolder -Filter '*.lnk' -File -Recurse -ErrorAction SilentlyContinue | ForEach-Object {$null=$taskPaths.Add($_.FullName)}}}
 else{foreach($taskFolder in @((Split-Path $taskProcess.ExecutablePath),(Split-Path (Split-Path $taskProcess.ExecutablePath)))){Get-ChildItem -LiteralPath $taskFolder -Filter '*.lnk' -File -ErrorAction SilentlyContinue | ForEach-Object {$null=$taskPaths.Add($_.FullName)}}}
}
$null=New-Item -ItemType Directory -Path $BackupFolder -Force
$taskUpdated=0;$taskSkipped=0;$taskErrors=0
foreach($taskPath in $taskPaths){try{
 $taskLink=$taskShell.CreateShortcut($taskPath)
 $taskExe=[IO.Path]::GetFileName($taskLink.TargetPath)
 if(-not $taskPorts.ContainsKey($taskExe) -or -not (Test-Path -LiteralPath $taskLink.TargetPath)){continue}
 # Use a user-level copy for common Start Menu links; never require administrator rights.
 $taskDestination=$taskPath
 if($taskPath.StartsWith($taskCommonMenu+'\',[StringComparison]::OrdinalIgnoreCase)){
  $taskDestination=Join-Path $taskUserMenu $taskPath.Substring($taskCommonMenu.Length+1)
  if(-not (Test-Path -LiteralPath $taskDestination)){$null=New-Item -ItemType Directory -Path (Split-Path $taskDestination) -Force;Copy-Item -LiteralPath $taskPath -Destination $taskDestination}
  $taskLink=$taskShell.CreateShortcut($taskDestination)
  if([IO.Path]::GetFileName($taskLink.TargetPath) -ne $taskExe){continue}
 }
 if($taskLink.Arguments -match '--remote-debugging-port(?:=|\s)'){$taskSkipped++;continue}
 $taskHasher=[Security.Cryptography.SHA256]::Create();try{$taskHash=([BitConverter]::ToString($taskHasher.ComputeHash([Text.Encoding]::UTF8.GetBytes($taskDestination)))).Replace('-','')}finally{$taskHasher.Dispose()}
 $taskBackup=Join-Path $BackupFolder ($taskHash+'.lnk')
 if(-not (Test-Path -LiteralPath $taskBackup)){Copy-Item -LiteralPath $taskDestination -Destination $taskBackup;@{path=$taskDestination;arguments=$taskLink.Arguments;backup=$taskBackup}|ConvertTo-Json -Compress|Add-Content -LiteralPath (Join-Path $BackupFolder 'index.jsonl') -Encoding UTF8}
 $taskLink.Arguments=('--remote-debugging-address=127.0.0.1 --remote-debugging-port='+$taskPorts[$taskExe]+' '+$taskLink.Arguments).Trim()
 $taskLink.Save();$taskUpdated++
}catch{$taskErrors++}}
@{type='client-launch';updated=$taskUpdated;alreadyPrepared=$taskSkipped;errors=$taskErrors}|ConvertTo-Json -Compress
