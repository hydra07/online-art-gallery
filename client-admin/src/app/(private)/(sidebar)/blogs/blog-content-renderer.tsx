// components/BlogContentRenderer.tsx
'use client'

import { useEditor, EditorContent, type Extensions } from '@tiptap/react'

import { extensions } from '@/lib/tiptap'


interface BlogContentRendererProps {
  content: string
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
  const editor = useEditor({
    extensions: extensions as Extensions,
    content,
    editable: false,
    immediatelyRender: false,
  })

  return (
    <div className="blog-content no-scroll">
      <EditorContent editor={editor} className='' />
    </div>
  )
}