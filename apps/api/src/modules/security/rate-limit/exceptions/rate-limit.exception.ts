// src/modules/security/rate-limit/exceptions/rate-limit.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common'

export interface RateLimitExceptionResponse {
	statusCode: number
	message: string
	error: string
	retryAfter: number // seconds
	retryAfterMs: number // milliseconds
	retryAt: string // ISO timestamp
	limits: {
		points: number
		duration: number
		consumed: number
		remaining: number
	}
}

export class RateLimitException extends HttpException {
	constructor(baseMessage: string, retryAfterMs: number, points: number, duration: number, consumed: number) {
		const retryAfter = Math.ceil(retryAfterMs / 1000)
		const retryAt = new Date(Date.now() + retryAfterMs).toISOString()

		// ✅ Вызываем статический метод через имя класса
		const timeFormatted = RateLimitException.formatTime(retryAfter)
		const message = `${baseMessage} Please try again in ${timeFormatted}.`

		const response: RateLimitExceptionResponse = {
			statusCode: HttpStatus.TOO_MANY_REQUESTS,
			message,
			error: 'Too Many Requests',
			retryAfter,
			retryAfterMs,
			retryAt,
			limits: {
				points,
				duration,
				consumed,
				remaining: 0,
			},
		}

		super(response, HttpStatus.TOO_MANY_REQUESTS)
	}

	/**
	 * Форматирует секунды в читаемый формат
	 * @example
	 * 45 -> "45 seconds"
	 * 125 -> "2 minutes and 5 seconds"
	 * 3665 -> "1 hour and 1 minute"
	 * 90 -> "1 minute and 30 seconds"
	 */
	private static formatTime(seconds: number): string {
		if (seconds <= 0) return '0 seconds'

		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const secs = seconds % 60

		const parts: string[] = []

		if (hours > 0) {
			parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
		}
		if (minutes > 0) {
			parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`)
		}
		if (secs > 0 && hours === 0) {
			// Показываем секунды только если нет часов
			parts.push(`${secs} second${secs !== 1 ? 's' : ''}`)
		}

		// Если нет ни одной части, возвращаем "0 seconds"
		if (parts.length === 0) {
			return '0 seconds'
		}

		// Соединяем части
		if (parts.length === 1) {
			return parts[0]
		}

		// Последний элемент добавляем через "and"
		const lastPart = parts.pop()
		return `${parts.join(', ')} and ${lastPart}`
	}
}
