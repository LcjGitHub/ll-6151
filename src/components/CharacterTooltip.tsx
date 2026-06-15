import type { CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TooltipContent } from '../types'
import './CharacterTooltip.css'

interface CharacterTooltipProps {
  visible: boolean
  content: TooltipContent
  position?: 'top' | 'bottom'
}

export function CharacterTooltip({ visible, content, position = 'top' }: CharacterTooltipProps) {
  const { found, char, glyph, onReplace } = content

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`char-tooltip char-tooltip--${position}`}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          {found && glyph ? (
            <div className="char-tooltip__found">
              <div className="char-tooltip__glyph-preview">
                <span
                  className="char-tooltip__glyph"
                  style={{
                    '--wood-tone': glyph.woodTone,
                    '--ink-shade': glyph.inkShade,
                  } as CSSProperties}
                >
                  {glyph.char}
                </span>
              </div>
              <div className="char-tooltip__info">
                <div className="char-tooltip__row">
                  <span className="char-tooltip__label">字形</span>
                  <span className="char-tooltip__value">{glyph.char}</span>
                </div>
                <div className="char-tooltip__row">
                  <span className="char-tooltip__label">木纹色调</span>
                  <span className="char-tooltip__value">
                    <span
                      className="char-tooltip__color-swatch"
                      style={{ backgroundColor: glyph.woodTone }}
                    />
                    {glyph.woodTone}
                  </span>
                </div>
                <div className="char-tooltip__row">
                  <span className="char-tooltip__label">墨色调</span>
                  <span className="char-tooltip__value">
                    <span
                      className="char-tooltip__color-swatch"
                      style={{ backgroundColor: glyph.inkShade }}
                    />
                    {glyph.inkShade}
                  </span>
                </div>
                <div className="char-tooltip__row">
                  <span className="char-tooltip__label">字库序号</span>
                  <span className="char-tooltip__value">#{glyph.sequence}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="char-tooltip__missing">
              <div className="char-tooltip__missing-icon">!</div>
              <div className="char-tooltip__missing-title">字库未收录「{char}」</div>
              <div className="char-tooltip__missing-desc">
                该字暂未加入 Mock 字库，建议替换为常用字或扩充字库数据。
              </div>
              {onReplace && (
                <button
                  type="button"
                  className="char-tooltip__replace-btn"
                  onClick={() => onReplace(char)}
                >
                  去替换
                </button>
              )}
            </div>
          )}
          <div className={`char-tooltip__arrow char-tooltip__arrow--${position}`} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
