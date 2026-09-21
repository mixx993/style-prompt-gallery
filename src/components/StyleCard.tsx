import { Link } from 'react-router-dom'
import type { StyleItem } from '../types'
import { StyleImage } from './StyleImage'

export function StyleCard({ style }: { style: StyleItem }) {
  return (
    <Link to={`/style/${encodeURIComponent(style.id)}`} className="card">
      <div className="thumb">
        <StyleImage style={style} />
      </div>
      <div className="meta">
        <div className="tag">{style.category_zh}</div>
        <h3>{style.name_zh || style.name_en}</h3>
        {style.name_en && style.name_zh ? <p className="en">{style.name_en}</p> : null}
      </div>
    </Link>
  )
}
