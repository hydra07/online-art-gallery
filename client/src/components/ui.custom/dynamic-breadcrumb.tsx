'use client';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
// Function to parse URL path and filter out language codes and unnecessary segments
const parseBreadcrumbPaths = (path: string) => {
	// Remove leading and trailing slashes, split the path
	const segments = path.replace(/^\/|\/$/g, '').split('/');
	// Filter out language codes (en, vn, etc.) - assuming 2-letter language codes
	const filteredSegments = segments.filter(
		(segment) => segment.length !== 2 || !/^[a-z]{2}$/.test(segment)
	);

	return filteredSegments;
};

interface DynamicBreadcrumbProps {
	className?: string;
	homeLabel?: string;
}

const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({
	className = '',
	homeLabel = ''
}) => {
	const currentPath = usePathname();
	const pathSegments = parseBreadcrumbPaths(currentPath);

	return (
		<Breadcrumb className={cn('w-full px-2 py-3', className)}>
			<BreadcrumbList className='flex flex-wrap items-center gap-2 text-sm sm:text-base md:text-lg'>
				{/* Home Item */}
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link
							href='/'
							className='flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-all duration-200 group'
						>
							<Home className='w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform' />
							<span className='hidden sm:inline font-medium'>
								{homeLabel}
							</span>
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				{pathSegments.length > 0 && (
					<BreadcrumbSeparator className='text-muted-foreground/50'>
						<ChevronRight className='h-4 w-4' />
					</BreadcrumbSeparator>
				)}

				{pathSegments.map((segment, index) => {
					const path =
						'/' + pathSegments.slice(0, index + 1).join('/');
					const isLast = index === pathSegments.length - 1;

					return (
						<React.Fragment key={segment}>
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage className='font-semibold text-foreground capitalize px-1 max-w-[200px] truncate'>
										{segment}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link
											href={path}
											className='text-muted-foreground hover:text-foreground transition-colors duration-200 capitalize px-1 max-w-[150px] truncate block hover:bg-accent rounded'
										>
											{segment}
										</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>

							{!isLast && (
								<BreadcrumbSeparator className='text-muted-foreground/50'>
									<ChevronRight className='h-4 w-4' />
								</BreadcrumbSeparator>
							)}
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default DynamicBreadcrumb;
// Example usage:
// <DynamicBreadcrumb currentPath="/en/test/demo" />
// <DynamicBreadcrumb currentPath="/vn/test/market" />
// <DynamicBreadcrumb currentPath="/test/abc" />
// <DynamicBreadcrumb currentPath="/test/abc" homeLabel="Trang chủ" />
