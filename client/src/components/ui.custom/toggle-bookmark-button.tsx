'use client';
import { useState } from 'react';
import { toggleBookmarkBlogAction } from '@/app/(public)/[locale]/blogs/actions';
import { Button } from '@/components/ui/button';
import { BookmarkPlusIcon, BookmarkCheckIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { TooltipCustom } from '@/components/ui.custom/tooltip-custom';
import { useServerAction } from 'zsa-react';
// import { useServerAction } from "zsa-react";

interface ToggleBookmarkButtonProps {
	blogId: string;
	initialBookmarked: boolean;
}

// export function ToggleBookmarkButton({ blogId, initialBookmarked }: ToggleBookmarkButtonProps) {
//     const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
//     const [isPending, startTransition] = useTransition();

//     const handleToggleBookmark = async () => {
//         startTransition(async () => {
//             try {
//                 const result = await toggleBookmarkBlogAction({ blogId });
//                 if (result) {
//                     throw new Error('Failed to toggle bookmark');
//                 }
//                 setIsBookmarked(prevState => {
//                     const newState = !prevState;
//                     toast({
//                         title: "Success",
//                         description: newState ? "Bookmark added" : "Bookmark removed",
//                         variant: "success",
//                     });
//                     return newState;
//                 });
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             } catch (error: any) {
//                 console.error("Error in handleToggleBookmark:", error);
//                 toast({
//                     title: "Error",
//                     description: error.message || "Failed to toggle bookmark. Please try again.",
//                     variant: "destructive",
//                 });
//             }
//         });
//     };

//     return (
//         <TooltipCustom tooltipText={isBookmarked ? "Remove Bookmark" : "Bookmark the Article"}>
//             <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleToggleBookmark}
//                 disabled={isPending}
//             >
//                 {isBookmarked ? (
//                     <BookmarkCheckIcon className="fill-slate-400" />
//                 ) : (
//                     <BookmarkPlusIcon className="text-gray-600 dark:text-gray-300" />
//                 )}
//             </Button>
//         </TooltipCustom>
//     );
// }
export function ToggleBookmarkButton({
	blogId,
	initialBookmarked
}: ToggleBookmarkButtonProps) {
	const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

	const { execute, isPending } = useServerAction(toggleBookmarkBlogAction, {
		onSuccess() {
			setIsBookmarked((prevState) => {
				const newState = !prevState;
				toast({
					title: 'Success',
					description: newState
						? 'Bookmark added'
						: 'Bookmark removed',
					variant: 'success'
				});
				return newState;
			});
		},
		onError(error) {
			console.error('Error in handleToggleBookmark:', error);
			toast({
				title: 'Error',
				description:
					error?.err?.message ||
					'Failed to toggle bookmark. Please try again.',
				variant: 'destructive'
			});
		}
	});

	const handleToggleBookmark = () => {
		execute({ blogId });
	};

	return (
		<TooltipCustom
			tooltipText={
				isBookmarked ? 'Remove Bookmark' : 'Bookmark the Article'
			}
		>
			<Button
				variant='ghost'
				size='sm'
				onClick={handleToggleBookmark}
				disabled={isPending}
			>
				{isBookmarked ? (
					<BookmarkCheckIcon className='fill-slate-400' />
				) : (
					<BookmarkPlusIcon className='text-gray-600 dark:text-gray-300' />
				)}
			</Button>
		</TooltipCustom>
	);
}
