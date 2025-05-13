import { useSafeParams } from '@/lib/params';
import { jwtDecode } from 'jwt-decode';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';

export const AUTHENTICATION_ERROR_MESSAGE =
	'You must be logged in to view this content';

export const PRIVATE_GROUP_ERROR_MESSAGE =
	'You do not have permission to view this group';

export const AuthenticationError = class AuthenticationError extends Error {
	constructor() {
		super(AUTHENTICATION_ERROR_MESSAGE);
		this.name = 'AuthenticationError';
	}
};

export const PrivateGroupAccessError = class PrivateGroupAccessError extends Error {
	constructor() {
		super(PRIVATE_GROUP_ERROR_MESSAGE);
		this.name = 'PrivateGroupAccessError';
	}
};

export const NotFoundError = class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NotFoundError';
	}
};

export const isTokenExpired = (token: string) => {
	if (!token) return true;
	try {
		const decoded = jwtDecode(token);
		const now = Math.floor(Date.now() / 1000);
		return decoded.exp! <= now;
	} catch (error) {
		console.error('Error decoding token:', error);
		return true;
	}
};

export function sanitizeBlogContent(html: string): string {
	return sanitizeHtml(html);
}

export function stripHtmlTags(content: string): string {
	return content
		.replace(/<[^>]+>/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

export function createExcerpt(html: string, maxLength: number = 135): string {
	const cleanText = stripHtmlTags(html);

	if (cleanText.length <= maxLength) {
		return cleanText;
	}

	const lastSpace = cleanText.lastIndexOf(' ', maxLength);
	const cutoff = lastSpace > -1 ? lastSpace : maxLength;

	return `${cleanText.substring(0, cutoff)}...`;
}

export function calculateReadingTime(content: string): number {
	const plainText = stripHtmlTags(sanitizeBlogContent(content));
	const words = plainText.split(/\s+/).length;
	const wordsPerMinute = 200;

	return Math.ceil(words / wordsPerMinute);
}

// Simple language detection function
// Enhanced language detection function
export const detectLanguage = (text: string): string => {
	// Return default for empty text
	const normalizedText = text.trim();
	if (!normalizedText) {
		return 'en-US';
	}

	// Expanded Vietnamese word list including common real estate terms
	const patterns = {
		en: /\b(the|is|are|and|in|to|of|for|with|you|that|have|this|it|on|was|not|be|they|but|from|at|his|her|by|will|we|my|our|their|what|who|when|how|there|would|could|should|has|can|an|as|if|about|which|your|one|all|were|been|do|does|did|had|very|just|so|some|like|more|than|only|now|them|i)\b/gi,
		vi: /\b(của|là|và|trong|cho|với|bạn|rằng|có|này|không|đã|được|những|các|một|người|về|tôi|khi|từ|đến|cũng|như|ở|thì|đi|nếu|còn|vì|sẽ|phải|mình|chúng|họ|ai|gì|làm|tại|nhiều|hay|rất|năm|sau|trước|lại|đó|nơi|theo|qua|hoặc|bởi|đang|mọi|nên|nào|mua|bán|nhà|đất|giá|rẻ|căn|hộ|chung|cư|thuê|phòng|trọ|quận|huyện|thành|phố|dự|án|khu|vực|đầu|tư|bất|động|sản|mét|vuông)\b/gi
	};

	// Character-based detection for Vietnamese
	const vietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/g;
	const hasVietnameseChars = vietnameseChars.test(normalizedText);
	
	// If text has Vietnamese diacritical marks, prioritize Vietnamese
	if (hasVietnameseChars) {
		return 'vi-VN';
	}
	
	// Calculate scores based on word matches
	const scores: Record<string, number> = {
		en: 0,
		vi: 0
	};

	const wordCount = normalizedText.split(/\s+/).length;

	if (wordCount > 0) {
		// Count matches for each language
		Object.entries(patterns).forEach(([lang, pattern]) => {
			const matches = (normalizedText.match(pattern) || []).length;
			scores[lang] = matches / wordCount * 100;
		});
	}

	// Add bias for very short Vietnamese phrases
	if (wordCount <= 5) {
		// Check if any words match Vietnamese patterns
		const viMatches = normalizedText.match(patterns.vi) || [];
		if (viMatches.length > 0) {
			scores.vi += 30; // Add extra score for Vietnamese on short phrases
		}
	}

	// Use Vietnamese if its score is higher or equal, otherwise use English
	return scores.vi >= scores.en ? 'vi-VN' : 'en-US';
};

export function useBlogIdParam() {
	const { blogId } = useSafeParams(
		z.object({ blogId: z.string().pipe(z.coerce.number()) })
	);
	return blogId;
}
