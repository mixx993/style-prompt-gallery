import { useEffect, useState } from 'react'
import type { Catalog } from '../types'

let cache: Catalog | null = null

export function useCatalog() {
  const [data, setData] = useState<Catalog | null>(cache)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    if (cache) return
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}data/catalog.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`加载失败 ${r.status}`)
        return r.json()
      })
      .then((j: Catalog) => {
        if (!cancelled) {
          cache = j
          setData(j)
          setLoading(false)
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message)
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { data, error, loading }
}
