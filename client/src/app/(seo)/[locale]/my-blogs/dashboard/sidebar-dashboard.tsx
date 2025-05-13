// components/DashboardSidebar.tsx
import React from 'react';
import ReusableSidebar from '../sidebar';
import { Grid, NotepadText, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';

const DashboardSidebar: React.FC = async () => {
	const user = await getCurrentUser();

	if (!user) {
		return null;
	}

	const header = (
		<div className='flex items-center gap-4'>
			{/* <Avatar>
        <AvatarImage src={user.image} alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <h1 className="text-lg font-bold">{user.firstname + ' ' + user.lastname}</h1> */}
		</div>
	);

	const content = (
		<>
			<Link href='/dashboard' passHref>
				<button className='flex w-full font-bold text-slate-500 items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-900 dark:text-white rounded-md'>
					<Grid size={20} />
					<span className='text-sm'>Overview</span>
				</button>
			</Link>
			<Link href='/dashboard/posts' passHref>
				<button className='flex w-full font-bold text-slate-500 items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-900 dark:text-white rounded-md'>
					<NotepadText size={20} />
					<span className='text-sm'>Articles and drafts</span>
				</button>
			</Link>
		</>
	);

	const footer = (
		<nav className='flex flex-col gap-2 border rounded-full'>
			<a
				href='#'
				className='flex items-center justify-center w-full py-3 px-4 transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-900'
			>
				<ExternalLink className='mr-3' size={18} />
				Visiting blog
			</a>
		</nav>
	);

	return (
		<ReusableSidebar header={header} content={content} footer={footer} />
	);
};

export default DashboardSidebar;
