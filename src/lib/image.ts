import type { StyleItem } from '../types'

export function styleImageCandidates(s: StyleItem): string[] {
  const list = [`${import.meta.env.BASE_URL}${s.image}`]
  if (s.image_remote && /^https?:\/\//.test(s.image_remote)) {
    const raw = s.image_remote
      .replace('github.com/', 'raw.githubusercontent.com/')
      .replace('/blob/', '/')
    list.push(raw)
    if (raw !== s.image_remote) list.push(s.image_remote)
  }
  return list
}
