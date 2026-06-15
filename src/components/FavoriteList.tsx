import { useState } from 'react'
import { Button, Empty, Popconfirm, Segmented, Tag, Typography } from 'antd'
import {
  AppstoreOutlined,
  DeleteOutlined,
  UndoOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import type { FavoriteItem } from '../types'
import './FavoriteList.css'

const { Text } = Typography

type ViewMode = 'card' | 'list'

interface FavoriteListProps {
  favorites: FavoriteItem[]
  onRestore: (item: FavoriteItem) => void
  onRemove: (id: string) => void
}

/**
 * 收藏列表组件：支持「卡片」与「列表」两种展示模式切换
 * 点击卡片或「恢复」按钮可一键还原短句与排版方向
 */
export function FavoriteList({ favorites, onRestore, onRemove }: FavoriteListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('card')

  if (favorites.length === 0) {
    return (
      <div className="favorite-list__empty">
        <Empty description="暂无收藏" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    )
  }

  return (
    <div className="favorite-list-wrap">
      <div className="favorite-list__toolbar">
        <span className="favorite-list__count">
          共 {favorites.length} 条
        </span>
        <Segmented
          size="small"
          value={viewMode}
          onChange={(v) => setViewMode(v as ViewMode)}
          options={[
            { label: '卡片', value: 'card', icon: <AppstoreOutlined /> },
            { label: '列表', value: 'list', icon: <UnorderedListOutlined /> },
          ]}
        />
      </div>

      <div className={viewMode === 'card' ? 'favorite-list favorite-list--card' : 'favorite-list favorite-list--list'}>
        {favorites.map((item) => (
          <div
            key={item.id}
            className={viewMode === 'card' ? 'favorite-card' : 'favorite-list-item'}
            onClick={() => onRestore(item)}
          >
            <div className={viewMode === 'card' ? 'favorite-card__header' : 'favorite-list-item__header'}>
              <Text strong className={viewMode === 'card' ? 'favorite-card__name' : 'favorite-list-item__name'}>
                {item.name}
              </Text>
              <Tag color={item.writingMode === 'vertical' ? 'gold' : 'default'}>
                {item.writingMode === 'vertical' ? '竖排' : '横排'}
              </Tag>
            </div>
            <Text type="secondary" className={viewMode === 'card' ? 'favorite-card__sentence' : 'favorite-list-item__sentence'}>
              {item.sentence}
            </Text>
            <div className={viewMode === 'card' ? 'favorite-card__footer' : 'favorite-list-item__footer'}>
              <span className="favorite-card__time">
                {new Date(item.createdAt).toLocaleString('zh-CN', {
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="favorite-card__actions">
                <Button
                  type="text"
                  size="small"
                  icon={<UndoOutlined />}
                  onClick={(e) => {
                    e.stopPropagation()
                    onRestore(item)
                  }}
                >
                  恢复
                </Button>
                <Popconfirm
                  title="确认删除此收藏？"
                  onConfirm={(e) => {
                    e?.stopPropagation()
                    onRemove(item.id)
                  }}
                  onCancel={(e) => e?.stopPropagation()}
                  okText="删除"
                  cancelText="取消"
                >
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => e.stopPropagation()}
                  >
                    删除
                  </Button>
                </Popconfirm>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
