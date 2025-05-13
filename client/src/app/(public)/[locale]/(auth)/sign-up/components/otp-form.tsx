'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { LoaderButton } from '@/components/ui.custom/loader-button';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

import { useServerAction } from 'zsa-react';
import { sendOtpAction, signUpAction } from '../actions';
import { TOtpSchema, TRegisterSchema } from '../schema';
import { UseFormReturn } from 'react-hook-form';

import { useTranslations } from 'next-intl';
import { formatTime } from '@/lib/utils';
import { signIn } from 'next-auth/react';

const RESEND_COOLDOWN = 60; // 60s
const OTP_VALIDITY = 3 * 60;

export default function OtpForm({
	otpForm,
	registerForm,
	setStep
}: {
	otpForm: UseFormReturn<TOtpSchema>;
	registerForm: UseFormReturn<TRegisterSchema>;
	setStep: (step: 'otp' | 'register') => void;
}) {
	const tSignup = useTranslations('signup');
	const tError = useTranslations('error');
	const tCommon = useTranslations('common');
	const router = useRouter();

	const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
	const [otpValidity, setOtpValidity] = useState(OTP_VALIDITY);
	const [canResend, setCanResend] = useState(false);

	useEffect(() => {
		let cooldownInterval: ReturnType<typeof setInterval>;
		if (resendCooldown > 0) {
			cooldownInterval = setInterval(() => {
				setResendCooldown((prev) => {
					if (prev <= 1) {
						setCanResend(true);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		let validityInterval: ReturnType<typeof setInterval>;
		if (otpValidity > 0) {
			validityInterval = setInterval(() => {
				setOtpValidity((prev) => {
					if (prev <= 1) {
						toast({
							title: tError('error'),
							description: tError('otpExpired')
						});
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => {
			clearInterval(cooldownInterval);
			clearInterval(validityInterval);
		};
	}, [resendCooldown, otpValidity, tError]);

	const {
		execute: register,
		isPending,
		error
	} = useServerAction(signUpAction, {
		onError() {
			toast({
				title: tError('error'),
				description: tError(error?.message)
			});
		}
	});
	// Gửi lại OTP
	const {
		execute: sendOtp,
		isPending: isSendingOtp,
		error: errorSendingOtp
	} = useServerAction(sendOtpAction, {
		onSuccess() {
			setStep('otp');
			setResendCooldown(RESEND_COOLDOWN);
			setOtpValidity(OTP_VALIDITY);
			setCanResend(false);
			toast({
				title: tSignup('otpSent'),
				description: tSignup('otpSentDescription')
			});
		},
		onError() {
			toast({
				title: tError('error'),
				description: `${tError(errorSendingOtp?.message)}`
			});
		}
	});

	const handleResendOtp = async () => {
		if (!canResend) return;
		const success = await sendOtp({
			phone: registerForm.getValues('phone')
		});
		if (success) {
			setCanResend(false);
		}
	};

	const onSubmit = async (data: TOtpSchema) => {
		if (otpValidity <= 0) {
			toast({
				title: tError('error'),
				description: tError('otpExpired')
			});
			return;
		}
		const payload = {
			name: registerForm.getValues('name'),
			phone: registerForm.getValues('phone'),
			password: registerForm.getValues('password'),
			otp: data.otp
		};
		const result = await register(payload);

		if (result) {
			const result = await signIn('phone', {
				phone: payload.phone,
				password: payload.password,
				redirect: false
			});

			if (result?.error) {
				toast({
					title: tError('error'),
					description: tError('registerError')
				});
				return;
			}

			router.push('/');
		} else {
			toast({
				title: tError('error'),
				description: tError('invalidOtp')
			});
		}
	};

	return (
		<Form {...otpForm}>
			<form
				onSubmit={otpForm.handleSubmit(onSubmit)}
				className='space-y-4'
			>
				<FormField
					control={otpForm.control}
					name='otp'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='flex justify-between'>
								<span>{tSignup('verifyOtp')}</span>
								<span className='text-sm text-muted-foreground'>
									{tSignup('validFor')}:{' '}
									{formatTime(otpValidity)}
								</span>
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									maxLength={6}
									placeholder='000000'
									type='number'
									// placeholder={t('otpPlaceholder')}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex flex-col gap-2'>
					<LoaderButton
						isLoading={isPending}
						type='submit'
						className='w-full'
					>
						{tSignup('verifyOtp')}
					</LoaderButton>

					<Button
						variant='outline'
						type='button'
						disabled={!canResend || isSendingOtp}
						onClick={handleResendOtp}
						className='w-full'
					>
						{canResend
							? tSignup('resendOtp')
							: `${tSignup('resendOtpIn')} ${formatTime(
									resendCooldown
							  )}`}
					</Button>

					<Button
						variant='ghost'
						type='button'
						onClick={() => setStep('register')}
					>
						{tCommon('back')}
					</Button>
				</div>
			</form>
		</Form>
	);
}

/*
    todo:
    - handle expired otp: ✅ just show otp expired or incorrect
    - ui rate limit: 60s to resend. otp valid in 3 minutes ✅
    - handle role access page
    - handle access token expired
    - handle refresh token expired
    - update profile
*/
