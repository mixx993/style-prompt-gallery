import { useState } from 'react'
import { copyText } from '../lib/copy'

export function CopyButton({ text, label = '复制' }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button
      type="button"
      className={`btn ${ok ? 'ok' : ''}`}
      onClick={async () => {
        const done = await copyText(text)
        if (done) {
          setOk(true)
          setTimeout(() => setOk(false), 1400)
        }
      }}
    >
      {ok ? '已复制' : label}
    </button>
  )
}
