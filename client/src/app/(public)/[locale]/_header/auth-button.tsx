'use client';
import HeaderButton from '@/app/(public)/[locale]/_header/components/header-button';
import { DropdownItemWithIcon } from '@/app/(public)/[locale]/_header/components/header-dropdown';
import Notification from '@/app/(public)/[locale]/_header/notification';
import SignOutItem from '@/app/(public)/[locale]/_header/sign-out-item';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import useUserProfile from '@/hooks/useUserProfile';
import {
	BookOpen,
	CircleUserRoundIcon,
	Key,
	Palette,
	SquareChartGantt,
	UserRoundPen,
	WalletMinimal,
	Warehouse
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import CustomDropdown from '@/components/ui.custom/custom-dropdown';
import useAuthClient from '@/hooks/useAuth-client';

export default function AuthButton() {
	const t = useTranslations('header');
	const tCommon = useTranslations('common');
	const { status } = useAuthClient();
	const { data: user, isLoading } = useUserProfile();

	if (status === 'loading' || isLoading) {
		return (
			<div className='flex flex-row space-x-2'>
				{/* Notification skeleton */}
				<Skeleton className='w-10 h-10 rounded-full flex items-center justify-center'>
					<div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 opacity-30"></div>
				</Skeleton>

				{/* Avatar skeleton with better visual representation */}
				<Skeleton className='w-10 h-10 rounded-full flex items-center justify-center'>
					<div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 opacity-30"></div>
				</Skeleton>
			</div>
		);
	}

	if (status === 'unauthenticated' || !user) {
		return (
			<Link
				href={`/sign-in`}
				className='inline-flex items-center justify-center px-4 py-2 min-w-[100px] h-10 rounded-3xl 
					bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
					text-white font-medium transition-colors duration-200 ease-in-out
					focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
				aria-label={tCommon('signin')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="mr-2"
				>
					<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
					<circle cx="12" cy="7" r="4"></circle>
				</svg>
				{tCommon('signin')}
			</Link>
		);
	}

	return (
		<div className='flex flex-row space-x-2'>
			<Notification />
			<CustomDropdown
				trigger={
					<HeaderButton
						isGradient
						isArtist={user.role.includes('artist')}
						isPremium={user.role.includes('premium')}
					>
						<Avatar className="w-full h-full">
							<AvatarImage src={user.image || '/default-avatar.png'} />
						</Avatar>
					</HeaderButton>
				}
			>
				<div className='w-60 flex flex-col'>
					<DropdownItemWithIcon
						icon={<CircleUserRoundIcon className='w-6 h-6' />}
						text={t('profile')}
						href='/settings/profile'
					/>
					<DropdownItemWithIcon
						icon={<Key className='w-6 h-6' />}
						text={t('become_artist')}
						href='/settings'
					/>
					<DropdownItemWithIcon
						icon={<Warehouse className='w-6 h-6' />}
						text={t('artwork_warehouse')}
						href='/Artwork-warehouse'
					/>
					{user.role.includes('artist') && (
						<>
							<DropdownItemWithIcon
								icon={<UserRoundPen className='w-6 h-6' />}
								text={t('artists')}
								href='/artists'
							/>
							<DropdownItemWithIcon
								icon={<Palette className='w-6 h-6' />}
								text={t('creator')}
								href='/creator'
							/>
							<DropdownItemWithIcon
								icon={<BookOpen className='w-6 h-6' />}
								text={t('my_blogs')}
								href='/my-blogs'
							/>
						</>
					)}

					<DropdownItemWithIcon
						icon={<WalletMinimal className='w-6 h-6' />}
						text={t('wallet')}
						href='/wallet'
					/>
					{/* <DropdownItemWithIcon
						icon={<MessageCircle className='w-6 h-6' />}
						text={t('messages')}
						href='/messages'
					/> */}
					<DropdownItemWithIcon
						icon={<SquareChartGantt className='w-6 h-6' />}
						text='My Events'
						href='/my-events'
					/>

					<Separator className='mt-6' />

					<SignOutItem dropdown />
				</div>
			</CustomDropdown>
		</div>
	);
}
