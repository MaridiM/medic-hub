import type { NextFunction, Request, Response } from 'express'
import getRawBody from 'raw-body'

import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common'

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		if (!req.readable) {
			return next(new BadRequestException('Не валидные данные из запроса'))
		}

		getRawBody(req, { encoding: 'utf-8' })
			.then(rawBody => {
				req.body = rawBody
				next()
			})
			.catch(error => {
				return next(new BadRequestException('Ошибка при получении: ', error))
			})
	}
}
