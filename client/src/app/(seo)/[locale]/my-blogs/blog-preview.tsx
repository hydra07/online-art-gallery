import React, { useState } from 'react';
import { Monitor, Smartphone, NotepadText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/footer';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
// import { calculateReadingTime } from '@/app/util';
// import Link from 'next/link';
// import { dancingScript } from '@/util/fonts';

type PreviewMode = 'desktop' | 'mobile';

interface BlogPreviewOverlayProps {
	isOpen: boolean;
	onClose: () => void;
	post: {
		title: string;
		content: string;
		createdAt: Date;
		image: string;
	};
}

const BlogPreviewOverlay: React.FC<BlogPreviewOverlayProps> = ({
	isOpen,
	onClose,
	post
}) => {
	const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
	// const readingTime = calculateReadingTime(post.content);
	const tBlog = useTranslations('blog');

	const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
		<div
			className='relative my-6 mx-auto'
			style={{ width: '375px', height: '812px' }}
		>
			<Image
				width={375}
				height={812}
				src='https://res.cloudinary.com/djvlldzih/image/upload/v1739338528/gallery/phone-frame.png'
				alt='Phone frame'
				className='absolute inset-0 w-full h-full'
			/>
			<div
				className='absolute inset-0 overflow-y-auto p-6'
				style={{ top: '60px', bottom: '60px' }}
			>
				{children}
			</div>
		</div>
	);

	const MonitorFrame = ({ children }: { children: React.ReactNode }) => (
		<div
			className='relative my-6 mx-auto'
			style={{ width: '1024px', height: '640px' }}
		>
			<Image
				width={1024}
				height={640}
				src='https://res.cloudinary.com/djvlldzih/image/upload/v1739338527/gallery/monitor-frame.png'
				alt='Monitor frame'
				className='absolute inset-0 w-full h-full'
			/>
			<div
				className='absolute inset-0 overflow-y-auto p-6'
				style={{
					top: '48px',
					bottom: '128px',
					left: '32px',
					right: '32px'
				}}
			>
				{children}
			</div>
		</div>
	);

	const Content = () => (
		<article className='bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden'>
			<div className='p-6'>
				<header className='mb-8 text-center'>
					<h1
						className={`${
							previewMode === 'mobile'
								? 'text-xl sm:text-2xl'
								: 'text-xl sm:text-2xl md:text-3xl'
						} font-extrabold leading-tight mb-4 text-gray-900 dark:text-gray-100`}
					>
						{post.title}
					</h1>
					<div
						className={`flex ${
							previewMode === 'mobile' ? 'flex-col' : 'flex-row'
						} items-center justify-center text-gray-500 dark:text-gray-400 mb-6 ${
							previewMode === 'mobile' ? 'space-y-4' : 'space-x-4'
						}`}
					>
						<div className='flex items-center space-x-2'>
							<p
								className={`${
									previewMode === 'mobile'
										? 'text-xs'
										: 'text-sm'
								} text-gray-600 dark:text-gray-400`}
							>
								{new Date(post.createdAt).toLocaleDateString(
									'en-US',
									{
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									}
								)}
							</p>
							{/* <span className={`${previewMode === 'mobile' ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 flex items-center`}>
                <BookOpen className={`${previewMode === 'mobile' ? 'w-3 h-3' : 'w-4 h-4'} text-gray-500 dark:text-gray-400 mr-1`} />
                {readingTime} min read
              </span> */}
						</div>
					</div>
					<Separator />
				</header>
				<section className='blog-content mt-6'>
					<div
						className={`prose dark:prose-invert max-w-none ${
							previewMode === 'mobile' ? 'text-sm' : 'text-base'
						}`}
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>
				</section>
				<footer className='mt-8'>
					{/* Conditionally render MobileFooter or regular Footer based on previewMode */}
					{previewMode === 'mobile' ? <MobileFooter /> : <Footer />}
				</footer>
			</div>
		</article>
	);

	const MobileFooter = () => {
		return (
			<footer>
				<h1>Mobile footer</h1>
			</footer>
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='w-screen h-screen max-w-full max-h-full m-0 p-0'>
				<DialogHeader className='absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 flex justify-between items-center z-10'>
					<div className='flex justify-between w-full px-20'>
						<DialogTitle className='text-lg sm:text-xl md:text-2xl'>
							<div className='flex items-center text-slate-600 text-xl dark:text-slate-400'>
								<NotepadText className='mr-2 h-4 w-4 sm:h-8 sm:w-8' />
								<span>{tBlog('preview_draft')}</span>
							</div>
						</DialogTitle>
						<Button
							className='px-6 text-blue-500 font-bold rounded-full border border-blue-600 hover:bg-blue-50 hover:text-blue-500'
							variant='ghost'
							size='default'
							onClick={onClose}
						>
							{tBlog('close')}
						</Button>
					</div>
					<div className='flex items-center space-x-2'>
						<Button
							variant={
								previewMode === 'desktop'
									? 'default'
									: 'outline'
							}
							size='sm'
							onClick={() => setPreviewMode('desktop')}
						>
							<Monitor className='mr-2 h-4 w-4 sm:h-5 sm:w-5' />
							{tBlog('desktop')}
						</Button>
						<Button
							variant={
								previewMode === 'mobile' ? 'default' : 'outline'
							}
							size='sm'
							onClick={() => setPreviewMode('mobile')}
						>
							<Smartphone className='mr-2 h-4 w-4 sm:h-5 sm:w-5' />
							{tBlog('mobile')}
						</Button>
					</div>
				</DialogHeader>
				<div className='mt-16 p-4 sm:p-6 h-full overflow-auto flex justify-center items-start'>
					{previewMode === 'mobile' ? (
						<PhoneFrame>
							<Content />
						</PhoneFrame>
					) : (
						<MonitorFrame>
							<Content />
						</MonitorFrame>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default BlogPreviewOverlay;
