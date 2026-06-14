import type { MappedCharacter } from '../types'
import { lookupCharacter } from './characterLibrary'

/** 短句最大字数 */
export const MAX_SENTENCE_LENGTH = 20

/**
 * 将短句逐字映射到 Mock 字库
 * @param text - 用户输入短句
 */
export function mapSentenceToGlyphs(text: string): MappedCharacter[] {
  const chars = Array.from(text)
  return chars.map((char, index) => {
    const glyph = lookupCharacter(char)
    return {
      char,
      index,
      found: glyph !== null,
      glyph,
    }
  })
}

/**
 * 提取缺字列表（去重保序）
 * @param mapped - 映射结果
 */
export function getMissingCharacters(mapped: MappedCharacter[]): string[] {
  const seen = new Set<string>()
  const missing: string[] = []
  for (const item of mapped) {
    if (!item.found && !seen.has(item.char)) {
      seen.add(item.char)
      missing.push(item.char)
    }
  }
  return missing
}
