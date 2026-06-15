import type { FavoriteItem, WritingMode } from '../types'

const STORAGE_KEY = 'movable-type-favorites'
const COMPOSE_STATE_KEY = 'movable-type-compose-state'

interface ComposeStateCache {
  sentence: string
  writingMode: WritingMode
}

function isComposeStateCache(value: unknown): value is ComposeStateCache {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  if (typeof obj.sentence !== 'string') return false
  if (obj.writingMode !== 'horizontal' && obj.writingMode !== 'vertical') return false
  return true
}

function isFavoriteItem(value: unknown): value is FavoriteItem {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  if (typeof obj.id !== 'string' || obj.id.length === 0) return false
  if (typeof obj.name !== 'string' || obj.name.length === 0) return false
  if (typeof obj.sentence !== 'string') return false
  if (obj.writingMode !== 'horizontal' && obj.writingMode !== 'vertical') return false
  if (typeof obj.createdAt !== 'number' || Number.isNaN(obj.createdAt)) return false
  return true
}

/**
 * 从 localStorage 读取收藏列表，自动跳过字段不完整的非法条目
 */
export function loadFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isFavoriteItem)
  } catch {
    return []
  }
}

/**
 * 将收藏列表写入 localStorage
 */
export function saveFavorites(items: FavoriteItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // storage full or unavailable — silently ignore
  }
}

/**
 * 在列表头部新增一条收藏并持久化，返回更新后的列表
 */
export function addFavorite(item: FavoriteItem): FavoriteItem[] {
  const items = loadFavorites()
  items.unshift(item)
  saveFavorites(items)
  return items
}

/**
 * 按 id 删除指定收藏并持久化，返回更新后的列表
 */
export function removeFavorite(id: string): FavoriteItem[] {
  const items = loadFavorites().filter((f) => f.id !== id)
  saveFavorites(items)
  return items
}

/**
 * 判断是否已存在同名收藏（大小写不敏感）
 */
export function hasFavoriteName(name: string): boolean {
  const normalized = name.trim()
  return loadFavorites().some((f) => f.name.trim() === normalized)
}

/**
 * 从 localStorage 读取排版台状态（短句与排版方向），字段非法时返回 null
 */
export function loadComposeState(): ComposeStateCache | null {
  try {
    const raw = localStorage.getItem(COMPOSE_STATE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return isComposeStateCache(parsed) ? parsed : null
  } catch {
    return null
  }
}

/**
 * 将当前短句写入 localStorage，保留已有排版方向
 */
export function saveComposeSentence(sentence: string): void {
  try {
    const current = loadComposeState()
    const data: ComposeStateCache = {
      sentence,
      writingMode: current?.writingMode ?? 'horizontal',
    }
    localStorage.setItem(COMPOSE_STATE_KEY, JSON.stringify(data))
  } catch {
    // storage full or unavailable — silently ignore
  }
}

/**
 * 将当前排版方向写入 localStorage，保留已有短句
 */
export function saveComposeWritingMode(writingMode: WritingMode): void {
  try {
    const current = loadComposeState()
    const data: ComposeStateCache = {
      sentence: current?.sentence ?? '',
      writingMode,
    }
    localStorage.setItem(COMPOSE_STATE_KEY, JSON.stringify(data))
  } catch {
    // storage full or unavailable — silently ignore
  }
}
