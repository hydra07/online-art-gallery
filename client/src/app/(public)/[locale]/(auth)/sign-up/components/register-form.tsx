import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { LoaderButton } from '@/components/ui.custom/loader-button';
import { toast } from '@/hooks/use-toast';
import { sendOtpAction } from '../actions';
import { useTranslations } from 'next-intl';
import { useServerAction } from 'zsa-react';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui.custom/phone-input';
import { TRegisterSchema } from '../schema';

export default function RegisterForm({
	registerForm,
	setStep
}: {
	registerForm: UseFormReturn<TRegisterSchema>;
	setStep: (step: 'otp' | 'register') => void;
}) {
	const t = useTranslations('signup');
	const tCommon = useTranslations('common');
	const tError = useTranslations('error');
	const {
		execute: sendOtp,
		isPending,
		error
	} = useServerAction(sendOtpAction, {
		onSuccess() {
			setStep('otp');
			toast({
				title: t('otpSent'),
				description: t('otpSentDescription')
			});
		},
		onError() {
			toast({
				title: tError('error'),
				description: `${tError(error?.message)}`
			});
		}
	});

	const onSubmit = async (data: TRegisterSchema) => {
		await sendOtp({ phone: data.phone });
	};

	return (
		<Form {...registerForm}>
			<form
				onSubmit={registerForm.handleSubmit(onSubmit)}
				className='space-y-4'
			>
				<FormField
					control={registerForm.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{tCommon('name')}</FormLabel>
							<FormControl>
								<Input
									placeholder={tCommon('namePlaceholder')}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={registerForm.control}
					name='phone'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{tCommon('phone')}</FormLabel>
							<FormControl>
								<PhoneInput
									placeholder={tCommon('phonePlaceholder')}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={registerForm.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{tCommon('password')}</FormLabel>
							<FormControl>
								<Input
									type='password'
									placeholder={tCommon('passwordPlaceholder')}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={registerForm.control}
					name='confirmPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{tCommon('confirmPassword')}</FormLabel>
							<FormControl>
								<Input
									type='password'
									placeholder={tCommon(
										'confirmPasswordPlaceholder'
									)}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<LoaderButton
					isLoading={isPending}
					type='submit'
					className='w-full'
				>
					{tCommon('signup')}
				</LoaderButton>
			</form>
		</Form>
	);
}
