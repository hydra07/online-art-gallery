import { z } from 'zod';
import { useTranslations } from 'next-intl';

export const useEditProfileSchema = () => {
 const t = useTranslations('profile.edit.validation');

 const editProfileSchema = z.object({
  name: z.string()
   .min(2, { message: t('name_min_length') })
   .max(50, { message: t('name_max_length') })
   .regex(/^[a-zA-Z0-9\sÀ-ỹ]+$/, { message: t('name_no_special_chars') }),
  address: z.string()
   .max(200, { message: t('address_max_length') })
   .optional()
   .or(z.literal('')),
  bio: z.string()
   .max(1000, { message: t('bio_max_length') })
   .optional()
   .or(z.literal('')),
  genres: z.array(z.string())
   .max(10, { message: t('max_genres') })
   .refine(genres => genres.every(genre => genre.length <= 30), {
    message: t('genre_max_length')
   })
 });

 return { editProfileSchema };
}; 