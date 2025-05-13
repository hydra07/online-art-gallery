import { z } from 'zod';

export const artworkFormSchema = (t: (key: string) => string) => {
	return z.object({
		title: z.string().min(1, { message: t('validation.titleRequired') }),
		description: z
			.string()
			.min(10, { message: t('validation.descriptionMinLength') }),
		categories: z
			.array(z.string())
			.min(1, { message: t('validation.categoryRequired') }),
		width: z.string().min(1, { message: t('validation.widthRequired') }),
		height: z.string().min(1, { message: t('validation.heightRequired') }),
		artType: z.enum(['painting', 'digitalart'], {
			required_error: t('validation.artTypeRequired')
		}),
		isSelling: z.boolean().default(false),
		price: z.union([
			z.string().min(1),
			z.number().min(0)
		]).optional().transform(val => typeof val === 'string' && val ? Number(val) : val),
		status: z.enum(['available', 'hidden', 'selling'], {
			required_error: t('validation.statusRequired')
		}),
		imageUrl: z.string().url(
			{ message: t('validation.imageUrlInvalid') }
		).optional(),
		lowResUrl: z.string().url(
			{ message: t('validation.imageUrlInvalid') }
		).optional(),
		watermarkUrl: z.string().url(
			{ message: t('validation.imageUrlInvalid') }
		).optional(),
	});
};
export const artworkFormUpdateSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	status: z.enum(['available', 'sold', 'hidden', 'selling']).optional(),
	price: z.union([
		z.string().min(1),
		z.number().min(0)
	]).optional().transform(val => typeof val === 'string' && val ? Number(val) : val),
	artType: z.enum(['painting', 'digitalart']).optional(),
});
export type ArtworkFormData = z.infer<ReturnType<typeof artworkFormSchema>>;

