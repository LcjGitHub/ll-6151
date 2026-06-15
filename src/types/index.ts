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
  onReplace?: (char: string) => void
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

/** 逐字映射结果 */
export interface MappedCharacter {
  char: string
  index: number
  /** 字库中是否存在 */
  found: boolean
  /** 字模数据，缺字时为 null */
  glyph: TypeCharacter | null
}
