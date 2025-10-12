import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

/**
 * Encryption utility for 2FA sensitive data
 * Uses AES-256-GCM for authenticated encryption
 */
export class EncryptionUtil {
	private static readonly ALGORITHM = 'aes-256-gcm'
	private static readonly IV_LENGTH = 16
	private static readonly AUTH_TAG_LENGTH = 16
	private static readonly KEY_LENGTH = 32

	/**
	 * Get encryption key from environment
	 * @throws Error if key is not configured
	 */
	private static getKey(): Buffer {
		const key = process.env.TWO_FA_ENCRYPTION_KEY

		if (!key) {
			throw new Error('TWO_FA_ENCRYPTION_KEY is not defined in environment')
		}

		// Expect hex-encoded 256-bit key (64 characters)
		if (key.length !== 64) {
			throw new Error('TWO_FA_ENCRYPTION_KEY must be 64 hex characters (256 bits)')
		}

		return Buffer.from(key, 'hex')
	}

	/**
	 * Encrypt plaintext using AES-256-GCM
	 * @param plaintext Data to encrypt
	 * @returns Encrypted string in format: iv:authTag:ciphertext (all hex-encoded)
	 */
	static encrypt(plaintext: string): string {
		try {
			const key = this.getKey()
			const iv = randomBytes(this.IV_LENGTH)

			const cipher = createCipheriv(this.ALGORITHM, key, iv)

			let encrypted = cipher.update(plaintext, 'utf8', 'hex')
			encrypted += cipher.final('hex')

			const authTag = cipher.getAuthTag()

			// Format: iv:authTag:ciphertext
			return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
		} catch (error) {
			throw new Error(`Encryption failed: ${(error as Error).message}`)
		}
	}

	/**
	 * Decrypt ciphertext using AES-256-GCM
	 * @param encryptedData Encrypted string in format iv:authTag:ciphertext
	 * @returns Decrypted plaintext
	 */
	static decrypt(encryptedData: string): string {
		try {
			const key = this.getKey()
			const parts = encryptedData.split(':')

			if (parts.length !== 3) {
				throw new Error('Invalid encrypted data format')
			}

			const [ivHex, authTagHex, ciphertextHex] = parts

			const iv = Buffer.from(ivHex, 'hex')
			const authTag = Buffer.from(authTagHex, 'hex')
			const ciphertext = Buffer.from(ciphertextHex, 'hex')

			const decipher = createDecipheriv(this.ALGORITHM, key, iv)
			decipher.setAuthTag(authTag)

			let decrypted = decipher.update(ciphertext)
			decrypted = Buffer.concat([decrypted, decipher.final()])

			return decrypted.toString('utf8')
		} catch (error) {
			throw new Error(`Decryption failed: ${(error as Error).message}`)
		}
	}

	/**
	 * Encrypt JSON object
	 * @param data Object to encrypt
	 * @returns Encrypted string
	 */
	static encryptJSON<T>(data: T): string {
		return this.encrypt(JSON.stringify(data))
	}

	/**
	 * Decrypt to JSON object
	 * @param encryptedData Encrypted string
	 * @returns Decrypted object
	 */
	static decryptJSON<T>(encryptedData: string): T {
		const decrypted = this.decrypt(encryptedData)
		return JSON.parse(decrypted) as T
	}

	/**
	 * Generate a new encryption key (for initial setup)
	 * @returns Hex-encoded 256-bit key
	 */
	static generateKey(): string {
		return randomBytes(this.KEY_LENGTH).toString('hex')
	}
}
