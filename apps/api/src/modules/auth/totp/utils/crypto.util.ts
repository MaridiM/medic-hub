import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

/**
 * Утилита для шифрования/дешифрования TOTP секретов
 */
export class CryptoUtil {
	private static readonly ALGORITHM = 'aes-256-gcm'
	private static readonly IV_LENGTH = 16
	private static readonly AUTH_TAG_LENGTH = 16

	/**
	 * Получение ключа шифрования из env
	 */
	private static getEncryptionKey(): Buffer {
		const key = process.env.TOTP_ENCRYPTION_KEY

		if (!key) {
			throw new Error('TOTP_ENCRYPTION_KEY is not defined in environment')
		}

		// Ожидаем ключ в hex формате (64 символа для 256 бит)
		if (key.length !== 64) {
			throw new Error('TOTP_ENCRYPTION_KEY must be 64 hex characters (256 bits)')
		}

		return Buffer.from(key, 'hex')
	}

	/**
	 * Шифрование секрета
	 * @param plaintext - Исходный текст
	 * @returns Зашифрованная строка в формате: iv:authTag:encrypted
	 */
	static encrypt(plaintext: string): string {
		try {
			const key = this.getEncryptionKey()
			const iv = randomBytes(this.IV_LENGTH)

			const cipher = createCipheriv(this.ALGORITHM, key, iv)

			let encrypted = cipher.update(plaintext, 'utf8', 'hex')
			encrypted += cipher.final('hex')

			const authTag = cipher.getAuthTag()

			// Формат: iv:authTag:encrypted (все в hex)
			return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
		} catch (error) {
			throw new Error(`Encryption failed: ${(error as Error).message}`)
		}
	}

	/**
	 * Дешифрование секрета
	 * @param encryptedData - Зашифрованная строка
	 * @returns Расшифрованный текст
	 */
	static decrypt(encryptedData: string): string {
		try {
			const key = this.getEncryptionKey()
			const parts = encryptedData.split(':')

			if (parts.length !== 3) {
				throw new Error('Invalid encrypted data format')
			}

			const [ivHex, authTagHex, encryptedHex] = parts

			const iv = Buffer.from(ivHex, 'hex')
			const authTag = Buffer.from(authTagHex, 'hex')
			const encrypted = Buffer.from(encryptedHex, 'hex')

			const decipher = createDecipheriv(this.ALGORITHM, key, iv)
			decipher.setAuthTag(authTag)

			let decrypted = decipher.update(encrypted)
			decrypted = Buffer.concat([decrypted, decipher.final()])

			return decrypted.toString('utf8')
		} catch (error) {
			throw new Error(`Decryption failed: ${(error as Error).message}`)
		}
	}

	/**
	 * Генерация нового ключа шифрования (для первичной настройки)
	 */
	static generateEncryptionKey(): string {
		return randomBytes(32).toString('hex')
	}
}
