import { useState } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import type { MappedCharacter } from '../types'
import { CharacterTooltip } from './CharacterTooltip'
import './TypeBlock.css'

interface TypeBlockProps {
  /** 逐字映射条目 */
  item: MappedCharacter
  /** 入场动画延迟序号 */
  animationIndex: number
  /** 缺字替换回调 */
  onReplace?: (char: string) => void
}

/**
 * 活字印刷「字块」组件
 * 有字模时渲染木刻质感字块，缺字时显示占位提示
 * 悬停时显示浮层提示详情
 */
export function TypeBlock({ item, animationIndex, onReplace }: TypeBlockProps) {
  const { char, found, glyph } = item
  const [showTooltip, setShowTooltip] = useState(false)

  const handleMouseEnter = () => setShowTooltip(true)
  const handleMouseLeave = () => setShowTooltip(false)

  return (
    <motion.div
      className={`type-block ${found ? 'type-block--found' : 'type-block--missing'}`}
      style={
        found && glyph
          ? {
              '--wood-tone': glyph.woodTone,
              '--ink-shade': glyph.inkShade,
            } as CSSProperties
          : undefined
      }
      initial={{ opacity: 0, y: 24, rotateX: -40, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      whileHover={{ y: -2 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 22,
        delay: animationIndex * 0.06,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="type-block__char">{char}</span>
      {!found && <span className="type-block__badge">缺</span>}
      <CharacterTooltip
        visible={showTooltip}
        content={{
          found,
          char,
          glyph,
          onReplace,
        }}
        position="top"
      />
    </motion.div>
  )
}
