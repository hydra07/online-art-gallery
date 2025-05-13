export type ApiResponse<T = unknown> = {
    data: T | null;
    message: string | null;
    status: number;
    errorCode: string | null;
    details: unknown;
};
type BaseResponse<T = null> = {
    data: T;
    message: string;
    statusCode: number;
    errorCode: string | null;
    details: unknown | null;
}

export type Pagination = {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export default BaseResponse;