import {
	MAX_UPLOAD_IMAGE_SIZE,
	MAX_UPLOAD_IMAGE_SIZE_IN_MB
} from '@/app-config';
import { type ClassValue, clsx } from 'clsx';
import { jwtDecode } from 'jwt-decode';
import { twMerge } from 'tailwind-merge';
import slugify from 'slugify';
import { Exhibition, PublicExhibition } from '@/types/exhibition';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatTime = (seconds: number) =>  {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const padZero = (num: number): string => String(num).padStart(2, '0');

export const formatDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error("Invalid date passed to formatDate:", date);
    return "Invalid Date";
  }

  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1); // getMonth() is 0-indexed (0-11)
  const day = padZero(date.getDate());
//   const hour = padZero(date.getHours());
//   const minute = padZero(date.getMinutes());
//   const second = padZero(date.getSeconds());

  return `${day}-${month}-${year}`;
}

export const isTokenExpired = (token: string): boolean => {
	if (!token) return true;
	try {
		const decoded = jwtDecode<{ exp: number }>(token);
		const now = Math.floor(Date.now() / 1000);
		const timeRemaining = decoded.exp! - now;

		// Kiểm tra nếu token hết hạn trước 1 phút
		if (timeRemaining > 60) {
			console.log(`Token còn sống trong ${timeRemaining} giây.`);
			return false; // Token chưa hết hạn
		} else {
			console.log('Token đã hết hạn hoặc sắp hết hạn trong vòng 1 phút.');
			return true; // Token hết hạn hoặc gần hết hạn
		}
	} catch (error) {
		console.error('Error decoding token:', error);
		return true; // Token không hợp lệ
	}
};

export function validateImage(image: File) {
	if (!image.type.startsWith('image/')) {
		throw new Error('Invalid image type');
	}
	if (image.size > MAX_UPLOAD_IMAGE_SIZE) {
		throw new Error(
			`File size too large. Max size is ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`
		);
	}
}

export function createSlug(title: string): string {
	return slugify(title, {
		lower: true, // Convert to lower case
		strict: true, // Strip special characters except replacement
		trim: true, // Trim leading and trailing replacement chars
		locale: 'vi', // Language code for locale-specific rules
		remove: /[*+~.()'"!:@]/g // Remove specific characters
	});
}



export function getLocalizedContent(exhibition: Exhibition | PublicExhibition, locale: string) {
	// Try to find content matching current locale
	const localContent = exhibition.contents.find(
	  content => content.languageCode === locale
	);
  
	if (!localContent) {
	  // If no match, try to find content in default language
	  const defaultLang = exhibition.languageOptions.find(lang => lang.isDefault);
	  return exhibition.contents.find(
		content => content.languageCode === defaultLang?.code
	  ) || exhibition.contents[0]; // Fallback to first content if no default found
	}
  
	return localContent;
  }