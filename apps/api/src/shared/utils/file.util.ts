import { Readable } from 'stream'

/**
 * Checks if the uploaded file format is valid
 * @param filename - the file's name
 * @param allowedFileFormats - an array of allowed file extensions (e.g., ['jpg','png','gif'])
 * @returns true if the extension is allowed, otherwise false
 */
export function validateFileFormat(filename: string, allowedFileFormats: string[]) {
	const fileParts = filename.split('.')
	const extension = fileParts[fileParts.length - 1]?.toLowerCase()

	return allowedFileFormats.includes(extension)
}

/**
 * Converts a Readable stream into a single Buffer by collecting all chunks.
 * @param stream - The Readable stream to be consumed
 * @returns A Promise that resolves to a Buffer containing all the data from the stream
 */
export function streamToBuffer(stream: Readable): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = []

		stream.on('data', chunk => {
			chunks.push(chunk)
		})

		stream.on('end', () => {
			resolve(Buffer.concat(chunks))
		})

		stream.on('error', err => {
			reject(err)
		})
	})
}

/**
 * Creates a new Readable stream from a given Buffer.
 * @param buffer - The Buffer to be converted into a stream
 * @returns A Readable stream that will emit the contents of the buffer
 */
export function bufferToStream(buffer: Buffer): Readable {
	const readable = new Readable()
	readable.push(buffer)
	readable.push(null) // Signifies the end of the stream
	return readable
}
