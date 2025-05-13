// pages/blog/[id].tsx
import { NotFoundError } from '@/app/utils';
import { BlogPost } from '../components/blog-post';
import { getBlogById, getUserInteractions } from '@/service/blog';
import { Suspense } from 'react';
import BlogLoading from './loading';
import { getCurrentUser } from '@/lib/session';
export const fetchCache = 'force-no-store';

export default async function BlogPage({
	params
}: {
	params: { slug: string };
}) {
	const blogId = params.slug.split('.')[1];
	const [user, res] = await Promise.all([
		getCurrentUser(),
		getBlogById(blogId)
	]);
	const blog = res.data?.blog;
	if (!blog) {
		throw new NotFoundError('Blog not found');
	}

	// const { heart } = await getBlogInteractions(blogId);
	// const {heart, likedBy} = await getPostInteractions({blogId});

	const { hearted, bookmarked } = user
		? await getUserInteractions(user.accessToken, blogId)
		: { hearted: false, bookmarked: false };

	return (
		<Suspense fallback={<BlogLoading />}>
			<BlogPost
				isBookmarked={bookmarked}
				isHearted={hearted}
				userId={user?.id}
				blog={blog}
				author={blog.author}
				heartCount={blog.heartCount}
			/>
		</Suspense>
	);
}
