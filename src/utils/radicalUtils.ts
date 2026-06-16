import { RADICAL_MAP, LEFT_RADICALS, TOP_RADICALS } from '../data/radicalMap'

/**
 * 查询汉字所属的部首
 *
 * 遍历部首映射表，查找包含目标汉字的部首。
 * 若汉字在多个部首组中出现，返回第一个匹配的部首。
 *
 * @param char - 待查询的单个汉字
 * @returns 匹配的部首字符；若未找到则返回 null
 */
export function getCharRadical(char: string): string | null {
  for (const [radical, chars] of Object.entries(RADICAL_MAP)) {
    if (chars.includes(char)) {
      return radical
    }
  }
  return null
}

/**
 * 判断部首是否通常出现在汉字左侧
 *
 * 左侧部首列表包含：氵、火、木、土、金、人、口、心、手、足、目、言、女、子、日、月。
 * 用于判断两个汉字是否具有相似的左右结构特征。
 *
 * @param radical - 待判断的部首字符
 * @returns 该部首是否通常出现在左侧
 */
export function isLeftRadical(radical: string | null): boolean {
  return radical !== null && LEFT_RADICALS.includes(radical)
}

/**
 * 判断部首是否通常出现在汉字顶部
 *
 * 顶部部首列表包含：艹、宀、雨、日、竹。
 * 用于判断两个汉字是否具有相似的上下结构特征。
 *
 * @param radical - 待判断的部首字符
 * @returns 该部首是否通常出现在顶部
 */
export function isTopRadical(radical: string | null): boolean {
  return radical !== null && TOP_RADICALS.includes(radical)
}

/**
 * 判断两个汉字是否具有相同的部首
 *
 * @param char1 - 第一个汉字
 * @param char2 - 第二个汉字
 * @returns 两个汉字是否同部首；任一字无部首时返回 false
 */
export function hasSameRadical(char1: string, char2: string): boolean {
  const radical1 = getCharRadical(char1)
  const radical2 = getCharRadical(char2)
  return radical1 !== null && radical2 !== null && radical1 === radical2
}
