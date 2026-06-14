import { Card, Col, Row, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { getLibrarySize } from '../utils/characterLibrary'
import { MAX_SENTENCE_LENGTH } from '../utils/mapSentence'
import './HomePage.css'

const { Title, Paragraph, Text } = Typography

/**
 * 首页：模板说明与功能概览
 */
export function HomePage() {
  const librarySize = getLibrarySize()

  return (
    <div className="home-page">
      <section className="home-page__hero">
        <Title level={2} className="home-page__hero-title">
          活字印刷 · 短句排版预览
        </Title>
        <Paragraph className="home-page__hero-desc">
          输入不超过 {MAX_SENTENCE_LENGTH} 字的短句，系统将逐字映射 Mock 字库，
          以木刻质感字块呈现排版效果，支持横排与竖排切换。
        </Paragraph>
        <Link to="/compose" className="home-page__cta">
          进入排版台 →
        </Link>
      </section>

      <Row gutter={[16, 16]} className="home-page__features">
        <Col xs={24} sm={12}>
          <Card title="① 短句输入" bordered={false} className="home-page__card">
            <Text>使用 Ant Design Input 输入 ≤{MAX_SENTENCE_LENGTH} 字短句，超出自动截断。</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="② 逐字映射" bordered={false} className="home-page__card">
            <Text>
              每个汉字对照 Mock 字库（
              <Tag color="volcano">{librarySize} 字</Tag>
              ），命中则渲染字块。
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="③ 缺字提示" bordered={false} className="home-page__card">
            <Text>字库未收录的汉字以虚线占位块标示，顶部 Alert 汇总缺字列表。</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="④ 横竖切换" bordered={false} className="home-page__card">
            <Text>Segmented 控件切换横排 / 竖排，预览区通过 CSS writing-mode 实现。</Text>
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="⑤ 入场动画" bordered={false} className="home-page__card">
            <Text>
              字块使用 framer-motion 弹簧动画逐字入场，模拟活字从字盘拣选落版的过程。
            </Text>
          </Card>
        </Col>
      </Row>

      <section className="home-page__tech">
        <Title level={4}>技术栈</Title>
        <div className="home-page__tags">
          {['React 18', 'Vite', 'TypeScript', 'React Router 6', 'Ant Design 5', 'framer-motion', 'zustand'].map(
            (tech) => (
              <Tag key={tech} color="default">
                {tech}
              </Tag>
            ),
          )}
        </div>
        <Paragraph type="secondary" className="home-page__note">
          本项目为 Mock 演示，不接真实字体引擎。字块木纹与墨色取自{' '}
          <Text code>src/mock/type-characters.json</Text>。
        </Paragraph>
      </section>
    </div>
  )
}
