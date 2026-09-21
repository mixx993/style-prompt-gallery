import { Link, useParams } from 'react-router-dom'
import { useCatalog } from '../hooks/useCatalog'
import { StyleImage } from '../components/StyleImage'
import { CopyButton } from '../components/CopyButton'
import { copyText } from '../lib/copy'
import { useState } from 'react'

export function StyleDetail() {
  const { id } = useParams()
  const { data, loading, error } = useCatalog()
  const [shareOk, setShareOk] = useState(false)

  if (loading) return <main className="wrap main"><p className="muted">加载中…</p></main>
  if (error || !data) return <main className="wrap main"><p className="err">{error}</p></main>

  const style = data.styles.find((s) => s.id === id)
  if (!style) {
    return (
      <main className="wrap main">
        <p className="err">找不到风格：{id}</p>
        <Link to="/">返回浏览</Link>
      </main>
    )
  }

  const pack = `${style.name_zh || style.name_en}\n\n${style.prompt}${
    style.negative_prompt ? `\n\nNegative:\n${style.negative_prompt}` : ''
  }`

  return (
    <main className="wrap main detail">
      <Link to="/" className="back">
        ← 返回图鉴
      </Link>
      <div className="detail-grid">
        <div className="detail-media">
          <StyleImage style={style} className="hero-img" />
        </div>
        <div className="detail-body">
          <div className="tag">{style.category_zh}</div>
          <h1>{style.name_zh || style.name_en}</h1>
          {style.name_en ? <p className="en-lg">{style.name_en}</p> : null}
          <p className="id">ID：<code>{style.id}</code></p>

          <div className="actions">
            <CopyButton text={style.prompt} label="复制提示词" />
            {style.negative_prompt ? <CopyButton text={style.negative_prompt} label="复制反向" /> : null}
            <CopyButton text={pack} label="复制整包" />
            <button
              type="button"
              className={`btn ${shareOk ? 'ok' : ''}`}
              onClick={async () => {
                const ok = await copyText(window.location.href)
                if (ok) {
                  setShareOk(true)
                  setTimeout(() => setShareOk(false), 1400)
                }
              }}
            >
              {shareOk ? '链接已复制' : '复制分享链接'}
            </button>
          </div>

          <section className="block">
            <h2>正向提示词</h2>
            <pre>{style.prompt}</pre>
          </section>
          {style.negative_prompt ? (
            <section className="block">
              <h2>反向提示词</h2>
              <pre>{style.negative_prompt}</pre>
            </section>
          ) : null}
          {style.usage_hint_zh ? (
            <section className="block">
              <h2>用法提示</h2>
              <p>{style.usage_hint_zh}</p>
            </section>
          ) : null}
          {style.compatible_with?.length ? (
            <section className="block">
              <h2>适用</h2>
              <p className="compat">{style.compatible_with.join(' · ')}</p>
            </section>
          ) : null}
          {(style.source_url || style.source_note) && (
            <section className="block">
              <h2>来源</h2>
              <p className="src">
                {style.source_note}
                {style.source_url ? (
                  <>
                    {' '}
                    <a href={style.source_url} target="_blank" rel="noreferrer">
                      查看原仓库
                    </a>
                  </>
                ) : null}
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
