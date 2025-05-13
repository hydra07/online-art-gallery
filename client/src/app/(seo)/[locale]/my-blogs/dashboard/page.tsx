import {
	Card,
	CardHeader,
	CardDescription,
	CardTitle,
	CardContent,
	CardFooter
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Breadcrumb } from '@/components/ui.custom/Breadcrumb';

export default function DashboardPage() {
	return (
		<>
			<Breadcrumb
				items={[
					{ label: 'Dashboard', link: '/dashboard' },
					{ label: 'Overview', link: '/dashboard/overview' }
				]}
			/>
			<main className='flex-1 bg-muted/40 p-4 md:p-6 lg:p-8'>
				<header className='mb-6 flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<h1 className='text-3xl font-bold'>Overview</h1>
					</div>
				</header>
				<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
					<Card className='flex flex-col'>
						<CardHeader>
							<CardDescription>Total Posts</CardDescription>
							<CardTitle>124</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='text-xs text-muted-foreground'>
								+10% from last month
							</div>
						</CardContent>
						<CardFooter>
							<Progress value={10} aria-label='10% increase' />
						</CardFooter>
					</Card>
					<Card className='flex flex-col'>
						<CardHeader>
							<CardDescription>Total Views</CardDescription>
							<CardTitle>12,345</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='text-xs text-muted-foreground'>
								+25% from last month
							</div>
						</CardContent>
						<CardFooter>
							<Progress value={25} aria-label='25% increase' />
						</CardFooter>
					</Card>
					<Card className='flex flex-col'>
						<CardHeader>
							<CardDescription>Total Comments</CardDescription>
							<CardTitle>1,234</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='text-xs text-muted-foreground'>
								+15% from last month
							</div>
						</CardContent>
						<CardFooter>
							<Progress value={15} aria-label='15% increase' />
						</CardFooter>
					</Card>
				</div>
				<div className='mt-6 grid gap-6'>
					<Card>
						<CardHeader>
							<CardTitle>Post Engagement</CardTitle>
							<CardDescription>
								Engagement metrics for your blog posts over
								time.
							</CardDescription>
						</CardHeader>
						<CardContent></CardContent>
					</Card>
				</div>
			</main>
		</>
	);
}
