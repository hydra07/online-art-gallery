import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
export const formatCreatedAt = (
	createdAt: string | Date,
	locale: 'vi' | 'en'
) => {
	if (!createdAt) return 'Unknown time';
	let date: Date;
	try {
		// Nếu createdAt là chuỗi, sử dụng parseISO để phân tích
		if (typeof createdAt === 'string') {
			date = parseISO(createdAt); // parseISO giúp phân tích chuỗi ngày ISO
		} else {
			date = createdAt; // Nếu đã là đối tượng Date, dùng trực tiếp
		}
		const selectedLocale = locale === 'vi' ? vi : enUS;
		return `${formatDistanceToNow(date, {
			locale: selectedLocale
		})}`;
	} catch (error) {
		console.error('Error formatting date:', error);
		return 'Invalid date';
	}
};
