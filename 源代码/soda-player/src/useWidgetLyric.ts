import { computed, type Ref } from 'vue'
interface TrackLyrics { content?: string }
import { useInterpolatedProgressSeconds, useLyricTimelineKnown } from './progress'
import { getTextWidth } from './text'
interface WidgetLyricChar {
  startTime: number
  duration: number
  char: string
}
interface WidgetLyricLine {
  startTime: number
  duration: number
  isLRC?: boolean
  isKRC?: boolean
  chars: WidgetLyricChar[]
}
const lyricLinesCache = new Map<string, WidgetLyricLine[]>()
function parseLrcTime(timeText: string): number | null {
  const [minute, second, millisecond] = timeText.split(/[:.]/)
  const minuteNumber = Number.parseInt(minute, 10)
  const secondNumber = Number.parseInt(second, 10)
  const millisecondNumber = Number.parseInt((millisecond ?? '0').padEnd(3, '0').slice(0, 3), 10)
  if ([minuteNumber, secondNumber, millisecondNumber].some(Number.isNaN)) {
    return null
  }
  return minuteNumber * 60 * 1000 + secondNumber * 1000 + millisecondNumber
}
function parseWidgetLyricLines(lyrics?: TrackLyrics): WidgetLyricLine[] {
  if (!lyrics?.content) {
    return []
  }
  const cacheKey = lyrics.content
  const cached = lyricLinesCache.get(cacheKey)
  if (cached) {
    return cached
  }
  const rawLines = lyrics.content.split('\n')
  const result = rawLines
    .map(line => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      if (/^\[\d+,/.test(line)) {
        const [header = '', content = ''] = line.split(']')
        const [startText = '0', durationText = '0'] = header.slice(1).split(',')
        const startTime = Number.parseInt(startText, 10)
        const duration = Number.parseInt(durationText, 10)
        const chars = content
          .split('<')
          .filter(Boolean)
          .flatMap((word) => {
            const [wordHeader = '', text = ''] = word.split('>')
            const [wordStartText = '0', wordDurationText = '0'] = wordHeader.split(',')
            const wordChars = [...text]
            if (!wordChars.length) {
              return []
            }
            const charDuration = Number.parseInt(wordDurationText, 10) / wordChars.length
            let charStartTime = Number.parseInt(wordStartText, 10)
            return wordChars.map((char) => {
              const lyricChar = {
                startTime: charStartTime,
                duration: charDuration,
                char,
              }
              charStartTime += charDuration
              return lyricChar
            })
          })
          .filter(char => char.char.length > 0)
        if (Number.isNaN(startTime) || Number.isNaN(duration) || !chars.length) {
          return null
        }
        return {
          startTime,
          duration,
          isKRC: true,
          chars,
        } as WidgetLyricLine
      }
      const [header = '', content = ''] = line.split(']')
      const startTime = parseLrcTime(header.slice(1))
      if (startTime === null) {
        return null
      }
      let endTime = startTime + 10000
      const nextLine = rawLines[index + 1]?.trim()
      if (nextLine) {
        const nextStartTime = parseLrcTime(nextLine.split(']')[0]?.slice(1) ?? '')
        if (nextStartTime !== null) {
          endTime = nextStartTime
        }
      }
      return {
        startTime,
        duration: endTime - startTime,
        isLRC: true,
        chars: [...content].map(char => ({
          startTime: -1,
          duration: -1,
          char,
        })),
      } as WidgetLyricLine
    })
    .filter((line): line is WidgetLyricLine => Boolean(line?.chars.length))
  lyricLinesCache.set(cacheKey, result)
  return result
}
function stringifyLyricLine(line?: WidgetLyricLine) {
  return line?.chars.map(char => char.char).join('') ?? ''
}
function findDisplayLine(lines: WidgetLyricLine[], progressMs: number) {
  if (!lines.length) {
    return undefined
  }
  if (progressMs <= lines[0].startTime) {
    return lines[0]
  }
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    const nextLine = lines[index + 1]
    const lineEnd = nextLine?.startTime ?? (line.startTime + line.duration)
    if (progressMs >= line.startTime && progressMs < lineEnd) {
      return line
    }
  }
  return lines[lines.length - 1]
}
export function useWidgetLyric(
  lyrics: Ref<TrackLyrics | undefined>,
  fallbackText: Ref<string>,
  font: Ref<string | undefined>,
  progressOffsetMs: Ref<number>,
) {
  const progressSeconds = useInterpolatedProgressSeconds()
  const timelineKnown = useLyricTimelineKnown()
  const progressMs = computed(() => progressSeconds.value * 1000 + progressOffsetMs.value)
  const lyricLines = computed(() => parseWidgetLyricLines(lyrics.value))
  const currentLine = computed(() => findDisplayLine(lyricLines.value, progressMs.value))
  const currentLineText = computed(() => stringifyLyricLine(currentLine.value) || fallbackText.value)
  const currentLineKey = computed(() => {
    if (!currentLine.value) {
      return fallbackText.value
    }
    return `${currentLine.value.startTime}-${currentLineText.value}`
  })
  const textMetrics = computed(() => {
    if (!font.value || !currentLineText.value) {
      return {
        width: 0,
        subWidths: [] as number[],
      }
    }
    return getTextWidth(currentLineText.value, font.value)
  })
  const playedWidth = computed(() => {
    const line = currentLine.value
    if (!timelineKnown.value || !line || !font.value || progressMs.value <= line.startTime) {
      return 0
    }
    if (line.isLRC) {
      return textMetrics.value.width
    }
    let result = 0
    for (const [index, char] of line.chars.entries()) {
      const charWidth = textMetrics.value.subWidths[index] ?? 0
      const charStartTime = line.startTime + char.startTime
      const charEndTime = charStartTime + char.duration
      if (progressMs.value <= charStartTime) {
        break
      }
      if (progressMs.value >= charEndTime) {
        result += charWidth
        continue
      }
      const inCharProgress = (progressMs.value - charStartTime) / char.duration
      result += charWidth * inCharProgress
      break
    }
    return Math.max(0, Math.min(result, textMetrics.value.width))
  })
  const scrollAnchorX = computed(() => {
    const line = currentLine.value
    if (!timelineKnown.value || !line || !font.value || progressMs.value <= line.startTime) {
      return 0
    }
    if (line.isLRC) {
      return 0
    }
    return playedWidth.value
  })
  return {
    timelineKnown,
    progressSeconds,
    currentLine,
    currentLineKey,
    currentLineText,
    playedWidth,
    scrollAnchorX,
    totalWidth: computed(() => textMetrics.value.width),
  }
}
