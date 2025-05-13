import { z } from 'zod';
import { ReasonReport, RefType } from '@/utils/enums';

export const reportSchema = z.object({
    refId: z.string().min(1, 'Reported ID is required'),
    refType: z.nativeEnum(RefType, { errorMap: () => ({ message: 'Invalid report type' }) }),
    reason: z.nativeEnum(ReasonReport, { errorMap: () => ({ message: 'Invalid report reason' }) }),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    url: z.string().url('Invalid URL format').optional(),
    image: z.array(z.string()).min(1, 'Image is required'),
});


export type ReportForm = z.infer<typeof reportSchema>;