import { Alert, Tag } from 'antd'
import { useMemo } from 'react'
import type { MappedCharacter, WritingMode, SpacingMode } from '../types'
import { TypeBlock } from './TypeBlock'
import { recommendSimilarCharacters } from '../utils/characterRecommendation'
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
  /** 缺字替换回调，参数为 (缺字, 替换字) */
  onReplace?: (missingChar: string, replacement: string) => void
}

/**
 * 活字排版预览区
 * 支持横排 / 竖排 writing-mode 切换
 * 支持紧凑 / 默认 / 宽松三档字块间距调节
 * 字块间距通过每个字块的外边距实现，横排与竖排模式下均生效
 *
 * 动画批次标识与重播机制：
 * - animationKey（动画批次标识）为 store 中的递增数字，每次短句变更或手动重播时递增
 * - 将 animationKey 拼入每个 TypeBlock 的 React key，批次变化时 React 卸载旧组件并挂载新组件，
 *   从而使 framer-motion 重新触发 initial → animate 入场弹簧动画
 * - 排版台预览区标题栏的「重新播放」按钮调用 store.replayAnimation()，仅递增 animationKey，
 *   不改变输入内容，纯粹重播视觉效果
 * - 入场动画位移轴随排版方向切换：横排沿 y 轴自下而上弹入，竖排沿 x 轴顺阅读流向自右而左弹入
 */
export function TypePreview({ mapped, writingMode, spacing, missingChars, animationKey, onReplace }: TypePreviewProps) {
  const isVertical = writingMode === 'vertical'

  const missingRecommendations = useMemo(() => {
    return missingChars.map((char) => ({
      char,
      recommendations: recommendSimilarCharacters(char, 3),
    }))
  }, [missingChars])

  return (
    <div className="type-preview">
      {missingChars.length > 0 && (
        <Alert
          type="warning"
          showIcon
          className="type-preview__alert"
          message={
            <div>
              <div>字库缺字：{missingChars.join('、')}（共 {missingChars.length} 个）</div>
              <div className="type-preview__recommend-section">
                {missingRecommendations.map(({ char, recommendations }) => (
                  <div key={char} className="type-preview__recommend-item">
                    <span className="type-preview__recommend-label">「{char}」可替换为：</span>
                    {recommendations.map((rec) => (
                      <Tag
                        key={rec}
                        color="blue"
                        className="type-preview__recommend-tag"
                        onClick={() => onReplace?.(char, rec)}
                      >
                        {rec}
                      </Tag>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          }
          description="点击候选字可将短句中所有该缺字批量替换，缺字位置以虚线字块标示。"
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
              key={`${animationKey}-${item.index}-${item.char}`}
              item={item}
              animationIndex={item.index}
              writingMode={writingMode}
              spacing={spacing}
              onReplace={onReplace}
            />
          ))
        )}
      </div>
    </div>
  )
}
