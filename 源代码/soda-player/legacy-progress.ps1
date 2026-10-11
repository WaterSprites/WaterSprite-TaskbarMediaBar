param([switch]$Once)
$ErrorActionPreference='Stop'
[Console]::OutputEncoding=New-Object Text.UTF8Encoding($false)
Add-Type -AssemblyName System.Runtime.WindowsRuntime
Add-Type -Path (Join-Path $PSScriptRoot 'legacy-frame.cs') -ReferencedAssemblies System.Drawing
$null=[Windows.Media.Ocr.OcrEngine,Windows.Foundation,ContentType=WindowsRuntime]
$null=[Windows.Graphics.Imaging.BitmapDecoder,Windows.Foundation,ContentType=WindowsRuntime]
$null=[Windows.Graphics.Imaging.SoftwareBitmap,Windows.Foundation,ContentType=WindowsRuntime]
$null=[Windows.Storage.Streams.InMemoryRandomAccessStream,Windows.Foundation,ContentType=WindowsRuntime]
$taskAwaitMethod=[System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {$_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'} | Select-Object -First 1
function Await-Result($operation,[Type]$type){$taskResult=$taskAwaitMethod.MakeGenericMethod($type).Invoke($null,@($operation));if(-not $taskResult.Wait(3000)){throw '读取播放器进度超时'};return $taskResult.Result}
$null=[Windows.Globalization.Language,Windows.Globalization,ContentType=WindowsRuntime]
$taskLanguage=New-Object Windows.Globalization.Language('en-US');$taskEngine=[Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($taskLanguage);if(-not $taskEngine){$taskEngine=[Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()}
do {
 $taskPlayers=@()
 foreach($taskName in @('kwmusic','cloudmusic')){
  foreach($taskProcess in @(Get-Process -Name $taskName -ErrorAction SilentlyContinue)){
   try{
    $taskTitle=[LegacyMediaFrame]::Title($taskProcess.Id)
    if(-not $taskTitle){continue}
    $taskBytes=$null
    if($taskName -eq 'kwmusic'){$taskBytes=[LegacyMediaFrame]::Footer($taskProcess.Id,$true)}
    $taskPosition=$null;$taskDuration=$null;$taskText=''
    if($taskBytes -and $taskEngine){
     $taskStream=New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
     $taskWriter=New-Object Windows.Storage.Streams.DataWriter($taskStream)
     $taskWriter.WriteBytes($taskBytes)
     $null=Await-Result ($taskWriter.StoreAsync()) ([uint32])
     $taskStream.Seek(0)
     $taskDecoder=Await-Result ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($taskStream)) ([Windows.Graphics.Imaging.BitmapDecoder])
     $taskBitmap=Await-Result ($taskDecoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
     try{$taskOcr=Await-Result ($taskEngine.RecognizeAsync($taskBitmap)) ([Windows.Media.Ocr.OcrResult]);$taskText=$taskOcr.Text.Replace('：',':').Replace('／','/')}finally{$taskBitmap.Dispose();$taskWriter.DetachStream()|Out-Null;$taskWriter.Dispose();$taskStream.Dispose()}
     if($taskText -match '(\d{1,2})\s*:\s*([0-5]\d)\s*[/／]\s*(\d{1,2})\s*:\s*([0-5]\d)'){$taskPosition=[int]$Matches[1]*60+[int]$Matches[2];$taskDuration=[int]$Matches[3]*60+[int]$Matches[4]}
    }
    $taskItem=@{pid=$taskProcess.Id;name=$taskName;windowTitle=$taskTitle;visible=[LegacyMediaFrame]::Visible($taskProcess.Id);position=$taskPosition;duration=$taskDuration};if($Once){$taskItem.footerText=$taskText};$taskPlayers+=$taskItem
   }catch{$taskPlayers+=@{pid=$taskProcess.Id;name=$taskName;windowTitle=$taskTitle;error=$_.Exception.Message}}
  }
 }
 [Console]::WriteLine((@{type='legacy';players=$taskPlayers}|ConvertTo-Json -Depth 4 -Compress))
 if(-not $Once){Start-Sleep -Milliseconds 1000}
}while(-not $Once)
