import type { SimilarityScoreConfig } from '../types'
import { lookupCharacter } from './characterLibrary'
import { getCharRadical, isLeftRadical, isTopRadical } from './radicalUtils'
import { scoreStrokeSimilarity } from './strokeUtils'

/**
 * 默认相似度评分权重配置
 *
 * 各项权重决定了不同特征在最终推荐评分中的占比：
 * - 同部首：50 分（最高权重，结构相似最重要）
 * - 左侧部首位置匹配：10 分
 * - 顶部部首位置匹配：10 分
 * - 笔画相同：30 分
 * - 笔画相差 1：20 分
 * - 笔画相差 2：12 分
 * - 笔画相差 3：6 分
 * - 字库中不存在：-50 分（惩罚项）
 * - 自身匹配：-1000 分（强惩罚，确保排除自身）
 */
export const DEFAULT_SCORE_CONFIG: SimilarityScoreConfig = {
  similarCharBaseScore: 100,
  sameRadicalScore: 50,
  leftRadicalMatchScore: 10,
  topRadicalMatchScore: 10,
  notInLibraryPenalty: 50,
  selfMatchPenalty: 1000,
  strokeDiff0Score: 30,
  strokeDiff1Score: 20,
  strokeDiff2Score: 12,
  strokeDiff3Score: 6,
  fallbackBaseScore: 5,
  fallbackSameRadicalBonus: 5,
}

/**
 * 计算两个汉字的结构相似度得分
 *
 * 综合考量部首匹配和部首位置匹配：
 * 1. 同部首匹配：+50 分
 * 2. 同为左侧部首：+10 分
 * 3. 同为顶部部首：+10 分
 *
 * @param char1 - 第一个汉字
 * @param char2 - 第二个汉字
 * @param config - 评分权重配置（可选，默认使用 DEFAULT_SCORE_CONFIG）
 * @returns 结构相似度评分
 */
export function scoreStructureSimilarity(
  char1: string,
  char2: string,
  config: Partial<SimilarityScoreConfig> = {}
): number {
  const mergedConfig = { ...DEFAULT_SCORE_CONFIG, ...config }
  let score = 0

  const radical1 = getCharRadical(char1)
  const radical2 = getCharRadical(char2)
  if (radical1 && radical2 && radical1 === radical2) {
    score += mergedConfig.sameRadicalScore
  }

  if (isLeftRadical(radical1) && isLeftRadical(radical2)) {
    score += mergedConfig.leftRadicalMatchScore
  }

  if (isTopRadical(radical1) && isTopRadical(radical2)) {
    score += mergedConfig.topRadicalMatchScore
  }

  return score
}

/**
 * 计算两个汉字的综合相似度得分
 *
 * 综合考量结构相似度、笔画相似度以及字库存在性：
 * 1. 若两字相同，返回 -1000（强惩罚，用于排除自身）
 * 2. 结构相似度得分
 * 3. 笔画相似度得分
 * 4. 若候选字不在字库中，-50 分（惩罚项）
 *
 * @param char1 - 目标汉字（缺字）
 * @param char2 - 候选汉字
 * @param config - 评分权重配置（可选，默认使用 DEFAULT_SCORE_CONFIG）
 * @returns 综合相似度评分，分数越高越适合作为替代字
 */
export function scoreSimilarity(
  char1: string,
  char2: string,
  config: Partial<SimilarityScoreConfig> = {}
): number {
  const mergedConfig = { ...DEFAULT_SCORE_CONFIG, ...config }
  let score = 0

  if (char1 === char2) {
    return -mergedConfig.selfMatchPenalty
  }

  score += scoreStructureSimilarity(char1, char2, config)
  score += scoreStrokeSimilarity(char1, char2)

  if (!lookupCharacter(char2)) {
    score -= mergedConfig.notInLibraryPenalty
  }

  return score
}
