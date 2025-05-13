'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const reportReasons = [
	{
		value: 'spam',
		label: 'Spam',
		description: 'Unsolicited messages or repetitive content'
	},
	{
		value: 'harassment',
		label: 'Harassment',
		description: 'Bullying, threats, or abusive behavior'
	},
	{
		value: 'inappropriate',
		label: 'Inappropriate Content',
		description: 'Content that violates community guidelines'
	},
	{
		value: 'fake',
		label: 'Fake Account',
		description: 'Impersonation or misleading identity'
	},
	{
		value: 'other',
		label: 'Other',
		description: 'Other issues not listed above'
	}
];

export function ReportForm({ onClose }: { onClose: () => void }) {
	const [reason, setReason] = useState('');
	const [comment, setComment] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!reason) {
			setError('Please select a reason for reporting');
			return;
		}

		// Here you would typically send the report data to your backend
		onClose();
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			{error && (
				<Alert variant='destructive' className='mb-4'>
					<AlertCircle className='h-4 w-4' />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className='space-y-2'>
				<label className='text-sm font-medium text-gray-700'>
					Reason for Report
				</label>
				<Select
					value={reason}
					onValueChange={(value) => {
						setReason(value);
						setError('');
					}}
				>
					<SelectTrigger className='w-full'>
						<SelectValue placeholder='Select a reason for reporting' />
					</SelectTrigger>
					<SelectContent>
						{reportReasons.map((r) => (
							<SelectItem
								key={r.value}
								value={r.value}
								className='py-3'
							>
								<div className='flex flex-col gap-1'>
									<span className='font-medium'>
										{r.label}
									</span>
									<span className='text-sm text-gray-500'>
										{r.description}
									</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className='space-y-2'>
				<label className='text-sm font-medium text-gray-700'>
					Additional Details
				</label>
				<Textarea
					placeholder='Please provide more details about the issue...'
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					className='min-h-[120px] resize-none'
				/>
				<p className='text-sm text-gray-500'>
					Your report will be reviewed by our team. Please provide as
					much detail as possible to help us investigate.
				</p>
			</div>

			<div className='flex justify-end space-x-3 pt-4 border-t'>
				<Button
					type='button'
					variant='outline'
					onClick={onClose}
					className='w-24'
				>
					Cancel
				</Button>
				<Button type='submit' className='w-24' disabled={!reason}>
					Submit
				</Button>
			</div>
		</form>
	);
}
