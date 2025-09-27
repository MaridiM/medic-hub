import type { NextFunction, Request, Response } from 'express'
import getRawBody from 'raw-body'

import { DEFAULT_LANGUAGE, I18nService } from '@/core'
import { BadRequestException, Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common'

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
	constructor(private readonly i18n: I18nService) {}
	use(req: Request, res: Response, next: NextFunction) {
		const lang = req.language || DEFAULT_LANGUAGE
		if (!req.readable) {
			const message = this.i18n.t('common.invalid_data', { lng: lang }) as string
			return next(new BadRequestException(message))
		}

		getRawBody(req, { encoding: 'utf-8' })
			.then(rawBody => {
				req.body = rawBody
				next()
			})
			.catch(error => {
				const message = this.i18n.t('common.error_getting_raw_body', { lng: lang }) as string
				return next(new InternalServerErrorException(message))
			})
	}
}
