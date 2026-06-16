import { getAllCharacters, getLibrarySize } from './characterLibrary'
import { loadFavorites } from './localStorage'
import { presetPhrases } from '../data/presetPhrases'

export interface CharacterCoverage {
  char: string
  totalCount: number
  favoritesCount: number
  phrasesCount: number
  inFavorites: boolean
  inPhrases: boolean
}

export interface CoverageSummary {
  totalCharacters: number
  usedCharacters: number
  unusedCharacters: number
  coverageRate: number
  totalFavoritesItems: number
  totalPhrasesItems: number
}

function countCharactersInText(text: string, validChars: Set<string>): Map<string, number> {
  const counts = new Map<string, number>()
  for (const char of text) {
    if (validChars.has(char)) {
      counts.set(char, (counts.get(char) ?? 0) + 1)
    }
  }
  return counts
}

function mergeCounts(target: Map<string, number>, source: Map<string, number>): void {
  for (const [char, count] of source) {
    target.set(char, (target.get(char) ?? 0) + count)
  }
}

export function computeCoverageStatistics(): {
  summary: CoverageSummary
  allCharacters: CharacterCoverage[]
  highFrequency: CharacterCoverage[]
  unused: CharacterCoverage[]
} {
  const allChars = getAllCharacters()
  const validCharsSet = new Set(allChars)
  const totalSize = getLibrarySize()

  const favorites = loadFavorites()
  const favoritesCounts = new Map<string, number>()
  for (const fav of favorites) {
    const counts = countCharactersInText(fav.sentence, validCharsSet)
    mergeCounts(favoritesCounts, counts)
  }

  const phrasesCounts = new Map<string, number>()
  for (const phrase of presetPhrases) {
    const counts = countCharactersInText(phrase.text, validCharsSet)
    mergeCounts(phrasesCounts, counts)
  }

  const allCharacters: CharacterCoverage[] = allChars.map((char) => {
    const favCount = favoritesCounts.get(char) ?? 0
    const phrCount = phrasesCounts.get(char) ?? 0
    return {
      char,
      totalCount: favCount + phrCount,
      favoritesCount: favCount,
      phrasesCount: phrCount,
      inFavorites: favCount > 0,
      inPhrases: phrCount > 0,
    }
  })

  const used = allCharacters.filter((c) => c.totalCount > 0)
  const unused = allCharacters.filter((c) => c.totalCount === 0)

  const summary: CoverageSummary = {
    totalCharacters: totalSize,
    usedCharacters: used.length,
    unusedCharacters: unused.length,
    coverageRate: totalSize > 0 ? used.length / totalSize : 0,
    totalFavoritesItems: favorites.length,
    totalPhrasesItems: presetPhrases.length,
  }

  const sorted = [...allCharacters].sort((a, b) => b.totalCount - a.totalCount)
  const highFrequency = sorted.filter((c) => c.totalCount > 0).slice(0, 20)
  const unusedSorted = [...unused].sort((a, b) => a.char.localeCompare(b.char, 'zh-CN'))

  return {
    summary,
    allCharacters,
    highFrequency,
    unused: unusedSorted,
  }
}
