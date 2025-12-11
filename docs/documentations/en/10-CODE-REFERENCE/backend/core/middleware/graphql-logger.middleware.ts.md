# File: core\middleware\graphql-logger.middleware.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/core/middleware/graphql-logger.middleware.ts`

## Category
Backend

## File Type
TS (graphql-logger.middleware.ts)

## Size
8712 characters, 306 lines

## Full Code

```typescript
// src/core/middleware/graphql-logger.middleware.ts
import { NextFunction, Request, Response } from 'express'

import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

interface GraphQLRequest {
	query?: string
	operationName?: string
	variables?: Record<string, unknown>
}

type SanitizedValue = string | number | boolean | null | SanitizedObject | SanitizedArray
type SanitizedObject = { [key: string]: SanitizedValue }
type SanitizedArray = SanitizedValue[]

@Injectable()
export class GraphQLLoggerMiddleware implements NestMiddleware {
	private readonly logger = new Logger('GraphQL')
	private readonly isDevelopment: boolean
	private readonly detailedLogging: boolean

	constructor(private readonly config: ConfigService) {
		this.isDevelopment = this.config.get<string>('NODE_ENV') !== 'production'
		this.detailedLogging = this.config.get<string>('LOG_GRAPHQL_QUERIES') === 'true' || this.isDevelopment
	}

	use(req: Request, res: Response, next: NextFunction): void {
		const { method, originalUrl, ip, body } = req
		const userAgent = req.get('user-agent') || ''
		const language = req.language || 'unknown'
		const startTime = Date.now()

		// Проверяем, что это GraphQL запрос
		const isGraphQL = this.isGraphQLRequest(originalUrl)

		if (!isGraphQL) {
			// Для не-GraphQL запросов используем простое логирование
			this.logRegularRequest(method, originalUrl, ip)
			return this.attachResponseLogger(req, res, next, startTime, false)
		}

		const graphqlBody =
			typeof body === 'object' && body !== null ? (body as GraphQLRequest) : ({} as GraphQLRequest)
		const hasGraphQLPayload =
			(typeof graphqlBody.query === 'string' && graphqlBody.query.trim().length > 0) ||
			(typeof graphqlBody.operationName === 'string' && graphqlBody.operationName.trim().length > 0) ||
			(typeof graphqlBody.variables === 'object' && graphqlBody.variables !== null)

		if (!hasGraphQLPayload) {
			this.logRegularRequest(method, originalUrl, ip)
			return this.attachResponseLogger(req, res, next, startTime, false)
		}

		// Пропускаем introspection в production
		if (!this.isDevelopment && this.isIntrospectionQuery(graphqlBody)) {
			return next()
		}

		// Логируем GraphQL запрос
		this.logGraphQLRequest(graphqlBody, ip, language, userAgent)

		// Перехватываем ответ
		this.attachResponseLogger(req, res, next, startTime, true, graphqlBody)
	}

	/**
	 * Проверка, является ли запрос GraphQL
	 */
	private isGraphQLRequest(url: string): boolean {
		const graphqlPrefix = this.config.get<string>('GRAPHQL_PREFIX') || '/graphql'
		return url.includes(graphqlPrefix)
	}

	/**
	 * Проверка на introspection запрос
	 */
	private isIntrospectionQuery(body: GraphQLRequest): boolean {
		return (
			body?.query?.includes('__schema') ||
			body?.query?.includes('IntrospectionQuery') ||
			body?.operationName === 'IntrospectionQuery'
		)
	}

	/**
	 * Логирование GraphQL запроса
	 */
	private logGraphQLRequest(body: GraphQLRequest, ip: string, language: string, userAgent: string): void {
		const operationName = body.operationName || 'Anonymous'
		const operationType = this.extractOperationType(body.query)

		if (this.detailedLogging) {
			const details: string[] = [`📥 ${operationType} ${operationName}`, `   IP: ${ip}`, `   Lang: ${language}`]

			if (this.isDevelopment && userAgent) {
				details.push(`   User-Agent: ${userAgent.substring(0, 80)}`)
			}

			// Логируем query (обрезаем длинные запросы)
			if (body.query && this.isDevelopment) {
				const queryStr = body.query.replace(/\s+/g, ' ').trim()
				if (queryStr.length > 200) {
					details.push(`   Query: ${queryStr.substring(0, 200)}...`)
				} else {
					details.push(`   Query: ${queryStr}`)
				}
			}

			// Логируем variables (с санитизацией)
			if (body.variables && Object.keys(body.variables).length > 0) {
				const sanitized = this.sanitizeVariables(body.variables)
				details.push(`   Variables: ${JSON.stringify(sanitized, null, 2)}`)
			}

			this.logger.debug(details.join('\n'))
		} else {
			this.logger.log(`📥 ${operationType} ${operationName} - ${ip}`)
		}
	}

	/**
	 * Логирование обычного (не GraphQL) запроса
	 */
	private logRegularRequest(method: string, url: string, ip: string): void {
		this.logger.log(`📥 ${method} ${url} - ${ip}`)
	}

	/**
	 * Извлечение типа операции из query
	 */
	private extractOperationType(query?: string): string {
		if (!query) return 'QUERY'

		const trimmed = query.trim().toLowerCase()
		if (trimmed.startsWith('mutation')) return 'MUTATION'
		if (trimmed.startsWith('subscription')) return 'SUBSCRIPTION'
		return 'QUERY'
	}

	/**
	 * Прикрепление логгера ответа
	 */
	private attachResponseLogger(
		req: Request,
		res: Response,
		next: NextFunction,
		startTime: number,
		isGraphQL: boolean,
		graphqlBody?: GraphQLRequest,
	): void {
		res.on('finish', () => {
			const { statusCode } = res
			const duration = Date.now() - startTime
			const contentLength = res.get('content-length') || '0'

			if (isGraphQL && graphqlBody) {
				this.logGraphQLResponse(graphqlBody, statusCode, duration, contentLength)
			} else {
				this.logRegularResponse(req.method, req.originalUrl, statusCode, duration, contentLength)
			}
		})

		next()
	}

	/**
	 * Логирование GraphQL ответа
	 */
	private logGraphQLResponse(
		body: GraphQLRequest,
		statusCode: number,
		duration: number,
		contentLength: string,
	): void {
		const operationName = body.operationName || 'Anonymous'
		const operationType = this.extractOperationType(body.query)
		const message = `📤 ${operationType} ${operationName} ${statusCode} ${contentLength}b - ${duration}ms`

		if (statusCode === 429) {
			// ✅ Специальное логирование для Rate Limit
			this.logger.error(`🚫 RATE LIMIT: ${message}`)
		} else if (statusCode >= 500) {
			this.logger.error(message)
		} else if (statusCode >= 400) {
			this.logger.warn(message)
		} else if (duration > 1000) {
			this.logger.warn(`⏱️  SLOW: ${message}`)
		} else {
			this.logger.log(message)
		}
	}

	/**
	 * Логирование обычного ответа
	 */
	private logRegularResponse(
		method: string,
		url: string,
		statusCode: number,
		duration: number,
		contentLength: string,
	): void {
		const message = `📤 ${method} ${url} ${statusCode} ${contentLength}b - ${duration}ms`

		if (statusCode >= 500) {
			this.logger.error(message)
		} else if (statusCode >= 400) {
			this.logger.warn(message)
		} else {
			this.logger.log(message)
		}
	}

	/**
	 * Санитизация переменных GraphQL
	 */
	private sanitizeVariables(variables: Record<string, unknown>): SanitizedObject {
		const sensitiveFields = [
			'password',
			'newPassword',
			'oldPassword',
			'currentPassword',
			'token',
			'accessToken',
			'refreshToken',
			'secret',
			'apiKey',
			'code',
			'otp',
			'totpCode',
			'backupCode',
			'verificationCode',
			'recoveryCode',
			'cookie',
			'session',
		]

		const sanitize = (value: unknown): SanitizedValue => {
			// Null и undefined
			if (value === null || value === undefined) {
				return null
			}

			// Примитивные типы
			if (typeof value === 'string') {
				return value
			}

			if (typeof value === 'number') {
				return value
			}

			if (typeof value === 'boolean') {
				return value
			}

			// Массивы
			if (Array.isArray(value)) {
				return value.map(item => sanitize(item)) as SanitizedArray
			}

			// Объекты
			if (typeof value === 'object') {
				const result: SanitizedObject = {}

				for (const key in value) {
					if (Object.prototype.hasOwnProperty.call(value, key)) {
						const objValue = (value as Record<string, unknown>)[key]

						// Проверяем чувствительные поля
						if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
							result[key] = '***REDACTED***'
						} else {
							result[key] = sanitize(objValue)
						}
					}
				}

				return result
			}

			// Для Date объектов
			if (value instanceof Date) {
				return value.toISOString()
			}

			// Для всех остальных неизвестных типов - пытаемся сериализовать через JSON
			try {
				const serialized = JSON.stringify(value)
				// Если сериализация успешна и это не пустой объект
				if (serialized && serialized !== '{}') {
					return serialized
				}
			} catch {
				// Игнорируем ошибки сериализации
			}

			// Последний вариант - возвращаем null для непонятных типов
			return null
		}

		return sanitize(variables) as SanitizedObject
	}
}

```

## Description

This file is part of the MedicHub API (NestJS) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.050Z*
