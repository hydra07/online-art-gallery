'use client';

import React, { useState, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useServerAction } from 'zsa-react';
import { useToast } from '@/hooks/use-toast';
import { FilePlus, Upload } from 'lucide-react';
import { createBlogAction } from './action';
import { useRouter } from 'next/navigation';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import Image from 'next/image';
import { ToggleContext } from '@/components/ui.custom/interactive-overlay';
import { useTranslations } from 'next-intl';
import { LoaderButton } from '@/components/ui.custom/loader-button';

const MAX_UPLOAD_IMAGE_SIZE = 5000000; // 5MB
const MAX_UPLOAD_IMAGE_SIZE_IN_MB = 5;

export default function CreateDraftButton() {
	const router = useRouter();
	const { setIsOpen: setIsOverlayOpen } = useContext(ToggleContext);
	const { toast } = useToast();
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const tBlog = useTranslations('blog');
	const tCommon = useTranslations('common');
	const tValidation = useTranslations('validation');
	const tError = useTranslations('error');
	const createDraftSchema = z.object({
		title: z.string()
			.trim() // Add this line to trim whitespace before validation
			.min(5, {
				message: tValidation('minLength', { field: tBlog('title'), length: 5 })
			}),
		image: z
			// First check if it's a File or nullish value
			.custom((val) => val instanceof File || val === null || val === undefined)
			// Then apply custom validation with proper error messages
			.refine((val) => val instanceof File, {
				message: tValidation('required', { field: tBlog('image') })
			})
			.refine((file) =>
				file instanceof File ? file.size < MAX_UPLOAD_IMAGE_SIZE : true, {
				message: tValidation('image_size_limit', { size: MAX_UPLOAD_IMAGE_SIZE_IN_MB })
			}),
		content: z.string().optional(),
	});
	const { execute, isPending } = useServerAction(createBlogAction, {

		onSuccess: (draft) => {
			// Start navigation before other UI updates
			const draftId = draft.data.id;
			router.prefetch(`/my-blogs/${draftId}`);

			// Show success toast
			toast({
				title: tCommon('success'),
				description: tBlog('draft_create_success'),
				variant: 'success'
			});

			// Reset form and UI states
			form.reset();
			setImagePreview(null);
			setIsOpen(false);
			setIsOverlayOpen(false);

			// Use replace instead of push for smoother transition
			router.replace(`/my-blogs/${draftId}`);
			router.refresh();
		},
		onError: (error) => {
			const errorRespone = error?.err;
			toast({
				title: tCommon('error'),
				// description: tBlog('draft_create_error'),
				description: errorRespone.code === 'ERROR' ? tError('isBanned') : tBlog('draft_create_error'),
				variant: 'destructive'
			});
		}
	});
	const form = useForm<z.infer<typeof createDraftSchema>>({
		resolver: zodResolver(createDraftSchema),
		defaultValues: {
			title: '',
			image: undefined,
			content: ''
		}
	});

	const onSubmit: SubmitHandler<z.infer<typeof createDraftSchema>> = (
		values
	) => {
		const formData = new FormData();
		formData.append('file', values.image);

		execute({
			title: values.title,
			content: `${tBlog('type_content')}`,
			image: formData
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					className='flex w-full font-medium text-primary items-center justify-center gap-2 p-3 hover:bg-slate-100 transition-colors duration-200 rounded-md'
				>
					<FilePlus size={18} />
					<span>{tBlog('new_draft')}</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{tBlog('create_new_draft')}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{tBlog('title')}</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={`${tBlog(
												'enter_draft_title'
											)}`}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='image'
							render={({
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								field: { value, onChange, ...field }
							}) => (
								<FormItem>
									<FormLabel>{tBlog('image')}</FormLabel>
									<FormControl>
										<div className='flex items-center space-x-2'>
											<Input
												{...field}
												type='file'
												accept='image/jpeg,image/png,image/gif,image/webp'
												onChange={(e) => {
													const file = e.target.files?.[0];

													// Clear previous file/preview if user cancels selection
													if (!file) {
														onChange(undefined);
														setImagePreview(null);
														form.setError('image', {
															type: 'manual',
															message: tValidation('required', { field: tBlog('image') })
														});
														return;
													}

													// Validate file type
													const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
													if (!validTypes.includes(file.type)) {
														// Set form error instead of toast
														form.setError('image', {
															type: 'manual',
															message: tValidation('invalid_file_type', { allowed: 'JPEG, PNG, GIF, WEBP' })
														});
														e.target.value = ''; // Clear the input
														onChange(undefined); // Clear the form value
														return;
													}

													// Validate file size
													if (file.size > MAX_UPLOAD_IMAGE_SIZE) {
														// Set form error instead of toast
														form.setError('image', {
															type: 'manual',
															message: tValidation('image_size_limit', { size: MAX_UPLOAD_IMAGE_SIZE_IN_MB })
														});
														e.target.value = ''; // Clear the input
														onChange(undefined); // Clear the form value
														return;
													}

													// Clear any previous errors when valid file is selected
													form.clearErrors('image');

													// Create a safe object URL and clean up the previous one if it exists
													if (imagePreview) {
														URL.revokeObjectURL(imagePreview);
													}

													// Set the validated file
													onChange(file);
													setImagePreview(URL.createObjectURL(file));
												}}
												className='hidden'
												id='image-upload'
											/>
											<label
												htmlFor='image-upload'
												className='cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'
											>
												<Upload className='mr-2 h-4 w-4' />{' '}
												{imagePreview ? tBlog('change_image') : tBlog('upload_image')}
											</label>
											{imagePreview && (
												<Image
													src={imagePreview}
													alt='Preview'
													width={50}
													height={50}
													className='object-cover'
												/>
											)}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* {error && (
							<Alert variant='destructive'>
								<Terminal className='h-4 w-4' />
								<AlertTitle>
									{tBlog('draft_create_fail')}
								</AlertTitle>
								<AlertDescription>
									{error.message}
								</AlertDescription>
							</Alert>
						)} */}
						<LoaderButton
							type='submit'
							isLoading={isPending}
							className='w-full'
						>

							{tBlog('create_draft')}
						</LoaderButton>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}