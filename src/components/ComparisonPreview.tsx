import { Alert } from 'antd'
import type { MappedCharacter, FontSizeMode, SpacingMode } from '../types'
import { TypeBlock } from './TypeBlock'
import './ComparisonPreview.css'

interface ComparisonPreviewProps {
  mapped: MappedCharacter[]
  missingChars: string[]
  animationKey: number
  fontSize: FontSizeMode
  spacing: SpacingMode
  onReplace?: (char: string) => void
}

/**
 * 横竖对照分栏预览组件
 * 左右两栏分别独立渲染缺字提示（Alert）与字块列表（TypeBlock），
 * 不嵌套完整 TypePreview 整件，使两侧布局和样式完全独立可控。
 */
export function ComparisonPreview({ mapped, missingChars, animationKey, fontSize, spacing, onReplace }: ComparisonPreviewProps) {
  return (
    <div className="comparison-preview">
      <div className="comparison-preview__pane">
        <div className="comparison-preview__pane-label">横排</div>
        {missingChars.length > 0 && (
          <Alert
            type="warning"
            showIcon
            className="comparison-preview__alert"
            message={`字库缺字：${missingChars.join('、')}（共 ${missingChars.length} 个）`}
            description="缺字位置以虚线字块标示，请更换用字或扩充 Mock 字库。"
          />
        )}
        <div className="comparison-preview__stage comparison-preview__stage--horizontal">
          {mapped.length === 0 ? (
            <p className="comparison-preview__empty">请输入短句，字块将在此逐字排布</p>
          ) : (
            mapped.map((item) => (
              <TypeBlock
                key={`h-${animationKey}-${item.index}-${item.char}`}
                item={item}
                animationIndex={item.index}
                writingMode="horizontal"
                fontSize={fontSize}
                spacing={spacing}
                onReplace={onReplace}
              />
            ))
          )}
        </div>
      </div>

      <div className="comparison-preview__divider" />

      <div className="comparison-preview__pane">
        <div className="comparison-preview__pane-label">竖排</div>
        {missingChars.length > 0 && (
          <Alert
            type="warning"
            showIcon
            className="comparison-preview__alert"
            message={`字库缺字：${missingChars.join('、')}（共 ${missingChars.length} 个）`}
            description="缺字位置以虚线字块标示，请更换用字或扩充 Mock 字库。"
          />
        )}
        <div
          className="comparison-preview__stage comparison-preview__stage--vertical"
          style={{ writingMode: 'vertical-rl' }}
        >
          {mapped.length === 0 ? (
            <p className="comparison-preview__empty">请输入短句，字块将在此逐字排布</p>
          ) : (
            mapped.map((item) => (
              <TypeBlock
                key={`v-${animationKey}-${item.index}-${item.char}`}
                item={item}
                animationIndex={item.index}
                writingMode="vertical"
                fontSize={fontSize}
                spacing={spacing}
                onReplace={onReplace}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
