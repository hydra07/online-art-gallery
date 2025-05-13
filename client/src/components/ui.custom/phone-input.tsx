import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import * as React from 'react';

const PhoneInput = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
	return (
		<div className='relative'>
			<span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500'>
				+84
			</span>
			<Input
				type='tel'
				className={cn('pl-8 bg-white bg-opacity-50', className)}
				ref={ref}
				{...props}
			/>
		</div>
	);
});
PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
