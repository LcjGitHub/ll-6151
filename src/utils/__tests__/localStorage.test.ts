import { describe, it, expect, beforeEach } from 'vitest'
import type { FavoriteItem, WritingMode } from '../../types'
import {
  loadFavorites,
  saveFavorites,
  addFavorite,
  removeFavorite,
  hasFavoriteName,
  loadComposeState,
  saveComposeSentence,
  saveComposeWritingMode,
} from '../localStorage'

const STORAGE_KEY = 'movable-type-favorites'
const COMPOSE_STATE_KEY = 'movable-type-compose-state'

function createValidFavorite(overrides: Partial<FavoriteItem> = {}): FavoriteItem {
  return {
    id: 'test-id-1',
    name: '测试收藏',
    sentence: '活字印刷',
    writingMode: 'horizontal',
    createdAt: Date.now(),
    ...overrides,
  }
}

describe('localStorage - 浏览器本地存储工具', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('收藏条目字段校验 - 跳过非法数据', () => {
    it('存储为空时返回空数组', () => {
      expect(loadFavorites()).toEqual([])
    })

    it('存储为无效 JSON 时返回空数组', () => {
      localStorage.setItem(STORAGE_KEY, 'not valid json{{{')
      expect(loadFavorites()).toEqual([])
    })

    it('存储非数组值时返回空数组', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array' }))
      expect(loadFavorites()).toEqual([])
    })

    it('id 缺失或为空字符串时跳过该条目', () => {
      const items = [
        createValidFavorite({ id: '' }),
        createValidFavorite({ id: 'valid-id-1' }),
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      const result = loadFavorites()
      expect(result.length).toBe(1)
      expect(result[0].id).toBe('valid-id-1')
    })

    it('id 非字符串类型时跳过该条目', () => {
      const items = [
        { ...createValidFavorite(), id: 123 },
        createValidFavorite({ id: 'valid-id-2' }),
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      const result = loadFavorites()
      expect(result.length).toBe(1)
      expect(result[0].id).toBe('valid-id-2')
    })

    it('name 缺失或为空字符串时跳过该条目', () => {
      const items = [
        createValidFavorite({ name: '' }),
        createValidFavorite({ name: '  ' }),
        createValidFavorite({ id: 'valid-1', name: '有效名称' }),
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      const result = loadFavorites()
      expect(result.length).toBe(2)
    })

    it('name 非字符串类型时跳过该条目', () => {
      const items = [
        { ...createValidFavorite(), name: null },
        { ...createValidFavorite(), name: 123 },
        createValidFavorite({ id: 'valid-2', name: '有效名称2' }),
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      const result = loadFavorites()
      expect(result.length).toBe(1)
      expect(result[0].name).toBe('有效名称2')
    })

    it('sentence 非字符串类型时跳过该条目', () => {
      const items = [
        { ...createValidFavorite(), sentence: 123 },
        { ...createValidFavorite(), sentence: null },
        createValidFavorite({ id: 'valid-3', sentence: '有效短句' }),
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      const result = loadFavorites()
      expect(result.length).toBe(1)
      expect(result[0].sentence).toBe('有效短句')
    })

    it('writingMode 非法值时跳过该条目', () => {
      const items = [
        createValidFavorite({ writingMode: 'diagonal' as WritingMode }),
        createValidFavorite({ writingMode: 'horizontal' }),
        createValidFavorite({ writingMode: 'vertical' }),
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      const result = loadFavorites()
      expect(result.length).toBe(2)
    })

    it('createdAt 缺失或非数字或 NaN 时跳过该条目', () => {
      const items = [
        { ...createValidFavorite(), createdAt: undefined },
        { ...createValidFavorite(), createdAt: 'not a number' },
        { ...createValidFavorite(), createdAt: NaN },
        createValidFavorite({ id: 'valid-4', createdAt: Date.now() }),
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      const result = loadFavorites()
      expect(result.length).toBe(1)
      expect(result[0].id).toBe('valid-4')
    })

    it('混合非法与合法条目时仅保留合法条目', () => {
      const items = [
        createValidFavorite({ id: 'ok-1', name: '第一' }),
        { ...createValidFavorite(), id: '' },
        createValidFavorite({ id: 'ok-2', name: '第二' }),
        { ...createValidFavorite(), writingMode: 'invalid' as WritingMode },
        { ...createValidFavorite(), name: '' },
        createValidFavorite({ id: 'ok-3', name: '第三' }),
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      const result = loadFavorites()
      expect(result.length).toBe(3)
      expect(result.map((r) => r.id)).toEqual(['ok-1', 'ok-2', 'ok-3'])
    })

    it('条目为 null/undefined 时跳过', () => {
      const items = [null, undefined, createValidFavorite({ id: 'ok-only' })]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      const result = loadFavorites()
      expect(result.length).toBe(1)
      expect(result[0].id).toBe('ok-only')
    })
  })

  describe('收藏列表增删查操作', () => {
    it('saveFavorites 保存后可通过 loadFavorites 读取', () => {
      const items = [createValidFavorite({ id: 'save-1', name: '保存测试' })]
      saveFavorites(items)
      const loaded = loadFavorites()
      expect(loaded.length).toBe(1)
      expect(loaded[0].id).toBe('save-1')
    })

    it('addFavorite 在列表头部新增并返回更新后的列表', () => {
      const first = createValidFavorite({ id: 'first', name: '第一个' })
      addFavorite(first)
      const second = createValidFavorite({ id: 'second', name: '第二个' })
      const updated = addFavorite(second)
      expect(updated.length).toBe(2)
      expect(updated[0].id).toBe('second')
      expect(updated[1].id).toBe('first')
      const loaded = loadFavorites()
      expect(loaded[0].id).toBe('second')
    })

    it('removeFavorite 按 id 删除并返回更新后的列表', () => {
      addFavorite(createValidFavorite({ id: 'del-1', name: '待删1' }))
      addFavorite(createValidFavorite({ id: 'del-2', name: '待删2' }))
      addFavorite(createValidFavorite({ id: 'keep', name: '保留' }))
      const afterRemove = removeFavorite('del-1')
      expect(afterRemove.length).toBe(2)
      expect(afterRemove.map((r) => r.id)).toEqual(['keep', 'del-2'])
      const loaded = loadFavorites()
      expect(loaded.find((r) => r.id === 'del-1')).toBeUndefined()
    })

    it('removeFavorite 删除不存在的 id 时不报错', () => {
      addFavorite(createValidFavorite({ id: 'exists' }))
      const result = removeFavorite('non-existent')
      expect(result.length).toBe(1)
      expect(result[0].id).toBe('exists')
    })

    it('hasFavoriteName 判断是否存在同名（大小写不敏感？不，源码是大小写敏感 + trim）', () => {
      addFavorite(createValidFavorite({ id: 'hfn-1', name: '测试名称' }))
      expect(hasFavoriteName('测试名称')).toBe(true)
      expect(hasFavoriteName('  测试名称  ')).toBe(true)
      expect(hasFavoriteName('其他名称')).toBe(false)
      expect(hasFavoriteName('')).toBe(false)
    })
  })

  describe('排版状态读写 - 合并短句与方向', () => {
    it('loadComposeState 在无存储时返回 null', () => {
      expect(loadComposeState()).toBeNull()
    })

    it('loadComposeState 遇到非法 JSON 返回 null', () => {
      localStorage.setItem(COMPOSE_STATE_KEY, '{invalid json')
      expect(loadComposeState()).toBeNull()
    })

    it('loadComposeState 遇到字段非法返回 null', () => {
      localStorage.setItem(COMPOSE_STATE_KEY, JSON.stringify({ sentence: 123, writingMode: 'h' }))
      expect(loadComposeState()).toBeNull()
      localStorage.setItem(COMPOSE_STATE_KEY, JSON.stringify({ sentence: 'ok', writingMode: 'diagonal' }))
      expect(loadComposeState()).toBeNull()
    })

    it('saveComposeSentence 写入短句时，无之前状态默认横排', () => {
      saveComposeSentence('活字印刷')
      const state = loadComposeState()
      expect(state).not.toBeNull()
      expect(state?.sentence).toBe('活字印刷')
      expect(state?.writingMode).toBe('horizontal')
    })

    it('saveComposeSentence 写入短句时保留已有排版方向（竖排）', () => {
      localStorage.setItem(
        COMPOSE_STATE_KEY,
        JSON.stringify({ sentence: '旧内容', writingMode: 'vertical' })
      )
      saveComposeSentence('新内容')
      const state = loadComposeState()
      expect(state?.sentence).toBe('新内容')
      expect(state?.writingMode).toBe('vertical')
    })

    it('saveComposeSentence 写入短句时保留已有排版方向（横排）', () => {
      localStorage.setItem(
        COMPOSE_STATE_KEY,
        JSON.stringify({ sentence: '旧内容', writingMode: 'horizontal' })
      )
      saveComposeSentence('新内容横排')
      const state = loadComposeState()
      expect(state?.sentence).toBe('新内容横排')
      expect(state?.writingMode).toBe('horizontal')
    })

    it('saveComposeWritingMode 写入方向时，无之前状态默认空短句', () => {
      saveComposeWritingMode('vertical')
      const state = loadComposeState()
      expect(state).not.toBeNull()
      expect(state?.sentence).toBe('')
      expect(state?.writingMode).toBe('vertical')
    })

    it('saveComposeWritingMode 写入方向时保留已有短句', () => {
      localStorage.setItem(
        COMPOSE_STATE_KEY,
        JSON.stringify({ sentence: '保留我', writingMode: 'horizontal' })
      )
      saveComposeWritingMode('vertical')
      const state = loadComposeState()
      expect(state?.sentence).toBe('保留我')
      expect(state?.writingMode).toBe('vertical')
    })

    it('交替写入短句和方向时两者都被正确合并', () => {
      saveComposeSentence('第一步')
      saveComposeWritingMode('vertical')
      let state = loadComposeState()
      expect(state?.sentence).toBe('第一步')
      expect(state?.writingMode).toBe('vertical')

      saveComposeSentence('第二步')
      state = loadComposeState()
      expect(state?.sentence).toBe('第二步')
      expect(state?.writingMode).toBe('vertical')

      saveComposeWritingMode('horizontal')
      state = loadComposeState()
      expect(state?.sentence).toBe('第二步')
      expect(state?.writingMode).toBe('horizontal')
    })

    it('空字符串短句也是合法值', () => {
      saveComposeSentence('')
      const state = loadComposeState()
      expect(state?.sentence).toBe('')
      expect(state?.writingMode).toBe('horizontal')
    })
  })
})
