import React from 'react';
import { getCurrentUser } from '@/lib/session';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrashIcon, CalendarIcon, PenIcon } from 'lucide-react';
import Link from 'next/link';
import { DeleteBlogButton } from '../../delete-blog-button';
import { getBlogsByPublished } from '@/service/blog';

export default async function DraftPage() {
	const user = await getCurrentUser();

	if (!user) {
		return null;
	}

	const blogs = await getBlogsByPublished({ published: false });

	if (blogs.length === 0) {
		return (
			<div className='text-center py-10'>
				<p className='text-xl text-muted-foreground'>
					No draft blogs found.
				</p>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			{blogs.map((post) => (
				<Card
					key={post._id}
					className='hover:shadow-md transition-shadow duration-200'
				>
					<CardContent className='p-3'>
						<div className='flex items-center justify-between'>
							<div className='space-y-2'>
								<h3 className='text-lg font-semibold line-clamp-1'>
									{post.title}
								</h3>
								<div className='flex items-center space-x-3 text-sm text-muted-foreground'>
									{/* <div className="flex items-center space-x-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={user.image || "default-avatar.png"} alt={user.firstname} />
                                            <AvatarFallback>{user.firstname?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span>{user.firstname} {user.lastname}</span>
                                    </div> */}
									<div className='flex items-center space-x-1'>
										<CalendarIcon className='h-4 w-4' />
										<span>
											{new Date(
												post.createdAt
											).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'short',
												day: 'numeric'
											})}
										</span>
									</div>
								</div>
							</div>
							<div className='flex space-x-2'>
								<Link href={`/draft/${post._id}`} passHref>
									<Button
										variant='outline'
										size='sm'
										className='flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800'
									>
										<PenIcon className='h-4 w-4' />
										{/* <span>Edit</span> */}
									</Button>
								</Link>

								<DeleteBlogButton blogId={post._id}>
									<Button
										variant='outline'
										size='sm'
										className='flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800'
									>
										<TrashIcon className='h-4 w-4' />
										{/* <span>Delete</span> */}
									</Button>
								</DeleteBlogButton>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
