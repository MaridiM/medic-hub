export * from './method-data.types'
export * from './device.types'
export * from './risk.types'
export * from './security-event.types'

/**
 * Common response types
 */

export interface ISuccessResponse {
	success: true
	message?: string
}

export interface IErrorResponse {
	success: false
	error: string
	code?: string
}

export type TApiResponse<T = void> = T extends void
	? ISuccessResponse | IErrorResponse
	: (ISuccessResponse & { data: T }) | IErrorResponse

/**
 * Pagination
 */
export interface IPaginationParams {
	page: number
	limit: number
}

export interface IPaginatedResponse<T> {
	data: T[]
	total: number
	page: number
	limit: number
	totalPages: number
}
