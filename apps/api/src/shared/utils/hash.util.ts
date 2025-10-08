import { hash, verify } from 'argon2'

/**
 * Утилита для хеширования с использованием Argon2id
 * Argon2id - рекомендуемый вариант, объединяющий защиту от GPU и side-channel атак
 */
export class HashUtil {
	// Конфигурация Argon2id (OWASP рекомендации 2023)
	private static readonly config = {
		memoryCost: 19456, // 19 MiB (в KiB)
		timeCost: 2, // 2 итерации
		parallelism: 1, // Количество потоков
	}

	/**
	 * Хеширование строки
	 * @param plaintext - Исходная строка
	 * @returns Хешированная строка в формате Argon2
	 */
	static async hash(plaintext: string): Promise<string> {
		return Promise.resolve(
			hash(plaintext, {
				memoryCost: this.config.memoryCost,
				timeCost: this.config.timeCost,
				parallelism: this.config.parallelism,
			}),
		)
	}

	/**
	 * Верификация строки
	 * @param hash - Хеш для проверки
	 * @param plaintext - Исходная строка
	 * @returns true если совпадает
	 */
	static async verify(hash: string, plaintext: string): Promise<boolean> {
		try {
			return verify(hash, plaintext)
		} catch {
			// Если хеш некорректный, возвращаем false
			return false
		}
	}

	/**
	 * Проверка необходимости rehash (если параметры устарели)
	 * @param hash - Текущий хеш
	 * @returns true если нужен rehash
	 */
	static needsRehash(hash: string): boolean {
		try {
			// Формат Argon2: $argon2id$v=19$m=19456,t=2,p=1$...
			const params = hash.split('$')
			if (params.length < 5) return true

			const config = params[3]
			if (!config) return true

			const configParts = config.split(',')

			const m = parseInt(configParts[0]?.split('=')[1] ?? '0', 10)
			const t = parseInt(configParts[1]?.split('=')[1] ?? '0', 10)
			const p = parseInt(configParts[2]?.split('=')[1] ?? '0', 10)

			return m !== this.config.memoryCost || t !== this.config.timeCost || p !== this.config.parallelism
		} catch {
			return true
		}
	}
}
