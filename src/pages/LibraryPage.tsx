import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Descriptions, Input, Row, Statistic, Tag, Typography } from 'antd'
import { CharacterGrid } from '../components/CharacterGrid'
import { getAllCharacterEntries, getLibrarySize } from '../utils/characterLibrary'
import { categories, isCharacterInCategory } from '../data/categoryConfig'
import type { TypeCharacter } from '../types'
import './LibraryPage.css'

const { Title, Text } = Typography

export function LibraryPage() {
  const allEntries = useMemo(() => getAllCharacterEntries(), [])
  const totalSize = getLibrarySize()
  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedChar, setSelectedChar] = useState<TypeCharacter | null>(null)

  const filteredEntries = useMemo(() => {
    const kw = keyword.trim()
    return allEntries.filter((entry) => {
      const matchKeyword = !kw || entry.char.includes(kw)
      const matchCategory = isCharacterInCategory(entry.char, selectedCategory)
      return matchKeyword && matchCategory
    })
  }, [allEntries, keyword, selectedCategory])

  useEffect(() => {
    if (!selectedChar) return
    const stillExists = filteredEntries.some((e) => e.char === selectedChar.char)
    if (!stillExists) {
      setSelectedChar(null)
    }
  }, [filteredEntries, selectedChar])

  return (
    <div className="library-page">
      <Title level={3} className="library-page__title">
        字库查阅
      </Title>

      <Card className="library-page__toolbar" bordered={false}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="输入汉字关键字进行搜索"
              size="large"
              allowClear
              prefix={<span style={{ color: '#c4a574' }}>🔍</span>}
              className="library-page__search"
            />
          </Col>
          <Col xs={24} md={12}>
            <div className="library-page__stats">
              <Statistic title="字库总量" value={totalSize} suffix="字" />
              <Statistic
                title="当前显示"
                value={filteredEntries.length}
                suffix="字"
                valueStyle={{ color: '#8b6914' }}
              />
              {keyword && (
                <Tag color="default" className="library-page__keyword-tag">
                  关键字：{keyword}
                </Tag>
              )}
            </div>
          </Col>
        </Row>

        <div className="library-page__categories">
          <span className="library-page__categories-label">主题分类：</span>
          <div className="library-page__categories-tags">
            {categories.map((cat) => (
              <Tag
                key={cat.key}
                color={selectedCategory === cat.key ? 'gold' : 'default'}
                className={`library-page__category-tag ${
                  selectedCategory === cat.key ? 'library-page__category-tag--active' : ''
                }`}
                onClick={() => setSelectedCategory(cat.key)}
              >
                {cat.label}
              </Tag>
            ))}
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]} className="library-page__content">
        <Col xs={24} lg={selectedChar ? 14 : 24} xl={selectedChar ? 16 : 24}>
          <Card title="字库网格" className="library-page__grid-card" bordered={false}>
            <CharacterGrid
              characters={filteredEntries}
              selectedChar={selectedChar}
              onSelect={setSelectedChar}
            />
          </Card>
        </Col>

        {selectedChar && (
          <Col xs={24} lg={10} xl={8}>
            <Card
              title="字模详情"
              className="library-page__detail-card"
              bordered={false}
              extra={
                <Button size="small" onClick={() => setSelectedChar(null)}>
                  关闭
                </Button>
              }
            >
              <div
                className="library-page__detail-glyph"
                style={{
                  '--wood-tone': selectedChar.woodTone,
                  '--ink-shade': selectedChar.inkShade,
                } as React.CSSProperties}
              >
                <span className="library-page__detail-char">{selectedChar.char}</span>
              </div>

              <Descriptions column={1} size="middle" className="library-page__detail-desc">
                <Descriptions.Item label="字形">
                  <Text strong style={{ fontSize: '1.1rem' }}>
                    {selectedChar.char}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="木纹色调">
                  <div className="library-page__detail-swatch-row">
                    <div
                      className="library-page__detail-swatch"
                      style={{ background: selectedChar.woodTone }}
                    />
                    <Text code>{selectedChar.woodTone}</Text>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="墨色调">
                  <div className="library-page__detail-swatch-row">
                    <div
                      className="library-page__detail-swatch"
                      style={{ background: selectedChar.inkShade }}
                    />
                    <Text code>{selectedChar.inkShade}</Text>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  )
}
