# File: shared\middlewares\raw-body.middleware.ts

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/api/src/shared/middlewares/raw-body.middleware.ts`

## Category
Backend

## File Type
TS (raw-body.middleware.ts)

## Size
1049 characters, 31 lines

## Full Code

```typescript
import type { NextFunction, Request, Response } from 'express'
import getRawBody from 'raw-body'

import { DEFAULT_LANGUAGE, I18nService } from '@/core/i18n'
import { BadRequestException, Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common'

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
	constructor(private readonly i18n: I18nService) {}
	use(req: Request, res: Response, next: NextFunction) {
		const lang = req.language || DEFAULT_LANGUAGE
		if (!req.readable) {
			const message =
				this.i18n.t('common.errors.request.invalid_data', { lng: lang }) || 'Invalid data from request'
			return next(new BadRequestException(message))
		}

		getRawBody(req, { encoding: 'utf-8' })
			.then(rawBody => {
				req.body = rawBody
				next()
			})
			.catch(() => {
				const message =
					this.i18n.t('common.errors.request.error_getting_raw_body', { lng: lang }) ||
					'Error getting raw body'
				return next(new InternalServerErrorException(message))
			})
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:19.667Z*
