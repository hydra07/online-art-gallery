import { Artwork } from '@/types/artwork';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip';
import Image from 'next/image';
import {
	AlertTriangle,
	Calendar,
	CheckCircle,
	Clock,
	DollarSign,
	FileText,
	Maximize,
	Palette,
	Tag,
	User,
	X
} from 'lucide-react';
import { formatShortDate, formatFullDate } from '@/utils/date';
import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type CustomDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
	className?: string;
	maxWidth?: string;
};

function CustomDialog({ open, onOpenChange, children, className = '', maxWidth = 'max-w-md' }: CustomDialogProps) {
	const [mounted, setMounted] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const overlayRef = useRef<HTMLDivElement>(null);
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (mounted) {
			if (open) {
				// Small delay to ensure transitions work properly
				setTimeout(() => setIsVisible(true), 10);
				document.body.style.overflow = 'hidden';
				
				// Focus trap
				const handleKeyDown = (e: KeyboardEvent) => {
					if (e.key === 'Escape') {
						onOpenChange(false);
					}
				};
				
				window.addEventListener('keydown', handleKeyDown);
				return () => {
					window.removeEventListener('keydown', handleKeyDown);
				};
			} else {
				setIsVisible(false);
				// Allow time for animation to complete before removing from DOM
				setTimeout(() => {
					if (!open) document.body.style.overflow = '';
				}, 200);
			}
		}
	}, [open, mounted, onOpenChange]);
	
	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (overlayRef.current === e.target) {
				onOpenChange(false);
			}
		};
		
		if (open) {
			document.addEventListener('mousedown', handleOutsideClick);
		}
		
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [open, onOpenChange]);

	if (!mounted) return null;

	return createPortal(
		<div
			className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}
			aria-modal="true"
			role="dialog"
		>
			<div 
				ref={overlayRef}
				className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
					isVisible ? 'opacity-100' : 'opacity-0'
				}`}
				aria-hidden="true"
			/>
			
			<div className="fixed inset-0 overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-4">
					<div
						ref={dialogRef}
						className={`bg-white dark:bg-slate-950 rounded-lg shadow-xl ${maxWidth} w-full transition-all duration-300 ${
							isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
						} ${className}`}
					>
						{children}
						
						<button
							onClick={() => onOpenChange(false)}
							className="absolute top-3 right-3 rounded-full p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
							aria-label="Close dialog"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</div>,
		document.body
	);
}

type ArtworkDetailsDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	artwork: Artwork | null;
	onModerate: (artwork: Artwork) => void;
	isPending?: boolean;
};

export function ArtworkDetailsDialog({
	open,
	onOpenChange,
	artwork,
	onModerate
}: ArtworkDetailsDialogProps) {
	const [showAIReview, setShowAIReview] = useState(false);

	if (!artwork) return null;

	return (
		<CustomDialog 
			open={open} 
			onOpenChange={onOpenChange}
			maxWidth="max-w-4xl"
			className="max-h-[90vh] overflow-y-auto"
		>
			<div className="p-6">
				<div className="mb-4">
					<h2 className="text-xl font-semibold flex items-center">
						<FileText className='h-5 w-5 mr-2' />
						{artwork.title}
					</h2>
					<div className='flex items-center gap-2 mt-1 text-sm text-gray-500'>
						<User className='h-4 w-4' />
						<span>Artist: {artwork.artistId?.name}</span>
						<span className='mx-1'>•</span>
						<Calendar className='h-4 w-4' />
						<span>
							{artwork.createdAt && (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger className='cursor-help'>
											{formatShortDate(artwork.createdAt)}
										</TooltipTrigger>
										<TooltipContent>
											{formatFullDate(artwork.createdAt)}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</span>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-2'>
					<div className='space-y-4'>
						<div className='relative aspect-square rounded-md overflow-hidden ring-1 ring-border shadow-sm'>
							<Image
								src={artwork.url}
								alt={artwork.title}
								fill
								className='object-contain'
								sizes='(max-width: 768px) 100vw, 500px'
								priority
							/>
						</div>

						<div className='grid grid-cols-2 gap-3'>
							<div className='flex items-center justify-center p-3 rounded-md bg-muted border'>
								<div className='flex flex-col items-center'>
									<DollarSign className='h-5 w-5 text-green-500 mb-1' />
									<span className='text-xs text-muted-foreground'>Price</span>
									<span className='font-semibold'>${artwork.price?.toFixed(2)}</span>
								</div>
							</div>

							<div className='flex items-center justify-center p-3 rounded-md bg-muted border'>
								<div className='flex flex-col items-center'>
									<Maximize className='h-5 w-5 text-blue-500 mb-1' />
									<span className='text-xs text-muted-foreground'>Dimensions</span>
									<span className='text-center text-sm'>
										{artwork.dimensions?.width} × {artwork.dimensions?.height}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className='space-y-6'>
						<Tabs
							defaultValue='details'
							className='w-full'
							onValueChange={(value) => {
								if (value === 'ai-review') setShowAIReview(true);
							}}
						>
							<TabsList className='grid w-full grid-cols-2'>
								<TabsTrigger value='details'>
									<FileText className='h-4 w-4 mr-2' />
									Details
								</TabsTrigger>
								<TabsTrigger value='ai-review'>
									<Palette className='h-4 w-4 mr-2' />
									AI Review
								</TabsTrigger>
							</TabsList>
							
							{/* Details tab content */}
							<TabsContent value='details' className='space-y-4 mt-4'>
								<div>
									<h3 className='font-medium mb-1 flex items-center'>
										<FileText className='h-4 w-4 mr-1' />
										Description
									</h3>
									<ScrollArea className='h-24 rounded-md border p-4 bg-muted/50'>
										<p className='text-sm text-muted-foreground'>
											{artwork.description ||
												'No description provided'}
										</p>
									</ScrollArea>
								</div>

								<div>
									<h3 className='font-medium mb-1 flex items-center'>
										<Tag className='h-4 w-4 mr-1' />
										Categories
									</h3>
									<div className='flex flex-wrap gap-2'>
										{artwork.category?.length ? (
											artwork.category.map((cat, i) => (
												<Badge
													key={i}
													variant='secondary'
												>
													{cat}
												</Badge>
											))
										) : (
											<span className='text-sm text-muted-foreground'>
												No categories
											</span>
										)}
									</div>
								</div>

								<div className='grid grid-cols-2 gap-4'>
									<div className='p-3 rounded-md bg-muted border'>
										<h3 className='font-medium mb-1 flex items-center'>
											<Calendar className='h-4 w-4 mr-1' />
											Status
										</h3>
										<div className='flex flex-col gap-1'>
											<Badge
												variant='outline'
												className='w-fit'
											>
												{artwork.status}
											</Badge>
											<Badge
												variant={artwork.moderationStatus === 'pending'
													? 'outline'
													: artwork.moderationStatus === 'approved'
														? 'secondary' // Changed from "success" to a standard variant
														: 'destructive'}
												className={`w-fit mt-1 ${artwork.moderationStatus === 'approved'
													? 'bg-green-100 text-green-800 hover:bg-green-200'
													: ''}`}
											>
												{artwork.moderationStatus}
											</Badge>
										</div>
									</div>

									<div className='p-3 rounded-md bg-muted border'>
										<h3 className='font-medium mb-1 flex items-center'>
											<Clock className='h-4 w-4 mr-1' />
											Last Updated
										</h3>
										<p className='text-sm text-muted-foreground'>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger className='cursor-help'>
														{formatShortDate(
															artwork.updatedAt
														)}
													</TooltipTrigger>
													<TooltipContent>
														{formatFullDate(
															artwork.updatedAt
														)}
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</p>
									</div>
								</div>

								{artwork.moderationReason && (
									<div className='p-3 rounded-md bg-destructive/10 border border-destructive/20'>
										<h3 className='font-medium mb-1 text-destructive flex items-center'>
											<AlertTriangle className='h-4 w-4 mr-1' />
											Moderation Reason
										</h3>
										<ScrollArea className='h-24'>
											<p className='text-sm text-destructive'>
												{artwork.moderationReason}
											</p>
										</ScrollArea>
									</div>
								)}

								{artwork.moderatedBy && (
									<div className='p-3 rounded-md bg-muted border'>
										<h3 className='font-medium mb-1 flex items-center'>
											<User className='h-4 w-4 mr-1' />
											Moderated By
										</h3>
										<p className='text-sm text-muted-foreground'>
											{artwork.moderatedBy}
										</p>
									</div>
								)}
							</TabsContent>

							{/* AI Review tab content */}
							<TabsContent value='ai-review' className='space-y-4 mt-4'>
								{artwork.aiReview ? (
									<>
										<div>
											<h3 className='font-medium mb-1 flex items-center'>
												<Palette className='h-4 w-4 mr-1' />
												AI Description
											</h3>
											<ScrollArea className='h-32 rounded-md border p-4 bg-muted/50'>
												<p className='text-sm text-muted-foreground'>
													{
														artwork.aiReview
															.description
													}
												</p>
											</ScrollArea>
										</div>

										<div>
											<h3 className='font-medium mb-1 flex items-center'>
												<Tag className='h-4 w-4 mr-1' />
												Suggested Categories
											</h3>
											<div className='flex flex-wrap gap-2'>
												{artwork.aiReview
													.suggestedCategories
													?.length ? (
													artwork.aiReview.suggestedCategories.map(
														(cat, i) => (
															<Badge
																key={i}
																variant='secondary'
															>
																{cat}
															</Badge>
														)
													)
												) : (
													<span className='text-sm text-muted-foreground'>
														No suggested categories
													</span>
												)}
											</div>
										</div>

										<div>
											<h3 className='font-medium mb-1 flex items-center'>
												<Tag className='h-4 w-4 mr-1' />
												Keywords
											</h3>
											<div className='flex flex-wrap gap-2'>
												{artwork.aiReview.keywords
													?.length ? (
													artwork.aiReview.keywords.map(
														(keyword, i) => (
															<Badge
																key={i}
																variant='outline'
															>
																{keyword}
															</Badge>
														)
													)
												) : (
													<span className='text-sm text-muted-foreground'>
														No keywords
													</span>
												)}
											</div>
										</div>

										<div className='grid grid-cols-2 gap-4'>
											<div className='p-3 rounded-md bg-accent/50 border'>
												<h3 className='font-medium mb-1'>
													Style
												</h3>
												<p className='text-sm'>
													{artwork.aiReview.metadata
														?.style ||
														'Not specified'}
												</p>
											</div>
											<div className='p-3 rounded-md bg-accent/50 border'>
												<h3 className='font-medium mb-1'>
													Subject
												</h3>
												<p className='text-sm'>
													{artwork.aiReview.metadata
														?.subject ||
														'Not specified'}
												</p>
											</div>
											<div className='p-3 rounded-md bg-accent/50 border'>
												<h3 className='font-medium mb-1'>
													Mood
												</h3>
												<p className='text-sm'>
													{artwork.aiReview.metadata
														?.mood ||
														'Not specified'}
												</p>
											</div>
											<div className='p-3 rounded-md bg-accent/50 border'>
												<h3 className='font-medium mb-1'>
													Technique
												</h3>
												<p className='text-sm'>
													{artwork.aiReview.metadata
														?.technique ||
														'Not specified'}
												</p>
											</div>
										</div>

										<div>
											<h3 className='font-medium mb-1'>
												Colors
											</h3>
											<div className='flex flex-wrap gap-2'>
												{artwork.aiReview.metadata
													?.colors?.length ? (
													artwork.aiReview.metadata.colors.map(
														(color, i) => (
															<Badge
																key={i}
																variant='outline'
																style={{
																	backgroundColor:
																		color ===
																		'blue'
																			? '#EFF6FF'
																			: color ===
																			  'green'
																			? '#ECFDF5'
																			: color ===
																			  'red'
																			? '#FEF2F2'
																			: color ===
																			  'yellow'
																			? '#FEFCE8'
																			: color ===
																			  'purple'
																			? '#FAF5FF'
																			: color ===
																			  'pink'
																			? '#FDF2F8'
																			: color ===
																			  'gray'
																			? '#F9FAFB'
																			: color ===
																			  'black'
																			? '#F3F4F6'
																			: color ===
																			  'white'
																			? '#FFFFFF'
																			: color ===
																			  'warm tones'
																			? '#FEF3C7'
																			: '#F3F4F6',
																	color:
																		color ===
																		'blue'
																			? '#1E40AF'
																			: color ===
																			  'green'
																			? '#047857'
																			: color ===
																			  'red'
																			? '#B91C1C'
																			: color ===
																			  'yellow'
																			? '#A16207'
																			: color ===
																			  'purple'
																			? '#7E22CE'
																			: color ===
																			  'pink'
																			? '#BE185D'
																			: color ===
																			  'gray'
																			? '#374151'
																			: color ===
																			  'black'
																			? '#111827'
																			: color ===
																			  'white'
																			? '#374151'
																			: color ===
																			  'warm tones'
																			? '#92400E'
																			: '#374151'
																}}
															>
																{color}
															</Badge>
														)
													)
												) : (
													<span className='text-sm text-muted-foreground'>
														No color information
													</span>
												)}
											</div>
										</div>
									</>
								) : (
									<div className='flex flex-col items-center justify-center h-40 bg-muted rounded-md border'>
										<Palette className='h-10 w-10 text-muted-foreground/50 mb-2' />
										<p className='text-muted-foreground'>
											No AI review available for this
											artwork
										</p>
									</div>
								)}
							</TabsContent>
						</Tabs>

						<div className='flex justify-end gap-2 pt-4 border-t'>
							<Button variant='outline' onClick={() => onOpenChange(false)}>
								Close
							</Button>
							{artwork.moderationStatus !== 'approved' && (
								<Button onClick={() => onModerate(artwork)}>
									<CheckCircle className='h-4 w-4 mr-2' />
									Review this artwork
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</CustomDialog>
	);
}

type ModerationDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	artwork: Artwork | null;
	moderationReason: string;
	setModerationReason: Dispatch<SetStateAction<string>>;
	onApprove: () => void;
	onReject: () => void;
	onSuspend: () => void;
	isPending: boolean;
};

export function ModerationDialog({
	open,
	onOpenChange,
	artwork,
	moderationReason,
	setModerationReason,
	onApprove,
	onReject,
	onSuspend,
	isPending
}: ModerationDialogProps) {
	if (!artwork) return null;

	const isApproved = artwork.moderationStatus === "approved";
	const isPendingStatus = artwork.moderationStatus === "pending";
	const isSuspended = artwork.moderationStatus === "suspended";
	const isRejected = artwork.moderationStatus === "rejected";
	
	// Check if a reason is needed and provided
	const needsReason = artwork.moderationStatus === "rejected" || artwork.moderationStatus === "suspended";
	const reasonProvided = moderationReason.trim().length > 0;
	const isReasonInvalid = needsReason && !reasonProvided;

	return (
		<CustomDialog 
			open={open} 
			onOpenChange={onOpenChange}
			maxWidth="max-w-md"
		>
			<div className="p-6">
				<div className="mb-6">
					<h2 className="text-xl font-semibold">Moderate Artwork</h2>
					<p className="text-sm text-gray-500 mt-1">
						Review and update the moderation status of this artwork.
					</p>
				</div>
				
				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<h4 className="font-medium mb-1">Title</h4>
							<p className="text-sm text-muted-foreground">{artwork.title}</p>
						</div>
						<div>
							<h4 className="font-medium mb-1">Artist</h4>
							<p className="text-sm text-muted-foreground">
								{artwork.artistId?.name || "Unknown"}
							</p>
						</div>
					</div>

					<div>
						<h4 className="font-medium mb-1">Current Status</h4>
						<div className="mt-1">
							{isPendingStatus ? (
								<Badge variant="outline" className="bg-amber-50 text-amber-700">Pending</Badge>
							) : isApproved ? (
								<Badge variant="outline" className="bg-emerald-50 text-emerald-700">Approved</Badge>
							) : isRejected ? (
								<Badge variant="outline" className="bg-rose-50 text-rose-700">Rejected</Badge>
							) : isSuspended ? (
								<Badge variant="outline" className="bg-slate-50 text-slate-700">Suspended</Badge>
							) : null}
						</div>
					</div>

					 {/* Reason field for rejecting or suspending */}
					<div>
						<Label htmlFor="reason" className="mb-1 block">
							{isRejected ? 'Rejection Reason' : isSuspended ? 'Suspension Reason' : isApproved ? 'Suspension Reason' : 'Reason for Rejection/Suspension'}
							{(artwork.moderationStatus === "rejected" || artwork.moderationStatus === "suspended") && (
								<span className="text-destructive ml-1">*</span>
							)}
						</Label>
						<Textarea
							id="reason"
							className={`mt-1 transition focus:border-primary focus:ring-1 focus:ring-primary 
                ${isReasonInvalid ? "border-destructive focus:border-destructive focus:ring-destructive" : ""}`}
							value={moderationReason}
							onChange={(e) => setModerationReason(e.target.value)}
							placeholder={isRejected ? "Explain why this artwork was rejected..." : isSuspended ? "Explain why this artwork was suspended..." : isApproved ? "Provide a reason for suspension..." : "Provide a reason if rejecting or suspending..."}
							rows={3}
						/>
						{isReasonInvalid && (
							<p className="text-xs text-destructive mt-1">
								{artwork.moderationStatus === "rejected" ? "Please provide a rejection reason." : "Please provide a suspension reason."}
							</p>
						)}
					</div>
				</div>

				<div className="mt-6 pt-4 border-t flex flex-col sm:flex-row justify-end gap-2">
					<div className="flex flex-wrap gap-2 order-2 sm:order-1">
						{/* Approve button - not shown for already approved artworks */}
						{!isApproved && (
							<Button 
								onClick={onApprove} 
								disabled={isPending}
								className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
							>
								<CheckCircle className="h-4 w-4 mr-1.5" />
								{isSuspended ? "Unsuspend & Approve" : "Approve"}
							</Button>
						)}
						
						{/* Reject button - Only shown for pending artworks - not for approved or rejected */}
						{!isRejected && !isApproved && (
							<Button 
								onClick={onReject} 
								disabled={isPending || (artwork.moderationStatus === "rejected" && !reasonProvided)}
								variant="destructive"
								className="transition-colors"
							>
								<X className="h-4 w-4 mr-1.5" />
								Reject
							</Button>
						)}
						
						{/* Suspend button - Only shown for approved artworks */}
						{(isApproved && !isSuspended) && (
							<Button 
								onClick={onSuspend} 
								disabled={isPending || (artwork.moderationStatus === "suspended" && !reasonProvided)}
								variant="outline"
								className="bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
							>
								<AlertTriangle className="h-4 w-4 mr-1.5" />
								Suspend
							</Button>
						)}
					</div>
					
					<Button
						variant="ghost"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
						className="order-1 sm:order-2 transition-colors"
					>
						Cancel
					</Button>
				</div>
			</div>
		</CustomDialog>
	);
}
