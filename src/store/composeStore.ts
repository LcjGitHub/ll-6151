import { create } from 'zustand'
import type { FavoriteItem, HistoryItem, WritingMode, SpacingMode, FontSizeMode } from '../types'
import { MAX_SENTENCE_LENGTH } from '../utils/mapSentence'
import {
  addFavorite,
  hasFavoriteName,
  loadFavorites,
  removeFavorite,
  loadComposeState,
  saveComposeSentence,
  saveComposeWritingMode,
} from '../utils/localStorage'
import {
  addHistoryRecord,
  clearHistory as clearHistoryStorage,
  loadHistory,
  removeHistoryRecord,
} from '../utils/historyRecord'

/**
 * 排版台全局状态：短句、排版方向、收藏列表及其增删操作
 */
interface ComposeState {
  /** 用户输入短句 */
  sentence: string
  /** 排版方向 */
  writingMode: WritingMode
  /** 字块间距档位（仅存于页面会话内存，不写入浏览器本地存储） */
  spacing: SpacingMode
  /** 字块字号档位（仅存于页面会话内存，不写入浏览器本地存储） */
  fontSize: FontSizeMode
  /** 已收藏的短句列表 */
  favorites: FavoriteItem[]
  /** 排版历史记录列表 */
  history: HistoryItem[]
  /** 字块入场动画序号（每次选择/更新短句时递增，用于强制重播动画） */
  animationKey: number
  /** 更新短句（自动截断至最大长度），并递增动画序号触发入场动画重播 */
  setSentence: (text: string) => void
  /** 切换横排 / 竖排 */
  setWritingMode: (mode: WritingMode) => void
  /** 设置字块间距 */
  setSpacing: (spacing: SpacingMode) => void
  /** 设置字块字号档位 */
  setFontSize: (fontSize: FontSizeMode) => void
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
  /** 从 localStorage 加载历史记录 */
  loadHistoryFromStorage: () => void
  /** 将某条历史记录恢复为当前短句与排版方向，并刷新字块预览 */
  restoreHistoryItem: (item: HistoryItem) => void
  /** 按 id 删除一条历史记录 */
  removeHistoryItem: (id: string) => void
  /** 一键清空全部历史记录 */
  clearAllHistory: () => void
  /** 从分享参数恢复短句与排版方向，并触发入场动画重播 */
  restoreFromShareParams: (sentence: string, writingMode: WritingMode) => void
}

/**
 * 排版台全局状态
 */
export const useComposeStore = create<ComposeState>((set, get) => {
  const cached = loadComposeState()
  const hasCache = cached !== null

  return {
    sentence: cached?.sentence ?? '活字印刷排版预览',
    writingMode: cached?.writingMode ?? 'horizontal',
    spacing: 'default',
    fontSize: 'medium',
    favorites: [],
    history: [],
    animationKey: hasCache ? 1 : 0,

    setSentence: (text) => {
      const truncated = Array.from(text).slice(0, MAX_SENTENCE_LENGTH).join('')
      saveComposeSentence(truncated)
      const updated = addHistoryRecord(truncated, get().writingMode)
      set({
        sentence: truncated,
        history: updated,
        animationKey: get().animationKey + 1,
      })
    },

    setWritingMode: (mode) => {
      saveComposeWritingMode(mode)
      const updated = addHistoryRecord(get().sentence, mode)
      set({ writingMode: mode, history: updated })
    },

    setSpacing: (spacing) => set({ spacing }),

    setFontSize: (fontSize) => set({ fontSize }),

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
      saveComposeSentence(item.sentence)
      saveComposeWritingMode(item.writingMode)
      set({
        sentence: item.sentence,
        writingMode: item.writingMode,
        animationKey: get().animationKey + 1,
      })
    },

    replayAnimation: () => {
      set({ animationKey: get().animationKey + 1 })
    },

    loadHistoryFromStorage: () => {
      set({ history: loadHistory() })
    },

    restoreHistoryItem: (item) => {
      saveComposeSentence(item.sentence)
      saveComposeWritingMode(item.writingMode)
      set({
        sentence: item.sentence,
        writingMode: item.writingMode,
        animationKey: get().animationKey + 1,
      })
    },

    removeHistoryItem: (id) => {
      const updated = removeHistoryRecord(id)
      set({ history: updated })
    },

    clearAllHistory: () => {
      const updated = clearHistoryStorage()
      set({ history: updated })
    },

    restoreFromShareParams: (sentence, writingMode) => {
      saveComposeSentence(sentence)
      saveComposeWritingMode(writingMode)
      const updated = addHistoryRecord(sentence, writingMode)
      set({
        sentence,
        writingMode,
        history: updated,
        animationKey: get().animationKey + 1,
      })
    },
  }
})
