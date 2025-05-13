'use client';

import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { pageTitleStyles } from '@/styles/common';
import { cn } from '@/lib/utils';
import { useServerAction } from 'zsa-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { signInAction } from './actions';
import { LoaderButton } from '@/components/ui.custom/loader-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { useSignInSchemas } from '../schemas';
import { useTranslations } from 'next-intl';
import { afterLoginUrl } from '@/app-config';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
export default function SignInPage() {
	const { toast } = useToast();
	const { signInSchema } = useSignInSchemas();
	const tError = useTranslations('error');
	const tCommon = useTranslations('common');
	const router = useRouter();
	const { execute, isPending, error } = useServerAction(signInAction, {
		onError({ err }) {
			console.error(err, 'err');
			toast({
				title: tError('error'),
				description: tError(err.message),
				variant: 'destructive'
			});
		},
		onSuccess() {
			toast({
				title: "Let's Go!",
				description: 'Enjoy your session'
			});
		}
	});

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			phone: '',
			password: ''
		}
	});

	async function onSubmit(values: z.infer<typeof signInSchema>) {
		const success = await execute(values);
		if (success) {
			await signIn('phone', {
				phone: values.phone,
				password: values.password,
				redirect: false
			});
			router.push(afterLoginUrl);
		}
	}

	return (
		<div className='mx-auto max-w-[400px] space-y-6 py-24'>
			<h1 className={cn(pageTitleStyles, 'text-center')}>
				{tCommon('signin')}
			</h1>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-6'
				>
					<FormField
						control={form.control}
						name='phone'
						render={({ field }) => (
							<FormItem>
								<FormLabel>{tCommon('phone')}</FormLabel>
								<FormControl>
									<Input
										{...field}
										className='w-full'
										placeholder={tCommon(
											'phonePlaceholder'
										)}
										type='tel'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>{tCommon('password')}</FormLabel>
								<FormControl>
									<Input
										{...field}
										className='w-full'
										placeholder={tCommon(
											'passwordPlaceholder'
										)}
										type='password'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{error && (
						<Alert variant='destructive'>
							<Terminal className='h-4 w-4' />
							<AlertTitle>{tError('error')}</AlertTitle>
							<AlertDescription>
								{tError(error.message)}
							</AlertDescription>
						</Alert>
					)}

					<LoaderButton
						isLoading={isPending}
						className='w-full'
						type='submit'
					>
						{tCommon('signin')}
					</LoaderButton>
				</form>
			</Form>

			<div className='flex justify-center'>
				<Button asChild variant='link'>
					<Link href='/sign-in/forgot-password'>
						{tCommon('forgotPassword')}
					</Link>
				</Button>
			</div>

			<div className='relative py-4'>
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t' />
				</div>
				<div className='relative flex justify-center text-xs uppercase'>
					<span className='bg-gray-100 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400'>
						{tCommon('or')}
					</span>
				</div>
			</div>

			<Button className='w-full' variant={'secondary'}>
				<Link href='/sign-up'>{tCommon('signup')}</Link>
			</Button>
		</div>
	);
}
