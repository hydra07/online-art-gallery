// import FeaturedSection from '@/components/featured-section';
// import { getSession } from '@/lib/session';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { ClockIcon, CalendarIcon } from 'lucide-react';
// // Exhibition Section Component
// const ExhibitionSection = ({ title, description, dateRange }: {
// 	title: string;
// 	description: string;
// 	dateRange: string;
// }) => {
// 	const exhibitions = [
// 		{
// 			id: 1,
// 			title: "The Abstract Mind",
// 			artist: "Emma Chen",
// 			image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968"
// 		},
// 		{
// 			id: 2,
// 			title: "Urban Landscapes", 
// 			artist: "Michael Wong",
// 			image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912"
// 		},
// 		{
// 			id: 3,
// 			title: "Digital Dreams",
// 			artist: "Sarah Johnson",
// 			image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
// 		},
// 		{
// 			id: 4,
// 			title: "Nature's Harmony",
// 			artist: "David Park",
// 			image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66"
// 		},
// 		{
// 			id: 5,
// 			title: "Modern Expressions",
// 			artist: "Lisa Zhang",
// 			image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04"
// 		}
// 	];

// 	return (
// 		<section className="mb-24">
// 			<div className="max-w-4xl mx-auto px-4">
// 				<h2 className="text-3xl md:text-4xl font-bold mb-8">
// 					{title}
// 				</h2>
// 			</div>
// 			<div className="relative group">
// 				<div className="overflow-hidden no-scrollbar">
// 					<div className="flex gap-6 px-4 md:px-8 min-w-full">
// 						{exhibitions.map((exhibition) => (
// 							<Link href={`/exhibitions/${exhibition.id}`} key={exhibition.id} className="min-w-[250px] md:min-w-[300px]">
// 								<div className="flex flex-col bg-white rounded-3xl overflow-hidden shadow hover:shadow-md transition-shadow duration-300">
// 									<div className="relative aspect-[3/2]">
// 										<Image
// 											src={exhibition.image}
// 											alt={exhibition.title}
// 											fill
// 											className="object-cover"
// 										/>
// 									</div>
// 									<div className="p-3 flex flex-col gap-1.5">
// 										<h3 className="text-lg font-semibold text-gray-900">{exhibition.title}</h3>
// 										<p className="text-xs text-gray-600">By {exhibition.artist}</p>
// 										<p className="text-xs text-gray-500 line-clamp-2">
// 											{description}
// 										</p>
// 										<p className="text-xs text-gray-400 mt-1">{dateRange}</p>
// 									</div>
// 								</div>
// 							</Link>
// 						))}
// 					</div>
// 				</div>
// 				<button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
// 					<ChevronLeft className="w-6 h-6" />
// 				</button>
// 				<button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
// 					<ChevronRight className="w-6 h-6" />
// 				</button>
// 			</div>
// 		</section>
// 	);
// };

// // Artist Spotlight Section
// const ArtistSpotlight = () => {
// 	return (
// 		<section className="py-24 bg-gray-50">
// 			<div className="max-w-7xl mx-auto px-4">
// 				<h2 className="text-3xl font-bold mb-12">Artist Spotlight</h2>

// 				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
// 					{/* Artist Profile */}
// 					<div className="space-y-6">
// 						<div className="relative aspect-[4/3] rounded-xl overflow-hidden">
// 							<Image
// 								src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
// 								alt="Artist Profile"
// 								fill
// 								className="object-cover"
// 							/>
// 						</div>
// 						<div>
// 							<h3 className="text-2xl font-semibold">Sarah Chen</h3>
// 							<p className="text-gray-600">Contemporary Abstract Artist</p>
// 							<div className="flex items-center gap-4 mt-2">
// 								<span className="text-sm text-gray-500">15 Years Experience</span>
// 								<span className="text-sm text-gray-500">120+ Artworks</span>
// 								<span className="text-sm text-gray-500">25 Exhibitions</span>
// 							</div>
// 						</div>
// 						<p className="text-gray-600 leading-relaxed">
// 							&quot;Art is my way of expressing the unseen emotions and experiences that words cannot capture. 
// 							Through abstract forms and vibrant colors, I invite viewers to explore their own interpretations 
// 							and connect with the deeper meanings hidden within each piece.&quot;
// 						</p>
// 						<Button className="mt-4">View Full Profile</Button>
// 					</div>

// 					{/* Featured Works */}
// 					<div className="grid grid-cols-2 gap-4">
// 						{[
// 							{
// 								id: 1,
// 								title: "Ethereal Dreams",
// 								image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968",
// 								year: "2023"
// 							},
// 							{
// 								id: 2,
// 								title: "Urban Rhythm",
// 								image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912",
// 								year: "2023"
// 							},
// 							{
// 								id: 3,
// 								title: "Nature's Whisper",
// 								image: "https://images.unsplash.com/photo-1579783483458-83d02161294e",
// 								year: "2022"
// 							},
// 							{
// 								id: 4,
// 								title: "Digital Cosmos",
// 								image: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208",
// 								year: "2022"
// 							}
// 						].map(work => (
// 							<div key={work.id} className="group cursor-pointer">
// 								<div className="relative aspect-square rounded-lg overflow-hidden">
// 									<Image
// 										src={work.image}
// 										alt={work.title}
// 										fill
// 										className="object-cover transition-transform duration-300 group-hover:scale-105"
// 									/>
// 									<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
// 										<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
// 											<h4 className="font-medium">{work.title}</h4>
// 											<p className="text-sm text-gray-300">{work.year}</p>
// 										</div>
// 									</div>
// 								</div>
// 							</div>
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 		</section>
// 	);
// }

// // Recommendation Section Component
// const RecommendationSection = () => {
// 	return (
// 		<section className="py-24 bg-gray-50">
// 			<div className="w-full mx-auto px-4">
// 				<Tabs defaultValue="forYou" className="space-y-8">
// 					<div className="flex items-center justify-between">
// 						<TabsList className="bg-transparent border">
// 							<TabsTrigger
// 								value="forYou"
// 								className="data-[state=active]:bg-white"
// 							>
// 								New Works for You
// 							</TabsTrigger>
// 							<TabsTrigger
// 								value="following"
// 								className="data-[state=active]:bg-white"
// 							>
// 								New Works by Artists You Follow
// 							</TabsTrigger>
// 						</TabsList>
// 						<Button variant="ghost" className="text-blue-600 hover:text-blue-700">
// 							View All
// 						</Button>
// 					</div>

// 					<TabsContent value="forYou" className="mt-0">
// 						<div className="relative group">
// 							<div className="overflow-x-auto no-scrollbar">
// 								<div className="flex gap-6 items-end min-w-max pb-4">
// 									{[
// 										{
// 											id: 1,
// 											title: "Abstract Harmony",
// 											artist: "Emma Chen",
// 											image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968",
// 											price: "$2,400",
// 											width: 280,
// 											height: 180
// 										},
// 										{
// 											id: 2,
// 											title: "Urban Dreams",
// 											artist: "Marcus Rivera",
// 											image: "https://images.unsplash.com/photo-1579783483458-83d02161294e",
// 											price: "$1,800",
// 											width: 200,
// 											height: 240
// 										},
// 										{
// 											id: 3,
// 											title: "Digital Wilderness",
// 											artist: "Sophie Kim",
// 											image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912",
// 											price: "$3,200",
// 											width: 320,
// 											height: 160
// 										},
// 										{
// 											id: 4,
// 											title: "Neon Nights",
// 											artist: "Alex Wong",
// 											image: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208",
// 											price: "$2,800",
// 											width: 240,
// 											height: 200
// 										},
// 										{
// 											id: 5,
// 											title: "Nature's Pulse",
// 											artist: "Maria Garcia",
// 											image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
// 											price: "$1,900",
// 											width: 260,
// 											height: 220
// 										}
// 									].map((artwork) => (
// 										<div
// 											key={artwork.id}
// 											className="group flex flex-col"
// 											style={{ width: `${artwork.width}px` }}
// 										>
// 											<div className="flex-grow">
// 												<div
// 													className="relative overflow-hidden rounded-lg"
// 													style={{ height: `${artwork.height}px` }}
// 												>
// 													<Image
// 														src={artwork.image}
// 														alt={artwork.title}
// 														fill
// 														className="object-cover transition-transform duration-300 group-hover:scale-105"
// 													/>
// 												</div>
// 											</div>
// 											<div className="mt-3">
// 												<h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
// 													{artwork.title}
// 												</h3>
// 												<p className="text-sm text-gray-500">{artwork.artist}</p>
// 												<p className="text-sm font-medium text-gray-900 mt-1">{artwork.price}</p>
// 											</div>
// 										</div>
// 									))}
// 								</div>
// 							</div>
// 							<button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
// 								<ChevronLeft className="w-6 h-6" />
// 							</button>
// 							<button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
// 								<ChevronRight className="w-6 h-6" />
// 							</button>
// 						</div>
// 					</TabsContent>

// 					<TabsContent value="following" className="mt-0">
// 						<div className="relative group">
// 							<div className="overflow-x-auto no-scrollbar">
// 								<div className="flex gap-6 items-end min-w-max pb-4">
// 									{[
// 										{
// 											id: 1,
// 											title: "Morning Light",
// 											artist: "David Park",
// 											image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9",
// 											price: "$3,500",
// 											width: 300,
// 											height: 200
// 										},
// 										{
// 											id: 2,
// 											title: "City Rhythms",
// 											artist: "Lisa Chen",
// 											image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262",
// 											price: "$2,800",
// 											width: 220,
// 											height: 240
// 										},
// 										{
// 											id: 3,
// 											title: "Ocean Dreams",
// 											artist: "Michael Brown",
// 											image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1",
// 											price: "$4,200",
// 											width: 280,
// 											height: 180
// 										},
// 										{
// 											id: 4,
// 											title: "Desert Winds",
// 											artist: "Sarah Johnson",
// 											image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66",
// 											price: "$3,100",
// 											width: 260,
// 											height: 220
// 										},
// 										{
// 											id: 5,
// 											title: "Forest Tales",
// 											artist: "James Wilson",
// 											image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
// 											price: "$2,900",
// 											width: 240,
// 											height: 160
// 										}
// 									].map((artwork) => (
// 										<div
// 											key={artwork.id}
// 											className="group flex flex-col"
// 											style={{ width: `${artwork.width}px` }}
// 										>
// 											<div className="flex-grow">
// 												<div
// 													className="relative overflow-hidden rounded-lg"
// 													style={{ height: `${artwork.height}px` }}
// 												>
// 													<Image
// 														src={artwork.image}
// 														alt={artwork.title}
// 														fill
// 														className="object-cover transition-transform duration-300 group-hover:scale-105"
// 													/>
// 												</div>
// 											</div>
// 											<div className="mt-3">
// 												<h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
// 													{artwork.title}
// 												</h3>
// 												<p className="text-sm text-gray-500">{artwork.artist}</p>
// 												<p className="text-sm font-medium text-gray-900 mt-1">{artwork.price}</p>
// 											</div>
// 										</div>
// 									))}
// 								</div>
// 							</div>
// 							<button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
// 								<ChevronLeft className="w-6 h-6" />
// 							</button>
// 							<button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
// 								<ChevronRight className="w-6 h-6" />
// 							</button>
// 						</div>
// 					</TabsContent>
// 				</Tabs>
// 			</div>
// 		</section>
// 	);
// };

// // Trending Artists Section Component
// const TrendingArtistsSection = () => {
// 	return (
// 		<section className="py-24 bg-white">
// 			<div className="w-full mx-auto px-4">
// 				<div className="flex items-center justify-between mb-8">
// 					<h2 className="text-3xl md:text-4xl font-bold">
// 						Trending Artists
// 					</h2>
// 					<Button variant="ghost" className="text-blue-600 hover:text-blue-700">
// 						View All
// 					</Button>
// 				</div>

// 				<div className="relative group">
// 					<div className="overflow-x-auto no-scrollbar">
// 						<div className="flex gap-6 items-end min-w-max pb-4">
// 							{[
// 								{
// 									id: 1,
// 									name: "Sarah Johnson",
// 									specialty: "Contemporary Art",
// 									image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
// 									followers: "12.5K"
// 								},
// 								{
// 									id: 2,
// 									name: "Michael Chen",
// 									specialty: "Digital Art",
// 									image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1",
// 									followers: "8.2K"
// 								},
// 								{
// 									id: 3,
// 									name: "Emma Davis",
// 									specialty: "Abstract Art",
// 									image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
// 									followers: "15.7K"
// 								},
// 								{
// 									id: 4,
// 									name: "David Kim",
// 									specialty: "Photography",
// 									image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
// 									followers: "10.1K"
// 								},
// 								{
// 									id: 5,
// 									name: "Lisa Wang",
// 									specialty: "Sculpture",
// 									image: " https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
// 									followers: "9.3K"
// 								}
// 							].map((artist) => (
// 								<div
// 									key={artist.id}
// 									className="group/item flex flex-col w-[280px]"
// 								>
// 									<div className="flex-grow">
// 										<div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
// 											<Image
// 												src={artist.image}
// 												alt={artist.name}
// 												fill
// 												className="object-cover transition-transform duration-300 group-hover/item:scale-105"
// 											/>
// 											<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
// 											<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
// 												<h3 className="text-xl font-semibold group-hover/item:text-blue-400 transition-colors">
// 													{artist.name}
// 												</h3>
// 												<p className="text-sm text-gray-200">{artist.specialty}</p>
// 												<p className="text-sm text-gray-300 mt-1">{artist.followers} followers</p>
// 											</div>
// 										</div>
// 									</div>
// 								</div>
// 							))}
// 						</div>
// 					</div>
// 					<button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
// 						<ChevronLeft className="w-6 h-6" />
// 					</button>
// 					<button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
// 						<ChevronRight className="w-6 h-6" />
// 					</button>
// 				</div>
// 			</div>
// 		</section>
// 	);
// };

// // Article Section
// const ArticleSection = () => {
// 	return (
// 		<section className="py-24 bg-white">
// 			<div className=" mx-auto px-4">
// 				<div className="flex items-center justify-between mb-12">
// 					<h2 className="text-3xl font-bold">Latest Articles</h2>
// 					<Button variant="ghost" className="text-blue-600 hover:text-blue-700">
// 						View All Articles
// 					</Button>
// 				</div>

// 				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// 					{/* Featured Article - Cột 1 */}
// 					<div className="group">
// 						<Link href="/articles/1">
// 							<div className="relative aspect-square rounded-xl overflow-hidden mb-6">
// 								<Image
// 									src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968"
// 									alt="Featured Article"
// 									fill
// 									className="object-cover transition-transform duration-300 group-hover:scale-105"
// 								/>
// 							</div>
// 							<span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full mb-4 inline-block">
// 								Featured
// 							</span>
// 							<h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 mb-4">
// 								The Evolution of Digital Art in the Modern Era
// 							</h3>
// 							<p className="text-gray-600 mb-4 line-clamp-3">
// 								Exploring how digital technologies have transformed the art world and opened new possibilities for creative expression. 
// 								From NFTs to AI-generated artwork, discover how artists are pushing the boundaries of creativity in the digital age.
// 							</p>
// 							<div className="flex items-center gap-4 text-gray-500 text-sm">
// 								<div className="flex items-center gap-2">
// 									<ClockIcon className="w-4 h-4" />
// 									<span>5 min read</span>
// 								</div>
// 								<div className="flex items-center gap-2">
// 									<CalendarIcon className="w-4 h-4" />
// 									<span>Mar 15, 2024</span>
// 								</div>
// 							</div>
// 						</Link>
// 					</div>

// 					{/* Regular Articles - Cột 2 */}
// 					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
// 						{[
// 							{
// 								id: 1,
// 								title: "Understanding Color Theory in Contemporary Art",
// 								excerpt: "A deep dive into how modern artists use color to convey emotion and meaning.",
// 								image: "https://images.unsplash.com/photo-1579783483458-83d02161294e",
// 								readTime: "4 min",
// 								date: "Mar 14, 2024",
// 								category: "Theory"
// 							},
// 							{
// 								id: 2,
// 								title: "Emerging Artists to Watch in 2024",
// 								excerpt: "Discover the rising stars shaping the future of contemporary art.",
// 								image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912",
// 								readTime: "3 min",
// 								date: "Mar 13, 2024",
// 								category: "Artists"
// 							},
// 							{
// 								id: 3,
// 								title: "The Impact of AI on Modern Art Creation",
// 								excerpt: "How artificial intelligence is revolutionizing artistic expression.",
// 								image: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208",
// 								readTime: "6 min",
// 								date: "Mar 12, 2024",
// 								category: "Technology"
// 							},
// 							{
// 								id: 4,
// 								title: "Sustainable Art: Creating with Purpose",
// 								excerpt: "Exploring eco-friendly approaches in contemporary art practices.",
// 								image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1",
// 								readTime: "4 min",
// 								date: "Mar 11, 2024",
// 								category: "Sustainability"
// 							},
// 							{
// 								id: 5,
// 								title: "Art Collection: A Beginner's Guide",
// 								excerpt: "Essential tips for starting your own art collection journey.",
// 								image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66",
// 								readTime: "5 min",
// 								date: "Mar 10, 2024",
// 								category: "Collecting"
// 							},
// 							{
// 								id: 6,
// 								title: "Virtual Galleries: The Future of Art Exhibition",
// 								excerpt: "How digital spaces are transforming art presentation and access.",
// 								image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912",
// 								readTime: "4 min",
// 								date: "Mar 9, 2024",
// 								category: "Digital"
// 							}
// 						].map(article => (
// 							<Link 
// 								href={`/articles/${article.id}`} 
// 								key={article.id}
// 								className="group"
// 							>
// 								<div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-3">
// 									<Image
// 										src={article.image}
// 										alt={article.title}
// 										fill
// 										className="object-cover transition-transform duration-300 group-hover:scale-105"
// 									/>
// 								</div>
// 								<span className="text-xs font-medium text-blue-600 mb-2 block">
// 									{article.category}
// 								</span>
// 								<h3 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-2">
// 									{article.title}
// 								</h3>
// 								<p className="text-sm text-gray-500 line-clamp-2 mb-2">
// 									{article.excerpt}
// 								</p>
// 								<div className="flex items-center gap-4 text-xs text-gray-400">
// 									<span>{article.readTime} read</span>
// 									<span>{article.date}</span>
// 								</div>
// 							</Link>
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 		</section>
// 	);
// };

// // Main Page Component
// export default async function Home() {
// 	const session = await getSession();
// 	console.log(session, 'session');

// 	return (
// 		<div className='min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]'>
// 			<main className='flex-1 w-full'>
// 				<FeaturedSection />

// 				<div className="w-full bg-white py-24">
// 					<ExhibitionSection
// 						title="Trending art exhibitions."
// 						description="Experience this trending exhibition featuring contemporary artworks that challenge conventional perspectives."
// 						dateRange="March 15 - April 30, 2024"
// 					/>

// 					<ExhibitionSection
// 						title="New art exhibitions."
// 						description="Discover this newly launched exhibition showcasing emerging talent and innovative artistic expressions."
// 						dateRange="April 1 - May 15, 2024"
// 					/>
// 				</div>
// 				<RecommendationSection />
// 				<ArtistSpotlight />
// 				<TrendingArtistsSection />
// 				<ArticleSection />
// 			</main>
// 			{/* <Footer /> */}
// 		</div>
// 	);
// }
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function RootPage() {
	const user = await getCurrentUser();
	if (user) {
		redirect('/home');
	}
	redirect('/about');
}