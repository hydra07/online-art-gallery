'use client';

import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const transactions = [
	{
		id: '1',
		type: 'deposit',
		amount: 500000,
		date: '2024-02-06T13:45:00',
		description: 'Bank Transfer Deposit',
		status: 'success'
	},
	{
		id: '2',
		type: 'payment',
		amount: -200000,
		date: '2024-02-06T10:30:00',
		description: 'Service Payment',
		status: 'success'
	},
	{
		id: '3',
		type: 'deposit',
		amount: 1000000,
		date: '2024-02-05T15:20:00',
		description: 'Credit Card Deposit',
		status: 'success'
	}
];

export function TransactionList() {
	return (
		<div className='space-y-4'>
			{transactions.map((transaction) => (
				<div
					key={transaction.id}
					className='flex items-center justify-between space-x-4 rounded-lg border p-4 transition-all hover:bg-muted/50'
				>
					<div className='flex items-center space-x-4'>
						<div className='rounded-full border p-2'>
							{transaction.type === 'deposit' ? (
								<ArrowDownLeft className='h-4 w-4 text-green-500' />
							) : (
								<ArrowUpRight className='h-4 w-4 text-red-500' />
							)}
						</div>
						<div>
							<p className='text-sm font-medium leading-none'>
								{transaction.description}
							</p>
							<p className='text-sm text-muted-foreground'>
								{new Date(transaction.date).toLocaleString()}
							</p>
						</div>
					</div>
					<div
						className={cn(
							'text-sm font-medium',
							transaction.type === 'deposit'
								? 'text-green-500'
								: 'text-red-500'
						)}
					>
						{transaction.type === 'deposit' ? '+' : '-'}
						{Math.abs(transaction.amount).toLocaleString()} VND
					</div>
				</div>
			))}
		</div>
	);
}

export function TransactionListSkeleton() {
	return (
		<div className='space-y-4'>
			{Array.from({ length: 3 }).map((_, i) => (
				<div
					key={i}
					className='flex items-center justify-between space-x-4 rounded-lg border p-4'
				>
					<div className='flex items-center space-x-4'>
						<Skeleton className='h-8 w-8 rounded-full' />
						<div className='space-y-2'>
							<Skeleton className='h-4 w-[200px]' />
							<Skeleton className='h-4 w-[150px]' />
						</div>
					</div>
					<Skeleton className='h-4 w-[100px]' />
				</div>
			))}
		</div>
	);
}
