import { useState } from 'react'
import { Tag, Typography, Segmented } from 'antd'
import { FireOutlined, BookOutlined } from '@ant-design/icons'
import { presetPhrases, type PresetPhrase } from '../data/presetPhrases'
import './QuickPhrases.css'

const { Text } = Typography

type Category = 'all' | 'slogan' | 'poetry'

interface QuickPhrasesProps {
  onSelect: (text: string) => void
}

export function QuickPhrases({ onSelect }: QuickPhrasesProps) {
  const [category, setCategory] = useState<Category>('all')

  const filtered = category === 'all'
    ? presetPhrases
    : presetPhrases.filter((p) => p.category === category)

  const handleClick = (phrase: PresetPhrase) => {
    onSelect(phrase.text)
  }

  return (
    <div className="quick-phrases">
      <div className="quick-phrases__header">
        <Text strong className="quick-phrases__title">
          示例短句
        </Text>
        <Segmented
          size="small"
          value={category}
          onChange={(v) => setCategory(v as Category)}
          options={[
            { label: '全部', value: 'all' },
            { label: '标语', value: 'slogan', icon: <FireOutlined /> },
            { label: '诗词', value: 'poetry', icon: <BookOutlined /> },
          ]}
        />
      </div>
      <div className="quick-phrases__tags">
        {filtered.map((phrase) => (
          <Tag
            key={phrase.text}
            className={`quick-phrases__tag quick-phrases__tag--${phrase.category}`}
            onClick={() => handleClick(phrase)}
          >
            {phrase.text}
          </Tag>
        ))}
      </div>
    </div>
  )
}
