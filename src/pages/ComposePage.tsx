import { useMemo } from 'react'
import { Card, Input, Segmented, Space, Statistic, Typography } from 'antd'
import { useComposeStore } from '../store/composeStore'
import { TypePreview } from '../components/TypePreview'
import { getMissingCharacters, mapSentenceToGlyphs, MAX_SENTENCE_LENGTH } from '../utils/mapSentence'
import type { WritingMode } from '../types'
import './ComposePage.css'

const { Title, Text } = Typography

/**
 * 排版台页面：输入短句、切换方向、预览字块
 */
export function ComposePage() {
  const { sentence, writingMode, setSentence, setWritingMode } = useComposeStore()

  const mapped = useMemo(() => mapSentenceToGlyphs(sentence), [sentence])
  const missingChars = useMemo(() => getMissingCharacters(mapped), [mapped])
  const charCount = Array.from(sentence).length
  const foundCount = mapped.filter((m) => m.found).length

  return (
    <div className="compose-page">
      <Title level={3} className="compose-page__title">
        排版台
      </Title>

      <Card className="compose-page__panel" bordered={false}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div className="compose-page__input-row">
            <Text strong>短句输入</Text>
            <Input
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              placeholder={`请输入不超过 ${MAX_SENTENCE_LENGTH} 字的短句`}
              maxLength={MAX_SENTENCE_LENGTH}
              showCount
              size="large"
              className="compose-page__input"
            />
          </div>

          <div className="compose-page__control-row">
            <Text strong>排版方向</Text>
            <Segmented
              value={writingMode}
              onChange={(value) => setWritingMode(value as WritingMode)}
              options={[
                { label: '横排', value: 'horizontal' },
                { label: '竖排', value: 'vertical' },
              ]}
            />
          </div>

          <div className="compose-page__stats">
            <Statistic title="字数" value={charCount} suffix={`/ ${MAX_SENTENCE_LENGTH}`} />
            <Statistic title="命中字模" value={foundCount} suffix={`/ ${charCount}`} />
            <Statistic
              title="缺字"
              value={missingChars.length}
              valueStyle={missingChars.length > 0 ? { color: '#d4380d' } : undefined}
            />
          </div>
        </Space>
      </Card>

      <Card title="排版预览" className="compose-page__preview-card" bordered={false}>
        <TypePreview
          mapped={mapped}
          writingMode={writingMode}
          missingChars={missingChars}
        />
      </Card>
    </div>
  )
}
