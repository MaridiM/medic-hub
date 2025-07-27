import { DEFAULT_LANGUAGE, I18nService } from '@/core'
import { type ArgumentMetadata, BadRequestException, Injectable, type PipeTransform } from '@nestjs/common'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'

import { bufferToStream, streamToBuffer, validateFileFormat } from '../utils'

@Injectable()
export class FileValidationPipe implements PipeTransform {
	constructor(private readonly i18n: I18nService) {}

	async transform(value: any, _metadata: ArgumentMetadata) {
		if (!value?.filename || typeof value.createReadStream !== 'function') {
			// Преобразуем текущий контекст в ArgumentsHost

			// Пытаемся получить язык (если его явно не передали — fallback)
			const message = this.i18n.t('common.file_not_loaded', { lng: DEFAULT_LANGUAGE }) as string
			throw new BadRequestException(message)
		}

		const { filename, createReadStream } = value

		const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif']
		const isFileFormatValid = validateFileFormat(filename, allowedFormats)
		if (!isFileFormatValid) {
			const message = this.i18n.t('common.unsupported_file_format', { lng: DEFAULT_LANGUAGE }) as string
			throw new BadRequestException(message)
		}

		const originalStream = createReadStream()
		const fileBuffer = await streamToBuffer(originalStream)

		// Check file size (less 10 MB)
		const maxSize = 10 * 1024 * 1024
		if (fileBuffer.length > maxSize) {
			const message = this.i18n.t('common.file_size_exceeded', { lng: DEFAULT_LANGUAGE }) as string
			throw new BadRequestException(message)
		}

		value.createReadStream = () => bufferToStream(fileBuffer)

		return value
	}
}
