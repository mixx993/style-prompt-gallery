import { useCatalog } from '../hooks/useCatalog'

export function About() {
  const { data } = useCatalog()
  return (
    <main className="wrap main about">
      <h1>关于本站</h1>
      <p>
        「风格提示词图鉴」整理了大量公开可复用的 AI 图片风格提示词，配上示例图，方便浏览、复制和分享。
        当前库存约 <strong>{data?.count ?? '—'}</strong> 条（目录版本 {data?.version ?? '—'}）。
      </p>
      <h2>怎么用</h2>
      <ol>
        <li>在首页按分类筛选或搜索。</li>
        <li>打开详情页，把提示词里的 <code>{'{prompt}'}</code> 换成你的主体描述。</li>
        <li>点「复制提示词」或「复制分享链接」发给朋友。</li>
      </ol>
      <h2>数据说明</h2>
      <p>
        提示词与示例图来自多个公开 GitHub 风格合集（如 Fooocus SDXL styles、各类 Prompt Cookbook、ComfyUI
        风格预览等）。本站只做整理与展示，请遵守各来源仓库的许可与署名要求。
      </p>
    </main>
  )
}
