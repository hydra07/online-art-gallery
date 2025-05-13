'use client';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import Image from 'next/image';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
// import { ReportButton } from '@/components/ui.custom/report-button';
const mockComments = [
	{
		id: '1',
		author: {
			name: 'John Doe',
			avatar: '/oag-logo.png'
		},
		content: 'This is absolutely stunning! Love the use of colors.',
		createdAt: '2024-03-20T10:00:00Z'
	},
	{
		id: '2',
		author: {
			name: 'Jane Smith',
			avatar: '/oag-logo.png'
		},
		content: 'The composition is really well balanced.',
		createdAt: '2024-03-20T11:30:00Z'
	}
];

const mockArtPosts = [
	{
		id: '1',
		title: 'Abstract Harmony',
		artist: {
			name: 'Sarah Chen',
			avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
		},
		image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
		likes: 234,
		comments: 45,
		description: 'A contemporary piece exploring color and emotion'
	},
	{
		id: '2',
		title: 'Urban Reflections',
		artist: {
			name: 'Michael Rivera',
			avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop'
		},
		image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04',
		likes: 189,
		comments: 32,
		description: 'Capturing the essence of city life through abstract forms'
	}
];

export function ArtFeed() {
	const [newComment, setNewComment] = useState('');

	const handleSubmitComment = () => {
		console.log('Submitting comment:', newComment);
		setNewComment('');
	};

	return (
		<div className='grid grid-cols-1 gap-8 place-items-center'>
			{mockArtPosts.map((post) => (
				<Card
					key={post.id}
					className='overflow-hidden w-full max-w-[700px]'
				>
					<div className='p-4'>
						<div className='flex items-center space-x-4'>
							<Avatar>
								<AvatarImage src={post.artist.avatar} />
								<AvatarFallback>
									{post.artist.name[0]}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className='font-medium'>
									{post.artist.name}
								</p>
								<p className='text-sm text-muted-foreground'>
									Artist
								</p>
							</div>
						</div>
					</div>

					<div className='relative aspect-[4/3]'>
						<Image
							src={post.image}
							alt={post.title}
							fill
							className='object-cover'
						/>
					</div>

					<div className='p-4'>
						<h3 className='text-xl font-semibold mb-2'>
							{post.title}
						</h3>
						<p className='text-muted-foreground'>
							{post.description}
						</p>

						<div className='flex items-center space-x-4 mt-4'>
							<Button variant='ghost' size='sm'>
								<Heart className='w-4 h-4 mr-2' />
								{post.likes}
							</Button>

							<Drawer>
								<DrawerTrigger asChild>
									<Button variant='ghost' size='sm'>
										<MessageSquare className='w-4 h-4 mr-2' />
										{post.comments}
									</Button>
								</DrawerTrigger>
								<DrawerContent className='w-[400px] h-screen'>
									<div className='mx-auto w-full max-w-2xl h-full flex flex-col'>
										<DrawerHeader>
											<DrawerTitle>Comments</DrawerTitle>
											<DrawerDescription>
												View and add comments for this
												artwork
											</DrawerDescription>
										</DrawerHeader>

										<div className='p-4 space-y-4 flex-1 overflow-y-auto'>
											{mockComments.map((comment) => (
												<div
													key={comment.id}
													className='flex space-x-3'
												>
													<Avatar className='h-8 w-8'>
														<AvatarImage
															src={
																comment.author
																	.avatar
															}
														/>
														<AvatarFallback>
															{
																comment.author
																	.name[0]
															}
														</AvatarFallback>
													</Avatar>
													<div className='flex-1'>
														<div className='flex items-center space-x-2'>
															<p className='text-sm font-medium'>
																{
																	comment
																		.author
																		.name
																}
															</p>
															<span className='text-xs text-muted-foreground'>
																{new Date(
																	comment.createdAt
																).toLocaleDateString()}
															</span>
														</div>
														<p className='text-sm text-muted-foreground mb-2'>
															{comment.content}
														</p>
														<div className='flex items-center space-x-4'>
															<button className='text-xs text-muted-foreground hover:text-primary flex items-center space-x-1'>
																<Heart className='w-3 h-3' />
																<span>12</span>
															</button>
															<button className='text-xs text-muted-foreground hover:text-primary'>
																Reply
															</button>
														</div>
													</div>
												</div>
											))}
										</div>

										<DrawerFooter className='border-t mt-auto'>
											<div className='flex space-x-2'>
												<Input
													placeholder='Write a comment...'
													value={newComment}
													onChange={(e) =>
														setNewComment(
															e.target.value
														)
													}
												/>
												<Button
													onClick={
														handleSubmitComment
													}
												>
													Post
												</Button>
											</div>
											<DrawerClose asChild>
												<Button variant='outline'>
													Close
												</Button>
											</DrawerClose>
										</DrawerFooter>
									</div>
								</DrawerContent>
							</Drawer>

							<Button
								variant='ghost'
								size='sm'
								className='ml-auto'
							>
								<Share2 className='w-4 h-4' />
							</Button>
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}
