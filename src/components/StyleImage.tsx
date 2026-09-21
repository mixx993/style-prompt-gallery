import { useMemo, useState } from 'react'
import type { StyleItem } from '../types'
import { styleImageCandidates } from '../lib/image'

export function StyleImage({ style, className }: { style: StyleItem; className?: string }) {
  const candidates = useMemo(() => styleImageCandidates(style), [style])
  const [idx, setIdx] = useState(0)
  const [failed, setFailed] = useState(false)
  const src = !failed && idx < candidates.length ? candidates[idx] : ''

  if (!src) {
    return (
      <div className={`ph ${className || ''}`} aria-hidden>
        <span>{(style.name_zh || style.name_en || '?').slice(0, 1)}</span>
      </div>
    )
  }

  return (
    <img
      className={className}
      src={src}
      alt={style.name_zh || style.name_en || style.id}
      loading="lazy"
      onError={() => {
        if (idx + 1 < candidates.length) setIdx(idx + 1)
        else setFailed(true)
      }}
    />
  )
}
