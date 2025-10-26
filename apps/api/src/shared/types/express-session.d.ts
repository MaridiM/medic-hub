import 'express-session'

import type { ISessionMetadataDTO } from './session-metadata.types'

// Предполагается, что этот тип существует. Если нет, замените на `any` или создайте его.

/**
 * @fileoverview Extends the default express-session SessionData interface
 * to include custom properties for our application.
 * This uses TypeScript's declaration merging feature.
 */

declare module 'express-session' {
	interface SessionData {
		/** The unique identifier of the logged-in user */
		userId?: string

		/** The timestamp when the session was created */
		createdAt?: Date

		/** Additional metadata about the session */
		metadata?: ISessionMetadataDTO

		/** Flag indicating if 2FA has been verified for this session */
		is2FAVerified?: boolean

		/** When 2FA was verified */
		verified2FAAt?: Date
	}
}

export {}
