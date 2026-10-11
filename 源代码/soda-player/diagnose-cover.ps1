. './soda-player/media-bridge.ps1' -Once | Out-Null
$null=[Windows.Storage.Streams.IRandomAccessStream,Windows.Storage.Streams,ContentType=WindowsRuntime]
$p=Await-WinRT ($taskManager.GetCurrentSession().TryGetMediaPropertiesAsync()) ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties])
$raw=Await-WinRT ($p.Thumbnail.OpenReadAsync()) ([Windows.Storage.Streams.IRandomAccessStreamWithContentType])
try{$typed=[Windows.Storage.Streams.IRandomAccessStream]$raw;[Console]::WriteLine('typed size='+$typed.Size);$reader=[Windows.Storage.Streams.DataReader]::new($typed.GetInputStreamAt(0));[Console]::WriteLine('loaded='+(Await-WinRT ($reader.LoadAsync([uint32]$typed.Size)) ([uint32])))}catch{[Console]::WriteLine('typed error='+$_.Exception.Message)}
try{$managed=[System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($raw);$mem=New-Object System.IO.MemoryStream;$managed.CopyTo($mem);[Console]::WriteLine('managed size='+$mem.Length)}catch{[Console]::WriteLine('managed error='+$_.Exception.Message)}
