export const formatFileSize = (bytes: number) => {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function vietnamCurrency(price: number) {
	return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export function vietnameseDateFormat(date: Date | string) {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		// hour: '2-digit',
		// minute: '2-digit',
		// second: '2-digit',
		// hour12: false,
		timeZone: 'Asia/Ho_Chi_Minh',
	};
	const dateObj = new Date(date);
	return new Intl.DateTimeFormat('vi-VN', options).format(dateObj);
}

export const englishDateFormat = (date: Date | string) => {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		// hour: '2-digit',
		// minute: '2-digit',
		// second: '2-digit',
		// hour12: false,
		timeZone: 'America/New_York', // or 'UTC' depending on your need
	};
	const dateObj = new Date(date);
	return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};

export const formatDateByLocale = (date: Date | string, locale: string) => {
	if (locale === 'vi') {
		return vietnameseDateFormat(date);
	} else if (locale === 'en') {
		return englishDateFormat(date);
	}
	return date.toString();
};

export function formatMoneyByLocale(price: number, locale: string) {
	if (locale === 'vi') {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
	} else if (locale === 'en') {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
	}
	return price.toString();
}