// app/blogs/[blogId]/draft/page.tsx
import { DraftBlogForm } from '../draft-blog-form';
import { notFound } from 'next/navigation';
import PreviewButton from '../preview-button';
import PublishButton from '../publish-button';
import { getCurrentUser } from '@/lib/session';
import { getBlogById } from '@/service/blog';
import BlogStatusButton from '../blog-status-button';
export default async function DraftPage({
	params
}: {
	params: { blogId: string };
}) {
	const { blogId } = params;
	const user = await getCurrentUser();
	if (!user) {
		notFound();
	}
	const res = await getBlogById(blogId);
	const blog = res.data?.blog;
	if (!blog || blog.author._id !== user.id) {
		notFound();	
	}

	return (
		<>
			<div className='flex items-center justify-between mb-4'>
				<div className='flex space-x-4'>
					<PreviewButton blog={blog} />
					{user.role.includes('admin') ? (
						<PublishButton
							blogId={blogId}
							initialStatus={blog.status}
						/>
					) : user.role.includes('artist') ? (
						<BlogStatusButton
							blogId={blogId}
							initialStatus={blog.status}
						/>
					) : null}
				</div>
			</div>

			<div className=''>
				<DraftBlogForm
					content={blog.content}
					_id={blogId}
					blogTitle={blog.title}
					isAdminOrAuthor={!!user}
					status={blog.status}
				/>
			</div>
		</>
	);
}
