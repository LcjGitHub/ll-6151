import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Input, Modal, Segmented, Space, Statistic, Typography } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { useComposeStore } from '../store/composeStore'
import { TypePreview } from '../components/TypePreview'
import { FavoriteList } from '../components/FavoriteList'
import { getMissingCharacters, mapSentenceToGlyphs, MAX_SENTENCE_LENGTH } from '../utils/mapSentence'
import type { FavoriteItem, WritingMode } from '../types'
import './ComposePage.css'

const { Title, Text } = Typography

export function ComposePage() {
  const {
    sentence,
    writingMode,
    favorites,
    setSentence,
    setWritingMode,
    loadFavoritesFromStorage,
    addFavoriteItem,
    removeFavoriteItem,
    restoreFavorite,
  } = useComposeStore()

  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [favoriteName, setFavoriteName] = useState('')

  useEffect(() => {
    loadFavoritesFromStorage()
  }, [loadFavoritesFromStorage])

  const mapped = useMemo(() => mapSentenceToGlyphs(sentence), [sentence])
  const missingChars = useMemo(() => getMissingCharacters(mapped), [mapped])
  const charCount = Array.from(sentence).length
  const foundCount = mapped.filter((m) => m.found).length

  const handleOpenSaveModal = () => {
    setFavoriteName('')
    setSaveModalOpen(true)
  }

  const handleSave = () => {
    const trimmed = favoriteName.trim()
    if (!trimmed) return
    addFavoriteItem(trimmed)
    setSaveModalOpen(false)
    setFavoriteName('')
  }

  const handleRestore = (item: FavoriteItem) => {
    restoreFavorite(item)
  }

  const handleRemove = (id: string) => {
    removeFavoriteItem(id)
  }

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
            <div className="compose-page__control-label">
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
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleOpenSaveModal}
              disabled={sentence.trim().length === 0}
            >
              收藏当前排版
            </Button>
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

      <div className="compose-page__content">
        <Card title="排版预览" className="compose-page__preview-card" bordered={false}>
          <TypePreview
            mapped={mapped}
            writingMode={writingMode}
            missingChars={missingChars}
          />
        </Card>

        <Card title="短句收藏" className="compose-page__favorites-card" bordered={false}>
          <FavoriteList
            favorites={favorites}
            onRestore={handleRestore}
            onRemove={handleRemove}
          />
        </Card>
      </div>

      <Modal
        title="收藏当前排版"
        open={saveModalOpen}
        onOk={handleSave}
        onCancel={() => setSaveModalOpen(false)}
        okText="保存"
        cancelText="取消"
        okButtonProps={{ disabled: favoriteName.trim().length === 0 }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text type="secondary">当前短句：</Text>
            <Text strong className="compose-page__modal-sentence">{sentence}</Text>
          </div>
          <div>
            <Text type="secondary">排版方向：</Text>
            <Text strong>{writingMode === 'vertical' ? '竖排' : '横排'}</Text>
          </div>
          <Input
            value={favoriteName}
            onChange={(e) => setFavoriteName(e.target.value)}
            placeholder="为本次收藏起个名字"
            maxLength={20}
            showCount
            onPressEnter={handleSave}
          />
        </Space>
      </Modal>
    </div>
  )
}
