param([string]$MediaPath)
[Console]::OutputEncoding=New-Object System.Text.UTF8Encoding($false)
Add-Type -Path (Join-Path $PSScriptRoot 'cover-reader.cs') -ReferencedAssemblies System.Drawing
try{if(Test-Path -LiteralPath $MediaPath -PathType Leaf){$bytes=[PlayerCoverReader]::FromFile($MediaPath);[Console]::WriteLine('data:image/png;base64,'+[Convert]::ToBase64String($bytes))}}catch{}
