export type StyleItem = {
  id: string
  name_zh: string
  name_en: string
  category: string
  category_zh: string
  prompt: string
  negative_prompt: string
  source_url: string
  source_note: string
  image: string
  image_remote: string
  compatible_with: string[]
  usage_hint_zh: string
}

export type Catalog = {
  title: string
  title_en: string
  version: string
  count: number
  updated: string
  styles: StyleItem[]
}
