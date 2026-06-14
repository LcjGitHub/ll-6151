import { create } from 'zustand'
import type { WritingMode } from '../types'
import { MAX_SENTENCE_LENGTH } from '../utils/mapSentence'

interface ComposeState {
  /** 用户输入短句 */
  sentence: string
  /** 排版方向 */
  writingMode: WritingMode
  /** 更新短句（自动截断至最大长度） */
  setSentence: (text: string) => void
  /** 切换横排 / 竖排 */
  setWritingMode: (mode: WritingMode) => void
}

/**
 * 排版台全局状态
 */
export const useComposeStore = create<ComposeState>((set) => ({
  sentence: '活字印刷排版预览',
  writingMode: 'horizontal',
  setSentence: (text) =>
    set({
      sentence: Array.from(text).slice(0, MAX_SENTENCE_LENGTH).join(''),
    }),
  setWritingMode: (mode) => set({ writingMode: mode }),
}))
