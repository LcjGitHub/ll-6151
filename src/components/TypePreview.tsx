import { Alert } from 'antd'
import type { MappedCharacter, WritingMode, SpacingMode } from '../types'
import { TypeBlock } from './TypeBlock'
import './TypePreview.css'

interface TypePreviewProps {
  /** 逐字映射列表 */
  mapped: MappedCharacter[]
  /** 排版方向 */
  writingMode: WritingMode
  /** 字块间距档位 */
  spacing: SpacingMode
  /** 缺字列表 */
  missingChars: string[]
  /** 动画触发键（变化时强制字块入场动画重播） */
  animationKey: number
  /** 缺字替换回调 */
  onReplace?: (char: string) => void
}

/**
 * 活字排版预览区
 * 支持横排 / 竖排 writing-mode 切换
 */
export function TypePreview({ mapped, writingMode, spacing, missingChars, animationKey, onReplace }: TypePreviewProps) {
  const isVertical = writingMode === 'vertical'

  return (
    <div className="type-preview">
      {missingChars.length > 0 && (
        <Alert
          type="warning"
          showIcon
          className="type-preview__alert"
          message={`字库缺字：${missingChars.join('、')}（共 ${missingChars.length} 个）`}
          description="缺字位置以虚线字块标示，请更换用字或扩充 Mock 字库。"
        />
      )}

      <div
        className={`type-preview__stage ${isVertical ? 'type-preview__stage--vertical' : 'type-preview__stage--horizontal'} type-preview__stage--spacing-${spacing}`}
        style={{ writingMode: isVertical ? 'vertical-rl' : 'horizontal-tb' }}
      >
        {mapped.length === 0 ? (
          <p className="type-preview__empty">请输入短句，字块将在此逐字排布</p>
        ) : (
          mapped.map((item) => (
            <TypeBlock
              key={`${animationKey}-${item.index}-${item.char}`}
              item={item}
              animationIndex={item.index}
              onReplace={onReplace}
            />
          ))
        )}
      </div>
    </div>
  )
}
