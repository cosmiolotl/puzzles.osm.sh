import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { cn } from '@/lib/utils'
import { linkAttachmentImages } from '@/lib/link-attachment-images'

/*
  Statement and solution prose: markdown with GitHub tables and KaTeX math,
  set in the terminal's own measure.
*/
export function Markdown({ source, className }: { source: string; className?: string }) {
  return (
    <div className={cn('prose-mono', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
        rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }], linkAttachmentImages]}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
