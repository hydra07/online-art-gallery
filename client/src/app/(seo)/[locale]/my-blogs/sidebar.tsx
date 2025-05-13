// components/ReusableSidebar.tsx
'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { PanelRightOpen, PanelRightClose } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarButtonProps {
	onClick: () => void;
	isOpen: boolean;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ onClick, isOpen }) => (
	<Tooltip>
		<TooltipTrigger asChild>
			<button
				className={`
            p-2
            rounded-full
            transition-all
            duration-200
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            hover:bg-gray-200
            active:bg-gray-300
            ${isOpen ? 'bg-gray-100' : 'bg-transparent'}
          `}
				onClick={onClick}
			>
				{isOpen ? (
					<PanelRightOpen size={24} className='text-gray-700' />
				) : (
					<PanelRightClose size={24} className='text-gray-700' />
				)}
			</button>
		</TooltipTrigger>
		<TooltipContent
			side='right'
			className='bg-slate-900 text-white dark:bg-slate-200 dark:text-black'
		>
			<p>{isOpen ? 'Close sidebar' : 'Open sidebar'}</p>
		</TooltipContent>
	</Tooltip>
);

interface ReusableSidebarProps {
	header: React.ReactNode;
	content: React.ReactNode;
	footer?: React.ReactNode;
	initialIsOpen?: boolean;
}

const ReusableSidebar: React.FC<ReusableSidebarProps> = ({
	header,
	content,
	footer,
	initialIsOpen = true
}) => {
	const [isOpen, setIsOpen] = useState(initialIsOpen);
	const toggleSidebar = () => setIsOpen((prev) => !prev);

	return (
		<div className='flex h-full p-4'>
			<div
				className={cn(
					'transition-all duration-300 ease-in-out border-r-2 flex flex-col',
					isOpen
						? 'w-64 opacity-100 visible'
						: 'w-0 opacity-0 invisible'
				)}
			>
				{/* Header Section */}
				<div className='h-20 border-b-2 flex items-center justify-between p-4'>
					{header}
					<SidebarButton onClick={toggleSidebar} isOpen={isOpen} />
				</div>

				{/* Content Section */}
				<ScrollArea className='flex-grow border-b p-4'>
					{content}
				</ScrollArea>

				{/* Footer Section */}
				{footer && <div className='mt-6 p-4'>{footer}</div>}
			</div>
			{!isOpen && (
				<div className='p-4'>
					<SidebarButton onClick={toggleSidebar} isOpen={isOpen} />
				</div>
			)}
		</div>
	);
};

export default ReusableSidebar;
