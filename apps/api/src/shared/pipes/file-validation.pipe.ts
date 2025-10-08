import { Readable } from 'node:stream'

import { DEFAULT_LANGUAGE, I18nService } from '@/core/i18n'
import { type ArgumentMetadata, BadRequestException, Injectable, type PipeTransform } from '@nestjs/common'

import { bufferToStream, streamToBuffer, validateFileFormat } from '../utils'

/** Минимальный контракт GraphQL Upload (graphql-upload) */
export type GqlUpload = {
	filename: string
	mimetype?: string
	encoding?: string
	createReadStream: () => Readable
}

/** Тайп-гарда для аплоада */
function isGqlUpload(x: unknown): x is GqlUpload {
	if (typeof x !== 'object' || x === null) return false
	const o = x as Record<string, unknown>
	if (!('filename' in o) || !('createReadStream' in o)) return false

	const filename = o.filename
	const createReadStream = o.createReadStream

	return typeof filename === 'string' && typeof createReadStream === 'function'
}

/** Расширенный тип: тот же объект, но с «переписанным» createReadStream на буфер */
export type BufferedUpload = Omit<GqlUpload, 'createReadStream'> & {
	createReadStream: () => Readable
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
	constructor(private readonly i18n: I18nService) {}

	async transform(value: unknown, _metadata: ArgumentMetadata): Promise<BufferedUpload> {
		// 1) Проверяем форму входа
		if (!isGqlUpload(value)) {
			const message =
				this.i18n.t('common.errors.file.not_loaded', { lng: DEFAULT_LANGUAGE }) ??
				'File not loaded or invalid structure'
			throw new BadRequestException(message)
		}

		const { filename, createReadStream } = value

		// 2) Проверяем формат по расширению (или можно по mimetype, если он приходит)
		const allowedExt: Array<'jpg' | 'jpeg' | 'png' | 'webp' | 'gif'> = ['jpg', 'jpeg', 'png', 'webp', 'gif']
		const okFormat = validateFileFormat(filename, allowedExt)
		if (!okFormat) {
			const message =
				this.i18n.t('common.errors.file.unsupported_format', { lng: DEFAULT_LANGUAGE }) ??
				'Unsupported file format'
			throw new BadRequestException(message)
		}

		// 3) Считываем в буфер и проверяем размер
		const originalStream = createReadStream()
		const fileBuffer = await streamToBuffer(originalStream)

		const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
		if (fileBuffer.length > MAX_SIZE_BYTES) {
			const message =
				this.i18n.t('common.errors.file.size_exceeded_10mb', { lng: DEFAULT_LANGUAGE }) ??
				'File size exceeds 10 MB'
			throw new BadRequestException(message)
		}

		// 4) Подменяем stream на «буферный» (чтобы можно было читать повторно)
		const buffered: BufferedUpload = {
			...value,
			createReadStream: () => bufferToStream(fileBuffer),
		}

		return buffered
	}
}

// import { DEFAULT_LANGUAGE, I18nService } from '@/core'
// import { type ArgumentMetadata, BadRequestException, Injectable, type PipeTransform } from '@nestjs/common'

// import { bufferToStream, streamToBuffer, validateFileFormat } from '../utils'

// @Injectable()
// export class FileValidationPipe implements PipeTransform {
// 	constructor(private readonly i18n: I18nService) {}

// 	async transform(value: any, _metadata: ArgumentMetadata) {
// 		if (!value?.filename || typeof value.createReadStream !== 'function') {
// 			// Преобразуем текущий контекст в ArgumentsHost

// 			// Пытаемся получить язык (если его явно не передали — fallback)
// 			const message =
// 				this.i18n.t('common.errors.file.not_loaded', { lng: DEFAULT_LANGUAGE }) ||
// 				'File not loaded or invalid structure'
// 			throw new BadRequestException(message)
// 		}

// 		const { filename, createReadStream } = value

// 		const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif']
// 		const isFileFormatValid = validateFileFormat(filename, allowedFormats)
// 		if (!isFileFormatValid) {
// 			const message =
// 				this.i18n.t('common.errors.file.unsupported_format', { lng: DEFAULT_LANGUAGE }) ||
// 				'Unsupported file format'
// 			throw new BadRequestException(message)
// 		}

// 		const originalStream = createReadStream()
// 		const fileBuffer = await streamToBuffer(originalStream)

// 		// Check file size (less 10 MB)
// 		const maxSize = 10 * 1024 * 1024
// 		if (fileBuffer.length > maxSize) {
// 			const message =
// 				this.i18n.t('common.errors.file.size_exceeded_10mb', { lng: DEFAULT_LANGUAGE }) ||
// 				'File size exceeds 10 MB'
// 			throw new BadRequestException(message)
// 		}

// 		value.createReadStream = () => bufferToStream(fileBuffer)

// 		return value
// 	}
// }
