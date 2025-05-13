import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<main className='flex-1 bg-muted/40 p-4 md:p-6 lg:p-8'>
			<header className='mb-6 flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Skeleton className='h-8 w-8 rounded-full' />
					<Skeleton className='h-6 w-48' />
				</div>
				<div className='flex items-center'>
					<Skeleton className='h-10 w-10 rounded-full' />
				</div>
			</header>
			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
				<Skeleton className='h-32 w-full rounded-lg' />
				<Skeleton className='h-32 w-full rounded-lg' />
				<Skeleton className='h-32 w-full rounded-lg' />
			</div>
			<div className='mt-6 grid gap-6'>
				<Skeleton className='h-48 w-full rounded-lg' />
			</div>
		</main>
	);
}
