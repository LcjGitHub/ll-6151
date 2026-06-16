import { useEffect } from 'react'
import { Button, Tag, Typography } from 'antd'
import { CloseOutlined, FullscreenExitOutlined } from '@ant-design/icons'
import type { MappedCharacter, WritingMode, SpacingMode, FontSizeMode } from '../types'
import { TypePreview } from './TypePreview'
import './FullscreenPreview.css'

const { Text } = Typography

interface FullscreenPreviewProps {
  /** 是否显示全屏预览 */
  visible: boolean
  /** 关闭全屏预览回调 */
  onClose: () => void
  /** 逐字映射列表 */
  mapped: MappedCharacter[]
  /** 排版方向 */
  writingMode: WritingMode
  /** 字块间距档位 */
  spacing: SpacingMode
  /** 字块字号档位 */
  fontSize: FontSizeMode
  /** 缺字列表 */
  missingChars: string[]
  /** 动画触发键 */
  animationKey: number
  /** 当前短句内容 */
  sentence: string
  /** 缺字替换回调 */
  onReplace?: (missingChar: string, replacement: string) => void
}

/**
 * 全屏沉浸式预览容器组件
 * 以遮罩层铺满视口展示当前字块排版效果
 * 保留缺字警告与当前横竖排状态
 * 支持 ESC 键或关闭按钮退出全屏
 */
export function FullscreenPreview({
  visible,
  onClose,
  mapped,
  writingMode,
  spacing,
  fontSize,
  missingChars,
  animationKey,
  sentence,
  onReplace,
}: FullscreenPreviewProps) {
  useEffect(() => {
    if (!visible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [visible, onClose])

  if (!visible) return null

  return (
    <div className="fullscreen-preview" role="dialog" aria-modal="true" aria-label="全屏预览">
      <div className="fullscreen-preview__mask" onClick={onClose} />

      <div className="fullscreen-preview__container">
        <div className="fullscreen-preview__header">
          <div className="fullscreen-preview__header-left">
            <Tag color="gold" className="fullscreen-preview__mode-tag">
              {writingMode === 'vertical' ? '竖排模式' : '横排模式'}
            </Tag>
            {sentence && (
              <Text ellipsis className="fullscreen-preview__sentence">
                当前短句：{sentence}
              </Text>
            )}
          </div>
          <div className="fullscreen-preview__header-right">
            <Button
              icon={<FullscreenExitOutlined />}
              onClick={onClose}
              className="fullscreen-preview__exit-btn"
            >
              退出全屏
            </Button>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
              className="fullscreen-preview__close-btn"
              aria-label="关闭"
            />
          </div>
        </div>

        <div className="fullscreen-preview__body">
          <div className="fullscreen-preview__content">
            <TypePreview
              mapped={mapped}
              writingMode={writingMode}
              spacing={spacing}
              fontSize={fontSize}
              missingChars={missingChars}
              animationKey={animationKey}
              onReplace={onReplace}
            />
          </div>
        </div>

        <div className="fullscreen-preview__footer">
          <Text type="secondary" className="fullscreen-preview__hint">
            按 ESC 键或点击关闭按钮退出全屏预览
          </Text>
        </div>
      </div>
    </div>
  )
}
