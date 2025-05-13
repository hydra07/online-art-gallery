import { Brush, Crown } from 'lucide-react';
import React, { forwardRef } from 'react';

interface HeaderButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	className?: string;
	isGradient?: boolean;
	isPremium?: boolean;
	isArtist?: boolean;
}

const HeaderButton = forwardRef<HTMLButtonElement, HeaderButtonProps>(
	(
		{
			children,
			className = '',
			isGradient = false,
			isPremium = false,
			isArtist = false,
			...props
		},
		ref
	) => {
		if (!isPremium && !isArtist) {
			return (
				<button
					ref={ref}
					className={`relative flex items-center justify-center w-10 h-10 rounded-full ${isGradient
						? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-400 hover:via-purple-400 hover:to-pink-400'
						: 'bg-gray-500 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
						} p-1 ${className}`}
					{...props}
				>
					<div className='flex items-center justify-center w-full h-full rounded-full'>
						{children}
					</div>
				</button>
			);
		}
		return (
			<button
				ref={ref}
				className={`relative flex items-center justify-center w-10 h-10 rounded-full ${isGradient
					? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-400 hover:via-purple-400 hover:to-pink-400'
					: 'bg-gray-500 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
					} p-1 ${className}`}
				{...props}
			>
				<div className='relative flex items-center justify-center w-full h-full rounded-full overflow-visible'>
					<div className='z-1000'>

						{children}
					</div>
					{isPremium && (
						<div className='absolute top-0 right-0 z-10 transform translate-x-[0.5rem] -translate-y-[0.5rem] bg-white rounded-full w-4 h-4 flex items-center justify-center shadow'>
							<Crown className='h-3 w-3 text-yellow-500' />
						</div>
					)}
					{isArtist && (
						<div className='absolute bottom-0 left-0 z-10 transform -translate-x-[0.5rem] translate-y-[0.5rem] bg-white rounded-full w-4 h-4 flex items-center justify-center shadow'>
							<Brush className='h-3 w-3 text-blue-500' />
						</div>
					)}
				</div>
			</button>
		);
	}
);

HeaderButton.displayName = 'HeaderButton';
export default HeaderButton;
