'use client';

import { useState } from 'react';
import { getUserProfile, followUser, unfollowUser } from '@/service/user';
import collectionService from '@/service/collection-service';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTranslations, useLocale } from 'next-intl';
import {
	Calendar,
	Mail,
	UserCheck,
	UserPlus,
	Star,
	FolderOpen,
	Users,
	Info,
	FileText,
	MessageSquare,
	ImageOff,
	Eye,
	Album,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileSkeleton } from '../../settings/profile/components/profile-skeleton';
import { useSession } from 'next-auth/react';
import { getByArtistId } from '@/service/artwork';
import Image from 'next/image';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface BaseUser {
	_id: string;
	name: string;
	email: string;
	image?: string;
	role: string[];
	createdAt: string;
	provider: string;
	providerId?: string;
	phone: string;
}

interface ArtistProfile {
	bio?: string;
	genre?: string[] | string;
	experience?: string;
	socialLinks?: {
		instagram?: string;
		twitter?: string;
		website?: string;
	};
}

interface Artwork {
	_id: string;
	title: string;
	url: string;
}

interface Collection {
	_id: string;
	userId: string;
	title: string;
	description: string;
	artworks?: Artwork[];
	createdAt: string;
	updatedAt: string;
}

interface User extends BaseUser {
	artworksCount: number;
	artistProfile: ArtistProfile | null;
	following: BaseUser[];
	followers: BaseUser[];
}

interface UserProfileResponse {
	user: User;
	isFollowing: boolean;
}

interface APIUserResponse extends BaseUser {
	artworksCount?: number;
	artistProfile?: ArtistProfile;
	following?: BaseUser[];
	followers?: BaseUser[];
}

interface APIResponse {
	user: APIUserResponse;
	isFollowing: boolean;
}

export default function UserProfileContent({ userId }: { userId: string }) {
	const t = useTranslations('profile');
	const tCommon = useTranslations('profile.common');
	const locale = useLocale();
	const { data: currentUser } = useSession();
	const accessToken = currentUser?.user.accessToken;
	const [activeTab, setActiveTab] = useState("about");
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
	const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

	// Sử dụng useQuery để fetch user profile
	const { data: userProfileData, isLoading } = useQuery<UserProfileResponse, Error>({
		queryKey: ['userProfile', userId],
		queryFn: async () => {
			const response = await getUserProfile(userId) as APIResponse;

			const userData: User = {
				...response.user,
				artworksCount: response.user.artworksCount || 0,
				artistProfile: response.user.artistProfile || null,
				following: response.user.following || [],
				followers: response.user.followers || []
			};
			return {
				user: userData,
				isFollowing: response.isFollowing
			};
		},
	});

	// Update the collections query to use the new endpoint
	const { data: collectionsData, isLoading: isLoadingCollections } = useQuery({
		queryKey: ['userCollections', userId],
		queryFn: async () => {
			const response = await collectionService.getByOtherUserId(userId);
			return response.data || [];
		},
		enabled: !!userId, // Only run query if we have a userId
	});

	// Mutation cho follow/unfollow
	const followMutation = useMutation({
		mutationFn: () => followUser(accessToken!, userId),
		onSuccess: () => {
			toast({
				title: t('toast.followed'),
				description: t('toast.followed_description'),
			});
			queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
		},
		onError: () => {
			toast({
				title: t('toast.operation_failed'),
			});
		}
	});

	const unfollowMutation = useMutation({
		mutationFn: () => unfollowUser(accessToken!, userId),
		onSuccess: () => {
			toast({
				title: t('toast.unfollowed')
			});
			queryClient.invalidateQueries({
				queryKey: ['userProfile', userId]
			});
		},
		onError: () => {
			toast({
				title: t('toast.operation_failed')
			});
		}
	});

	const handleFollow = async () => {
		if (!accessToken) {
			toast({
				title: t('toast.login_required')
			});
			return;
		}

		if (userProfileData?.isFollowing) {
			unfollowMutation.mutate();
		} else {
			followMutation.mutate();
		}
	};

	// Add this near the other queries
	const { data: artworksData } = useQuery({
		queryKey: ['artistArtworks', userId],
		queryFn: async () => {
			if (!userProfileData?.user?.role?.includes('artist')) return null;
			const response = await getByArtistId(userId, {
				skip: 0,
				take: 0,
			});
			return response.data?.artworks || [];
		},
		enabled: !!accessToken && !!userProfileData?.user?.role?.includes('artist')
	});

	// Add this function to handle collection click
	const handleCollectionClick = (collection: Collection) => {
		setSelectedCollection(collection);
		setIsViewDialogOpen(true);
	};

	if (isLoading) {
		return <ProfileSkeleton />;
	}

	const user = userProfileData?.user;
	const isArtist = user?.role?.includes('artist');
	const genres = Array.isArray(user?.artistProfile?.genre)
		? user?.artistProfile?.genre
		: user?.artistProfile?.genre
			? [user?.artistProfile?.genre]
			: [];

	return (
		<div className="max-w-7xl mx-auto px-4 mt-12">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
				{/* Sidebar Profile Section */}
				<div className="md:col-span-4 lg:col-span-3 space-y-6">
					<div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
						{/* Avatar */}
						<div className="flex flex-col items-center space-y-3">
							<Avatar className="h-24 w-24">
								<AvatarImage src={user?.image || '/default-avatar.png'} alt={user?.name} />
								<AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
							</Avatar>
							<h1 className="text-2xl font-bold text-center">{user?.name}</h1>

							{/* Badges */}
							<div className="flex flex-wrap gap-2 justify-center">
								{isArtist && (
									<Badge
										variant="secondary"
										className="bg-purple-100 text-purple-800 hover:bg-purple-200"
									>
										{tCommon('artist_badge')}
									</Badge>
								)}
							</div>
						</div>

						{/* Action Buttons */}
						<div className="space-y-2 pt-2">
							{currentUser && currentUser.user.id !== userId && (
								<Button
									variant={userProfileData?.isFollowing ? "outline" : "default"}
									onClick={handleFollow}
									className="w-full"
								>
									{userProfileData?.isFollowing ? (
										<>
											<UserCheck className="mr-2 h-4 w-4" />
											{t('view.following')}
										</>
									) : (
										<>
											<UserPlus className="mr-2 h-4 w-4" />
											{t('view.follow')}
										</>
									)}
								</Button>
							)}
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200">
							<div className="text-center">
								<p className="text-xl font-bold text-purple-600">
									{user?.artworksCount || 0}
								</p>
								<p className="text-gray-600 text-xs">{tCommon('artworks')}</p>
							</div>
							<div className="text-center">
								<p className="text-xl font-bold text-pink-600">
									{user?.followers?.length || 0}
								</p>
								<p className="text-gray-600 text-xs">{tCommon('followers')}</p>
							</div>
							<div className="text-center">
								<p className="text-xl font-bold text-purple-600">
									{user?.following?.length || 0}
								</p>
								<p className="text-gray-600 text-xs">{tCommon('following')}</p>
							</div>
						</div>
					</div>

					{/* Navigation Menu */}
					<div className="bg-white rounded-lg shadow-sm overflow-hidden">
						<nav className="flex flex-col">
							<button
								onClick={() => setActiveTab("about")}
								className={`px-6 py-3 text-left flex items-center ${activeTab === "about"
									? "bg-purple-50 border-l-4 border-purple-500 text-purple-700"
									: "hover:bg-gray-50"
									}`}
							>
								<Info className="w-4 h-4 mr-3" />
								<span>{t('view.about')}</span>
							</button>
							<button
								onClick={() => setActiveTab("collections")}
								className={`px-6 py-3 text-left flex items-center ${activeTab === "collections"
									? "bg-purple-50 border-l-4 border-purple-500 text-purple-700"
									: "hover:bg-gray-50"
									}`}
							>
								<FolderOpen className="w-4 h-4 mr-3" />
								<span>{t("view.collections")}</span>
							</button>
							<button
								onClick={() => setActiveTab("followers")}
								className={`px-6 py-3 text-left flex items-center ${activeTab === "followers"
									? "bg-purple-50 border-l-4 border-purple-500 text-purple-700"
									: "hover:bg-gray-50"
									}`}
							>
								<Users className="w-4 h-4 mr-3" />
								<span>{t('view.followers_title')}</span>
							</button>
							<button
								onClick={() => setActiveTab("following")}
								className={`px-6 py-3 text-left flex items-center ${activeTab === "following"
									? "bg-purple-50 border-l-4 border-purple-500 text-purple-700"
									: "hover:bg-gray-50"
									}`}
							>
								<UserCheck className="w-4 h-4 mr-3" />
								<span>{t('view.following_title')}</span>
							</button>
							{isArtist && (
								<button
									onClick={() => setActiveTab("artist")}
									className={`px-6 py-3 text-left flex items-center ${activeTab === "artist"
										? "bg-purple-50 border-l-4 border-purple-500 text-purple-700"
										: "hover:bg-gray-50"
										}`}
								>
									<Star className="w-4 h-4 mr-3" />
									<span>{t('view.artist_info')}</span>
								</button>
							)}

						</nav>
					</div>
				</div>

				{/* Main Content Area */}
				<div className="md:col-span-8 lg:col-span-9">
					{/* Tab Content */}
					<div className="bg-white rounded-lg shadow-sm p-8">
						{/* About Tab */}
						{activeTab === "about" && (
							<div className="space-y-6">
								<h2 className="text-2xl font-bold border-b pb-2">{t('view.about')}</h2>

								{/* Cover Image và Thông tin nổi bật */}
								<div className="relative w-full h-64 overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-purple-100 to-pink-100">
									{/* Ảnh bìa từ avatar */}
									{user?.image && (
										<div className="absolute inset-0 w-full h-full">
											<div
												className="w-full h-full bg-center bg-no-repeat bg-cover"
												style={{
													backgroundImage: `url(${user?.image})`,
													filter: 'blur(2px)',
													transform: 'scale(1.1)',
													opacity: '0.8'
												}}
											></div>
											{/* Lớp gradient phủ */}
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
										</div>
									)}
								</div>
								<div className="space-y-6">
									<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
										<h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center border-b pb-2">
											<MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
											{t('view.contact_info')}
										</h3>
										<div className="space-y-4">
											<div className="flex items-start">
												<div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
													<Mail className="w-5 h-5 text-purple-600" />
												</div>
												<div className="ml-3">
													<p className="text-sm font-medium text-gray-900">Email</p>
													<p className="text-sm text-gray-500">{user?.email}</p>
												</div>
											</div>
											<div className="flex items-start">
												<div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
													<Calendar className="w-5 h-5 text-purple-600" />
												</div>
												<div className="ml-3">
													<p className="text-sm font-medium text-gray-900">{t('view.joined_date')}</p>
													<p className="text-sm text-gray-500">
														{new Date(user?.createdAt || '').toLocaleDateString(
															locale,
															{
																day: "numeric",
																month: "long",
																year: "numeric",
															}
														)}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Followers Tab */}
						{activeTab === "followers" && (
							<div className="space-y-6">
								<h2 className="text-2xl font-bold border-b pb-2">{t('view.followers_title')}</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{(user?.followers || []).length > 0 ? (
										user?.followers?.map((follower: { _id: string; name: string; email: string; image?: string }) => (
											<div
												key={follower._id}
												className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
											>
												<div className="flex items-center space-x-4">
													<Avatar className="h-12 w-12">
														<AvatarImage src={follower.image || '/default-avatar.png'} alt={follower.name} />
														<AvatarFallback>{follower.name.substring(0, 2).toUpperCase()}</AvatarFallback>
													</Avatar>
													<div>
														<h3 className="font-semibold">{follower.name}</h3>
														<p className="text-sm text-gray-600">{follower.email}</p>
													</div>
												</div>
												<Button
													size="sm"
													variant="outline"
													onClick={() => window.location.href = `/profile/${follower._id}`}
												>
													{t('view.view_profile')}
												</Button>
											</div>
										))
									) : (
										<div className="col-span-full text-center py-8">
											<Users className="mx-auto h-12 w-12 text-gray-400" />
											<h3 className="mt-2 text-sm font-semibold text-gray-900">{t('view.no_followers')}</h3>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Following Tab */}
						{activeTab === "following" && (
							<div className="space-y-6">
								<h2 className="text-2xl font-bold border-b pb-2">{t('view.following_title')}</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{(user?.following || []).length > 0 ? (
										user?.following?.map((following: { _id: string; name: string; email: string; image?: string }) => (
											<div
												key={following._id}
												className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
											>
												<div className="flex items-center space-x-4">
													<Avatar className="h-12 w-12">
														<AvatarImage src={following.image || '/default-avatar.png'} alt={following.name} />
														<AvatarFallback>{following.name.substring(0, 2).toUpperCase()}</AvatarFallback>
													</Avatar>
													<div>
														<h3 className="font-semibold">{following.name}</h3>
														<p className="text-sm text-gray-600">{following.email}</p>
													</div>
												</div>
												<Button
													size="sm"
													variant="outline"
													onClick={() => window.location.href = `/profile/${following._id}`}
												>
													{t('view.view_profile')}
												</Button>
											</div>
										))
									) : (
										<div className="col-span-full text-center py-8">
											<UserCheck className="mx-auto h-12 w-12 text-gray-400" />
											<h3 className="mt-2 text-sm font-semibold text-gray-900">{t('view.no_following')}</h3>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Artist Tab */}
						{activeTab === "artist" && isArtist && (
							<div className="space-y-6">
								<h2 className="text-2xl font-bold border-b pb-2">{t('view.artist_info')}</h2>
								<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
									{user?.artistProfile ? (
										<div className="space-y-6">
											{user?.artistProfile?.bio && (
												<div>
													<h4 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
														<FileText className="w-5 h-5 mr-2 text-purple-500" />
														{t('view.biography')}
													</h4>
													<div className="text-gray-700 bg-gray-50 p-4 rounded-lg" dangerouslySetInnerHTML={{ __html: user.artistProfile.bio || '' }} />
												</div>
											)}

											{genres && genres.length > 0 && (
												<div>
													<h4 className='text-lg font-semibold mb-2 text-gray-800 flex items-center'>
														<Star className='w-5 h-5 mr-2 text-purple-500' />
														{t('view.genre')}
													</h4>
													<div className='flex flex-wrap gap-2'>
														{genres.map(
															(
																genre: string,
																index: number
															) => (
																<Badge
																	key={index}
																	variant='secondary'
																	className='bg-purple-100 text-purple-800 hover:bg-purple-200 py-1 px-3 text-sm'
																>
																	{genre}
																</Badge>
															)
														)}
													</div>
												</div>
											)}

											{user.artistProfile.experience && (
												<div>
													<h4 className='text-lg font-semibold mb-2 text-gray-800 flex items-center'>
														<Calendar className='w-5 h-5 mr-2 text-purple-500' />
														{t('view.experience')}
													</h4>
													<p className='text-gray-700 bg-gray-50 p-4 rounded-lg'>
														{
															user.artistProfile
																.experience
														}
													</p>
												</div>
											)}

											{user.artistProfile.socialLinks && (
												<div>
													<h4 className='text-lg font-semibold mb-2 text-gray-800 flex items-center'>
														<MessageSquare className='w-5 h-5 mr-2 text-purple-500' />
														{t('view.social_links')}
													</h4>
													<div className='bg-gray-50 p-4 rounded-lg space-y-2'>
														{user.artistProfile
															.socialLinks
															.instagram && (
																<div className='flex items-center gap-2'>
																	<span className='text-sm font-medium'>
																		Instagram:
																	</span>
																	<a
																		href={`https://instagram.com/${user.artistProfile.socialLinks.instagram}`}
																		target='_blank'
																		rel='noopener noreferrer'
																		className='text-sm text-blue-500 hover:underline'
																	>
																		{
																			user
																				.artistProfile
																				.socialLinks
																				.instagram
																		}
																	</a>
																</div>
															)}

														{user.artistProfile
															.socialLinks
															.twitter && (
																<div className='flex items-center gap-2'>
																	<span className='text-sm font-medium'>
																		Twitter:
																	</span>
																	<a
																		href={`https://twitter.com/${user.artistProfile.socialLinks.twitter}`}
																		target='_blank'
																		rel='noopener noreferrer'
																		className='text-sm text-blue-500 hover:underline'
																	>
																		{
																			user
																				.artistProfile
																				.socialLinks
																				.twitter
																		}
																	</a>
																</div>
															)}

														{user.artistProfile
															.socialLinks
															.website && (
																<div className='flex items-center gap-2'>
																	<span className='text-sm font-medium'>
																		Website:
																	</span>
																	<a
																		href={
																			user
																				.artistProfile
																				.socialLinks
																				.website
																		}
																		target='_blank'
																		rel='noopener noreferrer'
																		className='text-sm text-blue-500 hover:underline'
																	>
																		{
																			user
																				.artistProfile
																				.socialLinks
																				.website
																		}
																	</a>
																</div>
															)}
													</div>
												</div>
											)}

											{/* Artist Albums/Collections */}
											<div className='mt-8'>
												<h4 className='text-lg font-semibold mb-4 text-gray-800 flex items-center border-b pb-2'>
													<Album className='w-5 h-5 mr-2 text-purple-500' />
													{t('view.artist_albums')}
												</h4>

												{isLoadingCollections ? (
													<div className="flex justify-center items-center h-32">
														<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
													</div>
												) : collectionsData && collectionsData.length > 0 ? (
													<ScrollArea className="h-[300px] pr-4 mb-8">
														<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
															{collectionsData.map((collection: Collection) => (
																<div
																	key={collection._id}
																	className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
																	onClick={() => handleCollectionClick(collection)}
																>
																	{/* Collection Preview */}
																	<div className="aspect-video relative bg-gray-50">
																		{collection.artworks && collection.artworks.length > 0 ? (
																			<div className="grid grid-cols-2 gap-1 p-2 h-full">
																				{collection.artworks.slice(0, 4).map((artwork) => (
																					<div
																						key={artwork._id}
																						className="relative rounded-md overflow-hidden bg-gray-100"
																					>
																						<Image
																							src={artwork.url}
																							alt={artwork.title}
																							fill
																							className="object-cover"
																							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
																						/>
																					</div>
																				))}
																			</div>
																		) : (
																			<div className="flex items-center justify-center h-full">
																				<FolderOpen className="w-8 h-8 text-gray-400" />
																			</div>
																		)}
																	</div>

																	{/* Collection Info */}
																	<div className="p-4">
																		<h3 className="font-semibold text-lg mb-1 truncate">
																			{collection.title}
																		</h3>
																		<p className="text-sm text-gray-600 line-clamp-2 mb-3">
																			{collection.description || t("view.no_description")}
																		</p>

																		<div className="flex justify-between items-center text-sm text-gray-500">
																			<span>{collection.artworks?.length || 0} {tCommon('artworks')}</span>
																			<span>{new Date(collection.createdAt).toLocaleDateString(locale)}</span>
																		</div>
																	</div>
																</div>
															))}
														</div>
													</ScrollArea>
												) : (
													<div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
														<FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
														<h3 className="mt-2 text-sm font-semibold text-gray-900">{t('view.no_collections')}</h3>
													</div>
												)}
											</div>

											{/* Tác phẩm của nghệ sĩ */}
											<div className='mt-8'>
												<h4 className='text-lg font-semibold mb-4 text-gray-800 flex items-center border-b pb-2'>
													<FolderOpen className='w-5 h-5 mr-2 text-purple-500' />
													{t('view.artist_artworks')}
												</h4>

												{/* Hiển thị tác phẩm */}
												{artworksData && artworksData.length > 0 ? (
													<ScrollArea className="h-[500px] pr-4">
														<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
															{artworksData.map((artwork) => (
																<div
																	key={artwork._id}
																	className="relative group overflow-hidden rounded-lg shadow-md aspect-square bg-gray-100 hover:shadow-xl transition-all duration-300"
																	onClick={() => window.location.href = `/artworks?id=${artwork._id}`}
																>
																	{/* Actual artwork image */}
																	<div className="relative w-full h-full">
																		<Image
																			src={artwork.url || '/placeholder-artwork.jpg'}
																			alt={artwork.title || tCommon('artwork')}
																			fill
																			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
																			className="object-cover"
																			quality={50} // Decrease image quality to 50%
																			priority={false}
																		/>
																	</div>

																	{/* Overlay khi hover */}
																	<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 hover:cursor-pointer flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
																		<span className="text-white font-medium text-sm px-3 py-2 rounded-full bg-purple-700 bg-opacity-80">
																			{t('view.view_detail')}
																		</span>
																	</div>
																</div>
															))}
														</div>
													</ScrollArea>
												) : (
													<div className="text-center py-8 bg-gray-50 rounded-lg">
														<FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
														<h3 className="mt-2 text-sm font-semibold text-gray-900">{t('view.no_artworks')}</h3>
													</div>
												)}
											</div>
										</div>
									) : (
										<div className="text-center py-8">
											<FileText className="mx-auto h-12 w-12 text-gray-400" />
											<h3 className="mt-2 text-sm font-semibold text-gray-900">{t('view.no_artist_info')}</h3>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Collections Tab */}
						{activeTab === "collections" && (
							<div className="space-y-6">
								<h2 className="text-2xl font-bold border-b pb-2">{t("view.collections")}</h2>
								<div className="bg-white rounded-xl p-6">
									{isLoadingCollections ? (
										<div className="flex justify-center items-center h-32">
											<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
										</div>
									) : collectionsData && collectionsData.length > 0 ? (
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{collectionsData.map((collection: Collection) => (
												<div
													key={collection._id}
													className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
													onClick={() => handleCollectionClick(collection)}
												>
													{/* Collection Preview */}
													<div className="aspect-video relative bg-gray-50">
														{collection.artworks && collection.artworks.length > 0 ? (
															<div className="grid grid-cols-2 gap-1 p-2 h-full">
																{collection.artworks.slice(0, 4).map((artwork) => (
																	<div
																		key={artwork._id}
																		className="relative rounded-md overflow-hidden bg-gray-100"
																	>
																		<Image
																			src={artwork.url}
																			alt={artwork.title}
																			fill
																			className="object-cover"
																			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
																		/>
																	</div>
																))}
															</div>
														) : (
															<div className="flex items-center justify-center h-full">
																<FolderOpen className="w-8 h-8 text-gray-400" />
															</div>
														)}
													</div>

													{/* Collection Info */}
													<div className="p-4">
														<h3 className="font-semibold text-lg mb-1 truncate">
															{collection.title}
														</h3>
														<p className="text-sm text-gray-600 line-clamp-2 mb-3">
															{collection.description || t("view.no_description")}
														</p>

														<div className="flex justify-between items-center text-sm text-gray-500">
															<span>{collection.artworks?.length || 0} {tCommon('artworks')}</span>
															<span>{new Date(collection.createdAt).toLocaleDateString(locale)}</span>
														</div>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="text-center py-12">
											<FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-medium text-gray-900 mb-2">
												{t("view.no_collections")}
											</h3>
											<p className="text-sm text-gray-600">
												{t("view.no_collections_description")}
											</p>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Collection Detail Dialog - Moved outside to be accessible from all tabs */}
			<Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
				<DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold break-words">
							{selectedCollection?.title}
						</DialogTitle>
						<p className="text-muted-foreground mt-2 break-words">
							{selectedCollection?.description || t("view.no_description")}
						</p>
						<p className="text-sm text-muted-foreground">
							{t("view.created_on")}{" "}
							{selectedCollection?.createdAt
								? new Date(selectedCollection.createdAt).toLocaleDateString(
									locale,
									{ year: "numeric", month: "long", day: "numeric" }
								)
								: ""}
						</p>
					</DialogHeader>

					<div className="my-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-medium">{tCommon('artworks')}</h3>
							<p className="text-sm text-muted-foreground">
								{selectedCollection?.artworks?.length || 0} {tCommon('artworks')}
							</p>
						</div>

						{selectedCollection?.artworks && selectedCollection.artworks.length > 0 ? (
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
								{selectedCollection.artworks.map((artwork) => (
									<div
										key={artwork._id}
										className="group aspect-square bg-muted rounded-lg overflow-hidden relative"
									>
										<Image
											src={artwork.url}
											alt={artwork.title}
											fill
											className="object-cover"
										/>
										
										{/* Hover overlay */}
										<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
											<p className="text-white text-sm font-medium text-center mb-2 line-clamp-2">
												{artwork.title}
											</p>
											<Button
												size="sm"
												variant="secondary"
												onClick={(e) => {
													e.stopPropagation();
													window.open(`/artworks?id=${artwork._id}`, '_blank');
												}}
											>
												<Eye className="w-4 h-4 mr-1" />
												{t("view.view_artwork")}
											</Button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-lg border border-dashed">
								<ImageOff className="w-12 h-12 text-muted-foreground mb-4" />
								<p className="text-lg font-medium mb-2">{t("view.no_artworks")}</p>
								<p className="text-muted-foreground text-center max-w-md">
									{t("view.no_artworks_description")}
								</p>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
