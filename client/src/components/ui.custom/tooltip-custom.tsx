import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@radix-ui/react-tooltip';

interface TooltipProps {
	children: React.ReactNode;
	tooltipText: string;
}

export function TooltipCustom({ children, tooltipText }: TooltipProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent
				align='start'
				className='border-0 text-sm p-2 bg-slate-800 text-white dark:bg-white dark:text-gray-800  shadow-lg'
			>
				{tooltipText}
			</TooltipContent>
		</Tooltip>
	);
}
