import { describe, it, expect } from 'vitest'
import { mapSentenceToGlyphs, getMissingCharacters, MAX_SENTENCE_LENGTH } from '../mapSentence'

describe('mapSentence - 短句逐字映射工具', () => {
  describe('MAX_SENTENCE_LENGTH 常量', () => {
    it('应定义为 20', () => {
      expect(MAX_SENTENCE_LENGTH).toBe(20)
    })
  })

  describe('mapSentenceToGlyphs - 正常短句映射', () => {
    it('空字符串应返回空数组', () => {
      const result = mapSentenceToGlyphs('')
      expect(result).toEqual([])
    })

    it('所有字都在字库中时，每个字的 found 应为 true 且 glyph 不为空', () => {
      const result = mapSentenceToGlyphs('活字印刷')
      expect(result.length).toBe(4)
      expect(result[0]).toMatchObject({ char: '活', index: 0, found: true })
      expect(result[0].glyph).not.toBeNull()
      expect(result[1]).toMatchObject({ char: '字', index: 1, found: true })
      expect(result[1].glyph).not.toBeNull()
      expect(result[2]).toMatchObject({ char: '印', index: 2, found: true })
      expect(result[2].glyph).not.toBeNull()
      expect(result[3]).toMatchObject({ char: '刷', index: 3, found: true })
      expect(result[3].glyph).not.toBeNull()
    })

    it('部分字不在字库中时，缺字的 found 应为 false 且 glyph 为 null', () => {
      const result = mapSentenceToGlyphs('活龍印刷')
      expect(result.length).toBe(4)
      expect(result[0].found).toBe(true)
      expect(result[0].glyph).not.toBeNull()
      expect(result[1]).toMatchObject({ char: '龍', index: 1, found: false, glyph: null })
      expect(result[2].found).toBe(true)
      expect(result[3].found).toBe(true)
    })

    it('所有字都不在字库中时，所有 found 为 false 且 glyph 为 null', () => {
      const result = mapSentenceToGlyphs('龍鳳龜麟')
      expect(result.length).toBe(4)
      result.forEach((item) => {
        expect(item.found).toBe(false)
        expect(item.glyph).toBeNull()
      })
    })

    it('index 字段应为从 0 开始的连续序号', () => {
      const result = mapSentenceToGlyphs('一二三四五')
      result.forEach((item, idx) => {
        expect(item.index).toBe(idx)
      })
    })

    it('字模条目应包含 sequence 序号信息', () => {
      const result = mapSentenceToGlyphs('一')
      expect(result[0].glyph).toHaveProperty('sequence')
      expect(typeof result[0].glyph?.sequence).toBe('number')
      expect(result[0].glyph?.sequence).toBeGreaterThan(0)
    })
  })

  describe('mapSentenceToGlyphs - 超出最大字数截断', () => {
    it('短句长度等于 MAX_SENTENCE_LENGTH 时完整保留', () => {
      const text = '一二三四五六七八九十'.repeat(2)
      expect(text.length).toBe(MAX_SENTENCE_LENGTH)
      const result = mapSentenceToGlyphs(text)
      expect(result.length).toBe(MAX_SENTENCE_LENGTH)
    })

    it('短句长度超过 MAX_SENTENCE_LENGTH 时，mapSentenceToGlyphs 不自动截断（截断在 store 层处理）', () => {
      const text = '一二三四五六七八九十'.repeat(3)
      expect(text.length).toBeGreaterThan(MAX_SENTENCE_LENGTH)
      const result = mapSentenceToGlyphs(text)
      expect(result.length).toBe(text.length)
    })

    it('模拟 store 层截断逻辑：超出 MAX_SENTENCE_LENGTH 的输入应被截断', () => {
      const text = '一二三四五六七八九十'.repeat(3)
      const truncated = Array.from(text).slice(0, MAX_SENTENCE_LENGTH).join('')
      expect(truncated.length).toBe(MAX_SENTENCE_LENGTH)
      const result = mapSentenceToGlyphs(truncated)
      expect(result.length).toBe(MAX_SENTENCE_LENGTH)
    })
  })

  describe('getMissingCharacters - 缺字去重保序', () => {
    it('所有字都在字库中时返回空数组', () => {
      const mapped = mapSentenceToGlyphs('活字印刷')
      const missing = getMissingCharacters(mapped)
      expect(missing).toEqual([])
    })

    it('单个缺字应正确返回', () => {
      const mapped = mapSentenceToGlyphs('活龍印刷')
      const missing = getMissingCharacters(mapped)
      expect(missing).toEqual(['龍'])
    })

    it('多个不同缺字应按出现顺序返回', () => {
      const mapped = mapSentenceToGlyphs('活龍鳳印刷龜')
      const missing = getMissingCharacters(mapped)
      expect(missing).toEqual(['龍', '鳳', '龜'])
    })

    it('重复缺字应去重，只保留首次出现的位置', () => {
      const mapped = mapSentenceToGlyphs('龍活龍鳳印刷鳳')
      const missing = getMissingCharacters(mapped)
      expect(missing).toEqual(['龍', '鳳'])
    })

    it('缺字与存在字交替出现时仍保持正确顺序和去重', () => {
      const mapped = mapSentenceToGlyphs('龍活鳳印龍刷鳳')
      const missing = getMissingCharacters(mapped)
      expect(missing).toEqual(['龍', '鳳'])
    })

    it('空输入返回空数组', () => {
      const missing = getMissingCharacters([])
      expect(missing).toEqual([])
    })

    it('所有字都缺时仍去重保序', () => {
      const mapped = mapSentenceToGlyphs('龍鳳龍龜鳳麟')
      const missing = getMissingCharacters(mapped)
      expect(missing).toEqual(['龍', '鳳', '龜', '麟'])
    })
  })
})
