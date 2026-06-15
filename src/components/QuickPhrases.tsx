import { KeyboardEvent, useCallback } from 'react'
import { Typography } from 'antd'
import { presetPhrases, type PresetPhrase } from '../data/presetPhrases'
import './QuickPhrases.css'

const { Text } = Typography

interface QuickPhrasesProps {
  /** 当前选中的短句文本，用于高亮匹配 */
  currentSentence: string
  /**
   * 选择短句时的回调
   * @param text - 被选中的短句文本
   */
  onSelect: (text: string) => void
}

/**
 * 示例短句快选组件
 *
 * 在排版台输入区上方以可点击标签形式平铺展示所有预设短句。
 * 每个标签具备按钮角色语义，支持键盘 Tab 聚焦、Enter/Space 激活。
 * 与当前输入完全一致的标签会呈现高亮选中态。
 * 每次点击或键盘激活均通过 `onSelect` 通知父层更新短句，
 * 由全局状态中的 `animationKey` 自增机制保证字块入场动画强制重播（含重复点击同一条）。
 */
export function QuickPhrases({ currentSentence, onSelect }: QuickPhrasesProps) {
  const handleSelect = useCallback(
    (phrase: PresetPhrase) => {
      onSelect(phrase.text)
    },
    [onSelect],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLSpanElement>, phrase: PresetPhrase) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleSelect(phrase)
      }
    },
    [handleSelect],
  )

  return (
    <div className="quick-phrases">
      <div className="quick-phrases__header">
        <Text strong className="quick-phrases__title">
          示例短句
        </Text>
      </div>
      <div className="quick-phrases__tags">
        {presetPhrases.map((phrase) => {
          const isActive = phrase.text === currentSentence
          return (
            <span
              key={phrase.text}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              className={`quick-phrases__tag ${isActive ? 'quick-phrases__tag--active' : ''}`}
              onClick={() => handleSelect(phrase)}
              onKeyDown={(e) => handleKeyDown(e, phrase)}
            >
              {phrase.text}
            </span>
          )
        })}
      </div>
    </div>
  )
}
