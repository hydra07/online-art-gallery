/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import Youtube from '@tiptap/extension-youtube';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import sanitizeHtml from 'sanitize-html';
import { useCurrentEditor } from '@tiptap/react';
import {
	Bold,
	CodeXml,
	Heading2,
	Heading3,
	Heading4,
	Heading5,
	Heading6,
	Italic,
	LinkIcon,
	List,
	ListOrdered,
	YoutubeIcon
} from 'lucide-react';
import { useCallback } from 'react';
import { ImageUploader } from './image-upload';

export const sanitizeOptions = {
	allowedTags: sanitizeHtml.defaults.allowedTags.concat(['iframe', 'div']),
	allowedAttributes: {
		...sanitizeHtml.defaults.allowedAttributes,
		a: ['href', 'target', 'rel'],
		iframe: [
			'src',
			'class',
			'width',
			'height',
			'allowfullscreen',
			'autoplay',
			'disablekbcontrols',
			'enableiframeapi',
			'endtime',
			'ivloadpolicy',
			'loop',
			'modestbranding',
			'origin',
			'playlist',
			'start'
		],
		div: ['data-youtube-video']
	},
	allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com'],
	allowedSchemes: ['http', 'https'],
	allowedClasses: {
		iframe: ['youtube-video']
	}
};

export const extensions = [
	Color.configure({ types: [TextStyle.name, ListItem.name] }),
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TextStyle.configure({ types: [ListItem.name] } as any),
	StarterKit.configure({
		bulletList: {
			keepMarks: true,
			keepAttributes: false
		},
		orderedList: {
			keepMarks: true,
			keepAttributes: false
		}
	}),

	Image.configure({
		inline: true,
		allowBase64: true
	}),
	Link.configure({
		openOnClick: true,
		autolink: false,
		defaultProtocol: 'https'
	}),
	Youtube.configure({
		HTMLAttributes: {
			class: 'youtube-video'
		},
		width: 320,
		height: 180,
		controls: false,
		nocookie: true,
		inline: false
	})
	// CodeBlockLowlight.configure({
	//     languageClassPrefix: 'language-',
	//     lowlight,
	// })
];

export const MenuBar = () => {
	const { editor } = useCurrentEditor();

	if (!editor) {
		return null;
	}

	const addImage = (url: string) => {
		editor.chain().focus().setImage({ src: url }).run();
	};

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const toggleLink = useCallback(() => {
		const previousUrl = editor.getAttributes('link').href;

		if (previousUrl) {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
		} else {
			const url = window.prompt('Enter URL');
			if (url) {
				editor
					.chain()
					.focus()
					.extendMarkRange('link')
					.setLink({ href: url })
					.run();
			}
		}
	}, [editor]);

	const addYoutube = useCallback(() => {
		const url = prompt('Enter YouTube URL');
		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			editor
				.chain()
				.focus()
				.extendMarkRange('youtube')
				.clearContent()
				.run();
			return;
		}

		editor.commands.setYoutubeVideo({
			src: url,
			width: 640,
			height: 480
		});
	}, [editor]);

	return (
		<div className='tiptap__buttons'>
			<button
				onClick={() => editor.chain().focus().toggleBold().run()}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				className={editor.isActive('bold') ? 'is-active' : ''}
			>
				<Bold />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleItalic().run()}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
				className={editor.isActive('italic') ? 'is-active' : ''}
			>
				<Italic />
			</button>
			<button
				onClick={() =>
					editor.chain().focus().toggleHeading({ level: 2 }).run()
				}
				className={
					editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
				}
			>
				<Heading2 />
			</button>
			<button
				onClick={() =>
					editor.chain().focus().toggleHeading({ level: 3 }).run()
				}
				className={
					editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
				}
			>
				<Heading3 />
			</button>
			<button
				onClick={() =>
					editor.chain().focus().toggleHeading({ level: 4 }).run()
				}
				className={
					editor.isActive('heading', { level: 4 }) ? 'is-active' : ''
				}
			>
				<Heading4 />
			</button>
			<button
				onClick={() =>
					editor.chain().focus().toggleHeading({ level: 5 }).run()
				}
				className={
					editor.isActive('heading', { level: 5 }) ? 'is-active' : ''
				}
			>
				<Heading5 />
			</button>
			<button
				onClick={() =>
					editor.chain().focus().toggleHeading({ level: 6 }).run()
				}
				className={
					editor.isActive('heading', { level: 6 }) ? 'is-active' : ''
				}
			>
				<Heading6 />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={editor.isActive('bulletList') ? 'is-active' : ''}
			>
				<List />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={editor.isActive('orderedList') ? 'is-active' : ''}
			>
				<ListOrdered />
			</button>

			{/* Add Image Button */}
			{/* <button onClick={addImage}>
                <ImageIcon />
            </button> */}
			{/* Add YouTube Button */}
			<button
				value='youtube'
				aria-label='Insert a YouTube Video'
				onClick={addYoutube}
			>
				<YoutubeIcon />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
				className={editor.isActive('codeBlock') ? 'is-active' : ''}
			>
				<CodeXml />
			</button>
			{/* Toggle Link Button */}
			<button
				onClick={toggleLink}
				className={editor.isActive('link') ? 'is-active' : ''}
			>
				<LinkIcon />
			</button>
			<ImageUploader
				onUploadSuccess={(url) => {
					addImage(url);
				}}
			/>
		</div>
	);
};
