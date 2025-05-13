import { X, type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import SidebarItem from './sidebar-item';

interface MenuItem {
	href: string;
	label: string;
	icon: LucideIcon;
	children?: MenuItem[];
}

interface MobileSidebarProps {
	isOpen: boolean;
	onClose: () => void;
	menuItems: MenuItem[];
}

export default function MobileSidebar({
	isOpen,
	onClose,
	menuItems
}: MobileSidebarProps) {
	const pathname = usePathname();

	return (
		<div
			className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
				isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
			}`}
		>
			<div className='absolute inset-0 opacity-50' onClick={onClose} />
			<nav
				className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				<div className='p-4'>
					<div className='flex justify-between items-center mb-8'>
						<h1 className='text-2xl font-bold'>My App</h1>
						<button
							onClick={onClose}
							className='p-2'
							aria-label='Close menu'
						>
							<X size={24} />
						</button>
					</div>
					<ul>
						{menuItems.map((item) => (
							<SidebarItem
								key={item.href}
								item={item}
								isActive={
									pathname === item.href ||
									(item.children &&
										item.children.some((child) =>
											pathname.startsWith(child.href)
										))
								}
							/>
						))}
					</ul>
				</div>
			</nav>
		</div>
	);
}
