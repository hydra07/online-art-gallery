'use client';

import AuthButton from '@/app/(public)/[locale]/_header/auth-button';
import HeaderButton from '@/app/(public)/[locale]/_header/components/header-button';
import Settings from '@/app/(public)/[locale]/_header/settings';
import { cn } from '@/lib/utils';
import { MenuIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const listMenu = [
	{ href: '/home', label: 'home' },
	{ href: '/about', label: 'about' },
	// { href: '/contact', label: 'contact' },
	{ href: '/artworks', label: 'artworks' },
	{ href: '/discover', label: 'discover' },
	{ href: '/social', label: 'community' },
	{ href: '/premium', label: 'premium' }
];

const menuVariants = {
	hidden: { opacity: 0, scale: 0.95, y: -20 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			duration: 0.3,
			ease: 'easeOut',
			staggerChildren: 0.05
		}
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		y: -20,
		transition: {
			duration: 0.2,
			ease: 'easeIn'
		}
	}
};

const menuItemVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: { opacity: 1, y: 0 }
};

export default function Header() {
	const t = useTranslations('header');
	const pathname = usePathname();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		setIsMenuOpen(false);
		return () => setIsMenuOpen(false);
	}, [pathname]);

	useEffect(() => {
		document.body.style.overflow = isMenuOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [isMenuOpen]);

	const toggleMenu = () => setIsMenuOpen((prev) => !prev);

	return (
		<header
			className={cn(
				'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
				isScrolled
					? 'bg-white/25 dark:bg-gray-900/30 backdrop-blur-sm shadow-sm dark:shadow-gray-800/20'
					: 'bg-transparent backdrop-blur-[1px]'
			)}
		>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16 sm:h-20'>
					{/* Logo */}
					<div className='flex-shrink-0'>
						<Link
							href='/'
							className='flex items-center'
							aria-label='Go to homepage'
						>
							<Image
								src='/logo.svg'
								alt='logo'
								width={60}
								height={60}
								className='transition-all duration-300 hover:opacity-90 hover:scale-105 sm:w-20 sm:h-20'
							/>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className='hidden md:flex items-center justify-center flex-1'>
						<div className='flex flex-row gap-6 lg:gap-10'>
							{listMenu.map(({ href, label }) => {
								const isActive =
									pathname === href ||
									(href !== '/' &&
										pathname?.startsWith(href));
								return (
									<Link
										key={href}
										href={href}
										className={cn(
											'group relative py-2 text-base sm:text-lg uppercase tracking-wider  transition-all duration-300',
											isScrolled
												? 'text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary'
												: ' hover:text-primary ',
											isActive &&
												'text-primary dark:text-primary font-bold'
										)}
									>
										<span className='inline-block transform transition-transform duration-300 group-hover:-translate-y-1'>
											{t(label)}
										</span>
										<span
											className={cn(
												'absolute left-0 bottom-[-4px] w-0 h-[2px] bg-primary shadow-glow transition-all duration-300 ease-out',
												isActive
													? 'w-full'
													: 'group-hover:w-full'
											)}
										/>
									</Link>
								);
							})}
						</div>
					</nav>

					{/* Right Side Buttons */}
					<div className='flex items-center gap-2 sm:gap-4'>
						<Settings />
						<AuthButton />
					</div>

					{/* Mobile Menu Button */}
					<div className='md:hidden'>
						{!isMenuOpen && (
							<HeaderButton
								type='button'
								onClick={toggleMenu}
								aria-controls='mobile-menu'
								aria-expanded={isMenuOpen}
								className={cn(
									'p-2 rounded-md transition-colors',
									isScrolled
										? 'text-gray-800 dark:text-white hover:bg-gray-100/30 dark:hover:bg-gray-800/30'
										: 'text-white hover:bg-white/10 dark:hover:bg-gray-800/20'
								)}
							>
								<span className='sr-only'>
									{isMenuOpen ? 'Close menu' : 'Open menu'}
								</span>
								{/*{isMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}*/}
								<MenuIcon className='h-6 w-6' />
							</HeaderButton>
						)}
					</div>
				</div>
			</div>

			{/* Subtle Separator */}
			{isScrolled && (
				<div className='h-px w-full bg-gradient-to-r from-transparent via-gray-200/40 dark:via-gray-700/40 to-transparent' />
			)}

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						className='md:hidden fixed inset-x-0 top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md'
						variants={menuVariants}
						initial='hidden'
						animate='visible'
						exit='exit'
					>
						<div className='relative pt-20 pb-6 px-6 h-full flex flex-col'>
							{/* Close Button Inside Menu */}
							<button
								onClick={toggleMenu}
								className='absolute top-4 right-16 p-2 rounded-full dark:text-white text-black hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors'
								aria-label='Close menu'
							>
								<X className='h-6 w-6' />
							</button>

							{/* Menu Items */}
							<div className='flex flex-col gap-4'>
								{listMenu.map(({ href, label }) => {
									const isActive =
										pathname === href ||
										(href !== '/' &&
											pathname?.startsWith(href));
									return (
										<motion.div
											key={href}
											variants={menuItemVariants}
										>
											<Link
												href={href}
												className={cn(
													'py-4 px-4 text-xl font-semibold rounded-md transition-all duration-300',
													'text-gray-900 dark:text-white',
													isActive
														? 'bg-gray-50/40 dark:bg-gray-800/40 text-primary dark:text-primary'
														: 'hover:bg-gray-50/30 dark:hover:bg-gray-800/30 hover:text-primary'
												)}
												onClick={() =>
													setIsMenuOpen(false)
												}
											>
												{t(label)}
											</Link>
										</motion.div>
									);
								})}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Custom Styles */}
			<style jsx global>{`
				.text-shadow-md {
					text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7),
						0 1px 2px rgba(0, 0, 0, 0.5);
				}

				.shadow-glow {
					box-shadow: 0 0 6px var(--primary, #3b82f6),
						0 0 3px var(--primary, #3b82f6);
				}

				@supports (backdrop-filter: blur(10px)) {
					header.bg-transparent {
						background-color: rgba(255, 255, 255, 0);
						backdrop-filter: blur(1px);
					}

					.dark header.bg-transparent {
						background-color: rgba(17, 24, 39, 0);
						backdrop-filter: blur(1px);
					}

					header.bg-white \/25 {
						background-color: rgba(255, 255, 255, 0.25);
					}

					.dark header.bg-gray-900 \/30 {
						background-color: rgba(17, 24, 39, 0.3);
					}
				}

				@supports not (backdrop-filter: blur(10px)) {
					header.bg-transparent {
						background-color: rgba(255, 255, 255, 0.05);
					}

					.dark header.bg-transparent {
						background-color: rgba(17, 24, 39, 0.05);
					}
				}
			`}</style>
		</header>
	);
}
