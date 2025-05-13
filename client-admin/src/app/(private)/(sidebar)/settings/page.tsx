'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
	const { theme, setTheme } = useTheme();
	const [isHovered, setIsHovered] = useState<string | null>(null);

	const settingsItems = [
		{
			id: 'theme',
			label: 'Theme',
			description: 'Switch between light and dark mode',
			render: () => (
				<div className='flex items-center gap-4'>
					<button
						onClick={() =>
							setTheme(theme === 'dark' ? 'light' : 'dark')
						}
						className='p-2 rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition-colors duration-200'
					>
						{theme === 'dark' ? (
							<Sun size={20} />
						) : (
							<Moon size={20} />
						)}
					</button>
					<span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
				</div>
			)
		},
		// Placeholder cho các setting khác trong tương lai
		{
			id: 'placeholder1',
			label: 'Coming Soon',
			description: 'More settings will be added here',
			render: () => <span className='text-gray-400'>TBD</span>
		}
	];

	const itemVariants = {
		hover: { scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } },
		tap: { scale: 0.98, transition: { duration: 0.1 } }
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
			className='min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8'
		>
			<div className='max-w-3xl mx-auto'>
				<h1 className='text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6'>
					Settings
				</h1>
				<ul className='space-y-4'>
					{settingsItems.map((item) => (
						<motion.li
							key={item.id}
							variants={itemVariants}
							whileHover='hover'
							whileTap='tap'
							onHoverStart={() => setIsHovered(item.id)}
							onHoverEnd={() => setIsHovered(null)}
							className='p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200'
						>
							<div className='flex items-center justify-between'>
								<div>
									<h2 className='text-lg font-medium text-gray-700 dark:text-gray-200'>
										{item.label}
									</h2>
									<p className='text-sm text-gray-500 dark:text-gray-400'>
										{item.description}
									</p>
								</div>
								<div
									className={`transition-opacity duration-200 ${
										isHovered === item.id
											? 'opacity-100'
											: 'opacity-90'
									}`}
								>
									{item.render()}
								</div>
							</div>
						</motion.li>
					))}
				</ul>
			</div>
		</motion.div>
	);
}
