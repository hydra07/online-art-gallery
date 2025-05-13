// components/sidebar/user-info.tsx
'use client';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';
import useAuthClient from '@/hooks/useAuth-client';
import { signIn, signOut } from 'next-auth/react';
import NProgress from 'nprogress';
import { Skeleton } from '@/components/ui/skeleton';

export function UserInfo({ isMobile }: { isMobile: boolean }) {
	const { user, status } = useAuthClient();

	// Animation variants
	const avatarVariants = {
		initial: { scale: 0, opacity: 0 },
		animate: {
			scale: 1,
			opacity: 1,
			transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
		},
		hover: { scale: 1.15, rotate: 10, transition: { duration: 0.25, ease: 'easeInOut' } },
	};

	const frameVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: 0.7,
			scale: 1,
			transition: { duration: 0.4, ease: 'easeOut' },
		},
	};

	const dropdownVariants = {
		hidden: { opacity: 0, y: -20, scale: 0.9 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
		},
		exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
	};

	const handleSignIn = async () => {
		NProgress.start();
		await signIn('google', { callbackUrl: '/dashboard' });
		NProgress.done();
	};

	const handleSignOut = async () => {
		NProgress.start();
		await signOut({ callbackUrl: '/', redirect: true });
		NProgress.done();
	};

	// Mobile: Avatar với logout khi đã đăng nhập
	if (isMobile) {
		if (status === 'unauthenticated' || !user) {
			return (
				<motion.div
					variants={avatarVariants}
					initial="initial"
					animate="animate"
					whileHover="hover"
					onClick={handleSignIn}
					className="relative cursor-pointer"
				>
					<Avatar className="h-10 w-10 ring-2 ring-pink-500/50 transition-all duration-300 hover:ring-pink-500">
						<AvatarFallback className="bg-gradient-to-br from-pink-100 to-pink-500/20 text-pink-500 dark:text-pink-200 font-semibold text-base">
							?
						</AvatarFallback>
					</Avatar>
					<motion.div
						variants={frameVariants}
						initial="hidden"
						whileHover="visible"
						className="absolute inset-0 -m-1 rounded-full bg-gradient-to-br from-pink-100/50 to-transparent dark:from-pink-500/30"
					/>
				</motion.div>
			);
		}

		const initials = user.name
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase();

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<motion.div
						variants={avatarVariants}
						initial="initial"
						animate="animate"
						whileHover="hover"
						className="relative cursor-pointer"
					>
						<Avatar className="h-10 w-10 ring-2 ring-pink-500/50 transition-all duration-300 hover:ring-pink-500">
							<AvatarImage src={user.image} alt={user.name} />
							<AvatarFallback className="bg-gradient-to-br from-pink-500 to-pink-100 text-white dark:text-pink-100 font-semibold">
								{initials}
							</AvatarFallback>
						</Avatar>
						<motion.div
							variants={frameVariants}
							initial="hidden"
							whileHover="visible"
							className="absolute inset-0 -m-1 rounded-full bg-gradient-to-br from-pink-100/50 to-transparent dark:from-pink-500/30"
						/>
					</motion.div>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-48 p-2 shadow-lg rounded-xl border border-pink-100 dark:border-pink-500/30 bg-pink-50 dark:bg-pink-900/20"
					align="center"
					forceMount
				>
					<motion.div
						variants={dropdownVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
					>
						<DropdownMenuItem
							onClick={handleSignOut}
							className="px-3 py-2 hover:bg-pink-100 dark:hover:bg-pink-500/30 text-pink-600 dark:text-pink-200 rounded-lg transition-colors duration-200 cursor-pointer"
						>
							<LogOut className="mr-2 h-4 w-4" />
							<span className="text-sm font-medium">Log out</span>
						</DropdownMenuItem>
					</motion.div>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	// Desktop: Full UserInfo
	if (status === 'unauthenticated' || !user) {
		return (
			<motion.div className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors duration-200">
				<motion.div
					variants={avatarVariants}
					initial="initial"
					animate="animate"
					whileHover="hover"
					onClick={handleSignIn}
					className="relative cursor-pointer"
				>
					<Avatar className="h-11 w-11 ring-2 ring-pink-500/50 transition-all duration-300 hover:ring-pink-500">
						<AvatarFallback className="bg-gradient-to-br from-pink-100 to-pink-500/20 text-pink-500 dark:text-pink-200 font-semibold text-lg">
							?
						</AvatarFallback>
					</Avatar>
					<motion.div
						variants={frameVariants}
						initial="hidden"
						whileHover="visible"
						className="absolute inset-0 -m-1 rounded-full bg-gradient-to-br from-pink-100/50 to-transparent dark:from-pink-500/30"
					/>
				</motion.div>
				<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
					<Button
						variant="outline"
						className="flex-1 py-2.5 px-4 text-sm font-medium text-pink-500 dark:text-pink-200 border-pink-500/50 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-500/30 hover:text-pink-600 dark:hover:text-pink-100 transition-colors duration-200"
						onClick={handleSignIn}
					>
						Sign In
					</Button>
				</motion.div>
			</motion.div>
		);
	}

	const initials = user.name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase();

	return (
		<motion.div className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors duration-200">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="relative h-11 w-11 rounded-full p-0 hover:bg-pink-100 dark:hover:bg-pink-500/30"
					>
						<motion.div
							variants={avatarVariants}
							initial="initial"
							animate="animate"
							whileHover="hover"
							className="relative"
						>
							<Avatar className="h-11 w-11 ring-2 ring-pink-500/50 transition-all duration-300 hover:ring-pink-500">
								<AvatarImage src={user.image} alt={user.name} />
								<AvatarFallback className="bg-gradient-to-br from-pink-500 to-pink-100 text-white dark:text-pink-100 font-semibold transition-all duration-200 hover:from-pink-600 hover:to-pink-200">
									{initials}
								</AvatarFallback>
							</Avatar>
							<motion.div
								variants={frameVariants}
								initial="hidden"
								whileHover="visible"
								className="absolute inset-0 -m-1 rounded-full bg-gradient-to-br from-pink-100/50 to-transparent dark:from-pink-500/30"
							/>
						</motion.div>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-64 p-2 shadow-lg rounded-xl border border-pink-100 dark:border-pink-500/30 bg-pink-50 dark:bg-pink-900/20"
					align="end"
					forceMount
				>
					<motion.div
						variants={dropdownVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
					>
						<DropdownMenuLabel className="font-normal px-3 py-2">
							<div className="flex flex-col space-y-1.5">
								<p className="text-sm font-semibold text-pink-600 dark:text-pink-100">
									{user.name}
								</p>
								<p className="text-xs text-pink-500 dark:text-pink-200 truncate">
									{user.email}
								</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator className="bg-pink-100 dark:bg-pink-500/30" />
						<DropdownMenuItem className="px-3 py-2 hover:bg-pink-100 dark:hover:bg-pink-500/30 rounded-lg transition-colors duration-200 cursor-pointer">
							<User className="mr-2 h-4 w-4 text-pink-500 dark:text-pink-200" />
							<span className="text-sm text-pink-600 dark:text-pink-100">Profile</span>
						</DropdownMenuItem>
						<DropdownMenuItem className="px-3 py-2 hover:bg-pink-100 dark:hover:bg-pink-500/30 rounded-lg transition-colors duration-200 cursor-pointer">
							<Settings className="mr-2 h-4 w-4 text-pink-500 dark:text-pink-200" />
							<span className="text-sm text-pink-600 dark:text-pink-100">Settings</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator className="bg-pink-100 dark:bg-pink-500/30" />
						<DropdownMenuItem
							onClick={handleSignOut}
							className="px-3 py-2 hover:bg-pink-100 dark:hover:bg-pink-500/30 text-pink-600 dark:text-pink-200 rounded-lg transition-colors duration-200 cursor-pointer"
						>
							<LogOut className="mr-2 h-4 w-4" />
							<span className="text-sm font-medium">Log out</span>
						</DropdownMenuItem>
					</motion.div>
				</DropdownMenuContent>
			</DropdownMenu>
			<div className="flex flex-col justify-center">
				<p className="text-sm font-semibold text-pink-600 dark:text-pink-100 leading-tight">
					{user.name}
				</p>
				<p className="text-xs text-pink-500 dark:text-pink-200 truncate max-w-[150px]">
					{user.email}
				</p>
			</div>
		</motion.div>
	);
}

export function UserInfoSkeleton() {
	return (
		<div className="flex items-center gap-3 p-3">
			<Skeleton
				className="h-11 w-11 rounded-full bg-gradient-to-r from-pink-100 to-pink-500/20 dark:from-pink-500/30 dark:to-pink-900/20 animate-pulse ring-1 ring-pink-500/20 dark:ring-pink-400/30"
			/>
			<div className="flex flex-col gap-2">
				<Skeleton
					className="h-4 w-24 bg-gradient-to-r from-pink-100 to-pink-500/20 dark:from-pink-500/30 dark:to-pink-900/20 animate-[pulse_1.5s_ease-in-out_infinite]"
				/>
				<Skeleton
					className="h-3 w-32 bg-gradient-to-r from-pink-500/20 to-pink-100 dark:from-pink-500/40 dark:to-pink-900/20 animate-[pulse_1.5s_ease-in-out_infinite]"
				/>
			</div>
		</div>
	);
}