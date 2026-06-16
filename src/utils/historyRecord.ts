import type { HistoryItem, WritingMode } from '../types'

const STORAGE_KEY = 'movable-type-compose-history'
const MAX_HISTORY = 20

function isHistoryItem(value: unknown): value is HistoryItem {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  if (typeof obj.id !== 'string' || obj.id.length === 0) return false
  if (typeof obj.sentence !== 'string' || obj.sentence.trim().length === 0) return false
  if (obj.writingMode !== 'horizontal' && obj.writingMode !== 'vertical') return false
  if (typeof obj.timestamp !== 'number' || Number.isNaN(obj.timestamp) || obj.timestamp <= 0) return false
  return true
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute)
    return `${minutes}分钟前`
  } else if (diff < day) {
    const hours = Math.floor(diff / hour)
    return `${hours}小时前`
  } else if (diff < 7 * day) {
    const days = Math.floor(diff / day)
    return `${days}天前`
  } else {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
    })
  }
}

export function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isHistoryItem)
  } catch {
    return []
  }
}

function saveHistory(items: HistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // storage full or unavailable
  }
}

export function addHistoryRecord(sentence: string, writingMode: WritingMode): HistoryItem[] {
  const items = loadHistory()
  const newItem: HistoryItem = {
    id: crypto.randomUUID(),
    sentence,
    writingMode,
    timestamp: Date.now(),
  }
  items.unshift(newItem)
  const trimmed = items.slice(0, MAX_HISTORY)
  saveHistory(trimmed)
  return trimmed
}

export function removeHistoryRecord(id: string): HistoryItem[] {
  const items = loadHistory().filter((h) => h.id !== id)
  saveHistory(items)
  return items
}

export function clearHistory(): HistoryItem[] {
  saveHistory([])
  return []
}
