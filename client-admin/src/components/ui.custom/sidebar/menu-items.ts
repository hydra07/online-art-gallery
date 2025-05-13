import {
	BarChart2,
	Bell,
	Cylinder,
	FileText,
	Home,
	Newspaper,
	Settings,
	UserCog,
	Users,
	ImagePlus,
	Radio,
	BanknoteIcon,
	Palette,
	Brush
} from 'lucide-react';
const menuItems = [
	{ href: '/dashboard', label: 'Dashboard', icon: Home },
	{
		href: '/customers',
		label: 'Customers',
		icon: Users,
		children: [
			{
				href: '/customers/reporting',
				label: 'Reporting',
				icon: FileText
			},
			{
				href: '/customers/management',
				label: 'Management',
				icon: UserCog
			}
		]
	},
	{ href: '/events', label: 'Events', icon: FileText,
		children: [
			{
				href: '/events/manage',
				label: 'Manage',
				icon: FileText
			},
			{
				href: '/events/create',
				label: 'Create',
				icon: FileText
			}
		]
	 },
	{ href: '/notifications', label: 'Notifications', icon: Bell },
	{ href: '/artwork', label: 'Artwork', icon: ImagePlus },
	{ href: '/blogs', label: 'Blogs', icon: Newspaper },
	{ href: '/gallery', label: 'Gallery', icon: Cylinder },
	{ href: '/exhibitions', label: 'Exhibition', icon: Radio },
	{ href: '/withdraw-request', label: 'Withdraw', icon: BanknoteIcon },
	{ href: '/artist-requests', label: 'Artist Requests', icon: Palette },
	{ href: '/artists', label: 'Artist', icon: Brush },
	{ href: '/settings', label: 'Settings', icon: Settings },
	
	
];

export default menuItems;
