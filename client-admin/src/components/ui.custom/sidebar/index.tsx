// components/sidebar/index.tsx
'use client';

import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import menuItems from './menu-items';
import SidebarItem from './sidebar-item';
import { UserInfo, UserInfoSkeleton } from './user-info';

export default function Sidebar() {
	const [isMobile, setIsMobile] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Animation variants
	const sidebarVariants = {
		hidden: { x: '-100%', opacity: 0 },
		visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
	};

	const bottomBarVariants = {
		hidden: { y: '100%', opacity: 0 },
		visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
	};

	// Mobile layout (Bottom Bar)
	if (isMobile) {
		return (
			<motion.div
				variants={bottomBarVariants}
				initial="hidden"
				animate="visible"
				className="fixed bottom-0 left-0 right-0 z-40 shadow-lg border-t border-gray-200 dark:border-gray-800 flex justify-around items-center py-2 px-4 md:hidden bg-gray-50 dark:bg-gray-900"
			>
				{menuItems.slice(0, 4).map((item) => (
					<SidebarItem
						key={item.href}
						item={item}
						isActive={pathname === item.href}
						isMobile={true}
					/>
				))}
				<div className="flex items-center">
					<Suspense fallback={<UserInfoSkeleton />}>
						<UserInfo isMobile={true} />
					</Suspense>
				</div>
			</motion.div>
		);
	}

	// Desktop layout (Sidebar)
	return (
		<motion.nav
			variants={sidebarVariants}
			initial="hidden"
			animate="visible"
			className="hidden md:block w-64 h-screen fixed left-0 top-0 shadow-md border-r border-gray-100 dark:border-gray-800 flex flex-col bg-gray-50 dark:bg-gray-900"
		>
			<div className="flex flex-col h-full p-4">
				{/* Logo */}
				<Link href="/" className="flex justify-center items-center mb-6">
					<motion.img
						src="/logo.svg"
						alt="Next.js logo"
						width={100}
						height={42}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.1, duration: 0.3 }}
						className="[filter:invert(72%)_sepia(87%)_saturate(4090%)_hue-rotate(301deg)_brightness(104%)_contrast(101%)] dark:invert"
					/>
				</Link>
				<Separator className="w-full mb-4 bg-gray-200 dark:bg-gray-700" />

				{/* Menu Items */}
				<div className="flex-1 overflow-hidden">
					<ScrollArea className="h-full w-full pr-2">
						<ul className="space-y-1">
							{menuItems.map((item) => (
								<SidebarItem
									key={item.href}
									item={item}
									isActive={
										pathname === item.href ||
										(item.children &&
											item.children.some((child) => pathname.startsWith(child.href)))
									}
									isMobile={false}
								/>
							))}
						</ul>
					</ScrollArea>
				</div>

				{/* User Info */}
				<Separator className="w-full mt-4 mb-4 bg-gray-200 dark:bg-gray-700" />
				<div className="mt-auto">
					<Suspense fallback={<UserInfoSkeleton />}>
						<UserInfo isMobile={false} />
					</Suspense>
				</div>
			</div>
		</motion.nav>
	);
}