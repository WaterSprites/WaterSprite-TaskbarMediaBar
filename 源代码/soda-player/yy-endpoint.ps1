$ErrorActionPreference='Stop'
[Console]::OutputEncoding=New-Object Text.UTF8Encoding($false)
$taskYYPids=@(Get-Process -Name YY,YYClient -ErrorAction SilentlyContinue | ForEach-Object {$_.Id})
if(-not $taskYYPids.Count){'[]';exit}
$taskYYPorts=@(Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object {$_.LocalAddress -eq '127.0.0.1' -and $_.OwningProcess -in $taskYYPids} | ForEach-Object {@{pid=$_.OwningProcess;port=$_.LocalPort}})
ConvertTo-Json -InputObject $taskYYPorts -Compress
