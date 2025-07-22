import type { Request } from 'express'

import { InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { User } from '@prisma/__generated__'

import type { ISessionMetadata } from '../types'

/**
 * Save user session and set userId, metadata, createdAt
 * @param req - request
 * @param user - current user
 * @param metadata - user's metadata
 * @returns - user
 */
export function saveSession(req: Request, user: User, metadata: ISessionMetadata) {
	return new Promise((resolve, reject) => {
		req.session.createdAt = new Date()
		req.session.userId = user.id
		req.session.metadata = metadata

		req.session.save(err => {
			if (err) {
				return reject(new InternalServerErrorException('Не удалось сохранить сессию'))
			}

			resolve({ user })
		})
	})
}

/**
 * Destroy session from cookie and redis
 * @param req - request
 * @param configService - config service
 * @returns boolean
 */
export function destroySession(req: Request, configService: ConfigService) {
	return new Promise((resolve, reject) => {
		req.session.destroy(err => {
			if (err) {
				return reject(new InternalServerErrorException('Не удалось завершить сессию'))
			}

			req.res.clearCookie(configService.getOrThrow<string>('SESSION_NAME'))
			resolve(true)
		})
	})
}
