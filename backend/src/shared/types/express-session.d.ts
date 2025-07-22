import 'express-session'

import type { ISessionMetadata } from './session-metadata.types'

declare module 'express-session' {
	interface SessionData {
		userId?: string
		createdAt?: Datae | string
		metadata?: ISessionMetadata
	}
}
