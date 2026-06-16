/**
 * 活字印刷 Mock 字库类型定义
 */

/** 单个字模条目 */
export interface TypeCharacter {
  char: string
  woodTone: string
  inkShade: string
  sequence: number
}

/** 浮层提示显示内容 */
export interface TooltipContent {
  found: boolean
  char: string
  glyph?: TypeCharacter | null
  onReplace?: (missingChar: string, replacement: string) => void
}

/** Mock 字库 JSON 结构 */
export interface TypeCharacterLibrary {
  version: string
  description: string
  characters: TypeCharacter[]
}

/** 排版方向 */
export type WritingMode = 'horizontal' | 'vertical'

/** 字块间距档位 */
export type SpacingMode = 'compact' | 'default' | 'loose'

/** 短句收藏条目 */
export interface FavoriteItem {
  id: string
  name: string
  sentence: string
  writingMode: WritingMode
  createdAt: number
}

/** 排版历史记录条目 */
export interface HistoryItem {
  id: string
  sentence: string
  writingMode: WritingMode
  timestamp: number
}

/** 逐字映射结果 */
export interface MappedCharacter {
  char: string
  index: number
  /** 字库中是否存在 */
  found: boolean
  /** 字模数据，缺字时为 null */
  glyph: TypeCharacter | null
}

/** 候选字及其评分结果 */
export interface ScoredCandidate {
  /** 候选汉字 */
  char: string
  /** 相似度评分，分数越高越推荐 */
  score: number
}

/** 相似度评分权重配置 */
export interface SimilarityScoreConfig {
  /** 形近字表匹配的基础分数 */
  similarCharBaseScore: number
  /** 同部首匹配的分数 */
  sameRadicalScore: number
  /** 左侧部首位置匹配的分数 */
  leftRadicalMatchScore: number
  /** 顶部部首位置匹配的分数 */
  topRadicalMatchScore: number
  /** 字库中不存在的惩罚分数 */
  notInLibraryPenalty: number
  /** 自身匹配的惩罚分数（用于排除自身） */
  selfMatchPenalty: number
  /** 笔画数相差 0 时的分数 */
  strokeDiff0Score: number
  /** 笔画数相差 1 时的分数 */
  strokeDiff1Score: number
  /** 笔画数相差 2 时的分数 */
  strokeDiff2Score: number
  /** 笔画数相差 3 时的分数 */
  strokeDiff3Score: number
  /** 兜底推荐的基础分数 */
  fallbackBaseScore: number
  /** 兜底推荐时同部首的额外分数 */
  fallbackSameRadicalBonus: number
}
