import { z } from 'zod';
import { useTranslations } from 'next-intl';

export const useSignUpSchemas = () => {
	const t = useTranslations('validation');

	const phoneSchema = z.object({
		phone: z
			.string()
			.min(10, { message: t('invalidPhoneNumber') })
			.regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
				message: t('invalidPhoneNumber')
			})
	});

	const otpSchema = z.object({
		otp: z.string().length(6, { message: t('otpLength') })
	});

	const verifyOtpSchema = z.object({
		otp: z.string().length(6, { message: t('otpLength') }),
		phone: phoneSchema.shape.phone,
		name: z.string().min(2, {
			message: t('minLength', {
				field: t('name'),
				length: '2'
			})
		}),
		password: z.string().min(8, { message: t('passwordLength') })
	});

	const registerSchema = z
		.object({
			phone: phoneSchema.shape.phone,
			name: z.string().min(2, {
				message: t('minLength', {
					field: t('name'),
					length: '2'
				})
			}),
			password: z.string().min(8, {
				message: t('passwordLength')
			}),
			confirmPassword: z.string()
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t('passwordMatch'),
			path: ['confirmPassword']
		});

	return {
		phoneSchema,
		otpSchema,
		verifyOtpSchema,
		registerSchema
	};
};

export type TPhoneSchema = z.infer<
	ReturnType<typeof useSignUpSchemas>['phoneSchema']
>;
export type TOtpSchema = z.infer<
	ReturnType<typeof useSignUpSchemas>['otpSchema']
>;
export type TVerifyOtpSchema = z.infer<
	ReturnType<typeof useSignUpSchemas>['verifyOtpSchema']
>;
export type TRegisterSchema = z.infer<
	ReturnType<typeof useSignUpSchemas>['registerSchema']
>;
