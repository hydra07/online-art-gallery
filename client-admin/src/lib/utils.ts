import {
  MAX_UPLOAD_IMAGE_SIZE,
  MAX_UPLOAD_IMAGE_SIZE_IN_MB,
} from "@/app-config";
import { clsx, type ClassValue } from "clsx";
import { jwtDecode } from "jwt-decode";
import { twMerge } from "tailwind-merge";
import sanitizeHtml from "sanitize-html";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

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

export function sanitizeBlogContent(html: string): string {
  return sanitizeHtml(html);
}

export function stripHtmlTags(content: string): string {
  return content
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateReadingTime(content: string): number {
  const plainText = stripHtmlTags(sanitizeBlogContent(content));
  const words = plainText.split(/\s+/).length;
  const wordsPerMinute = 200;

  return Math.ceil(words / wordsPerMinute);
}