import 'express'

declare global {
	namespace Express {
		interface Request {
			/**
			 * Preferred language (i18n middleware may set this)
			 */
			language?: string
		}
	}
}
