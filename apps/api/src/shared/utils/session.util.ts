import type { Request } from 'express'

import { DEFAULT_LANGUAGE, i18n } from '@/core'
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
	const lang = req.language || DEFAULT_LANGUAGE
	return new Promise((resolve, reject) => {
		req.session.createdAt = new Date()
		req.session.userId = user.id
		req.session.metadata = metadata

		req.session.save(err => {
			if (err) {
				console.log('err', err)
				const message = i18n.t('common.errors.session.save_error', { lng: lang }) || 'Error saving session'
				return reject(new InternalServerErrorException(message))
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
	const lang = req.language || DEFAULT_LANGUAGE
	return new Promise((resolve, reject) => {
		req.session.destroy(err => {
			if (err) {
				const message =
					i18n.t('common.errors.session.destroy_error', { lng: lang }) || 'Error destroying session'
				return reject(new InternalServerErrorException(message))
			}

			req.res.clearCookie(configService.getOrThrow<string>('SESSION_NAME'))
			resolve(true)
		})
	})
}
