import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className='space-y-4'>
			{[...Array(3)].map((_, index) => (
				<Card
					key={index}
					className='hover:shadow-md transition-shadow duration-200'
				>
					<CardContent className='p-3'>
						<div className='flex items-center justify-between'>
							<div className='space-y-2'>
								<Skeleton className='h-6 w-1/2' />
								<div className='flex items-center space-x-3 text-sm text-muted-foreground'>
									<div className='flex items-center space-x-2'>
										<Skeleton className='h-6 w-6 rounded-full' />
										<Skeleton className='h-4 w-24' />
									</div>
									<div className='flex items-center space-x-1'>
										{/* <CalendarIcon className="h-4 w-4 text-muted-foreground" /> */}
										<Skeleton className='h-4 w-20' />
									</div>
								</div>
							</div>
							<div className='flex space-x-2'>
								<Skeleton className='h-8 w-8' />
								<Skeleton className='h-8 w-8' />
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
