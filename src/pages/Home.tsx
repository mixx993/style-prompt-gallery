import { useMemo, useState } from 'react'
import { useCatalog } from '../hooks/useCatalog'
import { StyleCard } from '../components/StyleCard'

const PAGE = 48

export function Home() {
  const { data, error, loading } = useCatalog()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('全部')
  const [page, setPage] = useState(1)

  const categories = useMemo(() => {
    if (!data) return ['全部']
    const set = new Set<string>()
    for (const s of data.styles) set.add(s.category_zh || '其他')
    return ['全部', ...Array.from(set).sort((a, b) => a.localeCompare(b, 'zh'))]
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return []
    const term = q.trim().toLowerCase()
    return data.styles.filter((s) => {
      if (cat !== '全部' && (s.category_zh || '其他') !== cat) return false
      if (!term) return true
      const blob = `${s.name_zh} ${s.name_en} ${s.id} ${s.category_zh} ${s.prompt}`.toLowerCase()
      return blob.includes(term)
    })
  }, [data, q, cat])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const pageSafe = Math.min(page, totalPages)
  const slice = filtered.slice((pageSafe - 1) * PAGE, pageSafe * PAGE)

  if (loading) return <main className="wrap main"><p className="muted">加载中…</p></main>
  if (error || !data) return <main className="wrap main"><p className="err">无法加载图鉴：{error}</p></main>

  return (
    <main className="wrap main">
      <section className="hero">
        <h1>发现并分享图片风格提示词</h1>
        <p>
          共 <strong>{data.count}</strong> 种风格 · 点击卡片查看详情 · 一键复制提示词 · 链接可分享
        </p>
        <div className="toolbar">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
            placeholder="搜索中文名 / 英文名 / ID / 提示词…"
            aria-label="搜索"
          />
          <span className="count">显示 {filtered.length} / {data.count}</span>
        </div>
        <div className="chips" role="listbox" aria-label="分类">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${cat === c ? 'on' : ''}`}
              onClick={() => {
                setCat(c)
                setPage(1)
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="grid">
        {slice.map((s) => (
          <StyleCard key={s.id} style={s} />
        ))}
      </section>

      {filtered.length === 0 ? <p className="muted center">没有匹配的风格</p> : null}

      {totalPages > 1 ? (
        <div className="pager">
          <button type="button" className="btn" disabled={pageSafe <= 1} onClick={() => setPage(pageSafe - 1)}>
            上一页
          </button>
          <span>
            {pageSafe} / {totalPages}
          </span>
          <button
            type="button"
            className="btn"
            disabled={pageSafe >= totalPages}
            onClick={() => setPage(pageSafe + 1)}
          >
            下一页
          </button>
        </div>
      ) : null}
    </main>
  )
}
