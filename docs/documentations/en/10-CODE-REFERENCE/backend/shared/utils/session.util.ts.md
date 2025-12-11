# File: shared\utils\session.util.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/utils/session.util.ts`

## Category
Backend

## File Type
TS (session.util.ts)

## Size
2259 characters, 74 lines

## Full Code

```typescript
import type { Request } from 'express'

import { i18n } from '@/core/config'
import { DEFAULT_LANGUAGE } from '@/core/i18n'
import { InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { User } from '@prisma/__generated__'

import type { ISessionMetadataDTO } from '../types'

/**
 * Save user session and set userId, metadata, createdAt
 * @param req - request
 * @param user - current user
 * @param metadata - user's metadata
 * @returns - user
 */
export function saveSession(req: Request, user: User, metadata: ISessionMetadataDTO) {
	const lang = req.language || DEFAULT_LANGUAGE

	return new Promise<{ user: User }>((resolve, reject) => {
		if (!req.session) {
			const message =
				i18n.t('common.errors.session.not_initialized', { lng: lang }) || 'Session is not initialized'
			return reject(new InternalServerErrorException(message))
		}

		req.session.createdAt = new Date()
		req.session.userId = user.id
		req.session.metadata = metadata

		req.session.save(err => {
			if (err) {
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
export function destroySession(req: Request, configService: ConfigService): Promise<boolean> {
	const lang = req.language || DEFAULT_LANGUAGE

	return new Promise<boolean>((resolve, reject) => {
		if (!req.session) {
			// если сессии нет — считать уничтоженной
			return resolve(true)
		}

		req.session.destroy(err => {
			if (err) {
				const message =
					i18n.t('common.errors.session.destroy_error', { lng: lang }) || 'Error destroying session'
				return reject(new InternalServerErrorException(message))
			}

			// req.res может быть undefined в некоторых контекстах (тесты/скрипты)
			const sessionCookieName = configService.get<string>('SESSION_NAME')
			if (sessionCookieName && req.res?.clearCookie) {
				req.res.clearCookie(sessionCookieName)
			}

			resolve(true)
		})
	})
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.752Z*
