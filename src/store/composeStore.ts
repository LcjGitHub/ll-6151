import { create } from 'zustand'
import type { FavoriteItem, WritingMode, SpacingMode } from '../types'
import { MAX_SENTENCE_LENGTH } from '../utils/mapSentence'
import { addFavorite, hasFavoriteName, loadFavorites, removeFavorite } from '../utils/localStorage'

/**
 * 排版台全局状态：短句、排版方向、收藏列表及其增删操作
 */
interface ComposeState {
  /** 用户输入短句 */
  sentence: string
  /** 排版方向 */
  writingMode: WritingMode
  /** 字块间距档位 */
  spacing: SpacingMode
  /** 已收藏的短句列表 */
  favorites: FavoriteItem[]
  /** 字块入场动画序号（每次选择/更新短句时递增，用于强制重播动画） */
  animationKey: number
  /** 更新短句（自动截断至最大长度），并递增动画序号触发入场动画重播 */
  setSentence: (text: string) => void
  /** 切换横排 / 竖排 */
  setWritingMode: (mode: WritingMode) => void
  /** 设置字块间距 */
  setSpacing: (spacing: SpacingMode) => void
  /** 从 localStorage 加载收藏列表 */
  loadFavoritesFromStorage: () => void
  /**
   * 新增一条收藏（含当前短句与排版方向）
   * @returns 是否保存成功（同名时返回 false）
   */
  addFavoriteItem: (name: string) => boolean
  /** 按 id 删除一条收藏 */
  removeFavoriteItem: (id: string) => void
  /** 将某条收藏恢复为当前短句和排版方向，并触发入场动画重播 */
  restoreFavorite: (item: FavoriteItem) => void
  /** 仅递增动画序号，触发所有字块重新播放入场动画，不改变输入内容 */
  replayAnimation: () => void
}

/**
 * 排版台全局状态
 */
export const useComposeStore = create<ComposeState>((set, get) => ({
  sentence: '活字印刷排版预览',
  writingMode: 'horizontal',
  spacing: 'default',
  favorites: [],
  animationKey: 0,

  setSentence: (text) =>
    set({
      sentence: Array.from(text).slice(0, MAX_SENTENCE_LENGTH).join(''),
      animationKey: get().animationKey + 1,
    }),

  setWritingMode: (mode) => set({ writingMode: mode }),

  setSpacing: (spacing) => set({ spacing }),

  loadFavoritesFromStorage: () => {
    set({ favorites: loadFavorites() })
  },

  addFavoriteItem: (name) => {
    const trimmed = name.trim()
    if (!trimmed) return false
    if (hasFavoriteName(trimmed)) return false
    const { sentence, writingMode } = get()
    const item: FavoriteItem = {
      id: crypto.randomUUID(),
      name: trimmed,
      sentence,
      writingMode,
      createdAt: Date.now(),
    }
    const updated = addFavorite(item)
    set({ favorites: updated })
    return true
  },

  removeFavoriteItem: (id) => {
    const updated = removeFavorite(id)
    set({ favorites: updated })
  },

  restoreFavorite: (item) => {
    set({
      sentence: item.sentence,
      writingMode: item.writingMode,
      animationKey: get().animationKey + 1,
    })
  },

  replayAnimation: () => {
    set({ animationKey: get().animationKey + 1 })
  },
}))
