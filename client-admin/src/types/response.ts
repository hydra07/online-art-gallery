export type ApiResponse<T = unknown> = {
	data: T | null;
	message: string | null;
	status: number;
	errorCode: string | null;
	details: unknown;
};

export type Pagination = {
	total: number;
	page: number;
	limit: number;
	pages: number;
	hasNext: boolean;
	hasPrev: boolean;
}