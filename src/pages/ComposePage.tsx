import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Input, message, Modal, Segmented, Space, Statistic, Typography } from 'antd'
import type { InputRef } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { useComposeStore } from '../store/composeStore'
import { TypePreview } from '../components/TypePreview'
import { FavoriteList } from '../components/FavoriteList'
import { QuickPhrases } from '../components/QuickPhrases'
import { getMissingCharacters, mapSentenceToGlyphs, MAX_SENTENCE_LENGTH } from '../utils/mapSentence'
import type { FavoriteItem, WritingMode } from '../types'
import './ComposePage.css'

const { Title, Text } = Typography

/**
 * 排版台页面：输入短句、切换排版方向、预览字块，以及收藏管理
 */
export function ComposePage() {
  const {
    sentence,
    writingMode,
    favorites,
    animationKey,
    setSentence,
    setWritingMode,
    loadFavoritesFromStorage,
    addFavoriteItem,
    removeFavoriteItem,
    restoreFavorite,
  } = useComposeStore()

  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [favoriteName, setFavoriteName] = useState('')
  const [messageApi, contextHolder] = message.useMessage()
  const inputRef = useRef<InputRef>(null)

  // 页面加载时从 localStorage 读取收藏列表
  useEffect(() => {
    loadFavoritesFromStorage()
  }, [loadFavoritesFromStorage])

  // 将当前短句逐字映射为字模
  const mapped = useMemo(() => mapSentenceToGlyphs(sentence), [sentence])
  // 统计缺字（去重保序）
  const missingChars = useMemo(() => getMissingCharacters(mapped), [mapped])
  const charCount = Array.from(sentence).length
  const foundCount = mapped.filter((m) => m.found).length

  // 打开收藏命名弹窗
  const handleOpenSaveModal = () => {
    setFavoriteName('')
    setSaveModalOpen(true)
  }

  // 保存收藏：同名阻止并提示，成功则 toast
  const handleSave = () => {
    const trimmed = favoriteName.trim()
    if (!trimmed) return
    const ok = addFavoriteItem(trimmed)
    if (!ok) {
      messageApi.warning(`已存在同名收藏："${trimmed}"，请换个名字`)
      return
    }
    messageApi.success('收藏成功')
    setSaveModalOpen(false)
    setFavoriteName('')
  }

  // 还原一条收藏为当前短句与排版方向
  const handleRestore = (item: FavoriteItem) => {
    restoreFavorite(item)
  }

  // 删除一条收藏
  const handleRemove = (id: string) => {
    removeFavoriteItem(id)
  }

  // 处理缺字替换：定位到输入框并提示用户替换
  const handleReplace = (char: string) => {
    messageApi.info(`请在输入框中替换「${char}」为其他常用字`)
    inputRef.current?.focus()
    inputRef.current?.input?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="compose-page">
      {contextHolder}

      <Title level={3} className="compose-page__title">
        排版台
      </Title>

      <Card className="compose-page__panel" bordered={false}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <QuickPhrases currentSentence={sentence} onSelect={setSentence} />

          <div className="compose-page__input-row">
            <Text strong>短句输入</Text>
            <Input
              ref={inputRef}
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
            animationKey={animationKey}
            onReplace={handleReplace}
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
