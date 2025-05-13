// components/BlogContentRenderer.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';

import { extensions } from '@/lib/tiptap';

interface BlogContentRendererProps {
	content: string;
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
	const editor = useEditor({
		extensions: extensions,
		content,
		editable: false,
		immediatelyRender: false
	});

	return (
		<div className='blog-content no-scroll'>
			<EditorContent editor={editor} className='' />
		</div>
	);
}
