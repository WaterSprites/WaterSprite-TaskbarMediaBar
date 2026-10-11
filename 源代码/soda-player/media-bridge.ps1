param([string]$CommandFile, [switch]$Once)
$ErrorActionPreference='Stop'
[Console]::OutputEncoding=New-Object System.Text.UTF8Encoding($false)
Add-Type -AssemblyName System.Runtime.WindowsRuntime
Add-Type -Path (Join-Path $PSScriptRoot 'cover-reader.cs') -ReferencedAssemblies System.Drawing
Add-Type -Path (Join-Path $PSScriptRoot 'audio-sessions.cs')
Add-Type -AssemblyName UIAutomationClient,UIAutomationTypes,WindowsBase
$taskNativeSource=[IO.File]::ReadAllText((Join-Path $PSScriptRoot 'window-control.cs'))+[Environment]::NewLine+[IO.File]::ReadAllText((Join-Path $PSScriptRoot 'netease-control.cs'))
$taskNativeSource=$taskNativeSource -replace '(?m)^using .+;\r?\n',''
Add-Type -TypeDefinition ('using System;using System.Diagnostics;using System.Runtime.InteropServices;using System.Text;using System.Windows.Automation;'+$taskNativeSource) -ReferencedAssemblies UIAutomationClient,UIAutomationTypes,WindowsBase
$null=[Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager,Windows.Media.Control,ContentType=WindowsRuntime]
$null=[Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties,Windows.Media.Control,ContentType=WindowsRuntime]
$null=[Windows.Storage.Streams.DataReader,Windows.Storage.Streams,ContentType=WindowsRuntime]
$null=[Windows.Storage.Streams.IRandomAccessStreamWithContentType,Windows.Storage.Streams,ContentType=WindowsRuntime]
$taskAwaitMethod=([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {$_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'} | Select-Object -First 1)
function Await-WinRT($Operation,[Type]$ResultType) {
    $taskAsync=$taskAwaitMethod.MakeGenericMethod($ResultType).Invoke($null,@($Operation))
    if (-not $taskAsync.Wait(5000)) { throw '媒体会话响应超时' }
    return $taskAsync.Result
}
try {
    $taskManager=Await-WinRT ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager]::RequestAsync()) ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager])
    if ($env:SODA_CONTROL_TEST -eq '1') {
        $taskSession=$taskManager.GetCurrentSession()
        if (-not $taskSession) { throw 'No media session for control test' }
        $taskBefore=[int]$taskSession.GetPlaybackInfo().PlaybackStatus
        $taskChanged=$false
        try {
            $taskAccepted=Await-WinRT ($taskSession.TryTogglePlayPauseAsync()) ([bool])
            Start-Sleep -Milliseconds 900
            $taskAfter=[int]$taskSession.GetPlaybackInfo().PlaybackStatus
            $taskChanged=($taskBefore -ne $taskAfter)
        } finally {
            if ($taskChanged) {
                $null=Await-WinRT ($taskSession.TryTogglePlayPauseAsync()) ([bool])
                Start-Sleep -Milliseconds 900
            }
        }
        [Console]::WriteLine((@{accepted=$taskAccepted;before=$taskBefore;after=$taskAfter;restored=([int]$taskSession.GetPlaybackInfo().PlaybackStatus -eq $taskBefore);source=$taskSession.SourceAppUserModelId} | ConvertTo-Json -Compress))
        exit 0
    }
    $taskSelected=''; $taskFollow=''; $taskAutoSource=''; $taskSystemSource=''; $taskPlaybackHistory=@{}; $taskAudio=@(); $taskMpc=@(); $taskAudioUpdated=[DateTime]::MinValue
    $taskAudioHeard=@{}; $taskCoverKey=''; $taskCover=''; $taskCoverError=''; $taskCoverRetry=[DateTime]::MinValue
    while ($true) {
        try {
            $taskSelectionChanged=$false
            if(([DateTime]::Now-$taskAudioUpdated).TotalSeconds -ge .35){$taskAudio=@([PlayerAudio.Sessions]::List() | Where-Object { $_.name -notmatch '^(kwmusic|cloudmusic|sodamusic|qqmusic|kugou|applemusic)$' -or $_.active -or [PlayerWindowControl]::Visible($_.pid) });$taskMpc=@(Get-Process -Name 'mpc-hc','mpc-hc64' -ErrorAction SilentlyContinue | ForEach-Object {@{pid=$_.Id;title=$_.MainWindowTitle}});$taskLiveProcessIds=@(Get-Process -Name 'kwmusic','cloudmusic','SodaMusic','QQMusic','KuGou','AppleMusic' -ErrorAction SilentlyContinue | ForEach-Object {$_.Id});$taskAudioUpdated=[DateTime]::Now}
            $taskSessions=@($taskManager.GetSessions() | Where-Object {
                $taskId=[string]$_.SourceAppUserModelId
                $taskKnownName=switch -Regex ($taskId){'apple.*music'{'AppleMusic';break};'qqmusic'{'QQMusic';break};'cloudmusic'{'cloudmusic';break};'kwmusic'{'kwmusic';break};'sodamusic|汽水'{'SodaMusic';break};'kugou'{'KuGou';break};default{''}}
                if($taskKnownName){@(Get-Process -Name $taskKnownName -ErrorAction SilentlyContinue | Where-Object {[PlayerWindowControl]::Visible($_.Id) -or @($taskAudio | Where-Object {$_.name -eq $taskKnownName -and $_.active}).Count -gt 0}).Count -gt 0}
                elseif($taskId -match '^([^\\/]+)\.exe$'){@(Get-Process -Name $Matches[1] -ErrorAction SilentlyContinue).Count -gt 0}
                else{$true}
            })
            $taskCurrent=$taskManager.GetCurrentSession()
            $taskSystemNow=if($taskCurrent){[string]$taskCurrent.SourceAppUserModelId}else{''}
            $taskSystemChanged=($taskSystemNow -ne $taskSystemSource)
            $taskSystemSource=$taskSystemNow
            # A newly playing session wins even if Windows still reports the previous current session.
            $taskStartedSession=$null; $taskPlaybackNext=@{}
            foreach($taskSession in $taskSessions){
                $taskSessionId=$taskSession.SourceAppUserModelId
                $taskIsPlaying=([int]$taskSession.GetPlaybackInfo().PlaybackStatus -eq 4)
                if($taskIsPlaying -and $taskPlaybackHistory.ContainsKey($taskSessionId) -and -not $taskPlaybackHistory[$taskSessionId]){$taskStartedSession=$taskSession}
                elseif($taskIsPlaying -and $taskPlaybackHistory.Count -gt 0 -and -not $taskPlaybackHistory.ContainsKey($taskSessionId)){$taskStartedSession=$taskSession}
                $taskPlaybackNext[$taskSessionId]=$taskIsPlaying
            }
            $taskPlaybackHistory=$taskPlaybackNext
            if(-not $taskSelected){
                if($taskStartedSession){$taskCurrent=$taskStartedSession}
                elseif($taskAutoSource -and -not ($taskSystemChanged -and $taskCurrent -and [int]$taskCurrent.GetPlaybackInfo().PlaybackStatus -eq 4)){$taskPreviousPlaying=$taskSessions | Where-Object {$_.SourceAppUserModelId -eq $taskAutoSource -and [int]$_.GetPlaybackInfo().PlaybackStatus -eq 4} | Select-Object -First 1;if($taskPreviousPlaying){$taskCurrent=$taskPreviousPlaying}}
            }
            if(-not $taskSelected -and (-not $taskCurrent -or [int]$taskCurrent.GetPlaybackInfo().PlaybackStatus -ne 4)){
                $taskPlayingSession=$taskSessions | Where-Object {[int]$_.GetPlaybackInfo().PlaybackStatus -eq 4} | Select-Object -First 1
                if($taskPlayingSession){$taskCurrent=$taskPlayingSession}
                elseif($taskAutoSource){$taskPreviousSession=$taskSessions | Where-Object {$_.SourceAppUserModelId -eq $taskAutoSource} | Select-Object -First 1;if($taskPreviousSession){$taskCurrent=$taskPreviousSession}}
            }
            if(-not $taskSelected -and $taskCurrent){$taskAutoSource=$taskCurrent.SourceAppUserModelId}
            if ($taskSelected) { $taskCurrent=$taskSessions | Where-Object {$_.SourceAppUserModelId -eq $taskSelected} | Select-Object -First 1 }
            $taskAudioCurrent=$null
            if($taskSelected -like 'audio:*'){$taskAudioCurrent=$taskAudio | Where-Object {$_.pid -eq [int]$taskSelected.Substring(6)} | Select-Object -First 1}
            elseif(-not $taskSelected -and (-not $taskCurrent -or [int]$taskCurrent.GetPlaybackInfo().PlaybackStatus -ne 4)){$taskAudioCurrent=$taskAudio | Where-Object {$_.active -and -not $_.muted -and $_.peak -gt .002 -and $_.name -match '^(kwmusic|cloudmusic)$' -and $_.windowTitle -match '-'} | Select-Object -First 1}
            if($taskAudioCurrent){
                $taskFamily=[string]$taskAudioCurrent.name
                if($taskFamily -match '^(AppleMusic|AMPLibraryAgent)$'){$taskFamily='AppleMusic'}
                $taskPaired=@($taskSessions | Where-Object {$_.SourceAppUserModelId -match [regex]::Escape($taskFamily)})
                if($taskPaired.Count -eq 1){$taskCurrent=$taskPaired[0];$taskAudioCurrent=$null}
            }
            if(-not $taskSelected -and $taskFollow){
                $taskFollowing=$taskSessions | Where-Object {$_.SourceAppUserModelId -eq $taskFollow} | Select-Object -First 1
                if($taskFollowing){$taskCurrent=$taskFollowing;$taskAudioCurrent=$null}
                elseif($taskFollow -like 'audio:*'){$taskAudioCurrent=$taskAudio | Where-Object {$_.pid -eq [int]$taskFollow.Substring(6)} | Select-Object -First 1;$taskCurrent=$null}
            }
            if ($CommandFile -and (Test-Path -LiteralPath $CommandFile)) {
                $taskCommand=Get-Content -LiteralPath $CommandFile -Raw -Encoding UTF8 | ConvertFrom-Json
                Remove-Item -LiteralPath $CommandFile
                if($taskCommand.action -ne 'select' -and $taskCommand.source){
                    $taskCurrent=$taskSessions | Where-Object {$_.SourceAppUserModelId -eq $taskCommand.source} | Select-Object -First 1
                    $taskAudioCurrent=$null
                    if($taskCommand.source -like 'audio:*'){$taskAudioCurrent=$taskAudio | Where-Object {$_.pid -eq [int]$taskCommand.source.Substring(6)} | Select-Object -First 1}
                }
                if ($taskCommand.action -eq 'select') {
                    $taskFollow=''
                    $taskSelectionChanged=$true
                    $taskSelected=[string]$taskCommand.source; $taskAudioCurrent=$null
                    if($taskSelected){$taskCurrent=$taskSessions | Where-Object {$_.SourceAppUserModelId -eq $taskSelected} | Select-Object -First 1}
                    else{$taskCurrent=$taskManager.GetCurrentSession();$taskAutoSource=''}
                    if($taskSelected -like 'audio:*'){$taskAudioCurrent=$taskAudio | Where-Object {$_.pid -eq [int]$taskSelected.Substring(6)} | Select-Object -First 1}
                }
                elseif($taskCommand.action -eq 'follow'){$taskFollow=[string]$taskCommand.source}
                elseif($taskCommand.action -eq 'open'){
                    $taskOpenPid=0
                    if($taskCommand.source -like 'audio:*'){
                        $taskOpenPid=[int]$taskCommand.source.Substring(6)
                        if([PlayerWindowControl]::Window($taskOpenPid) -eq [IntPtr]::Zero){
                            $taskAudioProcess=Get-Process -Id $taskOpenPid -ErrorAction SilentlyContinue
                            $taskFamily=switch -Regex ($taskAudioProcess.ProcessName){'^RpcMediaDecoderEx$'{'DouyuLive';break};'^yyexternal$'{'YY';break};default{$taskAudioProcess.ProcessName}}
                            if($taskFamily){$taskWindows=@(Get-Process -Name $taskFamily -ErrorAction SilentlyContinue | Where-Object {[PlayerWindowControl]::Window($_.Id) -ne [IntPtr]::Zero});if($taskWindows.Count -eq 1){$taskOpenPid=$taskWindows[0].Id}}
                        }
                    }
                    else{
                        $taskSourceId=[string]$taskCommand.source
                        $taskName=switch -Regex ($taskSourceId){'汽水|soda'{'SodaMusic';break};'qqmusic'{'QQMusic';break};'apple.*music'{'AppleMusic';break};'kugou'{'KuGou';break};'cloudmusic'{'cloudmusic';break};'kwmusic'{'kwmusic';break};'chrome'{'chrome';break};'edge'{'msedge';break};'mpc-hc'{'mpc-hc64';break};default{$taskSourceId -replace '\.exe$',''}}
                        $taskProcess=Get-Process -Name $taskName -ErrorAction SilentlyContinue | Where-Object {$_.MainWindowHandle -ne 0} | Select-Object -First 1
                        if($taskProcess){$taskOpenPid=$taskProcess.Id}
                    }
                    $taskOK=$taskOpenPid -gt 0 -and [PlayerWindowControl]::Open($taskOpenPid)
                    [Console]::WriteLine((@{type='ack';action='open';id=$taskCommand.id;ok=$taskOK;diagnostic=[PlayerWindowControl]::LastOpenDiagnostic;message='当前播放器窗口未能切到前台'}|ConvertTo-Json -Compress))
                }
                elseif($taskSelected -like 'mpc:*'){
                    $taskOK=[PlayerMpcControl]::Send([int]$taskSelected.Substring(4),$taskCommand.action)
                    [Console]::WriteLine((@{type='ack';id=$taskCommand.id;ok=$taskOK;message='MPC-HC 没有响应'}|ConvertTo-Json -Compress))
                }
                elseif($taskAudioCurrent) {
                    $taskOK=if($taskAudioCurrent.name -eq 'cloudmusic'){[NeteaseControl]::Send($taskAudioCurrent.pid,$taskCommand.action)}else{[PlayerWindowControl]::Send($taskAudioCurrent.pid,$taskCommand.action)}
                    [Console]::WriteLine((@{type='ack';id=$taskCommand.id;ok=$taskOK;message='播放器没有接受播放控制'}|ConvertTo-Json -Compress))
                }
                elseif ($taskCurrent) {
                    $taskOperation=switch ($taskCommand.action) {
                        'toggle' {if($taskCommand.desiredPlaying -eq $false -and $taskCurrent.GetPlaybackInfo().Controls.IsPauseEnabled){$taskCurrent.TryPauseAsync()}elseif($taskCommand.desiredPlaying -eq $true -and $taskCurrent.GetPlaybackInfo().Controls.IsPlayEnabled){$taskCurrent.TryPlayAsync()}elseif($taskCurrent.GetPlaybackInfo().Controls.IsPlayPauseToggleEnabled){$taskCurrent.TryTogglePlayPauseAsync()}elseif([int]$taskCurrent.GetPlaybackInfo().PlaybackStatus -eq 4){$taskCurrent.TryPauseAsync()}else{$taskCurrent.TryPlayAsync()}}
                        'next' { $taskCurrent.TrySkipNextAsync() }
                        'previous' { $taskCurrent.TrySkipPreviousAsync() }
                    }
                    if ($taskOperation) {
                        $taskOK=Await-WinRT $taskOperation ([bool])
                        [Console]::WriteLine((@{type='ack';id=$taskCommand.id;ok=$taskOK;message='当前播放器没有接受这个播放命令'} | ConvertTo-Json -Compress))
                    }
                }
                elseif($taskCommand.action -ne 'select') {[Console]::WriteLine((@{type='ack';id=$taskCommand.id;ok=$false;message='当前音源未提供播放控制'} | ConvertTo-Json -Compress))}
            }
            $taskState=@{type='state';selected=$taskSelected;mpc=@($taskMpc);audioMode=$false;audio=@($taskAudio);liveProcessIds=@($taskLiveProcessIds);sessions=@($taskSessions | ForEach-Object {@{source=$_.SourceAppUserModelId;playing=([int]$_.GetPlaybackInfo().PlaybackStatus -eq 4)}});source='';title='暂无媒体会话';artist='请在播放器或网页中播放';playing=$false;position=0;duration=0;canToggle=$false;canNext=$false;canPrevious=$false;cover='';coverError='';error=''}
            $taskState.timelineKnown=$true
            $taskState.selectionChanged=$taskSelectionChanged
            if ($taskCurrent -and -not $taskAudioCurrent) {
                $taskProperties=Await-WinRT ($taskCurrent.TryGetMediaPropertiesAsync()) ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties])
                $taskInfo=$taskCurrent.GetPlaybackInfo()
                $taskTimeline=$taskCurrent.GetTimelineProperties()
                $taskState.source=$taskCurrent.SourceAppUserModelId
                $taskState.title=$taskProperties.Title
                $taskState.artist=$taskProperties.Artist;$taskState.album=$taskProperties.AlbumTitle
                $taskState.playing=([int]$taskInfo.PlaybackStatus -eq 4)
                $taskState.position=$taskTimeline.Position.TotalSeconds
                if ($taskState.playing) {
                    $taskElapsed=([DateTimeOffset]::Now-$taskTimeline.LastUpdatedTime).TotalSeconds
                    if ($taskElapsed -ge 0 -and $taskElapsed -lt 86400) { $taskState.position+=$taskElapsed }
                }
                $taskState.duration=$taskTimeline.EndTime.TotalSeconds
                if ($taskState.duration -gt 0) { $taskState.position=[Math]::Min($taskState.position,$taskState.duration) }
                $taskState.canToggle=($taskInfo.Controls.IsPlayPauseToggleEnabled -or $taskInfo.Controls.IsPlayEnabled -or $taskInfo.Controls.IsPauseEnabled)
                $taskState.canNext=$taskInfo.Controls.IsNextEnabled
                $taskState.canPrevious=$taskInfo.Controls.IsPreviousEnabled
                $taskKey=$taskState.source+'|'+$taskState.title+'|'+$taskState.artist
                if ($taskKey -ne $taskCoverKey -or (-not $taskCover -and [DateTime]::Now -gt $taskCoverRetry)) {
                    $taskCoverKey=$taskKey; $taskCover=''; $taskCoverError='播放器未提供系统封面'; $taskCoverRetry=[DateTime]::Now.AddSeconds(3)
                    if ($taskProperties.Thumbnail) {
                        try {
                            $taskStream=Await-WinRT ($taskProperties.Thumbnail.OpenReadAsync()) ([Windows.Storage.Streams.IRandomAccessStreamWithContentType])
                            $taskBytes=[PlayerCoverReader]::Read($taskStream)
                            $taskMime='image/jpeg'
                            if($taskBytes.Length -gt 4 -and $taskBytes[0] -eq 137 -and $taskBytes[1] -eq 80){$taskMime='image/png'}
                            $taskCover='data:'+$taskMime+';base64,'+[Convert]::ToBase64String($taskBytes)
                            $taskCoverError=''
                        } catch { $taskCover=''; $taskCoverError=$_.Exception.Message }
                    }
                }
                $taskState.cover=$taskCover; $taskState.coverError=$taskCoverError
            }
            if($taskAudioCurrent){if($taskAudioCurrent.peak -gt .002){$taskAudioHeard[$taskAudioCurrent.pid]=[DateTime]::Now};$taskAudioPlaying=$taskAudioCurrent.active -and -not $taskAudioCurrent.muted -and $taskAudioHeard.ContainsKey($taskAudioCurrent.pid) -and ([DateTime]::Now-$taskAudioHeard[$taskAudioCurrent.pid]).TotalSeconds -lt 1;$taskState.source='audio:'+$taskAudioCurrent.pid;$taskState.audioMode=$true;$taskState.title=$taskAudioCurrent.name;$taskState.artist='';$taskState.playing=$taskAudioPlaying;$taskState.confirmedPlaying=($taskAudioCurrent.active -and -not $taskAudioCurrent.muted -and $taskAudioCurrent.peak -gt .002);$taskState.canToggle=($taskAudioCurrent.name -eq 'kwmusic' -or ($taskAudioCurrent.name -eq 'cloudmusic' -and [NeteaseControl]::Supported($taskAudioCurrent.pid)));if($taskAudioCurrent.name -eq 'cloudmusic' -and $taskState.canToggle){$taskState.playing=[NeteaseControl]::Playing($taskAudioCurrent.pid)};$taskState.canNext=$taskState.canToggle;$taskState.canPrevious=$taskState.canToggle;$taskState.timelineKnown=$false}
            [Console]::WriteLine(($taskState | ConvertTo-Json -Depth 5 -Compress))
        } catch { [Console]::WriteLine((@{type='error';message=$_.Exception.Message} | ConvertTo-Json -Compress)) }
        if ($Once) { break }
        Start-Sleep -Milliseconds 150
    }
} catch { [Console]::WriteLine((@{type='error';message=$_.Exception.Message} | ConvertTo-Json -Compress)); exit 1 }
