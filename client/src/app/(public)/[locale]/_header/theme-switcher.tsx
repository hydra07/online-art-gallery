'use client';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { DropdownItemWithIcon } from '@/app/(public)/[locale]/_header/components/header-dropdown';
import { useTranslations } from 'next-intl';

export default function ThemeSwitcher({ dropdown }: { dropdown?: boolean }) {
	const { theme, setTheme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);
	const t = useTranslations('header');

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	if (!isMounted) {
		if (dropdown) {
			return (
				<DropdownItemWithIcon
					icon={
						theme === 'dark' ? (
							<SunIcon className='w-6 h-6' />
						) : (
							<MoonIcon className='w-6 h-6' />
						)
					}
					text={theme === 'dark' ? t('lightmode') : t('darkmode')}
					onClick={toggleTheme}
				/>
			);
		}
		return (
			<div className='w-full space-x-2'>
				<SunIcon className='h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
				<MoonIcon className='absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
				<span className='sr-only'>Toggle theme</span>
			</div>
		);
	}

	if (dropdown) {
		return (
			<DropdownItemWithIcon
				icon={
					theme === 'dark' ? (
						<SunIcon className='w-6 h-6' />
					) : (
						<MoonIcon className='w-6 h-6' />
					)
				}
				text={theme === 'dark' ? t('lightmode') : t('darkmode')}
				onClick={toggleTheme}
			/>
		);
	}
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div
				className='flex items-center justify-center space-x-2'
				onClick={toggleTheme}
			>
				{theme === 'dark' ? (
					<SunIcon className='h-6 w-6' />
				) : (
					<MoonIcon className='h-6 w-6' />
				)}
				<span className='sr-only'>Toggle theme</span>
			</div>
		</div>
	);
}
