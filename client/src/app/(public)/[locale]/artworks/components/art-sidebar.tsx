import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { motion, useAnimation } from 'framer-motion';
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Search,
	X
} from 'lucide-react';
import { Fragment, useCallback, useEffect, useState } from 'react';

interface FloatingSidebarProps {
	changeLayout: () => void;
}

const FloatingSidebar = ({ changeLayout }: FloatingSidebarProps) => {
	const controls = useAnimation();
	const [isExpanded, setIsExpanded] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const toggleSidebar = useCallback(() => {
		setIsExpanded(!isExpanded);
	}, [isExpanded]);

	const handleHoverStart = useCallback(() => {
		setIsHovering(true);
		controls.start({
			opacity: 1,
			transition: { duration: 0.2 },
			// hiển thị viền trắng khi hover
			border: '1px solid white'
		});
	}, [controls]);

	const handleHoverEnd = useCallback(() => {
		setIsHovering(false);
	}, []);

	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;

		if (!isHovering) {
			timeoutId = setTimeout(() => {
				controls.start({
					opacity: 0.15, // Gần như trong suốt khi không hover
					transition: { duration: 1 }, // Fade out từ từ
					// Chỉ thực hiện fade out nếu không hover trong 4s
					transitionEnd: { opacity: 0.15 }
					// hiển thị viền trắng khi hover
				});
			}, 4500); // Đợi 4.5s trước khi fade out
		}

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [isHovering, controls]);

	const [openSections, setOpenSections] = useState({
		category: false,
		price: false,
		status: false
	});

	const toggleSection = useCallback((section: keyof typeof openSections) => {
		setOpenSections((prev) => ({
			...prev,
			[section]: !prev[section]
		}));
	}, []);

	return (
		<Fragment>
			<motion.div
				initial={{ x: -320 }}
				animate={{
					x: isExpanded ? 0 : -320,
					opacity: isExpanded ? 1 : 0
				}}
				transition={{ duration: 0.3 }}
				className='fixed top-[15vh] left-6 h-[70vh] bg-black/50 backdrop-blur-md text-white shadow-xl rounded-xl flex flex-col z-40 overflow-hidden'
				style={{
					width: '320px',
					pointerEvents: isExpanded ? 'auto' : 'none'
				}}
			>
				{/* Header */}
				<div className='flex items-center justify-between px-6 py-5 pl-16 border-b border-white/10 bg-white/5'>
					<span className='font-bold text-xl text-white'>
						Filters
					</span>
					<Button
						variant='ghost'
						size='sm'
						className='hover:bg-white/10 text-white/80 hover:text-white'
					>
						<X className='h-4 w-4 mr-2' />
						<span>Clear all</span>
					</Button>
				</div>

				{/*button change layout*/}
				<div className='flex items-center justify-between px-6 py-5 pl-16 border-b border-white/10 bg-white/5'>
					<Button
						variant='ghost'
						size='sm'
						className='hover:bg-white/10 text-white/80 hover:text-white'
						onClick={changeLayout}
					>
						<span>Change Layout</span>
					</Button>
				</div>
				{/* Content */}
				<div className='flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar'>
					{/* Search */}
					<div className='space-y-3'>
						<Label className='text-white/90 text-sm font-medium'>
							Search
						</Label>
						<div className='relative'>
							<Search className='absolute left-3 top-3 h-4 w-4 text-white/60' />
							<Input
								placeholder='Search items...'
								className='pl-10 py-6 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 rounded-lg'
							/>
						</div>
					</div>

					{/* Filters */}
					<div className='space-y-4'>
						{/* Category Filter */}
						<div className='rounded-lg overflow-hidden bg-white/5'>
							<button
								onClick={() => toggleSection('category')}
								className='flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium hover:bg-white/5 transition-colors'
							>
								<span className='text-white/90'>Category</span>
								<ChevronDown
									className={`h-4 w-4 text-white/60 transition-transform duration-200 ${
										openSections.category
											? 'transform rotate-180'
											: ''
									}`}
								/>
							</button>
							{openSections.category && (
								<div className='px-4 pb-4'>
									<Select>
										<SelectTrigger className='border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors'>
											<SelectValue placeholder='Select category' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='all'>
												All Categories
											</SelectItem>
											<SelectItem value='electronics'>
												Electronics
											</SelectItem>
											<SelectItem value='clothing'>
												Clothing
											</SelectItem>
											<SelectItem value='books'>
												Books
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							)}
						</div>

						{/* Price Range Filter */}
						<div className='rounded-lg overflow-hidden bg-white/5'>
							<button
								onClick={() => toggleSection('price')}
								className='flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium hover:bg-white/5 transition-colors'
							>
								<span className='text-white/90'>
									Price Range
								</span>
								<ChevronDown
									className={`h-4 w-4 text-white/60 transition-transform duration-200 ${
										openSections.price
											? 'transform rotate-180'
											: ''
									}`}
								/>
							</button>
							{openSections.price && (
								<div className='p-4 pt-2 space-y-4'>
									<div className='space-y-3'>
										<Label className='text-white/80 text-sm'>
											Min
										</Label>
										<Input
											type='number'
											placeholder='0'
											className='bg-white/5 border-white/10 text-white placeholder:text-white/40 hover:border-white/20 transition-colors'
										/>
									</div>
									<div className='space-y-3'>
										<Label className='text-white/80 text-sm'>
											Max
										</Label>
										<Input
											type='number'
											placeholder='1000'
											className='bg-white/5 border-white/10 text-white placeholder:text-white/40 hover:border-white/20 transition-colors'
										/>
									</div>
								</div>
							)}
						</div>

						{/* Status Filter */}
						<div className='rounded-lg overflow-hidden bg-white/5'>
							<button
								onClick={() => toggleSection('status')}
								className='flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium hover:bg-white/5 transition-colors'
							>
								<span className='text-white/90'>Status</span>
								<ChevronDown
									className={`h-4 w-4 text-white/60 transition-transform duration-200 ${
										openSections.status
											? 'transform rotate-180'
											: ''
									}`}
								/>
							</button>
							{openSections.status && (
								<div className='px-4 pb-4'>
									<Select>
										<SelectTrigger className='border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors'>
											<SelectValue placeholder='Select status' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='all'>
												All Status
											</SelectItem>
											<SelectItem value='active'>
												Active
											</SelectItem>
											<SelectItem value='inactive'>
												Inactive
											</SelectItem>
											<SelectItem value='pending'>
												Pending
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className='px-6 py-4 text-center text-sm border-t border-white/10 bg-white/5 text-white/60'>
					<span>© 2025 ArtGallery</span>
				</div>
			</motion.div>

			{/* Toggle Button */}
			<motion.button
				onClick={toggleSidebar}
				className='fixed top-[calc(15vh+16px)] left-10 z-50 p-3 rounded-full bg-gray-800/90 text-white backdrop-blur-sm shadow-xl hover:bg-gray-700/90 transition-colors'
				initial={{ opacity: 0.15 }}
				animate={controls}
				onHoverStart={handleHoverStart}
				onHoverEnd={handleHoverEnd}
			>
				{isExpanded ? (
					<ChevronLeft size={20} />
				) : (
					<ChevronRight size={20} />
				)}
			</motion.button>

			<style jsx global>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 5px;
				}

				.custom-scrollbar::-webkit-scrollbar-track {
					background: transparent;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(255, 255, 255, 0.2);
					border-radius: 10px;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: rgba(255, 255, 255, 0.3);
				}
			`}</style>
		</Fragment>
	);
};

export default FloatingSidebar;
