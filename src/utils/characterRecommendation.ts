import type { ScoredCandidate } from '../types'
import { getAllCharacters, lookupCharacter } from './characterLibrary'
import { SIMILAR_CHARS_LOOKUP, SIMILAR_CHAR_BASE_SCORE } from '../data/similarCharsLookup'
import { hasSameRadical } from './radicalUtils'
import { scoreSimilarity, DEFAULT_SCORE_CONFIG } from './similarityScoring'

/**
 * 缺字候选替字推荐工具
 *
 * 为字库中不存在的汉字推荐合适的替代字，推荐优先级：
 * 1. 形近字表中预定义的形近字（100 分）
 * 2. 综合相似度评分（结构 + 笔画 + 字库存在性）
 * 3. 兜底推荐（同部首优先）
 *
 * 推荐结果按分数从高到低排序，返回指定数量的候选字。
 */

/**
 * 从形近字表中收集候选字
 *
 * 若缺字在形近字表中存在对应条目，将这些候选字加入推荐列表，
 * 每个候选字获得 100 分的基础分。仅收录字库中存在的字。
 *
 * @param missingChar - 缺字
 * @param existingCandidates - 已有的候选字列表（用于去重）
 * @returns 新增的候选字列表
 */
function collectSimilarFromLookup(
  missingChar: string,
  existingCandidates: ScoredCandidate[]
): ScoredCandidate[] {
  const newCandidates: ScoredCandidate[] = []
  const similarFromMap = SIMILAR_CHARS_LOOKUP[missingChar] || []

  for (const char of similarFromMap) {
    if (lookupCharacter(char) && char !== missingChar) {
      const existing = existingCandidates.find((s) => s.char === char)
      const alreadyInNew = newCandidates.find((s) => s.char === char)
      if (!existing && !alreadyInNew) {
        newCandidates.push({ char, score: SIMILAR_CHAR_BASE_SCORE })
      }
    }
  }

  return newCandidates
}

/**
 * 从字库全量字符中按相似度评分收集候选字
 *
 * 遍历字库所有字符，计算每个字符与缺字的综合相似度评分，
 * 将评分大于 0 的字符加入推荐列表。
 *
 * @param missingChar - 缺字
 * @param existingCandidates - 已有的候选字列表（用于去重）
 * @returns 新增的候选字列表
 */
function collectSimilarByScoring(
  missingChar: string,
  existingCandidates: ScoredCandidate[]
): ScoredCandidate[] {
  const newCandidates: ScoredCandidate[] = []
  const allLibraryChars = getAllCharacters()

  for (const char of allLibraryChars) {
    if (char === missingChar) continue
    const score = scoreSimilarity(missingChar, char)
    if (score > 0) {
      const existing = existingCandidates.find((s) => s.char === char)
      const alreadyInNew = newCandidates.find((s) => s.char === char)
      if (!existing && !alreadyInNew) {
        newCandidates.push({ char, score })
      }
    }
  }

  return newCandidates
}

/**
 * 收集兜底候选字
 *
 * 当已有候选字数量不足时，从字库全量字符中补充候选字，
 * 同部首的字获得额外加分。
 *
 * @param missingChar - 缺字
 * @param existingCandidates - 已有的候选字列表（用于去重）
 * @returns 新增的候选字列表
 */
function collectFallbackCandidates(
  missingChar: string,
  existingCandidates: ScoredCandidate[]
): ScoredCandidate[] {
  const newCandidates: ScoredCandidate[] = []
  const allLibraryChars = getAllCharacters()

  for (const char of allLibraryChars) {
    if (char === missingChar) continue
    const alreadyExists = existingCandidates.find((s) => s.char === char)
    const alreadyInNew = newCandidates.find((s) => s.char === char)
    if (!alreadyExists && !alreadyInNew) {
      const bonus = hasSameRadical(missingChar, char)
        ? DEFAULT_SCORE_CONFIG.fallbackSameRadicalBonus
        : 0
      newCandidates.push({
        char,
        score: DEFAULT_SCORE_CONFIG.fallbackBaseScore + bonus,
      })
    }
  }

  return newCandidates
}

/**
 * 推荐缺字的候选替代字
 *
 * 为字库中不存在的汉字推荐合适的替代字，按推荐优先级排序。
 * 推荐逻辑分为三个阶段：
 * 1. 优先从形近字表中获取预定义的形近字
 * 2. 其次通过综合相似度评分（结构 + 笔画）从字库中筛选
 * 3. 若候选数量不足，补充兜底推荐（同部首优先）
 *
 * 保持对外接口签名与原实现完全一致：
 * - 入参：缺字字符（string）、推荐数量（number，默认 3）
 * - 返回：推荐汉字数组（string[]），按优先级从高到低排序
 *
 * @param missingChar - 字库中不存在的缺字
 * @param count - 需要返回的候选字数量，默认为 3
 * @returns 推荐的候选替代字数组，按相似度从高到低排序
 *
 * @example
 * ```typescript
 * // 推荐 3 个 "的" 的替代字
 * const candidates = recommendSimilarCharacters('的')
 * // 可能返回：['地', '得', '之']
 *
 * // 推荐 5 个 "美" 的替代字
 * const candidates = recommendSimilarCharacters('美', 5)
 * // 可能返回：['丽', '佳', '艳', '好', '爱']
 * ```
 */
export function recommendSimilarCharacters(missingChar: string, count: number = 3): string[] {
  const candidates: ScoredCandidate[] = []

  const similarFromLookup = collectSimilarFromLookup(missingChar, candidates)
  candidates.push(...similarFromLookup)

  if (candidates.length < count) {
    const similarByScoring = collectSimilarByScoring(missingChar, candidates)
    candidates.push(...similarByScoring)
  }

  if (candidates.length < count) {
    const fallbackCandidates = collectFallbackCandidates(missingChar, candidates)
    candidates.push(...fallbackCandidates)
  }

  candidates.sort((a, b) => b.score - a.score)

  return candidates.slice(0, count).map((s) => s.char)
}
