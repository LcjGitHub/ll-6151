import { Link, Outlet, useLocation } from 'react-router-dom'
import './AppLayout.css'

/**
 * 应用全局布局：顶栏导航 + 内容区
 */
export function AppLayout() {
  const location = useLocation()

  return (
    <div className="app-layout">
      <header className="app-layout__header">
        <div className="app-layout__brand">
          <span className="app-layout__logo">活</span>
          <div>
            <h1 className="app-layout__title">活字印刷</h1>
            <p className="app-layout__subtitle">短句排版预览</p>
          </div>
        </div>
        <nav className="app-layout__nav">
          <Link
            to="/"
            className={`app-layout__link ${location.pathname === '/' ? 'app-layout__link--active' : ''}`}
          >
            模板说明
          </Link>
          <Link
            to="/compose"
            className={`app-layout__link ${location.pathname === '/compose' ? 'app-layout__link--active' : ''}`}
          >
            排版台
          </Link>
        </nav>
      </header>
      <main className="app-layout__main">
        <Outlet />
      </main>
      <footer className="app-layout__footer">
        Mock 字库演示 · 不接真实字体引擎
      </footer>
    </div>
  )
}
