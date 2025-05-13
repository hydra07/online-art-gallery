// import { Suspense } from 'react';
// import BlogList, { Loading } from './components/blog-list';
// // import SearchBar from '@/components/SearchBar';
// import { getBookmarkedPostIds } from '@/service/blog';
// import { getCurrentUser } from '@/lib/session';
// import { TooltipProvider } from '@/components/ui/tooltip';

// export default async function Social() {
// 	const user = await getCurrentUser();
// 	let bookmarksId: string[] = [];
// 	if (user) {
// 		const bookmarkedPosts = await getBookmarkedPostIds(user.accessToken);
// 		bookmarksId = bookmarkedPosts || [];
// 	}
// 	return (
// 		<TooltipProvider>
// 			<main className="flex min-h-screen flex-col items-center justify-start p-4">
// 				<div className="w-full max-w-5xl">
// 					<Suspense fallback={<Loading />}>
// 						<BlogList bookmarkIds={bookmarksId} isSignedIn={!!user} />
// 					</Suspense>
// 				</div>
// 			</main>
// 		</TooltipProvider>
// 	);
// }
'use client';
import { BlogFeed } from './components/blog-feed';
// import { ArtFeed } from './components/art-feed';
import { UpcomingEvents } from './components/upcoming-event';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SocialSidebar from './components/social-sidebar';
import { EventFeed } from './components/event-feed';

export default function SocialPage() {
	return (
		<div className='container mx-auto px-4 py-6'>
			<div className='flex  justify-between'>
				{/* Left Sidebar */}
				<div className='hidden lg:block w-64 shrink-0'>
					<SocialSidebar />
				</div>

				{/* Main Content Area */}
				<div className='flex-1 max-w-[700px]'>
					<h1 className='text-3xl font-bold mb-8'>Art Community</h1>

					<Tabs defaultValue='all' className='mb-8'>
						<TabsList>
							<TabsTrigger value='all'>All</TabsTrigger>
							{/* to do: show best artworks */}
							{/* <TabsTrigger value='artwork'>Artwork</TabsTrigger> */}
							<TabsTrigger value='blogs'>Blogs</TabsTrigger>
							<TabsTrigger value='events'>Events</TabsTrigger>
						</TabsList>

						<TabsContent value='all'>
							<div className='space-y-6'>
								<EventFeed />
								{/* <ArtFeed /> */}
								<BlogFeed />
							</div>
						</TabsContent>

						{/* <TabsContent value='artwork'>
							<ArtFeed />
						</TabsContent> */}

						<TabsContent value='blogs'>
							<BlogFeed />
						</TabsContent>

						<TabsContent value='events'>
							<EventFeed />
						</TabsContent>
					</Tabs>
				</div>

				{/* Right Sidebar */}
				<div className='hidden lg:block w-[300px] shrink-0'>
					<UpcomingEvents />
				</div>
			</div>
		</div>
	);
}
