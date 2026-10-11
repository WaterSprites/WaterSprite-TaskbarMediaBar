export function chunkingText(text: string): string[] {

  // 使用正则表达式匹配 CJK 字符和空白字符

  const cjkRegex = /[\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]|\s+/g

  const chunks: string[] = []

  let lastIndex = 0

  let match



  while ((match = cjkRegex.exec(text)) !== null) {

    // 添加匹配位置之前的非 CJK 文本

    if (match.index > lastIndex) {

      chunks.push(text.slice(lastIndex, match.index))

    }



    // 如果匹配到的是空白字符，直接添加

    if (match[0].trim() === '') {

      chunks.push(match[0])

    } else {

      // 对于 CJK 字符，按字符拆分

      for (const char of match[0]) {

        chunks.push(char)

      }

    }

    lastIndex = match.index + match[0].length

  }



  // 添加剩余的文本

  if (lastIndex < text.length) {

    chunks.push(text.slice(lastIndex))

  }



  return chunks.filter(Boolean)

}



const textWidthCache: Map<string, Map<string, number>> = new Map()

const canvas = document.createElement('canvas')



export function getCharWidth(char: string, font: string): number {

  const matchedCache = textWidthCache.get(font)?.get(char)

  if (matchedCache) {

    return matchedCache

  }



  const context = canvas.getContext('2d')!

  context.font = font

  const metrics = context.measureText(char)

  const width = metrics.width

  if (!textWidthCache.has(font)) {

    textWidthCache.set(font, new Map())

  }

  textWidthCache.get(font)!.set(char, width)

  return width

}



export function getTextWidth(text: string, font: string) {

  let width = 0

  const subWidths: number[] = []

  for (const char of Array.from(text)) {

    const charWidth = getCharWidth(char, font)

    width += charWidth

    subWidths.push(charWidth)

  }

  return { width, subWidths }

}



export function clampLine(text: string, width = 0, font?: string) {

  if (width <= 0 || !font) {

    return []

  }



  const words = chunkingText(text)

  const lines: { text: string, charWidths: number[] }[] = []



  // 预先计算所有单词的宽度

  const wordWidths = words.map(word => getTextWidth(word, font))

  let currentIndex = 0



  while (currentIndex < words.length) {

    let usedWidth = 0

    const currentLineWords: string[] = []

    const charWidths: number[] = []

    let wordIndex = currentIndex



    while (wordIndex < words.length) {

      const { width: wordWidth, subWidths } = wordWidths[wordIndex]



      if (usedWidth + wordWidth > width && wordWidth <= width) {

        break

      }



      usedWidth += wordWidth

      currentLineWords.push(words[wordIndex])

      charWidths.push(...subWidths)

      wordIndex++

    }



    lines.push({

      text: currentLineWords.join(''),

      charWidths,

    })



    currentIndex = wordIndex

  }



  return lines

}



export function filterWhitespace(text: string) {

  return text.trim().replace(/\n+/g, '\n')

}

