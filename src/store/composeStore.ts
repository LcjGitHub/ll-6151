import { create } from 'zustand'
import type { FavoriteItem, WritingMode } from '../types'
import { MAX_SENTENCE_LENGTH } from '../utils/mapSentence'
import { addFavorite, loadFavorites, removeFavorite } from '../utils/localStorage'

interface ComposeState {
  sentence: string
  writingMode: WritingMode
  favorites: FavoriteItem[]
  setSentence: (text: string) => void
  setWritingMode: (mode: WritingMode) => void
  loadFavoritesFromStorage: () => void
  addFavoriteItem: (name: string) => void
  removeFavoriteItem: (id: string) => void
  restoreFavorite: (item: FavoriteItem) => void
}

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
    const { sentence, writingMode } = get()
    const item: FavoriteItem = {
      id: crypto.randomUUID(),
      name,
      sentence,
      writingMode,
      createdAt: Date.now(),
    }
    const updated = addFavorite(item)
    set({ favorites: updated })
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
