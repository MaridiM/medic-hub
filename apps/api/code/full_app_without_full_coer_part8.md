# Full App Code (excluding imports, tests, i18n, extra core) - Part 8 of 8

`src/shared/types/express-session.d.ts`


```typescript
// Предполагается, что этот тип существует. Если нет, замените на `any` или создайте его.

/**
 * @fileoverview Extends the default express-session SessionData interface
 * to include custom properties for our application.
 * This uses TypeScript's declaration merging feature.
 */

declare module 'express-session' {
	interface SessionData {
		/** The unique identifier of the logged-in user */
		userId?: string

		/** The timestamp when the session was created */
		createdAt?: Date

		/** Additional metadata about the session */
		metadata?: ISessionMetadata

		/** Flag indicating if 2FA has been verified for this session */
		is2FAVerified?: boolean

		/** When 2FA was verified */
		verified2FAAt?: Date
	}
}

export {}

```




`src/shared/types/express.d.ts`


```typescript
declare global {
	namespace Express {
		interface Request {
			/**
			 * Preferred language (i18n middleware may set this)
			 */
			language?: string
		}
	}
}

```




`src/shared/types/gql-context.types.ts`


```typescript
/**
 * The authenticated user object attached to the request,
 * with sensitive fields like 'password' omitted.
 * Using a `type` alias is the correct approach for transformations like Omit.
 */
export type AuthenticatedUser = Omit<PrismaUser, 'password'>

/**
 * Extends the base Express Request interface to include our custom properties,
 * ensuring type safety throughout the application.
 */
export interface AuthenticatedRequest extends Request {
	/**
	 * The authenticated user object, attached by an authentication guard/middleware.
	 */
	user?: AuthenticatedUser

	/**
	 * The session object, now correctly typed with our custom fields
	 * thanks to declaration merging in `session.types.ts`.
	 */
	session: Request['session']
}

/**
 * The GraphQL context object, providing typed access to the request and response.
 */
export interface GqlContext {
	req: AuthenticatedRequest
	res: Response
}

```




`src/shared/types/index.ts`


```typescript
export * from './gql-context.types'
export * from './session-metadata.types'

```




`src/shared/types/session-metadata.types.ts`


```typescript
export interface ILocation {
	country: string
	city: string
	latitude: number
	longitude: number
}

export interface IDevice {
	browser: string
	os: string
	type: string
}

export interface ISessionMetadata {
	location: ILocation
	device: IDevice
	ip: string
}

```




`src/shared/utils/errors/error.ts`


```typescript
/**
 * Тип JSON-примитива, который гарантированно сериализуем в строку без вложенных структур.
 */
type JsonPrimitive = string | number | boolean | null

/**
 * Узкий тайп-гарда для проверки, что значение — экземпляр Error.
 * @param x Любое значение неизвестного типа.
 * @returns true, если x — Error.
 */
function isError(x: unknown): x is Error {
	return x instanceof Error
}

/**
 * Тайп-гарда: является ли значение непустым объектом (Record).
 * Массивы и функции не исключаются — это ожидаемое поведение для JSON.stringify.
 * @param x Любое значение.
 * @returns true, если x — объект и не null.
 */
function isRecord(x: unknown): x is Record<string, unknown> {
	return typeof x === 'object' && x !== null
}

/**
 * Безопасно сериализует «что угодно» в строку для логов:
 * - Для `Error` формирует JSON c `name`, `message`, `stack` и рекурсивно сериализует `cause`;
 * - Для примитивов (string/number/boolean/null/undefined) возвращает строковое представление;
 * - Для объектов пытается `JSON.stringify` с защитой от циклов и поддержкой BigInt;
 * - В крайнем случае возвращает тег вида `"[object Something]"`.
 *
 * Гарантирует возвращаемый тип `string` и не использует небезопасных приведения типов.
 *
 * @param x Любое значение (обычно то, что пришло в `catch` как `unknown`).
 * @returns Строка, пригодная для логгирования.
 *
 * @example
 * serializeUnknown(new Error('boom'))
 * // => '{"name":"Error","message":"boom","stack":"..."}'
 *
 * serializeUnknown({ a: 1, self: ref })
 * // => '{"a":1,"self":"[Circular]"}'
 */
export function serializeUnknown(x: unknown): string {
	if (isError(x)) {
		const base: Record<string, JsonPrimitive> = {
			name: x.name,
			message: x.message,
			stack: x.stack ?? null,
		}
		const maybeCause = (x as { cause?: unknown }).cause
		if (typeof maybeCause !== 'undefined') {
			base.cause = serializeUnknown(maybeCause)
		}
		return JSON.stringify(base)
	}

	if (typeof x === 'string') return x
	if (typeof x === 'number') return `${x}`
	if (typeof x === 'boolean') return x ? 'true' : 'false'
	if (x === null) return 'null'
	if (x === undefined) return 'undefined'

	try {
		const json = JSON.stringify(x, createCycleReplacer())
		if (typeof json === 'string') return json
	} catch {
		// ignore
	}
	return objectTag(x) // ← всегда string, без no-unsafe-return
}

/**
 * Создаёт `replacer` для `JSON.stringify`, который:
 * 1) защищает от циклических ссылок, подставляя строку "[Circular]";
 * 2) сериализует BigInt как строку (по умолчанию JSON не умеет BigInt).
 *
 * Используется внутри `serializeUnknown` и `safeStringify`.
 *
 * @returns Функция-заменитель, совместимая с параметром `replacer` JSON.stringify.
 */
function createCycleReplacer() {
	const seen = new WeakSet<object>()
	return (_key: string, value: unknown) => {
		if (isRecord(value)) {
			if (seen.has(value)) return '[Circular]'
			seen.add(value)
		}
		if (typeof value === 'bigint') return value.toString()
		return value
	}
}

/**
 * Упрощённая версия безопасной сериализации для «обычных» значений.
 * Отличается от `serializeUnknown` тем, что не разбирает Error детально,
 * а пытается получить JSON-строку или отдаёт тег вида `"[object Something]"`.
 *
 * Полезно, когда не нужен подробный разбор ошибок, а достаточно «что-то логопригодное».
 *
 * @param x Любое значение.
 * @returns Строка (гарантированно).
 *
 * @example
 * safeStringify({a:1})         // '{"a":1}'
 * safeStringify(new Set([1]))  // '"[object Set]"' (если JSON не справился)
 */
export function safeStringify(x: unknown): string {
	if (typeof x === 'string') return x
	try {
		const json = JSON.stringify(x, createCycleReplacer()) // string | undefined
		if (typeof json === 'string') return json
	} catch {
		// ignore
	}
	return objectTag(x) // ← строго string
}

```




`src/shared/utils/errors/index.ts`


```typescript
export * from './error'
export * from './log'
export * from './prisma-errors'
export * from './tag'

```




`src/shared/utils/errors/log.ts`


```typescript
/**
 * Логирует ошибку неизвестного типа в формате, корректном для Nest `Logger`.
 *
 * - Если `err` — экземпляр `Error`, стек передаётся **отдельным аргументом**,
 *   чтобы логгер отформатировал его нативно (со стэктрейсом).
 * - Если `err` не `Error` (строка, число, объект, `null`/`undefined` и т.п.),
 *   значение сериализуется через `safeStringify` (c защитой от циклов/BigInt).
 *
 * @param logger  Экземпляр Nest `Logger` (например, `new Logger(RedisService.name)`).
 * @param prefix  Короткий префикс/сообщение (контекст ошибки), например: `"Redis connect error"`.
 * @param err     Любое значение из `catch` (тип `unknown`).
 * @param context Необязательный контекст для Nest Logger (обычно имя класса/сервиса).
 *
 * @example
 * const logger = new Logger(RedisService.name)
 * try {
 *   await client.connect()
 * } catch (e) {
 *   logUnknownError(logger, 'Redis connect error', e, RedisService.name)
 * }
 *
 * // Вывод:
 * // [Error] Redis connect error
 * // <stack trace>  // если err instanceof Error
 * //
 * // или
 * // Redis connect error: {"foo":"bar"}  // для произвольных значений
 */
export function logUnknownError(logger: Logger, prefix: string, err: unknown, context?: string): void {
	if (err instanceof Error) {
		logger.error(prefix, err.stack, context)
	} else {
		logger.error(`${prefix}: ${safeStringify(err)}`, undefined, context)
	}
}

```




`src/shared/utils/errors/prisma-errors.ts`


```typescript
export function isPrismaError(e: unknown, code?: string): e is Prisma.PrismaClientKnownRequestError {
	const err = e as Prisma.PrismaClientKnownRequestError
	return !!err && err.name === 'PrismaClientKnownRequestError' && (code ? err.code === code : true)
}

```




`src/shared/utils/errors/tag.ts`


```typescript
/**
 * Типобезопасная обёртка над `Object.prototype.toString.call(v)`.
 * Нужна, чтобы избежать предупреждений `no-unsafe-return`/`no-unsafe-call` и
 * всегда возвращать строго `string`.
 *
 * @example
 * objectTag(123)            // "[object Number]"
 * objectTag(new Date())     // "[object Date]"
 */
export const objectTag = (v: unknown): string => {
	// call() действительно возвращает any — сузим тип локально
	const s = Object.prototype.toString.call(v) as string
	return s
}

```




`src/shared/utils/file.util.ts`


```typescript
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

```




`src/shared/utils/generate-token.util.ts`


```typescript
const TOKEN_TTL_MS = 5 * 60 * 1000 // 5 минут

/**
 * Function for generation uuid or numeric code
 * Генерация токена (UUID или 6-значный код) и сохранение в БД.
 * Если для пары (userId, type) токен уже существует — заменяем на новый.
 * @param prisma - prisma service
 * @param user - current user
 * @param type - token type
 * @param isUUID - if true then generate uuid if false (default) generate numeric code from 6 letters
 * @returns return new token
 *
 * Требования к схеме (рекомендовано):
 *   - уникальный составной индекс: @@unique([userId, type], name: "token_user_type_unique")
 */
export async function generateToken(
	prisma: PrismaService,
	user: User,
	type: ETokenType,
	isUUID: boolean = true,
): Promise<Token> {
	const token = isUUID ? randomUUID() : generateNumericCode(6)
	const expiresIn = new Date(Date.now() + TOKEN_TTL_MS)

	// Если в схеме есть @@unique([userId, type]) — используем upsert.
	// Иначе — можешь оставить delete/create как было.
	return prisma.token.upsert({
		where: { userId_type: { userId: user.id, type } }, // <- имя поля под твой @@unique
		update: { token, expiresIn },
		create: {
			token,
			expiresIn,
			type,
			user: { connect: { id: user.id } },
		},
	})
}

/** Генератор криптографически стойкого числового кода нужной длины. */
function generateNumericCode(length: number): string {
	if (length <= 0) return ''
	// Диапазон: [10^(len-1), 10^len - 1]
	const min = 10 ** (length - 1)
	const max = 10 ** length - 1
	// randomInt(min, max + 1) — включительно сверху
	return String(randomInt(min, max + 1))
}

```




`src/shared/utils/hash.util.ts`


```typescript
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

```




`src/shared/utils/index.ts`


```typescript
export * from './errors'
export * from './is-dev.util'
export * from './ms.util'
export * from './parse-boolean.util'
export * from './session-metadata.util'
export * from './session.util'
export * from './generate-token.util'
export * from './file.util'
export * from './hash.util'

```




`src/shared/utils/is-dev.util.ts`


```typescript
dotenv.config()

export const isDev = (configService: ConfigService) => configService.getOrThrow<string>('NODE_ENV') === 'development'

export const IS_DEV_ENV = process.env.NODE_ENV === 'development'

```




`src/shared/utils/ms.util.ts`


```typescript
// Определение констант для различных единиц времени
const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24
const w = d * 7
const y = d * 365.25

// Тип для различных единиц времени
type Unit =
	| 'Years'
	| 'Year'
	| 'Yrs'
	| 'Yr'
	| 'Y'
	| 'Weeks'
	| 'Week'
	| 'W'
	| 'Days'
	| 'Day'
	| 'D'
	| 'Hours'
	| 'Hour'
	| 'Hrs'
	| 'Hr'
	| 'H'
	| 'Minutes'
	| 'Minute'
	| 'Mins'
	| 'Min'
	| 'M'
	| 'Seconds'
	| 'Second'
	| 'Secs'
	| 'Sec'
	| 's'
	| 'Milliseconds'
	| 'Millisecond'
	| 'Msecs'
	| 'Msec'
	| 'Ms'

// Тип для единиц времени в любом регистре
type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>

// Тип для строкового значения, которое может содержать число и необязательную единицу времени
export type StringValue = `${number}` | `${number}${UnitAnyCase}` | `${number} ${UnitAnyCase}`

/**
 * Преобразует строковое значение, представляющее время, в миллисекунды.
 *
 * @param str - Строка, представляющая количество времени, например, "1 hour", "60s", "500 milliseconds".
 * @returns Количество миллисекунд, соответствующее указанному времени.
 * @throws {Error} Если строка не соответствует ожидаемому формату или если единица времени не распознана.
 *
 * @example
 * ms('1 minute'); // вернет 60000
 * ms('2 hours'); // вернет 7200000
 * ms('500 ms'); // вернет 500
 */
export function ms(str: StringValue): number {
	// Проверка входных данных
	if (typeof str !== 'string' || str.length === 0 || str.length > 100) {
		throw new Error('Value provided to ms() must be a string with length between 1 and 99.')
	}

	// Регулярное выражение для сопоставления строки с числом и необязательной единицей времени
	const match =
		/^(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
			str,
		)

	// Извлечение значения и типа из совпадения
	const groups = match?.groups as { value: string; type?: string } | undefined
	if (!groups) {
		return NaN
	}
	const n = parseFloat(groups.value)
	const type = (groups.type || 'ms').toLowerCase() as Lowercase<Unit>

	// Преобразование строкового значения в миллисекунды в зависимости от единицы времени
	switch (type) {
		case 'years':
		case 'year':
		case 'yrs':
		case 'yr':
		case 'y':
			return n * y
		case 'weeks':
		case 'week':
		case 'w':
			return n * w
		case 'days':
		case 'day':
		case 'd':
			return n * d
		case 'hours':
		case 'hour':
		case 'hrs':
		case 'hr':
		case 'h':
			return n * h
		case 'minutes':
		case 'minute':
		case 'mins':
		case 'min':
		case 'm':
			return n * m
		case 'seconds':
		case 'second':
		case 'secs':
		case 'sec':
		case 's':
			return n * s
		case 'milliseconds':
		case 'millisecond':
		case 'msecs':
		case 'msec':
		case 'ms':
			return n
		default:
			throw new Error(
				`Error: time unit ${type} was recognized, but there is no corresponding case. Please check the input data.`,
			)
	}
}

```




`src/shared/utils/parse-boolean.util.ts`


```typescript
/**
 * Преобразует строковое значение в логическое значение (boolean).
 *
 * Эта функция принимает строку, представляющую логическое значение,
 * и возвращает соответствующее логическое значение. Если строка равна
 * "true" (игнорируя регистр), функция вернет `true`. Если строка равна
 * "false", функция вернет `false`. Если передано значение другого типа
 * или строка не соответствует ожидаемым значениям, будет выброшено
 * исключение.
 *
 * @param value - Строка, представляющая логическое значение ("true" или "false").
 * @returns {boolean} Логическое значение, соответствующее переданной строке.
 * @throws {Error} Если переданное значение не может быть преобразовано в логическое значение.
 *
 * @example
 * parseBoolean('true');  // вернет true
 * parseBoolean('false'); // вернет false
 * parseBoolean('TRUE');  // вернет true
 * parseBoolean('False'); // вернет false
 */
export function parseBoolean(value: string): boolean {
	if (typeof value === 'boolean') {
		return value
	}

	if (typeof value === 'string') {
		const lowerValue = value.trim().toLowerCase()
		if (lowerValue === 'true') {
			return true
		}
		if (lowerValue === 'false') {
			return false
		}
	}

	throw new Error(`Не удалось преобразовать значение "${value}" в логическое значение.`)
}

```




`src/shared/utils/session.util.ts`


```typescript
/**
 * Save user session and set userId, metadata, createdAt
 * @param req - request
 * @param user - current user
 * @param metadata - user's metadata
 * @returns - user
 */
export function saveSession(req: Request, user: User, metadata: ISessionMetadata) {
	const lang = req.language || DEFAULT_LANGUAGE

	return new Promise<{ user: User }>((resolve, reject) => {
		if (!req.session) {
			const message =
				i18n.t('common.errors.session.not_initialized', { lng: lang }) || 'Session is not initialized'
			return reject(new InternalServerErrorException(message))
		}

		req.session.createdAt = new Date()
		req.session.userId = user.id
		req.session.metadata = metadata

		req.session.save(err => {
			if (err) {
				const message = i18n.t('common.errors.session.save_error', { lng: lang }) || 'Error saving session'
				return reject(new InternalServerErrorException(message))
			}
			resolve({ user })
		})
	})
}

/**
 * Destroy session from cookie and redis
 * @param req - request
 * @param configService - config service
 * @returns boolean
 */
export function destroySession(req: Request, configService: ConfigService): Promise<boolean> {
	const lang = req.language || DEFAULT_LANGUAGE

	return new Promise<boolean>((resolve, reject) => {
		if (!req.session) {
			// если сессии нет — считать уничтоженной
			return resolve(true)
		}

		req.session.destroy(err => {
			if (err) {
				const message =
					i18n.t('common.errors.session.destroy_error', { lng: lang }) || 'Error destroying session'
				return reject(new InternalServerErrorException(message))
			}

			// req.res может быть undefined в некоторых контекстах (тесты/скрипты)
			const sessionCookieName = configService.get<string>('SESSION_NAME')
			if (sessionCookieName && req.res?.clearCookie) {
				req.res.clearCookie(sessionCookieName)
			}

			resolve(true)
		})
	})
}

```



