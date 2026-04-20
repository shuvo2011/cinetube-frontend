export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
	meta?: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}
export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}
export interface ApiErrorResponse {
	success: false;
	message: string;
}
