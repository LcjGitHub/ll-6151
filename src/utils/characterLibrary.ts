import type { TypeCharacter } from '../types'
import typeCharactersData from '../mock/type-characters.json'

/**
 * 构建字库查找表（char → TypeCharacter）
 */
function buildCharacterMap(): Map<string, TypeCharacter> {
  const map = new Map<string, TypeCharacter>()
  for (const entry of typeCharactersData.characters) {
    if (!map.has(entry.char)) {
      map.set(entry.char, entry)
    }
  }
  return map
}

const characterMap = buildCharacterMap()

/**
 * 查询单字是否在 Mock 字库中
 * @param char - 待查汉字
 */
export function lookupCharacter(char: string): TypeCharacter | null {
  return characterMap.get(char) ?? null
}

/**
 * 获取字库总字数
 */
export function getLibrarySize(): number {
  return characterMap.size
}

/**
 * 获取字库全部字符列表
 */
export function getAllCharacters(): string[] {
  return Array.from(characterMap.keys())
}
