import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Card, Input, message, Modal, Segmented, Space, Statistic, Typography } from 'antd'
import { FullscreenOutlined, ReloadOutlined, SaveOutlined, ShareAltOutlined } from '@ant-design/icons'
import { useComposeStore } from '../store/composeStore'
import { TypePreview } from '../components/TypePreview'
import { FullscreenPreview } from '../components/FullscreenPreview'
import { FavoriteList } from '../components/FavoriteList'
import { QuickPhrases } from '../components/QuickPhrases'
import { ComposeHistory } from '../components/ComposeHistory'
import { getMissingCharacters, mapSentenceToGlyphs, MAX_SENTENCE_LENGTH } from '../utils/mapSentence'
import { decodeShareParams, generateShareLink, copyToClipboard } from '../utils/shareLink'
import type { FavoriteItem, HistoryItem, WritingMode, SpacingMode, FontSizeMode } from '../types'
import './ComposePage.css'

const { Title, Text } = Typography

/**
 * 排版台页面：输入短句、切换排版方向、预览字块，以及收藏管理
 */
export function ComposePage() {
  const location = useLocation()
  const {
    sentence,
    writingMode,
    spacing,
    fontSize,
    favorites,
    history,
    animationKey,
    setSentence,
    setWritingMode,
    setSpacing,
    setFontSize,
    loadFavoritesFromStorage,
    loadHistoryFromStorage,
    addFavoriteItem,
    removeFavoriteItem,
    restoreFavorite,
    restoreHistoryItem,
    removeHistoryItem,
    clearAllHistory,
    replayAnimation,
    restoreFromShareParams,
  } = useComposeStore()

  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [favoriteName, setFavoriteName] = useState('')
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  // 页面加载时从 localStorage 读取收藏列表，并解析 URL 分享参数
  useEffect(() => {
    loadFavoritesFromStorage()
    loadHistoryFromStorage()

    const params = decodeShareParams(location.search)
    if (params) {
      restoreFromShareParams(params.sentence, params.writingMode)
      messageApi.success('已加载分享内容')
    }
  }, [loadFavoritesFromStorage, loadHistoryFromStorage, location.search, restoreFromShareParams, messageApi])

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

  // 批量替换缺字：将短句中所有该缺字替换为候选字
  const handleReplaceCharacter = (missingChar: string, replacement: string) => {
    const newSentence = sentence.split(missingChar).join(replacement)
    setSentence(newSentence)
    messageApi.success(`已将「${missingChar}」全部替换为「${replacement}」`)
  }

  const handleRestoreHistory = (item: HistoryItem) => {
    restoreHistoryItem(item)
  }

  const handleRemoveHistory = (id: string) => {
    removeHistoryItem(id)
  }

  const handleClearHistory = () => {
    clearAllHistory()
    messageApi.success('已清空全部排版历史')
  }

  const handleOpenShareModal = () => {
    const link = generateShareLink({ sentence, writingMode })
    setShareLink(link)
    setShareModalOpen(true)
  }

  const handleCopyShareLink = async () => {
    const success = await copyToClipboard(shareLink)
    if (success) {
      messageApi.success('分享链接已复制到剪贴板')
    } else {
      messageApi.error('复制失败，请手动复制')
    }
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
            <div className="compose-page__control-group">
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
              <div className="compose-page__control-label">
                <Text strong>字块间距</Text>
                <Segmented
                  value={spacing}
                  onChange={(value) => setSpacing(value as SpacingMode)}
                  options={[
                    { label: '紧凑', value: 'compact' },
                    { label: '默认', value: 'default' },
                    { label: '宽松', value: 'loose' },
                  ]}
                />
              </div>
              <div className="compose-page__control-label">
                <Text strong>字号</Text>
                <Segmented
                  value={fontSize}
                  onChange={(value) => setFontSize(value as FontSizeMode)}
                  options={[
                    { label: '小', value: 'small' },
                    { label: '中', value: 'medium' },
                    { label: '大', value: 'large' },
                  ]}
                />
              </div>
            </div>
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleOpenSaveModal}
                disabled={sentence.trim().length === 0}
              >
                收藏当前排版
              </Button>
              <Button
                icon={<ShareAltOutlined />}
                onClick={handleOpenShareModal}
                disabled={sentence.trim().length === 0}
              >
                生成分享链接
              </Button>
            </Space>
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
        <Card
          title="排版预览"
          className="compose-page__preview-card"
          bordered={false}
          extra={
            <Space size="small">
              <Button
                icon={<FullscreenOutlined />}
                onClick={() => setFullscreenOpen(true)}
                disabled={sentence.trim().length === 0}
                size="small"
              >
                全屏预览
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={replayAnimation}
                disabled={sentence.trim().length === 0}
                size="small"
              >
                重新播放
              </Button>
            </Space>
          }
        >
          <TypePreview
            mapped={mapped}
            writingMode={writingMode}
            spacing={spacing}
            fontSize={fontSize}
            missingChars={missingChars}
            animationKey={animationKey}
            onReplace={handleReplaceCharacter}
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

      <Card title="排版历史" className="compose-page__history-card" bordered={false}>
        <ComposeHistory
          history={history}
          onRestore={handleRestoreHistory}
          onRemove={handleRemoveHistory}
          onClearAll={handleClearHistory}
        />
      </Card>

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

      <Modal
        title="分享当前排版"
        open={shareModalOpen}
        onCancel={() => setShareModalOpen(false)}
        footer={null}
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
          <div>
            <Text type="secondary">分享链接：</Text>
            <Input.TextArea
              value={shareLink}
              readOnly
              autoSize={{ minRows: 2, maxRows: 4 }}
              style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 12 }}
            />
          </div>
          <Button
            type="primary"
            icon={<ShareAltOutlined />}
            onClick={handleCopyShareLink}
            block
          >
            复制链接
          </Button>
        </Space>
      </Modal>

      <FullscreenPreview
        visible={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        mapped={mapped}
        writingMode={writingMode}
        spacing={spacing}
        fontSize={fontSize}
        missingChars={missingChars}
        animationKey={animationKey}
        sentence={sentence}
        onReplace={handleReplaceCharacter}
      />
    </div>
  )
}
