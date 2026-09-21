import { Link, NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="app">
      <header className="top">
        <div className="wrap top-inner">
          <Link to="/" className="brand">
            <span className="logo">✦</span>
            <span>
              风格提示词图鉴
              <small>Image Prompt Share</small>
            </span>
          </Link>
          <nav>
            <NavLink to="/" end>
              浏览
            </NavLink>
            <NavLink to="/about">关于</NavLink>
          </nav>
        </div>
      </header>
      <Outlet />
      <footer className="foot">
        <div className="wrap">公开风格合集整理 · 可浏览 · 可复制 · 可分享</div>
      </footer>
    </div>
  )
}
