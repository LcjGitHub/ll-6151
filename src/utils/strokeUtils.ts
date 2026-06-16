import {
  STROKE_CATEGORY,
  CJK_UNIFIED_START,
  CJK_UNIFIED_END,
  MIN_STROKE_ESTIMATE,
  MAX_STROKE_ESTIMATE,
  STROKE_ESTIMATE_DIVISOR,
  DEFAULT_STROKE_COUNT,
} from '../data/strokeCategory'

/**
 * 获取汉字的笔画数
 *
 * 优先从笔画分类表中查询精确值；若未收录，
 * 则根据 Unicode 编码区间估算 CJK 统一汉字的笔画数，
 * 结果限制在 3-12 画之间；非汉字字符返回默认值 5。
 *
 * @param char - 待查询的单个汉字
 * @returns 汉字的笔画数
 */
export function getStrokeCount(char: string): number {
  if (STROKE_CATEGORY[char]) {
    return STROKE_CATEGORY[char]
  }
  const len = char.length
  if (len === 1) {
    const code = char.charCodeAt(0)
    if (code >= CJK_UNIFIED_START && code <= CJK_UNIFIED_END) {
      return Math.min(
        MAX_STROKE_ESTIMATE,
        Math.max(MIN_STROKE_ESTIMATE, Math.floor((code - CJK_UNIFIED_START) / STROKE_ESTIMATE_DIVISOR) + MIN_STROKE_ESTIMATE)
      )
    }
  }
  return DEFAULT_STROKE_COUNT
}

/**
 * 计算两个汉字的笔画相近度得分
 *
 * 根据笔画数的差值计算相似度分数：
 * - 笔画数相同：30 分
 * - 相差 1 画：20 分
 * - 相差 2 画：12 分
 * - 相差 3 画：6 分
 * - 相差 4 画及以上：0 分
 *
 * @param char1 - 第一个汉字
 * @param char2 - 第二个汉字
 * @returns 笔画相近度评分
 */
export function scoreStrokeSimilarity(char1: string, char2: string): number {
  const s1 = getStrokeCount(char1)
  const s2 = getStrokeCount(char2)
  const diff = Math.abs(s1 - s2)
  if (diff === 0) return 30
  if (diff === 1) return 20
  if (diff === 2) return 12
  if (diff === 3) return 6
  return 0
}
