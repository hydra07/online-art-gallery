'use client';

import * as React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import { btnStyles } from '@/styles/icons';
// import { Phone } from 'lucide-react';
// import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
export default function SignInPage() {
	const tCommon = useTranslations('common');

	const onGoogleLogin = async () => {
		await signIn('google');
	};

	return (
		<div className='mx-auto flex min-h-[80dvh] items-center justify-center py-24'>
			<div className='mx-auto max-w-md space-y-6'>
				<div className='space-y-2 text-center'>
					<h1 className='text-3xl font-bold'>{tCommon('signin')}</h1>
					<p className='text-gray-500 dark:text-gray-400'>
						{tCommon('signinDescription')}
					</p>
				</div>
				<div className='space-y-4'>
					<Button
						onClick={onGoogleLogin}
						className={cn(
							buttonVariants({
								variant: 'secondary'
							}),
							'w-full'
						)}
					>
						<GoogleIcon className='mr-2 h-5 w-5 stroke-white' />
						{tCommon('googleLogin')}
					</Button>

					<div className='relative py-4'>
						<div className='absolute inset-0 flex items-center'>
							<span className='w-full border-t' />
						</div>
						{/* <div className='relative flex justify-center text-xs uppercase'>
							<span className='bg-gray-100 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400'>
								{tCommon('or')}
							</span>
						</div> */}
					</div>
					{/* <div className='flex justify-center'>
						<Button
							asChild
							variant='ghost'
							className={cn(btnStyles, 'w-full')}
						>
							<Link href='/sign-in/phone'>
								<Phone /> {tCommon('phoneLogin')}
							</Link>
						</Button>
					</div> */}
				</div>
			</div>
		</div>
	);
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			role='img'
			viewBox='0 0 24 24'
			xmlns='http://www.w3.org/2000/svg'
		>
			<title>Google</title>
			<path d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z' />
		</svg>
	);
}
