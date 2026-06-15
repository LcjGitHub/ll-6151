import { create } from 'zustand'
import type { FavoriteItem, WritingMode } from '../types'
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
  /** 已收藏的短句列表 */
  favorites: FavoriteItem[]
  /** 更新短句（自动截断至最大长度） */
  setSentence: (text: string) => void
  /** 切换横排 / 竖排 */
  setWritingMode: (mode: WritingMode) => void
  /** 从 localStorage 加载收藏列表 */
  loadFavoritesFromStorage: () => void
  /**
   * 新增一条收藏（含当前短句与排版方向）
   * @returns 是否保存成功（同名时返回 false）
   */
  addFavoriteItem: (name: string) => boolean
  /** 按 id 删除一条收藏 */
  removeFavoriteItem: (id: string) => void
  /** 将某条收藏恢复为当前短句和排版方向 */
  restoreFavorite: (item: FavoriteItem) => void
}

/**
 * 排版台全局状态
 */
export const useComposeStore = create<ComposeState>((set, get) => ({
  sentence: '活字印刷排版预览',
  writingMode: 'horizontal',
  favorites: [],

  setSentence: (text) =>
    set({
      sentence: Array.from(text).slice(0, MAX_SENTENCE_LENGTH).join(''),
    }),

  setWritingMode: (mode) => set({ writingMode: mode }),

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
    })
  },
}))
