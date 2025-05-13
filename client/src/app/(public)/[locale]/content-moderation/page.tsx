'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Flag, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const reportReasons = [
	{
		value: 'spam',
		label: 'Spam',
		description: 'Unsolicited or repeated content'
	},
	{
		value: 'harassment',
		label: 'Harassment',
		description: 'Abusive or threatening behavior'
	},
	{
		value: 'inappropriate',
		label: 'Inappropriate Content',
		description: 'Content that violates guidelines'
	},
	{
		value: 'fake',
		label: 'Fake Account',
		description: 'Impersonation or false identity'
	},
	{
		value: 'other',
		label: 'Other',
		description: 'Other issues not listed above'
	}
];

const ReportForm = ({ onClose }: { onClose: () => void }) => {
	const [reason, setReason] = useState('');
	const [comment, setComment] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onClose();
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			<div className='space-y-4'>
				<Select value={reason} onValueChange={setReason}>
					<SelectTrigger className='w-full'>
						<SelectValue placeholder='Select a reason for reporting' />
					</SelectTrigger>
					<SelectContent>
						{reportReasons.map((reason) => (
							<SelectItem key={reason.value} value={reason.value}>
								<div className='flex flex-col'>
									<span className='font-medium'>
										{reason.label}
									</span>
									<span className='text-sm text-gray-500'>
										{reason.description}
									</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Textarea
					placeholder='Please provide additional details about the issue...'
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					className='min-h-[120px] resize-none'
				/>
			</div>

			<div className='flex justify-end space-x-3'>
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
};

export default function ReportUser() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className='min-h-screen bg-gray-50 p-8'>
			<Card className='max-w-2xl mx-auto'>
				<CardContent className='p-6'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-4'>
							<Avatar className='h-16 w-16'>
								<AvatarImage src='https://github.com/shadcn.png' />
								<AvatarFallback>
									<UserCircle className='h-8 w-8' />
								</AvatarFallback>
							</Avatar>
							<div className='space-y-1'>
								<div className='flex items-center space-x-2'>
									<h2 className='text-xl font-semibold'>
										Dang Hai
									</h2>
									<Badge
										variant='secondary'
										className='text-sm'
									>
										Premium User
									</Badge>
								</div>
								<p className='text-sm text-gray-500'>@Hai</p>
								<p className='text-sm text-gray-600'>
									Joined December 2023
								</p>
							</div>
						</div>

						<Dialog open={isOpen} onOpenChange={setIsOpen}>
							<DialogTrigger asChild>
								<Button
									variant='outline'
									size='sm'
									className='h-9'
								>
									<Flag className='w-4 h-4 mr-2' />
								</Button>
							</DialogTrigger>
							<DialogContent className='sm:max-w-[425px]'>
								<DialogHeader>
									<DialogTitle>Report @johndoe</DialogTitle>
									<DialogDescription>
										Your report will be reviewed by our
										team. Please provide as much detail as
										possible.
									</DialogDescription>
								</DialogHeader>
								<ReportForm onClose={() => setIsOpen(false)} />
							</DialogContent>
						</Dialog>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
