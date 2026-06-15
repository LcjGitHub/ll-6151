import type { CSSProperties } from 'react'
import { Empty } from 'antd'
import type { TypeCharacter } from '../types'
import './CharacterGrid.css'

interface CharacterGridProps {
  characters: TypeCharacter[]
  selectedChar: TypeCharacter | null
  onSelect: (char: TypeCharacter) => void
}

export function CharacterGrid({ characters, selectedChar, onSelect }: CharacterGridProps) {
  if (characters.length === 0) {
    return (
      <div className="character-grid__empty">
        <Empty description="未找到匹配的汉字" />
      </div>
    )
  }

  return (
    <div className="character-grid">
      {characters.map((item) => {
        const isSelected = selectedChar?.char === item.char
        return (
          <div
            key={item.char}
            className={`character-card ${isSelected ? 'character-card--selected' : ''}`}
            style={
              {
                '--wood-tone': item.woodTone,
                '--ink-shade': item.inkShade,
              } as CSSProperties
            }
            onClick={() => onSelect(item)}
          >
            <div className="character-card__glyph">
              <span className="character-card__char">{item.char}</span>
            </div>
            <div className="character-card__swatches">
              <div
                className="character-card__swatch character-card__swatch--wood"
                style={{ background: item.woodTone }}
                title={`木纹色：${item.woodTone}`}
              >
                <span className="character-card__swatch-label">木</span>
              </div>
              <div
                className="character-card__swatch character-card__swatch--ink"
                style={{ background: item.inkShade }}
                title={`墨色：${item.inkShade}`}
              >
                <span className="character-card__swatch-label">墨</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
