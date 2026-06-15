import type { FavoriteItem } from '../types'

const STORAGE_KEY = 'movable-type-favorites'

export function loadFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function saveFavorites(items: FavoriteItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export function addFavorite(item: FavoriteItem): FavoriteItem[] {
  const items = loadFavorites()
  items.unshift(item)
  saveFavorites(items)
  return items
}

export function removeFavorite(id: string): FavoriteItem[] {
  const items = loadFavorites().filter((f) => f.id !== id)
  saveFavorites(items)
  return items
}
