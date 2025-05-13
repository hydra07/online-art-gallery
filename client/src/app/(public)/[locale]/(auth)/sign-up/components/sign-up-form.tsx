'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUpSchemas } from '../schema';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { pageTitleStyles } from '@/styles/common';
import RegisterForm from './register-form';
import OtpForm from './otp-form';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export default function SignUpForm() {
	const tCommon = useTranslations('common');
	const { registerSchema, otpSchema } = useSignUpSchemas();
	const [step, setStep] = useState<'otp' | 'register'>('register');

	const registerForm = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			phone: '',
			password: '',
			confirmPassword: ''
		}
	});

	const otpForm = useForm({
		resolver: zodResolver(otpSchema),
		defaultValues: {
			otp: ''
		}
	});

	return (
		<div className='mx-auto max-w-[400px] space-y-6 py-24'>
			<h1 className={cn(pageTitleStyles, 'text-center')}>
				{tCommon('signup')}
			</h1>
			{step === 'otp' ? (
				<OtpForm
					otpForm={otpForm}
					registerForm={registerForm}
					setStep={setStep}
				/>
			) : (
				<RegisterForm registerForm={registerForm} setStep={setStep} />
			)}

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
				<Link href='/sign-in'>{tCommon('signin')}</Link>
			</Button>
		</div>
	);
}
