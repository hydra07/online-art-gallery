// BlogPost.tsx
import { BlogContentRenderer } from './blog-conten-renderer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BookOpen } from 'lucide-react';
import { BottomBar } from './bottom-bar';
import { Blog } from '@/types/blog';
import { calculateReadingTime } from '@/app/utils';

interface BlogPostProps {
	blog: Blog;
	author: {
		_id: string;
		name: string;
		image: string;
	};
	userId?: string;
	isBookmarked: boolean;
	isHearted: boolean;
	heartCount: number;
}

export function BlogPost({
	blog,
	author,
	isBookmarked,
	userId,
	isHearted,
	heartCount
}: BlogPostProps) {
	const readingTime = calculateReadingTime(blog.content);

	return (
		<article className='max-w-4xl mx-auto px-6'>
			<BottomBar
				isBookmarked={isBookmarked}
				userId={userId}
				isHearted={isHearted}
				heartCount={heartCount}
				blogId={blog._id}
			/>
			<header className='mb-8 text-center'>
				<h1 className='text-4xl font-extrabold leading-tight mb-6 text-gray-900 dark:text-gray-100'>
					{blog.title}
				</h1>
				<BlogAuthorInfo
					author={author}
					postDate={blog.createdAt.toString()}
					readingTime={readingTime}
				/>
			</header>
			<section className='mt-8'>
				<BlogContentRenderer content={blog.content} />
			</section>
		</article>
	);
}

function BlogAuthorInfo({
	author,
	postDate,
	readingTime
}: {
	author: {
		_id: string;
		name: string;
		image: string;
	};
	postDate: string;
	readingTime: number;
}) {
	return (
		<div className='flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 mb-6 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
			<div className='flex items-center space-x-2'>
				<Avatar className='w-10 h-10'>
					<AvatarImage
						src={author.image}
						alt={`${author.name}`}
						className='rounded-full'
					/>
					<AvatarFallback>
						{author.name?.charAt(0) || ''}
					</AvatarFallback>
				</Avatar>
				<p className='text-lg font-medium text-gray-800 dark:text-gray-200'>
					{author.name}
				</p>
			</div>
			<div className='flex items-center space-x-2 text-md text-gray-600 dark:text-gray-400'>
				<p>
					{new Date(postDate).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</p>
				<span className='text-gray-400 dark:text-gray-600'>•</span>
				<span className='flex items-center'>
					<BookOpen className='w-5 h-5 text-gray-500 dark:text-gray-400 mr-1' />
					{readingTime} min read
				</span>
			</div>
		</div>
	);
}
