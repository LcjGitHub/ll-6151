import { useCallback, useMemo, useState } from 'react'
import { Card, Col, Progress, Row, Statistic, Table, Tabs, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { computeCoverageStatistics } from '../utils/coverageStatistics'
import type { CharacterCoverage, CoverageSummary } from '../utils/coverageStatistics'
import './CoveragePage.css'

const { Title, Text } = Typography

function formatCoverageRate(rate: number): string {
  return (rate * 100).toFixed(1)
}

function CoverageSummaryCard({ summary }: { summary: CoverageSummary }) {
  return (
    <Card className="coverage-page__summary-card" bordered={false}>
      <Row gutter={[24, 16]}>
        <Col xs={12} md={6}>
          <Statistic
            title="字库总字数"
            value={summary.totalCharacters}
            suffix="字"
            valueStyle={{ color: '#3d2b1f' }}
          />
        </Col>
        <Col xs={12} md={6}>
          <Statistic
            title="已使用字数"
            value={summary.usedCharacters}
            suffix="字"
            valueStyle={{ color: '#8b6914' }}
          />
        </Col>
        <Col xs={12} md={6}>
          <Statistic
            title="未使用字数"
            value={summary.unusedCharacters}
            suffix="字"
            valueStyle={{ color: '#a08060' }}
          />
        </Col>
        <Col xs={12} md={6}>
          <Statistic
            title="覆盖率"
            value={formatCoverageRate(summary.coverageRate)}
            suffix="%"
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
      </Row>
      <div className="coverage-page__progress-wrapper">
        <Text className="coverage-page__progress-label">字库使用覆盖进度</Text>
        <Progress
          percent={Number(formatCoverageRate(summary.coverageRate))}
          strokeColor={{ '0%': '#c4a574', '100%': '#8b6914' }}
          trailColor="#e8dfd0"
          strokeWidth={16}
        />
      </div>
      <Row gutter={[24, 8]} className="coverage-page__source-stats">
        <Col xs={12}>
          <Text type="secondary">收藏短句数：</Text>
          <Text strong style={{ color: '#8b6914' }}>
            {summary.totalFavoritesItems} 条
          </Text>
        </Col>
        <Col xs={12}>
          <Text type="secondary">预设短句数：</Text>
          <Text strong style={{ color: '#8b6914' }}>
            {summary.totalPhrasesItems} 条
          </Text>
        </Col>
      </Row>
    </Card>
  )
}

export function CoveragePage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  const { summary, highFrequency, unused } = useMemo(
    () => computeCoverageStatistics(),
    [refreshKey],
  )

  const columns: ColumnsType<CharacterCoverage> = useMemo(
    () => [
      {
        title: '序号',
        key: 'index',
        width: 64,
        render: (_v, _r, index) => index + 1,
      },
      {
        title: '汉字',
        dataIndex: 'char',
        key: 'char',
        width: 80,
        render: (char: string) => (
          <span className="coverage-page__char-cell">{char}</span>
        ),
      },
      {
        title: '出现频次',
        dataIndex: 'totalCount',
        key: 'totalCount',
        width: 100,
        sorter: (a, b) => a.totalCount - b.totalCount,
        render: (count: number) => (
          <Tag color="gold" className="coverage-page__count-tag">
            {count} 次
          </Tag>
        ),
      },
      {
        title: '来源分布',
        key: 'sources',
        render: (_v, record) => (
          <div className="coverage-page__source-tags">
            <Tag color={record.inFavorites ? 'blue' : 'default'}>
              收藏：{record.favoritesCount}
            </Tag>
            <Tag color={record.inPhrases ? 'green' : 'default'}>
              预设：{record.phrasesCount}
            </Tag>
          </div>
        ),
      },
    ],
    [],
  )

  const tabItems = useMemo(
    () => [
      {
        key: 'high-frequency',
        label: (
          <span>
            高频字 <Tag color="gold">{highFrequency.length}</Tag>
          </span>
        ),
        children: (
          <Table
            rowKey="char"
            columns={columns}
            dataSource={highFrequency}
            pagination={false}
            size="middle"
            className="coverage-page__table"
          />
        ),
      },
      {
        key: 'unused',
        label: (
          <span>
            冷僻字 <Tag color="default">{unused.length}</Tag>
          </span>
        ),
        children: unused.length > 0 ? (
          <div className="coverage-page__unused-grid">
            {unused.map((item) => (
              <div key={item.char} className="coverage-page__unused-item">
                <span className="coverage-page__unused-char">{item.char}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="coverage-page__empty">
            <Text type="secondary">字库所有汉字均已被使用，覆盖率 100%</Text>
          </div>
        ),
      },
    ],
    [columns, highFrequency, unused],
  )

  return (
    <div className="coverage-page">
      <Title level={3} className="coverage-page__title">
        字库覆盖统计
      </Title>

      <CoverageSummaryCard summary={summary} />

      <Card
        className="coverage-page__detail-card"
        bordered={false}
        extra={
          <button
            type="button"
            className="coverage-page__refresh-btn"
            onClick={refresh}
          >
            🔄 刷新统计
          </button>
        }
      >
        <Tabs
          defaultActiveKey="high-frequency"
          items={tabItems}
          className="coverage-page__tabs"
          size="large"
        />
      </Card>
    </div>
  )
}
