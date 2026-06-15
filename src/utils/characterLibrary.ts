import type { TypeCharacter } from '../types'
import typeCharactersData from '../mock/type-characters.json'

/**
 * 构建字库查找表（char → TypeCharacter）
 * 为每个字模条目添加在字库中的序号（从 1 开始）
 */
function buildCharacterMap(): Map<string, TypeCharacter> {
  const map = new Map<string, TypeCharacter>()
  for (let i = 0; i < typeCharactersData.characters.length; i++) {
    const entry = typeCharactersData.characters[i]
    if (!map.has(entry.char)) {
      map.set(entry.char, {
        ...entry,
        sequence: i + 1,
      })
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

/**
 * 获取字库全部字模条目列表（含完整木纹/墨色信息）
 */
export function getAllCharacterEntries(): TypeCharacter[] {
  return Array.from(characterMap.values())
}
