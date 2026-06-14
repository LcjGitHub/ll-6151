import { Alert } from 'antd'
import type { MappedCharacter, WritingMode } from '../types'
import { TypeBlock } from './TypeBlock'
import './TypePreview.css'

interface TypePreviewProps {
  /** 逐字映射列表 */
  mapped: MappedCharacter[]
  /** 排版方向 */
  writingMode: WritingMode
  /** 缺字列表 */
  missingChars: string[]
}

/**
 * 活字排版预览区
 * 支持横排 / 竖排 writing-mode 切换
 */
export function TypePreview({ mapped, writingMode, missingChars }: TypePreviewProps) {
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
        className={`type-preview__stage ${isVertical ? 'type-preview__stage--vertical' : 'type-preview__stage--horizontal'}`}
        style={{ writingMode: isVertical ? 'vertical-rl' : 'horizontal-tb' }}
      >
        {mapped.length === 0 ? (
          <p className="type-preview__empty">请输入短句，字块将在此逐字排布</p>
        ) : (
          mapped.map((item) => (
            <TypeBlock
              key={`${item.index}-${item.char}`}
              item={item}
              animationIndex={item.index}
            />
          ))
        )}
      </div>
    </div>
  )
}
