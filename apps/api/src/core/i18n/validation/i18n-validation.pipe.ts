import { validate, ValidatorOptions } from 'class-validator'

import {
	ArgumentMetadata,
	Inject,
	Injectable,
	Scope,
	ValidationError,
	ValidationPipe,
	ValidationPipeOptions,
} from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

type ReqLike = {
	cookies?: Record<string, string | undefined>
	language?: string
	headers?: Record<string, string | string[] | undefined>
}

// ✅ Создаём расширенный тип для опций с контекстом
type ValidatorOptionsWithContext = ValidatorOptions & {
	context?: {
		lang?: string
		[key: string]: any
	}
}

function norm(v?: string | string[]): string | undefined {
	const raw = Array.isArray(v) ? v[0] : v
	if (!raw) return
	return raw.split(',')[0]?.split(';')[0]?.trim().toLowerCase() || undefined
}

@Injectable({ scope: Scope.REQUEST })
export class I18nValidationPipe extends ValidationPipe {
	private lang: string = 'en'

	constructor(
		@Inject(REQUEST) private readonly request: ReqLike,
		options?: ValidationPipeOptions,
	) {
		super({
			...options,
			transform: true,
			whitelist: true,
		})
	}

	public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
		this.lang =
			norm(this.request.cookies?.language) ??
			norm(this.request.language) ??
			norm(this.request.headers?.['accept-language']) ??
			'en'

		return super.transform(value, metadata)
	}

	protected async validate(object: object, validatorOptions?: Record<string, any>): Promise<ValidationError[]> {
		const optionsWithContext: ValidatorOptionsWithContext = {
			...validatorOptions,
			context: { lang: this.lang },
		}

		return validate(object, optionsWithContext as ValidatorOptions)
	}
}
