import { Button, Empty, Popconfirm, Tag, Typography } from 'antd'
import { ClearOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons'
import type { HistoryItem } from '../types'
import './ComposeHistory.css'

const { Text } = Typography

interface ComposeHistoryProps {
  history: HistoryItem[]
  onRestore: (item: HistoryItem) => void
  onRemove: (id: string) => void
  onClearAll: () => void
}

export function ComposeHistory({ history, onRestore, onRemove, onClearAll }: ComposeHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="compose-history__empty">
        <Empty description="暂无排版历史" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    )
  }

  return (
    <div className="compose-history-wrap">
      <div className="compose-history__toolbar">
        <span className="compose-history__count">
          共 {history.length} 条
        </span>
        <Popconfirm
          title="确认清空全部排版历史？"
          onConfirm={onClearAll}
          okText="清空"
          cancelText="取消"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            size="small"
            danger
            icon={<ClearOutlined />}
          >
            清空全部
          </Button>
        </Popconfirm>
      </div>

      <div className="compose-history__list">
        {history.map((item) => (
          <div
            key={item.id}
            className="compose-history__item"
            onClick={() => onRestore(item)}
          >
            <div className="compose-history__item-header">
              <Tag color={item.writingMode === 'vertical' ? 'gold' : 'default'}>
                {item.writingMode === 'vertical' ? '竖排' : '横排'}
              </Tag>
              <span className="compose-history__item-time">
                {new Date(item.timestamp).toLocaleString('zh-CN', {
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>
            <Text type="secondary" className="compose-history__item-sentence">
              {item.sentence}
            </Text>
            <div className="compose-history__item-actions">
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
                title="确认删除此条历史？"
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
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
