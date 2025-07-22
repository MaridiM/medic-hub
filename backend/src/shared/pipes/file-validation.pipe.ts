import { type ArgumentMetadata, BadRequestException, Injectable, type PipeTransform } from '@nestjs/common'

import { bufferToStream, streamToBuffer, validateFileFormat } from '../utils'

@Injectable()
export class FileValidationPipe implements PipeTransform {
	async transform(value: any, _metadata: ArgumentMetadata) {
		if (!value?.filename || typeof value.createReadStream !== 'function') {
			throw new BadRequestException('Файл не загружен или неверная структура')
		}

		const { filename, createReadStream } = value

		const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif']
		const isFileFormatValid = validateFileFormat(filename, allowedFormats)
		if (!isFileFormatValid) {
			throw new BadRequestException('Неподдерживаемый формат файла')
		}

		const originalStream = createReadStream()
		const fileBuffer = await streamToBuffer(originalStream)

		// Check file size (less 10 MB)
		const maxSize = 10 * 1024 * 1024
		if (fileBuffer.length > maxSize) {
			throw new BadRequestException('Размер файла превышает 10 МБ')
		}

		value.createReadStream = () => bufferToStream(fileBuffer)

		return value
	}
}
