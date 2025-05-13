import React from 'react';
import Link from 'next/link';

export function DropdownItemWithIcon({
	icon,
	text,
	onClick,
	href,
	key
}: {
	icon: React.ReactNode;
	text: string;
	onClick?: () => void;
	href?: string;
	key?: string;
}) {
	const content = (
		<div
			className='w-full flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 ease-in-out'
			onClick={onClick}
			key={key}
		>
			<div className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600'>
				{icon}
			</div>
			<span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
				{text}
			</span>
		</div>
	);
	if (href) {
		return <Link href={href}>{content}</Link>;
	}
	return content;
}
