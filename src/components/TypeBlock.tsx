import { useState } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import type { MappedCharacter, SpacingMode, WritingMode, FontSizeMode } from '../types'
import { CharacterTooltip } from './CharacterTooltip'
import './TypeBlock.css'

interface TypeBlockProps {
  /** 逐字映射条目 */
  item: MappedCharacter
  /** 入场动画延迟序号 */
  animationIndex: number
  /** 排版方向，决定入场动画位移轴：横排沿 y 轴、竖排沿 x 轴 */
  writingMode: WritingMode
  /** 字块间距档位 */
  spacing?: SpacingMode
  /** 字块字号档位 */
  fontSize?: FontSizeMode
  /** 缺字替换回调，参数为 (缺字, 替换字) */
  onReplace?: (missingChar: string, replacement: string) => void
}

/**
 * 活字印刷「字块」组件
 * 有字模时渲染木刻质感字块，缺字时显示占位提示
 * 悬停时显示浮层提示详情
 *
 * 入场动画按排版方向切换位移轴：
 * - 横排 (horizontal)：字块从下方弹入，沿 y 轴自下而上位移
 * - 竖排 (vertical)：字块从右侧弹入，沿 x 轴自右而左位移（顺竖排阅读流向）
 *
 * 字号档位与间距档位叠加生效规则：
 * - 字号档位（小、中、大）控制字块尺寸与字符大小
 * - 间距档位（紧凑、默认、宽松）控制字块外边距
 * - 两类样式同时作用于同一字块组件，独立生效、叠加组合出三乘三共九种排版效果
 * - 间距使用字体相对单位，因此间距随字号档位自动等比缩放：字号越大，同档位下间距绝对值也越大
 */
export function TypeBlock({ item, animationIndex, writingMode, spacing = 'default', fontSize = 'medium', onReplace }: TypeBlockProps) {
  const { char, found, glyph } = item
  const [showTooltip, setShowTooltip] = useState(false)

  const isVertical = writingMode === 'vertical'

  const initial = isVertical
    ? { opacity: 0, x: 24, rotateY: -40, scale: 0.85 }
    : { opacity: 0, y: 24, rotateX: -40, scale: 0.85 }

  const animate = isVertical
    ? { opacity: 1, x: 0, rotateY: 0, scale: 1 }
    : { opacity: 1, y: 0, rotateX: 0, scale: 1 }

  const whileHover = isVertical
    ? { x: -2 }
    : { y: -2 }

  const handleMouseEnter = () => setShowTooltip(true)
  const handleMouseLeave = () => setShowTooltip(false)

  return (
    <motion.div
      className={`type-block ${found ? 'type-block--found' : 'type-block--missing'} type-block--spacing-${spacing} type-block--font-${fontSize}`}
      style={
        found && glyph
          ? {
              '--wood-tone': glyph.woodTone,
              '--ink-shade': glyph.inkShade,
            } as CSSProperties
          : undefined
      }
      initial={initial}
      animate={animate}
      whileHover={whileHover}
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
