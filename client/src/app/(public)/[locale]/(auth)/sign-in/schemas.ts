import { z } from 'zod';
import { useTranslations } from 'next-intl';

export const useSignInSchemas = () => {
	const t = useTranslations('validation');

	const phoneSchema = z.object({
		phone: z
			.string()
			.min(10, { message: t('invalidPhoneNumber') })
			.regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
				message: t('invalidPhoneNumber')
			})
	});

	const signInSchema = z.object({
		phone: phoneSchema.shape.phone,
		password: z.string().min(8, {
			message: t('minLength', {
				field: t('password'),
				length: '8'
			})
		})
	});

	return { phoneSchema, signInSchema };
};
