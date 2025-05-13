import { Button } from '@/components/ui/button';
import { Compass, Home, Search, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function SocialSidebar() {
	return (
		<aside className='w-64 p-4 hidden md:block fixed top-[65px] left-0 h-[calc(100vh-65px)] overflow-y-auto'>
			<nav className='space-y-2'>
				<Link href='/social'>
					<Button variant='ghost' className='w-full justify-start'>
						<Home className='mr-2 h-4 w-4' />
						Home
					</Button>
				</Link>
				<Link href='/social/explore'>
					<Button variant='ghost' className='w-full justify-start'>
						<Compass className='mr-2 h-4 w-4' />
						Explore
					</Button>
				</Link>
				<Link href='/social/trending'>
					<Button variant='ghost' className='w-full justify-start'>
						<TrendingUp className='mr-2 h-4 w-4' />
						Trending
					</Button>
				</Link>
				<Link href='/social/artists'>
					<Button variant='ghost' className='w-full justify-start'>
						<Users className='mr-2 h-4 w-4' />
						Artists
					</Button>
				</Link>
			</nav>

			<div className='mt-8'>
				<div className='relative'>
					<Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
					<input
						className='w-full pl-9 pr-4 py-2 bg-muted rounded-full'
						placeholder='Search art & artists...'
					/>
				</div>
			</div>
		</aside>
	);
}
