// components/sidebar/sidebar-item.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MenuItem {
	href: string;
	label: string;
	icon: LucideIcon;
	children?: MenuItem[];
}

interface SidebarItemProps {
	item: MenuItem;
	isActive: boolean | undefined;
	isMobile?: boolean;
}

export default function SidebarItem({
										item,
										isActive,
										isMobile = false,
									}: SidebarItemProps) {
	const [isOpen, setIsOpen] = useState(isActive);
	const Icon = item.icon;
	const pathname = usePathname();

	useEffect(() => {
		if (item.children) {
			setIsOpen(
				isActive ||
				item.children.some((child) => pathname.startsWith(child.href))
			);
		}
	}, [isActive, item.children, pathname]);

	const toggleOpen = () => {
		setIsOpen((prev) => !prev);
	};

	// Animation variants
	const itemVariants = {
		hover: { scale: 1.05, transition: { duration: 0.2, ease: 'easeOut' } },
		tap: { scale: 0.95, transition: { duration: 0.1 } },
	};

	const childrenVariants = {
		hidden: { opacity: 0, height: 0 },
		visible: {
			opacity: 1,
			height: 'auto',
			transition: { duration: 0.3, ease: 'easeOut' },
		},
	};

	const indicatorVariants = {
		inactive: {
			opacity: 0,
			...(isMobile ? { width: 0 } : { height: 0 }),
			transition: { duration: 0.2, ease: 'easeIn' },
		},
		preActive: {
			opacity: 0.5,
			...(isMobile ? { width: '60%' } : { height: '60%' }),
			transition: { duration: 0.2, ease: 'easeOut' },
		},
		active: {
			opacity: 1,
			...(isMobile ? { width: '80%' } : { height: '100%' }),
			transition: { duration: 0.3, ease: 'easeOut' },
		},
	};

	const activeClass = isActive
		? 'bg-pink-100 dark:bg-pink-900/30 text-pink-500 dark:text-pink-400 font-semibold'
		: 'text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-400 dark:hover:text-pink-300';

	const itemStyle = isMobile
		? `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors duration-200 ${activeClass}`
		: `flex items-center p-2 rounded-lg transition-colors duration-200 ${activeClass}`;

	const indicatorStyle = isMobile
		? 'absolute bottom-[-4px] left-1/2 -translate-x-1/2 h-1 bg-pink-500 dark:bg-pink-400 rounded-t-full'
		: 'absolute left-0 top-0 bottom-1 w-1 bg-pink-500 dark:bg-pink-400 rounded-r-md';

	if (item.children) {
		return (
			<li className="mb-2 list-none">
				<motion.button
					variants={itemVariants}
					whileHover="hover"
					whileTap="tap"
					onClick={toggleOpen}
					className={`relative w-full ${itemStyle}`}
				>
					<div
						className={
							isMobile ? 'flex flex-col items-center gap-1' : 'flex items-center'
						}
					>
						<Icon className={isMobile ? '' : 'mr-3'} size={20} />
						<span className={isMobile ? 'text-xs' : ''}>{item.label}</span>
					</div>
					{!isMobile && (
						<motion.div
							animate={{ rotate: isOpen ? 180 : 0 }}
							transition={{ duration: 0.3, ease: 'easeOut' }}
						>
							{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
						</motion.div>
					)}
					<motion.div
						variants={indicatorVariants}
						initial="inactive"
						animate={isActive ? 'active' : 'inactive'}
						whileHover={isActive ? 'active' : 'preActive'}
						className={indicatorStyle}
					/>
				</motion.button>
				{!isMobile && (
					<AnimatePresence>
						{isOpen && (
							<motion.ul
								variants={childrenVariants}
								initial="hidden"
								animate="visible"
								exit="hidden"
								className="ml-6 mt-2 space-y-2"
							>
								{item.children.map((child) => (
									<SidebarItem
										key={child.href}
										item={child}
										isActive={pathname === child.href}
										isMobile={isMobile}
									/>
								))}
							</motion.ul>
						)}
					</AnimatePresence>
				)}
			</li>
		);
	}

	return (
		<li className="mb-2 list-none">
			<motion.div
				variants={itemVariants}
				whileHover="hover"
				whileTap="tap"
				className="relative"
			>
				<Link
					href={item.href}
					className={itemStyle}
					aria-current={isActive ? 'page' : undefined}
				>
					<Icon className={isMobile ? '' : 'mr-3'} size={20} />
					<span className={isMobile ? 'text-xs' : ''}>{item.label}</span>
				</Link>
				<motion.div
					layoutId={isMobile ? 'mobileIndicator' : 'sidebarIndicator'}
					variants={indicatorVariants}
					initial="inactive"
					animate={isActive ? 'active' : 'inactive'}
					whileHover={isActive ? 'active' : 'preActive'}
					className={indicatorStyle}
				/>
			</motion.div>
		</li>
	);
}