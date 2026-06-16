import { useMemo, useState } from 'react'
import { Card, Input, Statistic, Typography } from 'antd'
import { useComposeStore } from '../store/composeStore'
import { ComparisonPreview } from '../components/ComparisonPreview'
import { QuickPhrases } from '../components/QuickPhrases'
import { getMissingCharacters, mapSentenceToGlyphs, MAX_SENTENCE_LENGTH } from '../utils/mapSentence'
import './ComparisonPage.css'

const { Title, Text } = Typography

/**
 * 横竖对照预览页面
 * 用户输入或沿用当前短句后，左右分栏同时展示横排与竖排两种排版效果，
 * 两侧各自独立渲染字块列表和缺字提示，中间无方向切换控件。
 */
export function ComparisonPage() {
  const { sentence: storeSentence, animationKey, setSentence, fontSize, spacing } = useComposeStore()
  const [localSentence, setLocalSentence] = useState(storeSentence)
  const [animKey, setAnimKey] = useState(animationKey)

  const mapped = useMemo(() => mapSentenceToGlyphs(localSentence), [localSentence])
  const missingChars = useMemo(() => getMissingCharacters(mapped), [mapped])
  const charCount = Array.from(localSentence).length
  const foundCount = mapped.filter((m) => m.found).length

  const handleSentenceChange = (text: string) => {
    setLocalSentence(text)
    setSentence(text)
    setAnimKey((k) => k + 1)
  }

  return (
    <div className="comparison-page">
      <Title level={3} className="comparison-page__title">
        横竖对照预览
      </Title>

      <Card className="comparison-page__panel" bordered={false}>
        <div className="comparison-page__input-area">
          <QuickPhrases currentSentence={localSentence} onSelect={handleSentenceChange} />
          <div className="comparison-page__input-row">
            <Text strong>短句输入</Text>
            <Input
              value={localSentence}
              onChange={(e) => handleSentenceChange(e.target.value)}
              placeholder={`请输入不超过 ${MAX_SENTENCE_LENGTH} 字的短句`}
              maxLength={MAX_SENTENCE_LENGTH}
              showCount
              size="large"
              className="comparison-page__input"
            />
          </div>
          <div className="comparison-page__stats">
            <Statistic title="字数" value={charCount} suffix={`/ ${MAX_SENTENCE_LENGTH}`} />
            <Statistic title="命中字模" value={foundCount} suffix={`/ ${charCount}`} />
            <Statistic
              title="缺字"
              value={missingChars.length}
              valueStyle={missingChars.length > 0 ? { color: '#d4380d' } : undefined}
            />
          </div>
        </div>
      </Card>

      <Card title="对照预览" className="comparison-page__preview-card" bordered={false}>
        <ComparisonPreview
          mapped={mapped}
          missingChars={missingChars}
          animationKey={animKey}
          fontSize={fontSize}
          spacing={spacing}
        />
      </Card>
    </div>
  )
}
