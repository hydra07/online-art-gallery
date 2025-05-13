import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCurrentUser } from '@/lib/session';
export default async function Layout({
	children,
	draft,
	published
}: {
	children: React.ReactNode;
	draft: React.ReactNode;
	published: React.ReactNode;
}) {
	const user = await getCurrentUser();
	if (!user) {
		return <h1>You need to login !</h1>;
	}
	return (
		<div>
			<div>{children}</div>
			<div className='flex-1 bg-muted/40 p-4 md:p-6 lg:p-8'>
				<header className='mb-6 flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<h1 className='text-3xl font-bold'>
							Articles and drafts
						</h1>
					</div>
				</header>
				<Tabs defaultValue='draft' className='w-full px-6'>
					<div className='py-3 border-y'>
						<TabsList className='grid w-full grid-cols-4'>
							<TabsTrigger value='draft'>Draft</TabsTrigger>
							<TabsTrigger value='published'>
								Published
							</TabsTrigger>
						</TabsList>
					</div>
					<TabsContent value='published'>
						<ScrollArea className='h-80 rounded-md border'>
							{published}
						</ScrollArea>
					</TabsContent>
					<TabsContent value='draft'>
						<ScrollArea className='h-80 rounded-md border'>
							{draft}
						</ScrollArea>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
