import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import type { MappedCharacter } from '../types'
import './TypeBlock.css'

interface TypeBlockProps {
  /** 逐字映射条目 */
  item: MappedCharacter
  /** 入场动画延迟序号 */
  animationIndex: number
}

/**
 * 活字印刷「字块」组件
 * 有字模时渲染木刻质感字块，缺字时显示占位提示
 */
export function TypeBlock({ item, animationIndex }: TypeBlockProps) {
  const { char, found, glyph } = item

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
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 22,
        delay: animationIndex * 0.06,
      }}
      title={found ? `字模：${char}` : `缺字：${char}`}
    >
      <span className="type-block__char">{char}</span>
      {!found && <span className="type-block__badge">缺</span>}
    </motion.div>
  )
}
