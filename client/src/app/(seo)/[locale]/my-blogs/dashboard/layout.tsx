// layout.tsx
// import Sidebar from "@/app/dashboard/sidebar-dashboard";
import { getCurrentUser } from '@/lib/session';

export default async function DashboardLayout({
	children
}: {
	children: React.ReactNode;
}) {
	const user = await getCurrentUser();
	if (!user) {
		return <h1>You need to be signed in to view this page.</h1>;
	}
	return (
		<div className='flex h-screen'>
			{/* <Sidebar /> */}
			<div className='flex-grow p-4'>{children}</div>
		</div>
	);
}
