
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model AuthenticationMethod
 * Stores all 2FA methods for a user in a unified way
 * Supports TOTP, OTP, WebAuthn, Passkeys, and future methods
 */
export type AuthenticationMethod = $Result.DefaultSelection<Prisma.$AuthenticationMethodPayload>
/**
 * Model TrustedDevice
 * Manages trusted devices for reduced 2FA friction
 */
export type TrustedDevice = $Result.DefaultSelection<Prisma.$TrustedDevicePayload>
/**
 * Model SecurityEvent
 * Detailed security event logging with severity and risk scoring
 */
export type SecurityEvent = $Result.DefaultSelection<Prisma.$SecurityEventPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model AccountLock
 * 
 */
export type AccountLock = $Result.DefaultSelection<Prisma.$AccountLockPayload>
/**
 * Model Token
 * 
 */
export type Token = $Result.DefaultSelection<Prisma.$TokenPayload>
/**
 * Model BackupCode
 * 
 */
export type BackupCode = $Result.DefaultSelection<Prisma.$BackupCodePayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const E2FAMethod: {
  TOTP: 'TOTP',
  OTP_EMAIL: 'OTP_EMAIL',
  OTP_SMS: 'OTP_SMS',
  WEBAUTHN: 'WEBAUTHN',
  PASSKEY: 'PASSKEY',
  BACKUP_CODE: 'BACKUP_CODE'
};

export type E2FAMethod = (typeof E2FAMethod)[keyof typeof E2FAMethod]


export const ETokenType: {
  EMAIL_VERIFY: 'EMAIL_VERIFY',
  PHONE_VERIFY: 'PHONE_VERIFY',
  PASSWORD_RESET: 'PASSWORD_RESET',
  TWO_FA_SETUP: 'TWO_FA_SETUP'
};

export type ETokenType = (typeof ETokenType)[keyof typeof ETokenType]


export const EAuditCategory: {
  SECURITY: 'SECURITY',
  PROFILE: 'PROFILE',
  ADMIN: 'ADMIN',
  SYSTEM: 'SYSTEM',
  ACCOUNT: 'ACCOUNT',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  DATA: 'DATA'
};

export type EAuditCategory = (typeof EAuditCategory)[keyof typeof EAuditCategory]


export const ESecurityEvent: {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  TWO_FA_ENABLED: 'TWO_FA_ENABLED',
  TWO_FA_DISABLED: 'TWO_FA_DISABLED',
  TWO_FA_VERIFIED: 'TWO_FA_VERIFIED',
  TWO_FA_FAILED: 'TWO_FA_FAILED',
  TWO_FA_BACKUP_CODE_USED: 'TWO_FA_BACKUP_CODE_USED',
  TWO_FA_BACKUP_CODES_REGENERATED: 'TWO_FA_BACKUP_CODES_REGENERATED',
  TWO_FA_METHOD_ADDED: 'TWO_FA_METHOD_ADDED',
  TWO_FA_METHOD_REMOVED: 'TWO_FA_METHOD_REMOVED',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  PASSWORD_RESET_REQUESTED: 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET_COMPLETED: 'PASSWORD_RESET_COMPLETED',
  PASSWORD_RESET_FAILED: 'PASSWORD_RESET_FAILED',
  ACCOUNT_CREATED: 'ACCOUNT_CREATED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED: 'ACCOUNT_UNLOCKED',
  ACCOUNT_DELETED: 'ACCOUNT_DELETED',
  EMAIL_VERIFIED: 'EMAIL_VERIFIED',
  PHONE_VERIFIED: 'PHONE_VERIFIED',
  EMAIL_CHANGED: 'EMAIL_CHANGED',
  PHONE_CHANGED: 'PHONE_CHANGED',
  NEW_DEVICE_DETECTED: 'NEW_DEVICE_DETECTED',
  DEVICE_TRUSTED: 'DEVICE_TRUSTED',
  DEVICE_UNTRUSTED: 'DEVICE_UNTRUSTED',
  DEVICE_REVOKED: 'DEVICE_REVOKED',
  SUSPICIOUS_LOGIN: 'SUSPICIOUS_LOGIN',
  UNUSUAL_LOCATION: 'UNUSUAL_LOCATION',
  BRUTE_FORCE_DETECTED: 'BRUTE_FORCE_DETECTED',
  ACCOUNT_TAKEOVER_ATTEMPT: 'ACCOUNT_TAKEOVER_ATTEMPT',
  IMPOSSIBLE_TRAVEL: 'IMPOSSIBLE_TRAVEL',
  WEBAUTHN_REGISTERED: 'WEBAUTHN_REGISTERED',
  WEBAUTHN_VERIFIED: 'WEBAUTHN_VERIFIED',
  WEBAUTHN_REMOVED: 'WEBAUTHN_REMOVED',
  PASSKEY_CREATED: 'PASSKEY_CREATED',
  PASSKEY_USED: 'PASSKEY_USED',
  PASSKEY_DELETED: 'PASSKEY_DELETED'
};

export type ESecurityEvent = (typeof ESecurityEvent)[keyof typeof ESecurityEvent]


export const ESecuritySeverity: {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export type ESecuritySeverity = (typeof ESecuritySeverity)[keyof typeof ESecuritySeverity]

}

export type E2FAMethod = $Enums.E2FAMethod

export const E2FAMethod: typeof $Enums.E2FAMethod

export type ETokenType = $Enums.ETokenType

export const ETokenType: typeof $Enums.ETokenType

export type EAuditCategory = $Enums.EAuditCategory

export const EAuditCategory: typeof $Enums.EAuditCategory

export type ESecurityEvent = $Enums.ESecurityEvent

export const ESecurityEvent: typeof $Enums.ESecurityEvent

export type ESecuritySeverity = $Enums.ESecuritySeverity

export const ESecuritySeverity: typeof $Enums.ESecuritySeverity

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.authenticationMethod`: Exposes CRUD operations for the **AuthenticationMethod** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuthenticationMethods
    * const authenticationMethods = await prisma.authenticationMethod.findMany()
    * ```
    */
  get authenticationMethod(): Prisma.AuthenticationMethodDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.trustedDevice`: Exposes CRUD operations for the **TrustedDevice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrustedDevices
    * const trustedDevices = await prisma.trustedDevice.findMany()
    * ```
    */
  get trustedDevice(): Prisma.TrustedDeviceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.securityEvent`: Exposes CRUD operations for the **SecurityEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SecurityEvents
    * const securityEvents = await prisma.securityEvent.findMany()
    * ```
    */
  get securityEvent(): Prisma.SecurityEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.accountLock`: Exposes CRUD operations for the **AccountLock** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AccountLocks
    * const accountLocks = await prisma.accountLock.findMany()
    * ```
    */
  get accountLock(): Prisma.AccountLockDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.token`: Exposes CRUD operations for the **Token** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tokens
    * const tokens = await prisma.token.findMany()
    * ```
    */
  get token(): Prisma.TokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.backupCode`: Exposes CRUD operations for the **BackupCode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BackupCodes
    * const backupCodes = await prisma.backupCode.findMany()
    * ```
    */
  get backupCode(): Prisma.BackupCodeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.17.1
   * Query Engine version: 272a37d34178c2894197e17273bf937f25acdeac
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    AuthenticationMethod: 'AuthenticationMethod',
    TrustedDevice: 'TrustedDevice',
    SecurityEvent: 'SecurityEvent',
    Session: 'Session',
    AccountLock: 'AccountLock',
    Token: 'Token',
    BackupCode: 'BackupCode',
    AuditLog: 'AuditLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "authenticationMethod" | "trustedDevice" | "securityEvent" | "session" | "accountLock" | "token" | "backupCode" | "auditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      AuthenticationMethod: {
        payload: Prisma.$AuthenticationMethodPayload<ExtArgs>
        fields: Prisma.AuthenticationMethodFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthenticationMethodFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticationMethodPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthenticationMethodFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticationMethodPayload>
          }
          findFirst: {
            args: Prisma.AuthenticationMethodFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticationMethodPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthenticationMethodFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticationMethodPayload>
          }
          findMany: {
            args: Prisma.AuthenticationMethodFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticationMethodPayload>[]
          }
          create: {
            args: Prisma.AuthenticationMethodCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticationMethodPayload>
          }
          createMany: {
            args: Prisma.AuthenticationMethodCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthenticationMethodCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticationMethodPayload>[]
          }
          delete: {
            args: Prisma.AuthenticationMethodDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticationMethodPayload>
          }
          update: {
            args: Prisma.AuthenticationMethodUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticationMethodPayload>
          }
          deleteMany: {
            args: Prisma.AuthenticationMethodDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthenticationMethodUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthenticationMethodUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticationMethodPayload>[]
          }
          upsert: {
            args: Prisma.AuthenticationMethodUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticationMethodPayload>
          }
          aggregate: {
            args: Prisma.AuthenticationMethodAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuthenticationMethod>
          }
          groupBy: {
            args: Prisma.AuthenticationMethodGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthenticationMethodGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthenticationMethodCountArgs<ExtArgs>
            result: $Utils.Optional<AuthenticationMethodCountAggregateOutputType> | number
          }
        }
      }
      TrustedDevice: {
        payload: Prisma.$TrustedDevicePayload<ExtArgs>
        fields: Prisma.TrustedDeviceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrustedDeviceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrustedDeviceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>
          }
          findFirst: {
            args: Prisma.TrustedDeviceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrustedDeviceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>
          }
          findMany: {
            args: Prisma.TrustedDeviceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>[]
          }
          create: {
            args: Prisma.TrustedDeviceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>
          }
          createMany: {
            args: Prisma.TrustedDeviceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrustedDeviceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>[]
          }
          delete: {
            args: Prisma.TrustedDeviceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>
          }
          update: {
            args: Prisma.TrustedDeviceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>
          }
          deleteMany: {
            args: Prisma.TrustedDeviceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrustedDeviceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TrustedDeviceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>[]
          }
          upsert: {
            args: Prisma.TrustedDeviceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>
          }
          aggregate: {
            args: Prisma.TrustedDeviceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrustedDevice>
          }
          groupBy: {
            args: Prisma.TrustedDeviceGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrustedDeviceGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrustedDeviceCountArgs<ExtArgs>
            result: $Utils.Optional<TrustedDeviceCountAggregateOutputType> | number
          }
        }
      }
      SecurityEvent: {
        payload: Prisma.$SecurityEventPayload<ExtArgs>
        fields: Prisma.SecurityEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SecurityEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SecurityEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventPayload>
          }
          findFirst: {
            args: Prisma.SecurityEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SecurityEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventPayload>
          }
          findMany: {
            args: Prisma.SecurityEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventPayload>[]
          }
          create: {
            args: Prisma.SecurityEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventPayload>
          }
          createMany: {
            args: Prisma.SecurityEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SecurityEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventPayload>[]
          }
          delete: {
            args: Prisma.SecurityEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventPayload>
          }
          update: {
            args: Prisma.SecurityEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventPayload>
          }
          deleteMany: {
            args: Prisma.SecurityEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SecurityEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SecurityEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventPayload>[]
          }
          upsert: {
            args: Prisma.SecurityEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventPayload>
          }
          aggregate: {
            args: Prisma.SecurityEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSecurityEvent>
          }
          groupBy: {
            args: Prisma.SecurityEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<SecurityEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.SecurityEventCountArgs<ExtArgs>
            result: $Utils.Optional<SecurityEventCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      AccountLock: {
        payload: Prisma.$AccountLockPayload<ExtArgs>
        fields: Prisma.AccountLockFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountLockFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountLockPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountLockFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountLockPayload>
          }
          findFirst: {
            args: Prisma.AccountLockFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountLockPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountLockFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountLockPayload>
          }
          findMany: {
            args: Prisma.AccountLockFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountLockPayload>[]
          }
          create: {
            args: Prisma.AccountLockCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountLockPayload>
          }
          createMany: {
            args: Prisma.AccountLockCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountLockCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountLockPayload>[]
          }
          delete: {
            args: Prisma.AccountLockDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountLockPayload>
          }
          update: {
            args: Prisma.AccountLockUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountLockPayload>
          }
          deleteMany: {
            args: Prisma.AccountLockDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountLockUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountLockUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountLockPayload>[]
          }
          upsert: {
            args: Prisma.AccountLockUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountLockPayload>
          }
          aggregate: {
            args: Prisma.AccountLockAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccountLock>
          }
          groupBy: {
            args: Prisma.AccountLockGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountLockGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountLockCountArgs<ExtArgs>
            result: $Utils.Optional<AccountLockCountAggregateOutputType> | number
          }
        }
      }
      Token: {
        payload: Prisma.$TokenPayload<ExtArgs>
        fields: Prisma.TokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          findFirst: {
            args: Prisma.TokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          findMany: {
            args: Prisma.TokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>[]
          }
          create: {
            args: Prisma.TokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          createMany: {
            args: Prisma.TokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>[]
          }
          delete: {
            args: Prisma.TokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          update: {
            args: Prisma.TokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          deleteMany: {
            args: Prisma.TokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>[]
          }
          upsert: {
            args: Prisma.TokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          aggregate: {
            args: Prisma.TokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateToken>
          }
          groupBy: {
            args: Prisma.TokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<TokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.TokenCountArgs<ExtArgs>
            result: $Utils.Optional<TokenCountAggregateOutputType> | number
          }
        }
      }
      BackupCode: {
        payload: Prisma.$BackupCodePayload<ExtArgs>
        fields: Prisma.BackupCodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BackupCodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BackupCodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>
          }
          findFirst: {
            args: Prisma.BackupCodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BackupCodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>
          }
          findMany: {
            args: Prisma.BackupCodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>[]
          }
          create: {
            args: Prisma.BackupCodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>
          }
          createMany: {
            args: Prisma.BackupCodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BackupCodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>[]
          }
          delete: {
            args: Prisma.BackupCodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>
          }
          update: {
            args: Prisma.BackupCodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>
          }
          deleteMany: {
            args: Prisma.BackupCodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BackupCodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BackupCodeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>[]
          }
          upsert: {
            args: Prisma.BackupCodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>
          }
          aggregate: {
            args: Prisma.BackupCodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBackupCode>
          }
          groupBy: {
            args: Prisma.BackupCodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<BackupCodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.BackupCodeCountArgs<ExtArgs>
            result: $Utils.Optional<BackupCodeCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    authenticationMethod?: AuthenticationMethodOmit
    trustedDevice?: TrustedDeviceOmit
    securityEvent?: SecurityEventOmit
    session?: SessionOmit
    accountLock?: AccountLockOmit
    token?: TokenOmit
    backupCode?: BackupCodeOmit
    auditLog?: AuditLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    authenticationMethods: number
    backupCodes: number
    trustedDevices: number
    auditLogs: number
    tokens: number
    sessions: number
    accountLocks: number
    securityEvents: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authenticationMethods?: boolean | UserCountOutputTypeCountAuthenticationMethodsArgs
    backupCodes?: boolean | UserCountOutputTypeCountBackupCodesArgs
    trustedDevices?: boolean | UserCountOutputTypeCountTrustedDevicesArgs
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs
    tokens?: boolean | UserCountOutputTypeCountTokensArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    accountLocks?: boolean | UserCountOutputTypeCountAccountLocksArgs
    securityEvents?: boolean | UserCountOutputTypeCountSecurityEventsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuthenticationMethodsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthenticationMethodWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBackupCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BackupCodeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTrustedDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrustedDeviceWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TokenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountLocksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountLockWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSecurityEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SecurityEventWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    riskScore: number | null
  }

  export type UserSumAggregateOutputType = {
    riskScore: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    fullName: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    email: string | null
    avatar: string | null
    bio: string | null
    password: string | null
    isEmailVerified: boolean | null
    emailVerifiedAt: Date | null
    isUnsubscribed: boolean | null
    emailBouncedAt: Date | null
    isPhoneVerified: boolean | null
    phoneVerifiedAt: Date | null
    phoneBouncedAt: Date | null
    is2FAEnabled: boolean | null
    preferred2FAMethod: $Enums.E2FAMethod | null
    require2FA: boolean | null
    lastLoginAt: Date | null
    lastLoginIp: string | null
    passwordChangedAt: Date | null
    riskScore: number | null
    lastRiskAssessAt: Date | null
    deletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    fullName: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    email: string | null
    avatar: string | null
    bio: string | null
    password: string | null
    isEmailVerified: boolean | null
    emailVerifiedAt: Date | null
    isUnsubscribed: boolean | null
    emailBouncedAt: Date | null
    isPhoneVerified: boolean | null
    phoneVerifiedAt: Date | null
    phoneBouncedAt: Date | null
    is2FAEnabled: boolean | null
    preferred2FAMethod: $Enums.E2FAMethod | null
    require2FA: boolean | null
    lastLoginAt: Date | null
    lastLoginIp: string | null
    passwordChangedAt: Date | null
    riskScore: number | null
    lastRiskAssessAt: Date | null
    deletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    fullName: number
    firstName: number
    lastName: number
    phone: number
    email: number
    avatar: number
    bio: number
    password: number
    isEmailVerified: number
    emailVerifiedAt: number
    isUnsubscribed: number
    emailBouncedAt: number
    isPhoneVerified: number
    phoneVerifiedAt: number
    phoneBouncedAt: number
    is2FAEnabled: number
    preferred2FAMethod: number
    require2FA: number
    lastLoginAt: number
    lastLoginIp: number
    passwordChangedAt: number
    riskScore: number
    lastRiskAssessAt: number
    deletedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    riskScore?: true
  }

  export type UserSumAggregateInputType = {
    riskScore?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    fullName?: true
    firstName?: true
    lastName?: true
    phone?: true
    email?: true
    avatar?: true
    bio?: true
    password?: true
    isEmailVerified?: true
    emailVerifiedAt?: true
    isUnsubscribed?: true
    emailBouncedAt?: true
    isPhoneVerified?: true
    phoneVerifiedAt?: true
    phoneBouncedAt?: true
    is2FAEnabled?: true
    preferred2FAMethod?: true
    require2FA?: true
    lastLoginAt?: true
    lastLoginIp?: true
    passwordChangedAt?: true
    riskScore?: true
    lastRiskAssessAt?: true
    deletedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    fullName?: true
    firstName?: true
    lastName?: true
    phone?: true
    email?: true
    avatar?: true
    bio?: true
    password?: true
    isEmailVerified?: true
    emailVerifiedAt?: true
    isUnsubscribed?: true
    emailBouncedAt?: true
    isPhoneVerified?: true
    phoneVerifiedAt?: true
    phoneBouncedAt?: true
    is2FAEnabled?: true
    preferred2FAMethod?: true
    require2FA?: true
    lastLoginAt?: true
    lastLoginIp?: true
    passwordChangedAt?: true
    riskScore?: true
    lastRiskAssessAt?: true
    deletedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    fullName?: true
    firstName?: true
    lastName?: true
    phone?: true
    email?: true
    avatar?: true
    bio?: true
    password?: true
    isEmailVerified?: true
    emailVerifiedAt?: true
    isUnsubscribed?: true
    emailBouncedAt?: true
    isPhoneVerified?: true
    phoneVerifiedAt?: true
    phoneBouncedAt?: true
    is2FAEnabled?: true
    preferred2FAMethod?: true
    require2FA?: true
    lastLoginAt?: true
    lastLoginIp?: true
    passwordChangedAt?: true
    riskScore?: true
    lastRiskAssessAt?: true
    deletedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    fullName: string
    firstName: string | null
    lastName: string | null
    phone: string | null
    email: string
    avatar: string | null
    bio: string | null
    password: string
    isEmailVerified: boolean
    emailVerifiedAt: Date | null
    isUnsubscribed: boolean | null
    emailBouncedAt: Date | null
    isPhoneVerified: boolean
    phoneVerifiedAt: Date | null
    phoneBouncedAt: Date | null
    is2FAEnabled: boolean
    preferred2FAMethod: $Enums.E2FAMethod | null
    require2FA: boolean
    lastLoginAt: Date | null
    lastLoginIp: string | null
    passwordChangedAt: Date | null
    riskScore: number | null
    lastRiskAssessAt: Date | null
    deletedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    email?: boolean
    avatar?: boolean
    bio?: boolean
    password?: boolean
    isEmailVerified?: boolean
    emailVerifiedAt?: boolean
    isUnsubscribed?: boolean
    emailBouncedAt?: boolean
    isPhoneVerified?: boolean
    phoneVerifiedAt?: boolean
    phoneBouncedAt?: boolean
    is2FAEnabled?: boolean
    preferred2FAMethod?: boolean
    require2FA?: boolean
    lastLoginAt?: boolean
    lastLoginIp?: boolean
    passwordChangedAt?: boolean
    riskScore?: boolean
    lastRiskAssessAt?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    authenticationMethods?: boolean | User$authenticationMethodsArgs<ExtArgs>
    backupCodes?: boolean | User$backupCodesArgs<ExtArgs>
    trustedDevices?: boolean | User$trustedDevicesArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    tokens?: boolean | User$tokensArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accountLocks?: boolean | User$accountLocksArgs<ExtArgs>
    securityEvents?: boolean | User$securityEventsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    email?: boolean
    avatar?: boolean
    bio?: boolean
    password?: boolean
    isEmailVerified?: boolean
    emailVerifiedAt?: boolean
    isUnsubscribed?: boolean
    emailBouncedAt?: boolean
    isPhoneVerified?: boolean
    phoneVerifiedAt?: boolean
    phoneBouncedAt?: boolean
    is2FAEnabled?: boolean
    preferred2FAMethod?: boolean
    require2FA?: boolean
    lastLoginAt?: boolean
    lastLoginIp?: boolean
    passwordChangedAt?: boolean
    riskScore?: boolean
    lastRiskAssessAt?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    email?: boolean
    avatar?: boolean
    bio?: boolean
    password?: boolean
    isEmailVerified?: boolean
    emailVerifiedAt?: boolean
    isUnsubscribed?: boolean
    emailBouncedAt?: boolean
    isPhoneVerified?: boolean
    phoneVerifiedAt?: boolean
    phoneBouncedAt?: boolean
    is2FAEnabled?: boolean
    preferred2FAMethod?: boolean
    require2FA?: boolean
    lastLoginAt?: boolean
    lastLoginIp?: boolean
    passwordChangedAt?: boolean
    riskScore?: boolean
    lastRiskAssessAt?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    fullName?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    email?: boolean
    avatar?: boolean
    bio?: boolean
    password?: boolean
    isEmailVerified?: boolean
    emailVerifiedAt?: boolean
    isUnsubscribed?: boolean
    emailBouncedAt?: boolean
    isPhoneVerified?: boolean
    phoneVerifiedAt?: boolean
    phoneBouncedAt?: boolean
    is2FAEnabled?: boolean
    preferred2FAMethod?: boolean
    require2FA?: boolean
    lastLoginAt?: boolean
    lastLoginIp?: boolean
    passwordChangedAt?: boolean
    riskScore?: boolean
    lastRiskAssessAt?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fullName" | "firstName" | "lastName" | "phone" | "email" | "avatar" | "bio" | "password" | "isEmailVerified" | "emailVerifiedAt" | "isUnsubscribed" | "emailBouncedAt" | "isPhoneVerified" | "phoneVerifiedAt" | "phoneBouncedAt" | "is2FAEnabled" | "preferred2FAMethod" | "require2FA" | "lastLoginAt" | "lastLoginIp" | "passwordChangedAt" | "riskScore" | "lastRiskAssessAt" | "deletedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authenticationMethods?: boolean | User$authenticationMethodsArgs<ExtArgs>
    backupCodes?: boolean | User$backupCodesArgs<ExtArgs>
    trustedDevices?: boolean | User$trustedDevicesArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    tokens?: boolean | User$tokensArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accountLocks?: boolean | User$accountLocksArgs<ExtArgs>
    securityEvents?: boolean | User$securityEventsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      authenticationMethods: Prisma.$AuthenticationMethodPayload<ExtArgs>[]
      backupCodes: Prisma.$BackupCodePayload<ExtArgs>[]
      trustedDevices: Prisma.$TrustedDevicePayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
      tokens: Prisma.$TokenPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      accountLocks: Prisma.$AccountLockPayload<ExtArgs>[]
      securityEvents: Prisma.$SecurityEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fullName: string
      firstName: string | null
      lastName: string | null
      phone: string | null
      email: string
      avatar: string | null
      bio: string | null
      password: string
      isEmailVerified: boolean
      emailVerifiedAt: Date | null
      isUnsubscribed: boolean | null
      emailBouncedAt: Date | null
      isPhoneVerified: boolean
      phoneVerifiedAt: Date | null
      phoneBouncedAt: Date | null
      /**
       * Global 2FA status - true if user has any active 2FA method
       */
      is2FAEnabled: boolean
      /**
       * User's preferred 2FA method for login
       */
      preferred2FAMethod: $Enums.E2FAMethod | null
      /**
       * Force 2FA for this user (admin-enforced, compliance)
       */
      require2FA: boolean
      lastLoginAt: Date | null
      lastLoginIp: string | null
      passwordChangedAt: Date | null
      /**
       * User risk score (0-100): 0=trusted, 100=high risk
       * Calculated based on login patterns, location changes, failed attempts
       */
      riskScore: number | null
      /**
       * Last time risk score was calculated
       */
      lastRiskAssessAt: Date | null
      deletedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    authenticationMethods<T extends User$authenticationMethodsArgs<ExtArgs> = {}>(args?: Subset<T, User$authenticationMethodsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthenticationMethodPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    backupCodes<T extends User$backupCodesArgs<ExtArgs> = {}>(args?: Subset<T, User$backupCodesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    trustedDevices<T extends User$trustedDevicesArgs<ExtArgs> = {}>(args?: Subset<T, User$trustedDevicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    auditLogs<T extends User$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tokens<T extends User$tokensArgs<ExtArgs> = {}>(args?: Subset<T, User$tokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accountLocks<T extends User$accountLocksArgs<ExtArgs> = {}>(args?: Subset<T, User$accountLocksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountLockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    securityEvents<T extends User$securityEventsArgs<ExtArgs> = {}>(args?: Subset<T, User$securityEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecurityEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly bio: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly isEmailVerified: FieldRef<"User", 'Boolean'>
    readonly emailVerifiedAt: FieldRef<"User", 'DateTime'>
    readonly isUnsubscribed: FieldRef<"User", 'Boolean'>
    readonly emailBouncedAt: FieldRef<"User", 'DateTime'>
    readonly isPhoneVerified: FieldRef<"User", 'Boolean'>
    readonly phoneVerifiedAt: FieldRef<"User", 'DateTime'>
    readonly phoneBouncedAt: FieldRef<"User", 'DateTime'>
    readonly is2FAEnabled: FieldRef<"User", 'Boolean'>
    readonly preferred2FAMethod: FieldRef<"User", 'E2FAMethod'>
    readonly require2FA: FieldRef<"User", 'Boolean'>
    readonly lastLoginAt: FieldRef<"User", 'DateTime'>
    readonly lastLoginIp: FieldRef<"User", 'String'>
    readonly passwordChangedAt: FieldRef<"User", 'DateTime'>
    readonly riskScore: FieldRef<"User", 'Float'>
    readonly lastRiskAssessAt: FieldRef<"User", 'DateTime'>
    readonly deletedAt: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.authenticationMethods
   */
  export type User$authenticationMethodsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthenticationMethod
     */
    select?: AuthenticationMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthenticationMethod
     */
    omit?: AuthenticationMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticationMethodInclude<ExtArgs> | null
    where?: AuthenticationMethodWhereInput
    orderBy?: AuthenticationMethodOrderByWithRelationInput | AuthenticationMethodOrderByWithRelationInput[]
    cursor?: AuthenticationMethodWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuthenticationMethodScalarFieldEnum | AuthenticationMethodScalarFieldEnum[]
  }

  /**
   * User.backupCodes
   */
  export type User$backupCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupCode
     */
    omit?: BackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    where?: BackupCodeWhereInput
    orderBy?: BackupCodeOrderByWithRelationInput | BackupCodeOrderByWithRelationInput[]
    cursor?: BackupCodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BackupCodeScalarFieldEnum | BackupCodeScalarFieldEnum[]
  }

  /**
   * User.trustedDevices
   */
  export type User$trustedDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    where?: TrustedDeviceWhereInput
    orderBy?: TrustedDeviceOrderByWithRelationInput | TrustedDeviceOrderByWithRelationInput[]
    cursor?: TrustedDeviceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TrustedDeviceScalarFieldEnum | TrustedDeviceScalarFieldEnum[]
  }

  /**
   * User.auditLogs
   */
  export type User$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * User.tokens
   */
  export type User$tokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    where?: TokenWhereInput
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    cursor?: TokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.accountLocks
   */
  export type User$accountLocksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountLock
     */
    select?: AccountLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountLock
     */
    omit?: AccountLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountLockInclude<ExtArgs> | null
    where?: AccountLockWhereInput
    orderBy?: AccountLockOrderByWithRelationInput | AccountLockOrderByWithRelationInput[]
    cursor?: AccountLockWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountLockScalarFieldEnum | AccountLockScalarFieldEnum[]
  }

  /**
   * User.securityEvents
   */
  export type User$securityEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEvent
     */
    select?: SecurityEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityEvent
     */
    omit?: SecurityEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityEventInclude<ExtArgs> | null
    where?: SecurityEventWhereInput
    orderBy?: SecurityEventOrderByWithRelationInput | SecurityEventOrderByWithRelationInput[]
    cursor?: SecurityEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SecurityEventScalarFieldEnum | SecurityEventScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model AuthenticationMethod
   */

  export type AggregateAuthenticationMethod = {
    _count: AuthenticationMethodCountAggregateOutputType | null
    _avg: AuthenticationMethodAvgAggregateOutputType | null
    _sum: AuthenticationMethodSumAggregateOutputType | null
    _min: AuthenticationMethodMinAggregateOutputType | null
    _max: AuthenticationMethodMaxAggregateOutputType | null
  }

  export type AuthenticationMethodAvgAggregateOutputType = {
    useCount: number | null
  }

  export type AuthenticationMethodSumAggregateOutputType = {
    useCount: number | null
  }

  export type AuthenticationMethodMinAggregateOutputType = {
    id: string | null
    userId: string | null
    method: $Enums.E2FAMethod | null
    name: string | null
    isActive: boolean | null
    isPrimary: boolean | null
    lastUsedAt: Date | null
    useCount: number | null
    credentialId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthenticationMethodMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    method: $Enums.E2FAMethod | null
    name: string | null
    isActive: boolean | null
    isPrimary: boolean | null
    lastUsedAt: Date | null
    useCount: number | null
    credentialId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthenticationMethodCountAggregateOutputType = {
    id: number
    userId: number
    method: number
    data: number
    name: number
    isActive: number
    isPrimary: number
    lastUsedAt: number
    useCount: number
    credentialId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AuthenticationMethodAvgAggregateInputType = {
    useCount?: true
  }

  export type AuthenticationMethodSumAggregateInputType = {
    useCount?: true
  }

  export type AuthenticationMethodMinAggregateInputType = {
    id?: true
    userId?: true
    method?: true
    name?: true
    isActive?: true
    isPrimary?: true
    lastUsedAt?: true
    useCount?: true
    credentialId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthenticationMethodMaxAggregateInputType = {
    id?: true
    userId?: true
    method?: true
    name?: true
    isActive?: true
    isPrimary?: true
    lastUsedAt?: true
    useCount?: true
    credentialId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthenticationMethodCountAggregateInputType = {
    id?: true
    userId?: true
    method?: true
    data?: true
    name?: true
    isActive?: true
    isPrimary?: true
    lastUsedAt?: true
    useCount?: true
    credentialId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AuthenticationMethodAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthenticationMethod to aggregate.
     */
    where?: AuthenticationMethodWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthenticationMethods to fetch.
     */
    orderBy?: AuthenticationMethodOrderByWithRelationInput | AuthenticationMethodOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthenticationMethodWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthenticationMethods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthenticationMethods.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuthenticationMethods
    **/
    _count?: true | AuthenticationMethodCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuthenticationMethodAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuthenticationMethodSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthenticationMethodMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthenticationMethodMaxAggregateInputType
  }

  export type GetAuthenticationMethodAggregateType<T extends AuthenticationMethodAggregateArgs> = {
        [P in keyof T & keyof AggregateAuthenticationMethod]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthenticationMethod[P]>
      : GetScalarType<T[P], AggregateAuthenticationMethod[P]>
  }




  export type AuthenticationMethodGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthenticationMethodWhereInput
    orderBy?: AuthenticationMethodOrderByWithAggregationInput | AuthenticationMethodOrderByWithAggregationInput[]
    by: AuthenticationMethodScalarFieldEnum[] | AuthenticationMethodScalarFieldEnum
    having?: AuthenticationMethodScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthenticationMethodCountAggregateInputType | true
    _avg?: AuthenticationMethodAvgAggregateInputType
    _sum?: AuthenticationMethodSumAggregateInputType
    _min?: AuthenticationMethodMinAggregateInputType
    _max?: AuthenticationMethodMaxAggregateInputType
  }

  export type AuthenticationMethodGroupByOutputType = {
    id: string
    userId: string
    method: $Enums.E2FAMethod
    data: JsonValue
    name: string | null
    isActive: boolean
    isPrimary: boolean
    lastUsedAt: Date | null
    useCount: number
    credentialId: string | null
    createdAt: Date
    updatedAt: Date
    _count: AuthenticationMethodCountAggregateOutputType | null
    _avg: AuthenticationMethodAvgAggregateOutputType | null
    _sum: AuthenticationMethodSumAggregateOutputType | null
    _min: AuthenticationMethodMinAggregateOutputType | null
    _max: AuthenticationMethodMaxAggregateOutputType | null
  }

  type GetAuthenticationMethodGroupByPayload<T extends AuthenticationMethodGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthenticationMethodGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthenticationMethodGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthenticationMethodGroupByOutputType[P]>
            : GetScalarType<T[P], AuthenticationMethodGroupByOutputType[P]>
        }
      >
    >


  export type AuthenticationMethodSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    method?: boolean
    data?: boolean
    name?: boolean
    isActive?: boolean
    isPrimary?: boolean
    lastUsedAt?: boolean
    useCount?: boolean
    credentialId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authenticationMethod"]>

  export type AuthenticationMethodSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    method?: boolean
    data?: boolean
    name?: boolean
    isActive?: boolean
    isPrimary?: boolean
    lastUsedAt?: boolean
    useCount?: boolean
    credentialId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authenticationMethod"]>

  export type AuthenticationMethodSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    method?: boolean
    data?: boolean
    name?: boolean
    isActive?: boolean
    isPrimary?: boolean
    lastUsedAt?: boolean
    useCount?: boolean
    credentialId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authenticationMethod"]>

  export type AuthenticationMethodSelectScalar = {
    id?: boolean
    userId?: boolean
    method?: boolean
    data?: boolean
    name?: boolean
    isActive?: boolean
    isPrimary?: boolean
    lastUsedAt?: boolean
    useCount?: boolean
    credentialId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AuthenticationMethodOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "method" | "data" | "name" | "isActive" | "isPrimary" | "lastUsedAt" | "useCount" | "credentialId" | "createdAt" | "updatedAt", ExtArgs["result"]["authenticationMethod"]>
  export type AuthenticationMethodInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuthenticationMethodIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuthenticationMethodIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AuthenticationMethodPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuthenticationMethod"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      /**
       * Type of 2FA method (TOTP, OTP_EMAIL, OTP_SMS, WEBAUTHN, PASSKEY)
       */
      method: $Enums.E2FAMethod
      /**
       * Method-specific encrypted data as JSON
       */
      data: Prisma.JsonValue
      /**
       * Display name for this method (e.g., "iPhone 15 Pro", "YubiKey 5")
       */
      name: string | null
      /**
       * Whether this method is currently active
       */
      isActive: boolean
      /**
       * Primary method used by default for 2FA challenges
       */
      isPrimary: boolean
      /**
       * Last time this method was used for authentication
       */
      lastUsedAt: Date | null
      /**
       * Total number of successful authentications with this method
       */
      useCount: number
      /**
       * WebAuthn credential ID (base64url encoded)
       */
      credentialId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["authenticationMethod"]>
    composites: {}
  }

  type AuthenticationMethodGetPayload<S extends boolean | null | undefined | AuthenticationMethodDefaultArgs> = $Result.GetResult<Prisma.$AuthenticationMethodPayload, S>

  type AuthenticationMethodCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthenticationMethodFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthenticationMethodCountAggregateInputType | true
    }

  export interface AuthenticationMethodDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuthenticationMethod'], meta: { name: 'AuthenticationMethod' } }
    /**
     * Find zero or one AuthenticationMethod that matches the filter.
     * @param {AuthenticationMethodFindUniqueArgs} args - Arguments to find a AuthenticationMethod
     * @example
     * // Get one AuthenticationMethod
     * const authenticationMethod = await prisma.authenticationMethod.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthenticationMethodFindUniqueArgs>(args: SelectSubset<T, AuthenticationMethodFindUniqueArgs<ExtArgs>>): Prisma__AuthenticationMethodClient<$Result.GetResult<Prisma.$AuthenticationMethodPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuthenticationMethod that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthenticationMethodFindUniqueOrThrowArgs} args - Arguments to find a AuthenticationMethod
     * @example
     * // Get one AuthenticationMethod
     * const authenticationMethod = await prisma.authenticationMethod.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthenticationMethodFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthenticationMethodFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthenticationMethodClient<$Result.GetResult<Prisma.$AuthenticationMethodPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthenticationMethod that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticationMethodFindFirstArgs} args - Arguments to find a AuthenticationMethod
     * @example
     * // Get one AuthenticationMethod
     * const authenticationMethod = await prisma.authenticationMethod.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthenticationMethodFindFirstArgs>(args?: SelectSubset<T, AuthenticationMethodFindFirstArgs<ExtArgs>>): Prisma__AuthenticationMethodClient<$Result.GetResult<Prisma.$AuthenticationMethodPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthenticationMethod that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticationMethodFindFirstOrThrowArgs} args - Arguments to find a AuthenticationMethod
     * @example
     * // Get one AuthenticationMethod
     * const authenticationMethod = await prisma.authenticationMethod.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthenticationMethodFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthenticationMethodFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthenticationMethodClient<$Result.GetResult<Prisma.$AuthenticationMethodPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuthenticationMethods that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticationMethodFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuthenticationMethods
     * const authenticationMethods = await prisma.authenticationMethod.findMany()
     * 
     * // Get first 10 AuthenticationMethods
     * const authenticationMethods = await prisma.authenticationMethod.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const authenticationMethodWithIdOnly = await prisma.authenticationMethod.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuthenticationMethodFindManyArgs>(args?: SelectSubset<T, AuthenticationMethodFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthenticationMethodPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuthenticationMethod.
     * @param {AuthenticationMethodCreateArgs} args - Arguments to create a AuthenticationMethod.
     * @example
     * // Create one AuthenticationMethod
     * const AuthenticationMethod = await prisma.authenticationMethod.create({
     *   data: {
     *     // ... data to create a AuthenticationMethod
     *   }
     * })
     * 
     */
    create<T extends AuthenticationMethodCreateArgs>(args: SelectSubset<T, AuthenticationMethodCreateArgs<ExtArgs>>): Prisma__AuthenticationMethodClient<$Result.GetResult<Prisma.$AuthenticationMethodPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuthenticationMethods.
     * @param {AuthenticationMethodCreateManyArgs} args - Arguments to create many AuthenticationMethods.
     * @example
     * // Create many AuthenticationMethods
     * const authenticationMethod = await prisma.authenticationMethod.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthenticationMethodCreateManyArgs>(args?: SelectSubset<T, AuthenticationMethodCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuthenticationMethods and returns the data saved in the database.
     * @param {AuthenticationMethodCreateManyAndReturnArgs} args - Arguments to create many AuthenticationMethods.
     * @example
     * // Create many AuthenticationMethods
     * const authenticationMethod = await prisma.authenticationMethod.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuthenticationMethods and only return the `id`
     * const authenticationMethodWithIdOnly = await prisma.authenticationMethod.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthenticationMethodCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthenticationMethodCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthenticationMethodPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuthenticationMethod.
     * @param {AuthenticationMethodDeleteArgs} args - Arguments to delete one AuthenticationMethod.
     * @example
     * // Delete one AuthenticationMethod
     * const AuthenticationMethod = await prisma.authenticationMethod.delete({
     *   where: {
     *     // ... filter to delete one AuthenticationMethod
     *   }
     * })
     * 
     */
    delete<T extends AuthenticationMethodDeleteArgs>(args: SelectSubset<T, AuthenticationMethodDeleteArgs<ExtArgs>>): Prisma__AuthenticationMethodClient<$Result.GetResult<Prisma.$AuthenticationMethodPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuthenticationMethod.
     * @param {AuthenticationMethodUpdateArgs} args - Arguments to update one AuthenticationMethod.
     * @example
     * // Update one AuthenticationMethod
     * const authenticationMethod = await prisma.authenticationMethod.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthenticationMethodUpdateArgs>(args: SelectSubset<T, AuthenticationMethodUpdateArgs<ExtArgs>>): Prisma__AuthenticationMethodClient<$Result.GetResult<Prisma.$AuthenticationMethodPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuthenticationMethods.
     * @param {AuthenticationMethodDeleteManyArgs} args - Arguments to filter AuthenticationMethods to delete.
     * @example
     * // Delete a few AuthenticationMethods
     * const { count } = await prisma.authenticationMethod.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthenticationMethodDeleteManyArgs>(args?: SelectSubset<T, AuthenticationMethodDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthenticationMethods.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticationMethodUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuthenticationMethods
     * const authenticationMethod = await prisma.authenticationMethod.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthenticationMethodUpdateManyArgs>(args: SelectSubset<T, AuthenticationMethodUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthenticationMethods and returns the data updated in the database.
     * @param {AuthenticationMethodUpdateManyAndReturnArgs} args - Arguments to update many AuthenticationMethods.
     * @example
     * // Update many AuthenticationMethods
     * const authenticationMethod = await prisma.authenticationMethod.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuthenticationMethods and only return the `id`
     * const authenticationMethodWithIdOnly = await prisma.authenticationMethod.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthenticationMethodUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthenticationMethodUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthenticationMethodPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuthenticationMethod.
     * @param {AuthenticationMethodUpsertArgs} args - Arguments to update or create a AuthenticationMethod.
     * @example
     * // Update or create a AuthenticationMethod
     * const authenticationMethod = await prisma.authenticationMethod.upsert({
     *   create: {
     *     // ... data to create a AuthenticationMethod
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuthenticationMethod we want to update
     *   }
     * })
     */
    upsert<T extends AuthenticationMethodUpsertArgs>(args: SelectSubset<T, AuthenticationMethodUpsertArgs<ExtArgs>>): Prisma__AuthenticationMethodClient<$Result.GetResult<Prisma.$AuthenticationMethodPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuthenticationMethods.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticationMethodCountArgs} args - Arguments to filter AuthenticationMethods to count.
     * @example
     * // Count the number of AuthenticationMethods
     * const count = await prisma.authenticationMethod.count({
     *   where: {
     *     // ... the filter for the AuthenticationMethods we want to count
     *   }
     * })
    **/
    count<T extends AuthenticationMethodCountArgs>(
      args?: Subset<T, AuthenticationMethodCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthenticationMethodCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuthenticationMethod.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticationMethodAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthenticationMethodAggregateArgs>(args: Subset<T, AuthenticationMethodAggregateArgs>): Prisma.PrismaPromise<GetAuthenticationMethodAggregateType<T>>

    /**
     * Group by AuthenticationMethod.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticationMethodGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthenticationMethodGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthenticationMethodGroupByArgs['orderBy'] }
        : { orderBy?: AuthenticationMethodGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthenticationMethodGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthenticationMethodGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuthenticationMethod model
   */
  readonly fields: AuthenticationMethodFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuthenticationMethod.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthenticationMethodClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuthenticationMethod model
   */
  interface AuthenticationMethodFieldRefs {
    readonly id: FieldRef<"AuthenticationMethod", 'String'>
    readonly userId: FieldRef<"AuthenticationMethod", 'String'>
    readonly method: FieldRef<"AuthenticationMethod", 'E2FAMethod'>
    readonly data: FieldRef<"AuthenticationMethod", 'Json'>
    readonly name: FieldRef<"AuthenticationMethod", 'String'>
    readonly isActive: FieldRef<"AuthenticationMethod", 'Boolean'>
    readonly isPrimary: FieldRef<"AuthenticationMethod", 'Boolean'>
    readonly lastUsedAt: FieldRef<"AuthenticationMethod", 'DateTime'>
    readonly useCount: FieldRef<"AuthenticationMethod", 'Int'>
    readonly credentialId: FieldRef<"AuthenticationMethod", 'String'>
    readonly createdAt: FieldRef<"AuthenticationMethod", 'DateTime'>
    readonly updatedAt: FieldRef<"AuthenticationMethod", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuthenticationMethod findUnique
   */
  export type AuthenticationMethodFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthenticationMethod
     */
    select?: AuthenticationMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthenticationMethod
     */
    omit?: AuthenticationMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticationMethodInclude<ExtArgs> | null
    /**
     * Filter, which AuthenticationMethod to fetch.
     */
    where: AuthenticationMethodWhereUniqueInput
  }

  /**
   * AuthenticationMethod findUniqueOrThrow
   */
  export type AuthenticationMethodFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthenticationMethod
     */
    select?: AuthenticationMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthenticationMethod
     */
    omit?: AuthenticationMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticationMethodInclude<ExtArgs> | null
    /**
     * Filter, which AuthenticationMethod to fetch.
     */
    where: AuthenticationMethodWhereUniqueInput
  }

  /**
   * AuthenticationMethod findFirst
   */
  export type AuthenticationMethodFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthenticationMethod
     */
    select?: AuthenticationMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthenticationMethod
     */
    omit?: AuthenticationMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticationMethodInclude<ExtArgs> | null
    /**
     * Filter, which AuthenticationMethod to fetch.
     */
    where?: AuthenticationMethodWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthenticationMethods to fetch.
     */
    orderBy?: AuthenticationMethodOrderByWithRelationInput | AuthenticationMethodOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthenticationMethods.
     */
    cursor?: AuthenticationMethodWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthenticationMethods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthenticationMethods.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthenticationMethods.
     */
    distinct?: AuthenticationMethodScalarFieldEnum | AuthenticationMethodScalarFieldEnum[]
  }

  /**
   * AuthenticationMethod findFirstOrThrow
   */
  export type AuthenticationMethodFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthenticationMethod
     */
    select?: AuthenticationMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthenticationMethod
     */
    omit?: AuthenticationMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticationMethodInclude<ExtArgs> | null
    /**
     * Filter, which AuthenticationMethod to fetch.
     */
    where?: AuthenticationMethodWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthenticationMethods to fetch.
     */
    orderBy?: AuthenticationMethodOrderByWithRelationInput | AuthenticationMethodOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthenticationMethods.
     */
    cursor?: AuthenticationMethodWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthenticationMethods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthenticationMethods.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthenticationMethods.
     */
    distinct?: AuthenticationMethodScalarFieldEnum | AuthenticationMethodScalarFieldEnum[]
  }

  /**
   * AuthenticationMethod findMany
   */
  export type AuthenticationMethodFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthenticationMethod
     */
    select?: AuthenticationMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthenticationMethod
     */
    omit?: AuthenticationMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticationMethodInclude<ExtArgs> | null
    /**
     * Filter, which AuthenticationMethods to fetch.
     */
    where?: AuthenticationMethodWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthenticationMethods to fetch.
     */
    orderBy?: AuthenticationMethodOrderByWithRelationInput | AuthenticationMethodOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuthenticationMethods.
     */
    cursor?: AuthenticationMethodWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthenticationMethods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthenticationMethods.
     */
    skip?: number
    distinct?: AuthenticationMethodScalarFieldEnum | AuthenticationMethodScalarFieldEnum[]
  }

  /**
   * AuthenticationMethod create
   */
  export type AuthenticationMethodCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthenticationMethod
     */
    select?: AuthenticationMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthenticationMethod
     */
    omit?: AuthenticationMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticationMethodInclude<ExtArgs> | null
    /**
     * The data needed to create a AuthenticationMethod.
     */
    data: XOR<AuthenticationMethodCreateInput, AuthenticationMethodUncheckedCreateInput>
  }

  /**
   * AuthenticationMethod createMany
   */
  export type AuthenticationMethodCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuthenticationMethods.
     */
    data: AuthenticationMethodCreateManyInput | AuthenticationMethodCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuthenticationMethod createManyAndReturn
   */
  export type AuthenticationMethodCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthenticationMethod
     */
    select?: AuthenticationMethodSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthenticationMethod
     */
    omit?: AuthenticationMethodOmit<ExtArgs> | null
    /**
     * The data used to create many AuthenticationMethods.
     */
    data: AuthenticationMethodCreateManyInput | AuthenticationMethodCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticationMethodIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthenticationMethod update
   */
  export type AuthenticationMethodUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthenticationMethod
     */
    select?: AuthenticationMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthenticationMethod
     */
    omit?: AuthenticationMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticationMethodInclude<ExtArgs> | null
    /**
     * The data needed to update a AuthenticationMethod.
     */
    data: XOR<AuthenticationMethodUpdateInput, AuthenticationMethodUncheckedUpdateInput>
    /**
     * Choose, which AuthenticationMethod to update.
     */
    where: AuthenticationMethodWhereUniqueInput
  }

  /**
   * AuthenticationMethod updateMany
   */
  export type AuthenticationMethodUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuthenticationMethods.
     */
    data: XOR<AuthenticationMethodUpdateManyMutationInput, AuthenticationMethodUncheckedUpdateManyInput>
    /**
     * Filter which AuthenticationMethods to update
     */
    where?: AuthenticationMethodWhereInput
    /**
     * Limit how many AuthenticationMethods to update.
     */
    limit?: number
  }

  /**
   * AuthenticationMethod updateManyAndReturn
   */
  export type AuthenticationMethodUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthenticationMethod
     */
    select?: AuthenticationMethodSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthenticationMethod
     */
    omit?: AuthenticationMethodOmit<ExtArgs> | null
    /**
     * The data used to update AuthenticationMethods.
     */
    data: XOR<AuthenticationMethodUpdateManyMutationInput, AuthenticationMethodUncheckedUpdateManyInput>
    /**
     * Filter which AuthenticationMethods to update
     */
    where?: AuthenticationMethodWhereInput
    /**
     * Limit how many AuthenticationMethods to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticationMethodIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthenticationMethod upsert
   */
  export type AuthenticationMethodUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthenticationMethod
     */
    select?: AuthenticationMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthenticationMethod
     */
    omit?: AuthenticationMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticationMethodInclude<ExtArgs> | null
    /**
     * The filter to search for the AuthenticationMethod to update in case it exists.
     */
    where: AuthenticationMethodWhereUniqueInput
    /**
     * In case the AuthenticationMethod found by the `where` argument doesn't exist, create a new AuthenticationMethod with this data.
     */
    create: XOR<AuthenticationMethodCreateInput, AuthenticationMethodUncheckedCreateInput>
    /**
     * In case the AuthenticationMethod was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthenticationMethodUpdateInput, AuthenticationMethodUncheckedUpdateInput>
  }

  /**
   * AuthenticationMethod delete
   */
  export type AuthenticationMethodDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthenticationMethod
     */
    select?: AuthenticationMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthenticationMethod
     */
    omit?: AuthenticationMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticationMethodInclude<ExtArgs> | null
    /**
     * Filter which AuthenticationMethod to delete.
     */
    where: AuthenticationMethodWhereUniqueInput
  }

  /**
   * AuthenticationMethod deleteMany
   */
  export type AuthenticationMethodDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthenticationMethods to delete
     */
    where?: AuthenticationMethodWhereInput
    /**
     * Limit how many AuthenticationMethods to delete.
     */
    limit?: number
  }

  /**
   * AuthenticationMethod without action
   */
  export type AuthenticationMethodDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthenticationMethod
     */
    select?: AuthenticationMethodSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthenticationMethod
     */
    omit?: AuthenticationMethodOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticationMethodInclude<ExtArgs> | null
  }


  /**
   * Model TrustedDevice
   */

  export type AggregateTrustedDevice = {
    _count: TrustedDeviceCountAggregateOutputType | null
    _avg: TrustedDeviceAvgAggregateOutputType | null
    _sum: TrustedDeviceSumAggregateOutputType | null
    _min: TrustedDeviceMinAggregateOutputType | null
    _max: TrustedDeviceMaxAggregateOutputType | null
  }

  export type TrustedDeviceAvgAggregateOutputType = {
    trustScore: number | null
  }

  export type TrustedDeviceSumAggregateOutputType = {
    trustScore: number | null
  }

  export type TrustedDeviceMinAggregateOutputType = {
    id: string | null
    userId: string | null
    deviceId: string | null
    name: string | null
    userAgent: string | null
    browser: string | null
    os: string | null
    device: string | null
    trustScore: number | null
    lastIp: string | null
    lastCountry: string | null
    lastCity: string | null
    isActive: boolean | null
    lastSeenAt: Date | null
    expiresAt: Date | null
    revokedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrustedDeviceMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    deviceId: string | null
    name: string | null
    userAgent: string | null
    browser: string | null
    os: string | null
    device: string | null
    trustScore: number | null
    lastIp: string | null
    lastCountry: string | null
    lastCity: string | null
    isActive: boolean | null
    lastSeenAt: Date | null
    expiresAt: Date | null
    revokedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrustedDeviceCountAggregateOutputType = {
    id: number
    userId: number
    deviceId: number
    fingerprint: number
    name: number
    userAgent: number
    browser: number
    os: number
    device: number
    trustScore: number
    lastIp: number
    lastCountry: number
    lastCity: number
    isActive: number
    lastSeenAt: number
    expiresAt: number
    revokedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TrustedDeviceAvgAggregateInputType = {
    trustScore?: true
  }

  export type TrustedDeviceSumAggregateInputType = {
    trustScore?: true
  }

  export type TrustedDeviceMinAggregateInputType = {
    id?: true
    userId?: true
    deviceId?: true
    name?: true
    userAgent?: true
    browser?: true
    os?: true
    device?: true
    trustScore?: true
    lastIp?: true
    lastCountry?: true
    lastCity?: true
    isActive?: true
    lastSeenAt?: true
    expiresAt?: true
    revokedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrustedDeviceMaxAggregateInputType = {
    id?: true
    userId?: true
    deviceId?: true
    name?: true
    userAgent?: true
    browser?: true
    os?: true
    device?: true
    trustScore?: true
    lastIp?: true
    lastCountry?: true
    lastCity?: true
    isActive?: true
    lastSeenAt?: true
    expiresAt?: true
    revokedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrustedDeviceCountAggregateInputType = {
    id?: true
    userId?: true
    deviceId?: true
    fingerprint?: true
    name?: true
    userAgent?: true
    browser?: true
    os?: true
    device?: true
    trustScore?: true
    lastIp?: true
    lastCountry?: true
    lastCity?: true
    isActive?: true
    lastSeenAt?: true
    expiresAt?: true
    revokedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TrustedDeviceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrustedDevice to aggregate.
     */
    where?: TrustedDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustedDevices to fetch.
     */
    orderBy?: TrustedDeviceOrderByWithRelationInput | TrustedDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrustedDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustedDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustedDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrustedDevices
    **/
    _count?: true | TrustedDeviceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrustedDeviceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrustedDeviceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrustedDeviceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrustedDeviceMaxAggregateInputType
  }

  export type GetTrustedDeviceAggregateType<T extends TrustedDeviceAggregateArgs> = {
        [P in keyof T & keyof AggregateTrustedDevice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrustedDevice[P]>
      : GetScalarType<T[P], AggregateTrustedDevice[P]>
  }




  export type TrustedDeviceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrustedDeviceWhereInput
    orderBy?: TrustedDeviceOrderByWithAggregationInput | TrustedDeviceOrderByWithAggregationInput[]
    by: TrustedDeviceScalarFieldEnum[] | TrustedDeviceScalarFieldEnum
    having?: TrustedDeviceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrustedDeviceCountAggregateInputType | true
    _avg?: TrustedDeviceAvgAggregateInputType
    _sum?: TrustedDeviceSumAggregateInputType
    _min?: TrustedDeviceMinAggregateInputType
    _max?: TrustedDeviceMaxAggregateInputType
  }

  export type TrustedDeviceGroupByOutputType = {
    id: string
    userId: string
    deviceId: string
    fingerprint: JsonValue
    name: string | null
    userAgent: string
    browser: string | null
    os: string | null
    device: string | null
    trustScore: number
    lastIp: string | null
    lastCountry: string | null
    lastCity: string | null
    isActive: boolean
    lastSeenAt: Date
    expiresAt: Date | null
    revokedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: TrustedDeviceCountAggregateOutputType | null
    _avg: TrustedDeviceAvgAggregateOutputType | null
    _sum: TrustedDeviceSumAggregateOutputType | null
    _min: TrustedDeviceMinAggregateOutputType | null
    _max: TrustedDeviceMaxAggregateOutputType | null
  }

  type GetTrustedDeviceGroupByPayload<T extends TrustedDeviceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrustedDeviceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrustedDeviceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrustedDeviceGroupByOutputType[P]>
            : GetScalarType<T[P], TrustedDeviceGroupByOutputType[P]>
        }
      >
    >


  export type TrustedDeviceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    deviceId?: boolean
    fingerprint?: boolean
    name?: boolean
    userAgent?: boolean
    browser?: boolean
    os?: boolean
    device?: boolean
    trustScore?: boolean
    lastIp?: boolean
    lastCountry?: boolean
    lastCity?: boolean
    isActive?: boolean
    lastSeenAt?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trustedDevice"]>

  export type TrustedDeviceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    deviceId?: boolean
    fingerprint?: boolean
    name?: boolean
    userAgent?: boolean
    browser?: boolean
    os?: boolean
    device?: boolean
    trustScore?: boolean
    lastIp?: boolean
    lastCountry?: boolean
    lastCity?: boolean
    isActive?: boolean
    lastSeenAt?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trustedDevice"]>

  export type TrustedDeviceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    deviceId?: boolean
    fingerprint?: boolean
    name?: boolean
    userAgent?: boolean
    browser?: boolean
    os?: boolean
    device?: boolean
    trustScore?: boolean
    lastIp?: boolean
    lastCountry?: boolean
    lastCity?: boolean
    isActive?: boolean
    lastSeenAt?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trustedDevice"]>

  export type TrustedDeviceSelectScalar = {
    id?: boolean
    userId?: boolean
    deviceId?: boolean
    fingerprint?: boolean
    name?: boolean
    userAgent?: boolean
    browser?: boolean
    os?: boolean
    device?: boolean
    trustScore?: boolean
    lastIp?: boolean
    lastCountry?: boolean
    lastCity?: boolean
    isActive?: boolean
    lastSeenAt?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TrustedDeviceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "deviceId" | "fingerprint" | "name" | "userAgent" | "browser" | "os" | "device" | "trustScore" | "lastIp" | "lastCountry" | "lastCity" | "isActive" | "lastSeenAt" | "expiresAt" | "revokedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["trustedDevice"]>
  export type TrustedDeviceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TrustedDeviceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TrustedDeviceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TrustedDevicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrustedDevice"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      /**
       * Hashed device fingerprint for identification
       */
      deviceId: string
      /**
       * Full device fingerprint data (for verification)
       */
      fingerprint: Prisma.JsonValue
      /**
       * User-provided device name (e.g., "Home Laptop", "Work iPhone")
       */
      name: string | null
      userAgent: string
      browser: string | null
      os: string | null
      device: string | null
      /**
       * Trust level (0-100): higher = more trusted
       */
      trustScore: number
      lastIp: string | null
      lastCountry: string | null
      lastCity: string | null
      /**
       * Device is currently trusted and active
       */
      isActive: boolean
      /**
       * Last time device was seen/used
       */
      lastSeenAt: Date
      /**
       * Optional expiration (e.g., trust for 30 days)
       */
      expiresAt: Date | null
      /**
       * Manual revocation timestamp
       */
      revokedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["trustedDevice"]>
    composites: {}
  }

  type TrustedDeviceGetPayload<S extends boolean | null | undefined | TrustedDeviceDefaultArgs> = $Result.GetResult<Prisma.$TrustedDevicePayload, S>

  type TrustedDeviceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TrustedDeviceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TrustedDeviceCountAggregateInputType | true
    }

  export interface TrustedDeviceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrustedDevice'], meta: { name: 'TrustedDevice' } }
    /**
     * Find zero or one TrustedDevice that matches the filter.
     * @param {TrustedDeviceFindUniqueArgs} args - Arguments to find a TrustedDevice
     * @example
     * // Get one TrustedDevice
     * const trustedDevice = await prisma.trustedDevice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrustedDeviceFindUniqueArgs>(args: SelectSubset<T, TrustedDeviceFindUniqueArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TrustedDevice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TrustedDeviceFindUniqueOrThrowArgs} args - Arguments to find a TrustedDevice
     * @example
     * // Get one TrustedDevice
     * const trustedDevice = await prisma.trustedDevice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrustedDeviceFindUniqueOrThrowArgs>(args: SelectSubset<T, TrustedDeviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrustedDevice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustedDeviceFindFirstArgs} args - Arguments to find a TrustedDevice
     * @example
     * // Get one TrustedDevice
     * const trustedDevice = await prisma.trustedDevice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrustedDeviceFindFirstArgs>(args?: SelectSubset<T, TrustedDeviceFindFirstArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrustedDevice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustedDeviceFindFirstOrThrowArgs} args - Arguments to find a TrustedDevice
     * @example
     * // Get one TrustedDevice
     * const trustedDevice = await prisma.trustedDevice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrustedDeviceFindFirstOrThrowArgs>(args?: SelectSubset<T, TrustedDeviceFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TrustedDevices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustedDeviceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrustedDevices
     * const trustedDevices = await prisma.trustedDevice.findMany()
     * 
     * // Get first 10 TrustedDevices
     * const trustedDevices = await prisma.trustedDevice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trustedDeviceWithIdOnly = await prisma.trustedDevice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrustedDeviceFindManyArgs>(args?: SelectSubset<T, TrustedDeviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TrustedDevice.
     * @param {TrustedDeviceCreateArgs} args - Arguments to create a TrustedDevice.
     * @example
     * // Create one TrustedDevice
     * const TrustedDevice = await prisma.trustedDevice.create({
     *   data: {
     *     // ... data to create a TrustedDevice
     *   }
     * })
     * 
     */
    create<T extends TrustedDeviceCreateArgs>(args: SelectSubset<T, TrustedDeviceCreateArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TrustedDevices.
     * @param {TrustedDeviceCreateManyArgs} args - Arguments to create many TrustedDevices.
     * @example
     * // Create many TrustedDevices
     * const trustedDevice = await prisma.trustedDevice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrustedDeviceCreateManyArgs>(args?: SelectSubset<T, TrustedDeviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrustedDevices and returns the data saved in the database.
     * @param {TrustedDeviceCreateManyAndReturnArgs} args - Arguments to create many TrustedDevices.
     * @example
     * // Create many TrustedDevices
     * const trustedDevice = await prisma.trustedDevice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrustedDevices and only return the `id`
     * const trustedDeviceWithIdOnly = await prisma.trustedDevice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrustedDeviceCreateManyAndReturnArgs>(args?: SelectSubset<T, TrustedDeviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TrustedDevice.
     * @param {TrustedDeviceDeleteArgs} args - Arguments to delete one TrustedDevice.
     * @example
     * // Delete one TrustedDevice
     * const TrustedDevice = await prisma.trustedDevice.delete({
     *   where: {
     *     // ... filter to delete one TrustedDevice
     *   }
     * })
     * 
     */
    delete<T extends TrustedDeviceDeleteArgs>(args: SelectSubset<T, TrustedDeviceDeleteArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TrustedDevice.
     * @param {TrustedDeviceUpdateArgs} args - Arguments to update one TrustedDevice.
     * @example
     * // Update one TrustedDevice
     * const trustedDevice = await prisma.trustedDevice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrustedDeviceUpdateArgs>(args: SelectSubset<T, TrustedDeviceUpdateArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TrustedDevices.
     * @param {TrustedDeviceDeleteManyArgs} args - Arguments to filter TrustedDevices to delete.
     * @example
     * // Delete a few TrustedDevices
     * const { count } = await prisma.trustedDevice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrustedDeviceDeleteManyArgs>(args?: SelectSubset<T, TrustedDeviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrustedDevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustedDeviceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrustedDevices
     * const trustedDevice = await prisma.trustedDevice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrustedDeviceUpdateManyArgs>(args: SelectSubset<T, TrustedDeviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrustedDevices and returns the data updated in the database.
     * @param {TrustedDeviceUpdateManyAndReturnArgs} args - Arguments to update many TrustedDevices.
     * @example
     * // Update many TrustedDevices
     * const trustedDevice = await prisma.trustedDevice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TrustedDevices and only return the `id`
     * const trustedDeviceWithIdOnly = await prisma.trustedDevice.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TrustedDeviceUpdateManyAndReturnArgs>(args: SelectSubset<T, TrustedDeviceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TrustedDevice.
     * @param {TrustedDeviceUpsertArgs} args - Arguments to update or create a TrustedDevice.
     * @example
     * // Update or create a TrustedDevice
     * const trustedDevice = await prisma.trustedDevice.upsert({
     *   create: {
     *     // ... data to create a TrustedDevice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrustedDevice we want to update
     *   }
     * })
     */
    upsert<T extends TrustedDeviceUpsertArgs>(args: SelectSubset<T, TrustedDeviceUpsertArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TrustedDevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustedDeviceCountArgs} args - Arguments to filter TrustedDevices to count.
     * @example
     * // Count the number of TrustedDevices
     * const count = await prisma.trustedDevice.count({
     *   where: {
     *     // ... the filter for the TrustedDevices we want to count
     *   }
     * })
    **/
    count<T extends TrustedDeviceCountArgs>(
      args?: Subset<T, TrustedDeviceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrustedDeviceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrustedDevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustedDeviceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrustedDeviceAggregateArgs>(args: Subset<T, TrustedDeviceAggregateArgs>): Prisma.PrismaPromise<GetTrustedDeviceAggregateType<T>>

    /**
     * Group by TrustedDevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustedDeviceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrustedDeviceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrustedDeviceGroupByArgs['orderBy'] }
        : { orderBy?: TrustedDeviceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrustedDeviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrustedDeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrustedDevice model
   */
  readonly fields: TrustedDeviceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrustedDevice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrustedDeviceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TrustedDevice model
   */
  interface TrustedDeviceFieldRefs {
    readonly id: FieldRef<"TrustedDevice", 'String'>
    readonly userId: FieldRef<"TrustedDevice", 'String'>
    readonly deviceId: FieldRef<"TrustedDevice", 'String'>
    readonly fingerprint: FieldRef<"TrustedDevice", 'Json'>
    readonly name: FieldRef<"TrustedDevice", 'String'>
    readonly userAgent: FieldRef<"TrustedDevice", 'String'>
    readonly browser: FieldRef<"TrustedDevice", 'String'>
    readonly os: FieldRef<"TrustedDevice", 'String'>
    readonly device: FieldRef<"TrustedDevice", 'String'>
    readonly trustScore: FieldRef<"TrustedDevice", 'Float'>
    readonly lastIp: FieldRef<"TrustedDevice", 'String'>
    readonly lastCountry: FieldRef<"TrustedDevice", 'String'>
    readonly lastCity: FieldRef<"TrustedDevice", 'String'>
    readonly isActive: FieldRef<"TrustedDevice", 'Boolean'>
    readonly lastSeenAt: FieldRef<"TrustedDevice", 'DateTime'>
    readonly expiresAt: FieldRef<"TrustedDevice", 'DateTime'>
    readonly revokedAt: FieldRef<"TrustedDevice", 'DateTime'>
    readonly createdAt: FieldRef<"TrustedDevice", 'DateTime'>
    readonly updatedAt: FieldRef<"TrustedDevice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrustedDevice findUnique
   */
  export type TrustedDeviceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * Filter, which TrustedDevice to fetch.
     */
    where: TrustedDeviceWhereUniqueInput
  }

  /**
   * TrustedDevice findUniqueOrThrow
   */
  export type TrustedDeviceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * Filter, which TrustedDevice to fetch.
     */
    where: TrustedDeviceWhereUniqueInput
  }

  /**
   * TrustedDevice findFirst
   */
  export type TrustedDeviceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * Filter, which TrustedDevice to fetch.
     */
    where?: TrustedDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustedDevices to fetch.
     */
    orderBy?: TrustedDeviceOrderByWithRelationInput | TrustedDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrustedDevices.
     */
    cursor?: TrustedDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustedDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustedDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrustedDevices.
     */
    distinct?: TrustedDeviceScalarFieldEnum | TrustedDeviceScalarFieldEnum[]
  }

  /**
   * TrustedDevice findFirstOrThrow
   */
  export type TrustedDeviceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * Filter, which TrustedDevice to fetch.
     */
    where?: TrustedDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustedDevices to fetch.
     */
    orderBy?: TrustedDeviceOrderByWithRelationInput | TrustedDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrustedDevices.
     */
    cursor?: TrustedDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustedDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustedDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrustedDevices.
     */
    distinct?: TrustedDeviceScalarFieldEnum | TrustedDeviceScalarFieldEnum[]
  }

  /**
   * TrustedDevice findMany
   */
  export type TrustedDeviceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * Filter, which TrustedDevices to fetch.
     */
    where?: TrustedDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustedDevices to fetch.
     */
    orderBy?: TrustedDeviceOrderByWithRelationInput | TrustedDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrustedDevices.
     */
    cursor?: TrustedDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustedDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustedDevices.
     */
    skip?: number
    distinct?: TrustedDeviceScalarFieldEnum | TrustedDeviceScalarFieldEnum[]
  }

  /**
   * TrustedDevice create
   */
  export type TrustedDeviceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * The data needed to create a TrustedDevice.
     */
    data: XOR<TrustedDeviceCreateInput, TrustedDeviceUncheckedCreateInput>
  }

  /**
   * TrustedDevice createMany
   */
  export type TrustedDeviceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrustedDevices.
     */
    data: TrustedDeviceCreateManyInput | TrustedDeviceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrustedDevice createManyAndReturn
   */
  export type TrustedDeviceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * The data used to create many TrustedDevices.
     */
    data: TrustedDeviceCreateManyInput | TrustedDeviceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrustedDevice update
   */
  export type TrustedDeviceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * The data needed to update a TrustedDevice.
     */
    data: XOR<TrustedDeviceUpdateInput, TrustedDeviceUncheckedUpdateInput>
    /**
     * Choose, which TrustedDevice to update.
     */
    where: TrustedDeviceWhereUniqueInput
  }

  /**
   * TrustedDevice updateMany
   */
  export type TrustedDeviceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrustedDevices.
     */
    data: XOR<TrustedDeviceUpdateManyMutationInput, TrustedDeviceUncheckedUpdateManyInput>
    /**
     * Filter which TrustedDevices to update
     */
    where?: TrustedDeviceWhereInput
    /**
     * Limit how many TrustedDevices to update.
     */
    limit?: number
  }

  /**
   * TrustedDevice updateManyAndReturn
   */
  export type TrustedDeviceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * The data used to update TrustedDevices.
     */
    data: XOR<TrustedDeviceUpdateManyMutationInput, TrustedDeviceUncheckedUpdateManyInput>
    /**
     * Filter which TrustedDevices to update
     */
    where?: TrustedDeviceWhereInput
    /**
     * Limit how many TrustedDevices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrustedDevice upsert
   */
  export type TrustedDeviceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * The filter to search for the TrustedDevice to update in case it exists.
     */
    where: TrustedDeviceWhereUniqueInput
    /**
     * In case the TrustedDevice found by the `where` argument doesn't exist, create a new TrustedDevice with this data.
     */
    create: XOR<TrustedDeviceCreateInput, TrustedDeviceUncheckedCreateInput>
    /**
     * In case the TrustedDevice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrustedDeviceUpdateInput, TrustedDeviceUncheckedUpdateInput>
  }

  /**
   * TrustedDevice delete
   */
  export type TrustedDeviceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * Filter which TrustedDevice to delete.
     */
    where: TrustedDeviceWhereUniqueInput
  }

  /**
   * TrustedDevice deleteMany
   */
  export type TrustedDeviceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrustedDevices to delete
     */
    where?: TrustedDeviceWhereInput
    /**
     * Limit how many TrustedDevices to delete.
     */
    limit?: number
  }

  /**
   * TrustedDevice without action
   */
  export type TrustedDeviceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
  }


  /**
   * Model SecurityEvent
   */

  export type AggregateSecurityEvent = {
    _count: SecurityEventCountAggregateOutputType | null
    _avg: SecurityEventAvgAggregateOutputType | null
    _sum: SecurityEventSumAggregateOutputType | null
    _min: SecurityEventMinAggregateOutputType | null
    _max: SecurityEventMaxAggregateOutputType | null
  }

  export type SecurityEventAvgAggregateOutputType = {
    riskScore: number | null
  }

  export type SecurityEventSumAggregateOutputType = {
    riskScore: number | null
  }

  export type SecurityEventMinAggregateOutputType = {
    id: string | null
    userId: string | null
    event: $Enums.ESecurityEvent | null
    severity: $Enums.ESecuritySeverity | null
    ip: string | null
    userAgent: string | null
    country: string | null
    city: string | null
    deviceId: string | null
    riskScore: number | null
    resolved: boolean | null
    resolvedAt: Date | null
    resolvedBy: string | null
    createdAt: Date | null
  }

  export type SecurityEventMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    event: $Enums.ESecurityEvent | null
    severity: $Enums.ESecuritySeverity | null
    ip: string | null
    userAgent: string | null
    country: string | null
    city: string | null
    deviceId: string | null
    riskScore: number | null
    resolved: boolean | null
    resolvedAt: Date | null
    resolvedBy: string | null
    createdAt: Date | null
  }

  export type SecurityEventCountAggregateOutputType = {
    id: number
    userId: number
    event: number
    severity: number
    ip: number
    userAgent: number
    country: number
    city: number
    deviceId: number
    riskScore: number
    riskFactors: number
    resolved: number
    resolvedAt: number
    resolvedBy: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type SecurityEventAvgAggregateInputType = {
    riskScore?: true
  }

  export type SecurityEventSumAggregateInputType = {
    riskScore?: true
  }

  export type SecurityEventMinAggregateInputType = {
    id?: true
    userId?: true
    event?: true
    severity?: true
    ip?: true
    userAgent?: true
    country?: true
    city?: true
    deviceId?: true
    riskScore?: true
    resolved?: true
    resolvedAt?: true
    resolvedBy?: true
    createdAt?: true
  }

  export type SecurityEventMaxAggregateInputType = {
    id?: true
    userId?: true
    event?: true
    severity?: true
    ip?: true
    userAgent?: true
    country?: true
    city?: true
    deviceId?: true
    riskScore?: true
    resolved?: true
    resolvedAt?: true
    resolvedBy?: true
    createdAt?: true
  }

  export type SecurityEventCountAggregateInputType = {
    id?: true
    userId?: true
    event?: true
    severity?: true
    ip?: true
    userAgent?: true
    country?: true
    city?: true
    deviceId?: true
    riskScore?: true
    riskFactors?: true
    resolved?: true
    resolvedAt?: true
    resolvedBy?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type SecurityEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SecurityEvent to aggregate.
     */
    where?: SecurityEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityEvents to fetch.
     */
    orderBy?: SecurityEventOrderByWithRelationInput | SecurityEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SecurityEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SecurityEvents
    **/
    _count?: true | SecurityEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SecurityEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SecurityEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SecurityEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SecurityEventMaxAggregateInputType
  }

  export type GetSecurityEventAggregateType<T extends SecurityEventAggregateArgs> = {
        [P in keyof T & keyof AggregateSecurityEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSecurityEvent[P]>
      : GetScalarType<T[P], AggregateSecurityEvent[P]>
  }




  export type SecurityEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SecurityEventWhereInput
    orderBy?: SecurityEventOrderByWithAggregationInput | SecurityEventOrderByWithAggregationInput[]
    by: SecurityEventScalarFieldEnum[] | SecurityEventScalarFieldEnum
    having?: SecurityEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SecurityEventCountAggregateInputType | true
    _avg?: SecurityEventAvgAggregateInputType
    _sum?: SecurityEventSumAggregateInputType
    _min?: SecurityEventMinAggregateInputType
    _max?: SecurityEventMaxAggregateInputType
  }

  export type SecurityEventGroupByOutputType = {
    id: string
    userId: string
    event: $Enums.ESecurityEvent
    severity: $Enums.ESecuritySeverity
    ip: string | null
    userAgent: string | null
    country: string | null
    city: string | null
    deviceId: string | null
    riskScore: number | null
    riskFactors: JsonValue | null
    resolved: boolean
    resolvedAt: Date | null
    resolvedBy: string | null
    metadata: JsonValue | null
    createdAt: Date
    _count: SecurityEventCountAggregateOutputType | null
    _avg: SecurityEventAvgAggregateOutputType | null
    _sum: SecurityEventSumAggregateOutputType | null
    _min: SecurityEventMinAggregateOutputType | null
    _max: SecurityEventMaxAggregateOutputType | null
  }

  type GetSecurityEventGroupByPayload<T extends SecurityEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SecurityEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SecurityEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SecurityEventGroupByOutputType[P]>
            : GetScalarType<T[P], SecurityEventGroupByOutputType[P]>
        }
      >
    >


  export type SecurityEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    event?: boolean
    severity?: boolean
    ip?: boolean
    userAgent?: boolean
    country?: boolean
    city?: boolean
    deviceId?: boolean
    riskScore?: boolean
    riskFactors?: boolean
    resolved?: boolean
    resolvedAt?: boolean
    resolvedBy?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["securityEvent"]>

  export type SecurityEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    event?: boolean
    severity?: boolean
    ip?: boolean
    userAgent?: boolean
    country?: boolean
    city?: boolean
    deviceId?: boolean
    riskScore?: boolean
    riskFactors?: boolean
    resolved?: boolean
    resolvedAt?: boolean
    resolvedBy?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["securityEvent"]>

  export type SecurityEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    event?: boolean
    severity?: boolean
    ip?: boolean
    userAgent?: boolean
    country?: boolean
    city?: boolean
    deviceId?: boolean
    riskScore?: boolean
    riskFactors?: boolean
    resolved?: boolean
    resolvedAt?: boolean
    resolvedBy?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["securityEvent"]>

  export type SecurityEventSelectScalar = {
    id?: boolean
    userId?: boolean
    event?: boolean
    severity?: boolean
    ip?: boolean
    userAgent?: boolean
    country?: boolean
    city?: boolean
    deviceId?: boolean
    riskScore?: boolean
    riskFactors?: boolean
    resolved?: boolean
    resolvedAt?: boolean
    resolvedBy?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type SecurityEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "event" | "severity" | "ip" | "userAgent" | "country" | "city" | "deviceId" | "riskScore" | "riskFactors" | "resolved" | "resolvedAt" | "resolvedBy" | "metadata" | "createdAt", ExtArgs["result"]["securityEvent"]>
  export type SecurityEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SecurityEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SecurityEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SecurityEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SecurityEvent"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      /**
       * Type of security event (LOGIN_SUCCESS, TWO_FA_FAILED, etc.)
       */
      event: $Enums.ESecurityEvent
      /**
       * Event severity level
       */
      severity: $Enums.ESecuritySeverity
      ip: string | null
      userAgent: string | null
      country: string | null
      city: string | null
      /**
       * Associated device fingerprint
       */
      deviceId: string | null
      /**
       * Calculated risk score for this specific event (0-100)
       */
      riskScore: number | null
      /**
       * Risk factors that contributed to the score
       */
      riskFactors: Prisma.JsonValue | null
      /**
       * Whether this event has been reviewed and resolved
       */
      resolved: boolean
      /**
       * When the event was marked as resolved
       */
      resolvedAt: Date | null
      /**
       * Admin user who resolved the event
       */
      resolvedBy: string | null
      /**
       * Additional context data
       */
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["securityEvent"]>
    composites: {}
  }

  type SecurityEventGetPayload<S extends boolean | null | undefined | SecurityEventDefaultArgs> = $Result.GetResult<Prisma.$SecurityEventPayload, S>

  type SecurityEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SecurityEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SecurityEventCountAggregateInputType | true
    }

  export interface SecurityEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SecurityEvent'], meta: { name: 'SecurityEvent' } }
    /**
     * Find zero or one SecurityEvent that matches the filter.
     * @param {SecurityEventFindUniqueArgs} args - Arguments to find a SecurityEvent
     * @example
     * // Get one SecurityEvent
     * const securityEvent = await prisma.securityEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SecurityEventFindUniqueArgs>(args: SelectSubset<T, SecurityEventFindUniqueArgs<ExtArgs>>): Prisma__SecurityEventClient<$Result.GetResult<Prisma.$SecurityEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SecurityEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SecurityEventFindUniqueOrThrowArgs} args - Arguments to find a SecurityEvent
     * @example
     * // Get one SecurityEvent
     * const securityEvent = await prisma.securityEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SecurityEventFindUniqueOrThrowArgs>(args: SelectSubset<T, SecurityEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SecurityEventClient<$Result.GetResult<Prisma.$SecurityEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SecurityEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityEventFindFirstArgs} args - Arguments to find a SecurityEvent
     * @example
     * // Get one SecurityEvent
     * const securityEvent = await prisma.securityEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SecurityEventFindFirstArgs>(args?: SelectSubset<T, SecurityEventFindFirstArgs<ExtArgs>>): Prisma__SecurityEventClient<$Result.GetResult<Prisma.$SecurityEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SecurityEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityEventFindFirstOrThrowArgs} args - Arguments to find a SecurityEvent
     * @example
     * // Get one SecurityEvent
     * const securityEvent = await prisma.securityEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SecurityEventFindFirstOrThrowArgs>(args?: SelectSubset<T, SecurityEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__SecurityEventClient<$Result.GetResult<Prisma.$SecurityEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SecurityEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SecurityEvents
     * const securityEvents = await prisma.securityEvent.findMany()
     * 
     * // Get first 10 SecurityEvents
     * const securityEvents = await prisma.securityEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const securityEventWithIdOnly = await prisma.securityEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SecurityEventFindManyArgs>(args?: SelectSubset<T, SecurityEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecurityEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SecurityEvent.
     * @param {SecurityEventCreateArgs} args - Arguments to create a SecurityEvent.
     * @example
     * // Create one SecurityEvent
     * const SecurityEvent = await prisma.securityEvent.create({
     *   data: {
     *     // ... data to create a SecurityEvent
     *   }
     * })
     * 
     */
    create<T extends SecurityEventCreateArgs>(args: SelectSubset<T, SecurityEventCreateArgs<ExtArgs>>): Prisma__SecurityEventClient<$Result.GetResult<Prisma.$SecurityEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SecurityEvents.
     * @param {SecurityEventCreateManyArgs} args - Arguments to create many SecurityEvents.
     * @example
     * // Create many SecurityEvents
     * const securityEvent = await prisma.securityEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SecurityEventCreateManyArgs>(args?: SelectSubset<T, SecurityEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SecurityEvents and returns the data saved in the database.
     * @param {SecurityEventCreateManyAndReturnArgs} args - Arguments to create many SecurityEvents.
     * @example
     * // Create many SecurityEvents
     * const securityEvent = await prisma.securityEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SecurityEvents and only return the `id`
     * const securityEventWithIdOnly = await prisma.securityEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SecurityEventCreateManyAndReturnArgs>(args?: SelectSubset<T, SecurityEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecurityEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SecurityEvent.
     * @param {SecurityEventDeleteArgs} args - Arguments to delete one SecurityEvent.
     * @example
     * // Delete one SecurityEvent
     * const SecurityEvent = await prisma.securityEvent.delete({
     *   where: {
     *     // ... filter to delete one SecurityEvent
     *   }
     * })
     * 
     */
    delete<T extends SecurityEventDeleteArgs>(args: SelectSubset<T, SecurityEventDeleteArgs<ExtArgs>>): Prisma__SecurityEventClient<$Result.GetResult<Prisma.$SecurityEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SecurityEvent.
     * @param {SecurityEventUpdateArgs} args - Arguments to update one SecurityEvent.
     * @example
     * // Update one SecurityEvent
     * const securityEvent = await prisma.securityEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SecurityEventUpdateArgs>(args: SelectSubset<T, SecurityEventUpdateArgs<ExtArgs>>): Prisma__SecurityEventClient<$Result.GetResult<Prisma.$SecurityEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SecurityEvents.
     * @param {SecurityEventDeleteManyArgs} args - Arguments to filter SecurityEvents to delete.
     * @example
     * // Delete a few SecurityEvents
     * const { count } = await prisma.securityEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SecurityEventDeleteManyArgs>(args?: SelectSubset<T, SecurityEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SecurityEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SecurityEvents
     * const securityEvent = await prisma.securityEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SecurityEventUpdateManyArgs>(args: SelectSubset<T, SecurityEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SecurityEvents and returns the data updated in the database.
     * @param {SecurityEventUpdateManyAndReturnArgs} args - Arguments to update many SecurityEvents.
     * @example
     * // Update many SecurityEvents
     * const securityEvent = await prisma.securityEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SecurityEvents and only return the `id`
     * const securityEventWithIdOnly = await prisma.securityEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SecurityEventUpdateManyAndReturnArgs>(args: SelectSubset<T, SecurityEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecurityEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SecurityEvent.
     * @param {SecurityEventUpsertArgs} args - Arguments to update or create a SecurityEvent.
     * @example
     * // Update or create a SecurityEvent
     * const securityEvent = await prisma.securityEvent.upsert({
     *   create: {
     *     // ... data to create a SecurityEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SecurityEvent we want to update
     *   }
     * })
     */
    upsert<T extends SecurityEventUpsertArgs>(args: SelectSubset<T, SecurityEventUpsertArgs<ExtArgs>>): Prisma__SecurityEventClient<$Result.GetResult<Prisma.$SecurityEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SecurityEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityEventCountArgs} args - Arguments to filter SecurityEvents to count.
     * @example
     * // Count the number of SecurityEvents
     * const count = await prisma.securityEvent.count({
     *   where: {
     *     // ... the filter for the SecurityEvents we want to count
     *   }
     * })
    **/
    count<T extends SecurityEventCountArgs>(
      args?: Subset<T, SecurityEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SecurityEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SecurityEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SecurityEventAggregateArgs>(args: Subset<T, SecurityEventAggregateArgs>): Prisma.PrismaPromise<GetSecurityEventAggregateType<T>>

    /**
     * Group by SecurityEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SecurityEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SecurityEventGroupByArgs['orderBy'] }
        : { orderBy?: SecurityEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SecurityEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSecurityEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SecurityEvent model
   */
  readonly fields: SecurityEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SecurityEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SecurityEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SecurityEvent model
   */
  interface SecurityEventFieldRefs {
    readonly id: FieldRef<"SecurityEvent", 'String'>
    readonly userId: FieldRef<"SecurityEvent", 'String'>
    readonly event: FieldRef<"SecurityEvent", 'ESecurityEvent'>
    readonly severity: FieldRef<"SecurityEvent", 'ESecuritySeverity'>
    readonly ip: FieldRef<"SecurityEvent", 'String'>
    readonly userAgent: FieldRef<"SecurityEvent", 'String'>
    readonly country: FieldRef<"SecurityEvent", 'String'>
    readonly city: FieldRef<"SecurityEvent", 'String'>
    readonly deviceId: FieldRef<"SecurityEvent", 'String'>
    readonly riskScore: FieldRef<"SecurityEvent", 'Float'>
    readonly riskFactors: FieldRef<"SecurityEvent", 'Json'>
    readonly resolved: FieldRef<"SecurityEvent", 'Boolean'>
    readonly resolvedAt: FieldRef<"SecurityEvent", 'DateTime'>
    readonly resolvedBy: FieldRef<"SecurityEvent", 'String'>
    readonly metadata: FieldRef<"SecurityEvent", 'Json'>
    readonly createdAt: FieldRef<"SecurityEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SecurityEvent findUnique
   */
  export type SecurityEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEvent
     */
    select?: SecurityEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityEvent
     */
    omit?: SecurityEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityEventInclude<ExtArgs> | null
    /**
     * Filter, which SecurityEvent to fetch.
     */
    where: SecurityEventWhereUniqueInput
  }

  /**
   * SecurityEvent findUniqueOrThrow
   */
  export type SecurityEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEvent
     */
    select?: SecurityEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityEvent
     */
    omit?: SecurityEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityEventInclude<ExtArgs> | null
    /**
     * Filter, which SecurityEvent to fetch.
     */
    where: SecurityEventWhereUniqueInput
  }

  /**
   * SecurityEvent findFirst
   */
  export type SecurityEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEvent
     */
    select?: SecurityEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityEvent
     */
    omit?: SecurityEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityEventInclude<ExtArgs> | null
    /**
     * Filter, which SecurityEvent to fetch.
     */
    where?: SecurityEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityEvents to fetch.
     */
    orderBy?: SecurityEventOrderByWithRelationInput | SecurityEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SecurityEvents.
     */
    cursor?: SecurityEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SecurityEvents.
     */
    distinct?: SecurityEventScalarFieldEnum | SecurityEventScalarFieldEnum[]
  }

  /**
   * SecurityEvent findFirstOrThrow
   */
  export type SecurityEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEvent
     */
    select?: SecurityEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityEvent
     */
    omit?: SecurityEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityEventInclude<ExtArgs> | null
    /**
     * Filter, which SecurityEvent to fetch.
     */
    where?: SecurityEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityEvents to fetch.
     */
    orderBy?: SecurityEventOrderByWithRelationInput | SecurityEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SecurityEvents.
     */
    cursor?: SecurityEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SecurityEvents.
     */
    distinct?: SecurityEventScalarFieldEnum | SecurityEventScalarFieldEnum[]
  }

  /**
   * SecurityEvent findMany
   */
  export type SecurityEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEvent
     */
    select?: SecurityEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityEvent
     */
    omit?: SecurityEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityEventInclude<ExtArgs> | null
    /**
     * Filter, which SecurityEvents to fetch.
     */
    where?: SecurityEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityEvents to fetch.
     */
    orderBy?: SecurityEventOrderByWithRelationInput | SecurityEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SecurityEvents.
     */
    cursor?: SecurityEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityEvents.
     */
    skip?: number
    distinct?: SecurityEventScalarFieldEnum | SecurityEventScalarFieldEnum[]
  }

  /**
   * SecurityEvent create
   */
  export type SecurityEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEvent
     */
    select?: SecurityEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityEvent
     */
    omit?: SecurityEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityEventInclude<ExtArgs> | null
    /**
     * The data needed to create a SecurityEvent.
     */
    data: XOR<SecurityEventCreateInput, SecurityEventUncheckedCreateInput>
  }

  /**
   * SecurityEvent createMany
   */
  export type SecurityEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SecurityEvents.
     */
    data: SecurityEventCreateManyInput | SecurityEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SecurityEvent createManyAndReturn
   */
  export type SecurityEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEvent
     */
    select?: SecurityEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityEvent
     */
    omit?: SecurityEventOmit<ExtArgs> | null
    /**
     * The data used to create many SecurityEvents.
     */
    data: SecurityEventCreateManyInput | SecurityEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SecurityEvent update
   */
  export type SecurityEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEvent
     */
    select?: SecurityEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityEvent
     */
    omit?: SecurityEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityEventInclude<ExtArgs> | null
    /**
     * The data needed to update a SecurityEvent.
     */
    data: XOR<SecurityEventUpdateInput, SecurityEventUncheckedUpdateInput>
    /**
     * Choose, which SecurityEvent to update.
     */
    where: SecurityEventWhereUniqueInput
  }

  /**
   * SecurityEvent updateMany
   */
  export type SecurityEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SecurityEvents.
     */
    data: XOR<SecurityEventUpdateManyMutationInput, SecurityEventUncheckedUpdateManyInput>
    /**
     * Filter which SecurityEvents to update
     */
    where?: SecurityEventWhereInput
    /**
     * Limit how many SecurityEvents to update.
     */
    limit?: number
  }

  /**
   * SecurityEvent updateManyAndReturn
   */
  export type SecurityEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEvent
     */
    select?: SecurityEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityEvent
     */
    omit?: SecurityEventOmit<ExtArgs> | null
    /**
     * The data used to update SecurityEvents.
     */
    data: XOR<SecurityEventUpdateManyMutationInput, SecurityEventUncheckedUpdateManyInput>
    /**
     * Filter which SecurityEvents to update
     */
    where?: SecurityEventWhereInput
    /**
     * Limit how many SecurityEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SecurityEvent upsert
   */
  export type SecurityEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEvent
     */
    select?: SecurityEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityEvent
     */
    omit?: SecurityEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityEventInclude<ExtArgs> | null
    /**
     * The filter to search for the SecurityEvent to update in case it exists.
     */
    where: SecurityEventWhereUniqueInput
    /**
     * In case the SecurityEvent found by the `where` argument doesn't exist, create a new SecurityEvent with this data.
     */
    create: XOR<SecurityEventCreateInput, SecurityEventUncheckedCreateInput>
    /**
     * In case the SecurityEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SecurityEventUpdateInput, SecurityEventUncheckedUpdateInput>
  }

  /**
   * SecurityEvent delete
   */
  export type SecurityEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEvent
     */
    select?: SecurityEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityEvent
     */
    omit?: SecurityEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityEventInclude<ExtArgs> | null
    /**
     * Filter which SecurityEvent to delete.
     */
    where: SecurityEventWhereUniqueInput
  }

  /**
   * SecurityEvent deleteMany
   */
  export type SecurityEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SecurityEvents to delete
     */
    where?: SecurityEventWhereInput
    /**
     * Limit how many SecurityEvents to delete.
     */
    limit?: number
  }

  /**
   * SecurityEvent without action
   */
  export type SecurityEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEvent
     */
    select?: SecurityEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityEvent
     */
    omit?: SecurityEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityEventInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _avg: SessionAvgAggregateOutputType | null
    _sum: SessionSumAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionAvgAggregateOutputType = {
    riskScore: number | null
  }

  export type SessionSumAggregateOutputType = {
    riskScore: number | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    refreshToken: string | null
    deviceId: string | null
    userAgent: string | null
    ip: string | null
    country: string | null
    city: string | null
    browser: string | null
    os: string | null
    device: string | null
    isTrusted: boolean | null
    riskScore: number | null
    is2FAVerified: boolean | null
    verified2FAAt: Date | null
    expiresAt: Date | null
    lastUsedAt: Date | null
    revokedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    refreshToken: string | null
    deviceId: string | null
    userAgent: string | null
    ip: string | null
    country: string | null
    city: string | null
    browser: string | null
    os: string | null
    device: string | null
    isTrusted: boolean | null
    riskScore: number | null
    is2FAVerified: boolean | null
    verified2FAAt: Date | null
    expiresAt: Date | null
    lastUsedAt: Date | null
    revokedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    userId: number
    token: number
    refreshToken: number
    deviceId: number
    userAgent: number
    ip: number
    country: number
    city: number
    browser: number
    os: number
    device: number
    isTrusted: number
    riskScore: number
    is2FAVerified: number
    verified2FAAt: number
    expiresAt: number
    lastUsedAt: number
    revokedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SessionAvgAggregateInputType = {
    riskScore?: true
  }

  export type SessionSumAggregateInputType = {
    riskScore?: true
  }

  export type SessionMinAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    refreshToken?: true
    deviceId?: true
    userAgent?: true
    ip?: true
    country?: true
    city?: true
    browser?: true
    os?: true
    device?: true
    isTrusted?: true
    riskScore?: true
    is2FAVerified?: true
    verified2FAAt?: true
    expiresAt?: true
    lastUsedAt?: true
    revokedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    refreshToken?: true
    deviceId?: true
    userAgent?: true
    ip?: true
    country?: true
    city?: true
    browser?: true
    os?: true
    device?: true
    isTrusted?: true
    riskScore?: true
    is2FAVerified?: true
    verified2FAAt?: true
    expiresAt?: true
    lastUsedAt?: true
    revokedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    refreshToken?: true
    deviceId?: true
    userAgent?: true
    ip?: true
    country?: true
    city?: true
    browser?: true
    os?: true
    device?: true
    isTrusted?: true
    riskScore?: true
    is2FAVerified?: true
    verified2FAAt?: true
    expiresAt?: true
    lastUsedAt?: true
    revokedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _avg?: SessionAvgAggregateInputType
    _sum?: SessionSumAggregateInputType
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    userId: string
    token: string
    refreshToken: string | null
    deviceId: string | null
    userAgent: string | null
    ip: string | null
    country: string | null
    city: string | null
    browser: string | null
    os: string | null
    device: string | null
    isTrusted: boolean
    riskScore: number | null
    is2FAVerified: boolean
    verified2FAAt: Date | null
    expiresAt: Date
    lastUsedAt: Date
    revokedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: SessionCountAggregateOutputType | null
    _avg: SessionAvgAggregateOutputType | null
    _sum: SessionSumAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    refreshToken?: boolean
    deviceId?: boolean
    userAgent?: boolean
    ip?: boolean
    country?: boolean
    city?: boolean
    browser?: boolean
    os?: boolean
    device?: boolean
    isTrusted?: boolean
    riskScore?: boolean
    is2FAVerified?: boolean
    verified2FAAt?: boolean
    expiresAt?: boolean
    lastUsedAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    refreshToken?: boolean
    deviceId?: boolean
    userAgent?: boolean
    ip?: boolean
    country?: boolean
    city?: boolean
    browser?: boolean
    os?: boolean
    device?: boolean
    isTrusted?: boolean
    riskScore?: boolean
    is2FAVerified?: boolean
    verified2FAAt?: boolean
    expiresAt?: boolean
    lastUsedAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    refreshToken?: boolean
    deviceId?: boolean
    userAgent?: boolean
    ip?: boolean
    country?: boolean
    city?: boolean
    browser?: boolean
    os?: boolean
    device?: boolean
    isTrusted?: boolean
    riskScore?: boolean
    is2FAVerified?: boolean
    verified2FAAt?: boolean
    expiresAt?: boolean
    lastUsedAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    userId?: boolean
    token?: boolean
    refreshToken?: boolean
    deviceId?: boolean
    userAgent?: boolean
    ip?: boolean
    country?: boolean
    city?: boolean
    browser?: boolean
    os?: boolean
    device?: boolean
    isTrusted?: boolean
    riskScore?: boolean
    is2FAVerified?: boolean
    verified2FAAt?: boolean
    expiresAt?: boolean
    lastUsedAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "token" | "refreshToken" | "deviceId" | "userAgent" | "ip" | "country" | "city" | "browser" | "os" | "device" | "isTrusted" | "riskScore" | "is2FAVerified" | "verified2FAAt" | "expiresAt" | "lastUsedAt" | "revokedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      token: string
      refreshToken: string | null
      deviceId: string | null
      userAgent: string | null
      ip: string | null
      country: string | null
      city: string | null
      browser: string | null
      os: string | null
      device: string | null
      /**
       * Whether this session is from a trusted device
       */
      isTrusted: boolean
      /**
       * Risk score for this session (0-100)
       */
      riskScore: number | null
      /**
       * Whether 2FA has been verified for this session
       */
      is2FAVerified: boolean
      /**
       * When 2FA was successfully verified
       */
      verified2FAAt: Date | null
      expiresAt: Date
      lastUsedAt: Date
      revokedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly token: FieldRef<"Session", 'String'>
    readonly refreshToken: FieldRef<"Session", 'String'>
    readonly deviceId: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
    readonly ip: FieldRef<"Session", 'String'>
    readonly country: FieldRef<"Session", 'String'>
    readonly city: FieldRef<"Session", 'String'>
    readonly browser: FieldRef<"Session", 'String'>
    readonly os: FieldRef<"Session", 'String'>
    readonly device: FieldRef<"Session", 'String'>
    readonly isTrusted: FieldRef<"Session", 'Boolean'>
    readonly riskScore: FieldRef<"Session", 'Float'>
    readonly is2FAVerified: FieldRef<"Session", 'Boolean'>
    readonly verified2FAAt: FieldRef<"Session", 'DateTime'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly lastUsedAt: FieldRef<"Session", 'DateTime'>
    readonly revokedAt: FieldRef<"Session", 'DateTime'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model AccountLock
   */

  export type AggregateAccountLock = {
    _count: AccountLockCountAggregateOutputType | null
    _avg: AccountLockAvgAggregateOutputType | null
    _sum: AccountLockSumAggregateOutputType | null
    _min: AccountLockMinAggregateOutputType | null
    _max: AccountLockMaxAggregateOutputType | null
  }

  export type AccountLockAvgAggregateOutputType = {
    failedAttempts: number | null
  }

  export type AccountLockSumAggregateOutputType = {
    failedAttempts: number | null
  }

  export type AccountLockMinAggregateOutputType = {
    id: string | null
    userId: string | null
    reason: string | null
    failedAttempts: number | null
    lockedAt: Date | null
    expiresAt: Date | null
    unlockedAt: Date | null
    ip: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AccountLockMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    reason: string | null
    failedAttempts: number | null
    lockedAt: Date | null
    expiresAt: Date | null
    unlockedAt: Date | null
    ip: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AccountLockCountAggregateOutputType = {
    id: number
    userId: number
    reason: number
    failedAttempts: number
    lockedAt: number
    expiresAt: number
    unlockedAt: number
    ip: number
    userAgent: number
    createdAt: number
    _all: number
  }


  export type AccountLockAvgAggregateInputType = {
    failedAttempts?: true
  }

  export type AccountLockSumAggregateInputType = {
    failedAttempts?: true
  }

  export type AccountLockMinAggregateInputType = {
    id?: true
    userId?: true
    reason?: true
    failedAttempts?: true
    lockedAt?: true
    expiresAt?: true
    unlockedAt?: true
    ip?: true
    userAgent?: true
    createdAt?: true
  }

  export type AccountLockMaxAggregateInputType = {
    id?: true
    userId?: true
    reason?: true
    failedAttempts?: true
    lockedAt?: true
    expiresAt?: true
    unlockedAt?: true
    ip?: true
    userAgent?: true
    createdAt?: true
  }

  export type AccountLockCountAggregateInputType = {
    id?: true
    userId?: true
    reason?: true
    failedAttempts?: true
    lockedAt?: true
    expiresAt?: true
    unlockedAt?: true
    ip?: true
    userAgent?: true
    createdAt?: true
    _all?: true
  }

  export type AccountLockAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccountLock to aggregate.
     */
    where?: AccountLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountLocks to fetch.
     */
    orderBy?: AccountLockOrderByWithRelationInput | AccountLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountLocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AccountLocks
    **/
    _count?: true | AccountLockCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountLockAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountLockSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountLockMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountLockMaxAggregateInputType
  }

  export type GetAccountLockAggregateType<T extends AccountLockAggregateArgs> = {
        [P in keyof T & keyof AggregateAccountLock]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccountLock[P]>
      : GetScalarType<T[P], AggregateAccountLock[P]>
  }




  export type AccountLockGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountLockWhereInput
    orderBy?: AccountLockOrderByWithAggregationInput | AccountLockOrderByWithAggregationInput[]
    by: AccountLockScalarFieldEnum[] | AccountLockScalarFieldEnum
    having?: AccountLockScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountLockCountAggregateInputType | true
    _avg?: AccountLockAvgAggregateInputType
    _sum?: AccountLockSumAggregateInputType
    _min?: AccountLockMinAggregateInputType
    _max?: AccountLockMaxAggregateInputType
  }

  export type AccountLockGroupByOutputType = {
    id: string
    userId: string
    reason: string
    failedAttempts: number
    lockedAt: Date
    expiresAt: Date | null
    unlockedAt: Date | null
    ip: string | null
    userAgent: string | null
    createdAt: Date
    _count: AccountLockCountAggregateOutputType | null
    _avg: AccountLockAvgAggregateOutputType | null
    _sum: AccountLockSumAggregateOutputType | null
    _min: AccountLockMinAggregateOutputType | null
    _max: AccountLockMaxAggregateOutputType | null
  }

  type GetAccountLockGroupByPayload<T extends AccountLockGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountLockGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountLockGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountLockGroupByOutputType[P]>
            : GetScalarType<T[P], AccountLockGroupByOutputType[P]>
        }
      >
    >


  export type AccountLockSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    reason?: boolean
    failedAttempts?: boolean
    lockedAt?: boolean
    expiresAt?: boolean
    unlockedAt?: boolean
    ip?: boolean
    userAgent?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accountLock"]>

  export type AccountLockSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    reason?: boolean
    failedAttempts?: boolean
    lockedAt?: boolean
    expiresAt?: boolean
    unlockedAt?: boolean
    ip?: boolean
    userAgent?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accountLock"]>

  export type AccountLockSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    reason?: boolean
    failedAttempts?: boolean
    lockedAt?: boolean
    expiresAt?: boolean
    unlockedAt?: boolean
    ip?: boolean
    userAgent?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accountLock"]>

  export type AccountLockSelectScalar = {
    id?: boolean
    userId?: boolean
    reason?: boolean
    failedAttempts?: boolean
    lockedAt?: boolean
    expiresAt?: boolean
    unlockedAt?: boolean
    ip?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }

  export type AccountLockOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "reason" | "failedAttempts" | "lockedAt" | "expiresAt" | "unlockedAt" | "ip" | "userAgent" | "createdAt", ExtArgs["result"]["accountLock"]>
  export type AccountLockInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountLockIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountLockIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountLockPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AccountLock"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      reason: string
      failedAttempts: number
      lockedAt: Date
      expiresAt: Date | null
      unlockedAt: Date | null
      ip: string | null
      userAgent: string | null
      createdAt: Date
    }, ExtArgs["result"]["accountLock"]>
    composites: {}
  }

  type AccountLockGetPayload<S extends boolean | null | undefined | AccountLockDefaultArgs> = $Result.GetResult<Prisma.$AccountLockPayload, S>

  type AccountLockCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountLockFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountLockCountAggregateInputType | true
    }

  export interface AccountLockDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AccountLock'], meta: { name: 'AccountLock' } }
    /**
     * Find zero or one AccountLock that matches the filter.
     * @param {AccountLockFindUniqueArgs} args - Arguments to find a AccountLock
     * @example
     * // Get one AccountLock
     * const accountLock = await prisma.accountLock.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountLockFindUniqueArgs>(args: SelectSubset<T, AccountLockFindUniqueArgs<ExtArgs>>): Prisma__AccountLockClient<$Result.GetResult<Prisma.$AccountLockPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AccountLock that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountLockFindUniqueOrThrowArgs} args - Arguments to find a AccountLock
     * @example
     * // Get one AccountLock
     * const accountLock = await prisma.accountLock.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountLockFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountLockFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountLockClient<$Result.GetResult<Prisma.$AccountLockPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccountLock that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountLockFindFirstArgs} args - Arguments to find a AccountLock
     * @example
     * // Get one AccountLock
     * const accountLock = await prisma.accountLock.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountLockFindFirstArgs>(args?: SelectSubset<T, AccountLockFindFirstArgs<ExtArgs>>): Prisma__AccountLockClient<$Result.GetResult<Prisma.$AccountLockPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccountLock that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountLockFindFirstOrThrowArgs} args - Arguments to find a AccountLock
     * @example
     * // Get one AccountLock
     * const accountLock = await prisma.accountLock.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountLockFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountLockFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountLockClient<$Result.GetResult<Prisma.$AccountLockPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AccountLocks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountLockFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AccountLocks
     * const accountLocks = await prisma.accountLock.findMany()
     * 
     * // Get first 10 AccountLocks
     * const accountLocks = await prisma.accountLock.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountLockWithIdOnly = await prisma.accountLock.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountLockFindManyArgs>(args?: SelectSubset<T, AccountLockFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountLockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AccountLock.
     * @param {AccountLockCreateArgs} args - Arguments to create a AccountLock.
     * @example
     * // Create one AccountLock
     * const AccountLock = await prisma.accountLock.create({
     *   data: {
     *     // ... data to create a AccountLock
     *   }
     * })
     * 
     */
    create<T extends AccountLockCreateArgs>(args: SelectSubset<T, AccountLockCreateArgs<ExtArgs>>): Prisma__AccountLockClient<$Result.GetResult<Prisma.$AccountLockPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AccountLocks.
     * @param {AccountLockCreateManyArgs} args - Arguments to create many AccountLocks.
     * @example
     * // Create many AccountLocks
     * const accountLock = await prisma.accountLock.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountLockCreateManyArgs>(args?: SelectSubset<T, AccountLockCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AccountLocks and returns the data saved in the database.
     * @param {AccountLockCreateManyAndReturnArgs} args - Arguments to create many AccountLocks.
     * @example
     * // Create many AccountLocks
     * const accountLock = await prisma.accountLock.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AccountLocks and only return the `id`
     * const accountLockWithIdOnly = await prisma.accountLock.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountLockCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountLockCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountLockPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AccountLock.
     * @param {AccountLockDeleteArgs} args - Arguments to delete one AccountLock.
     * @example
     * // Delete one AccountLock
     * const AccountLock = await prisma.accountLock.delete({
     *   where: {
     *     // ... filter to delete one AccountLock
     *   }
     * })
     * 
     */
    delete<T extends AccountLockDeleteArgs>(args: SelectSubset<T, AccountLockDeleteArgs<ExtArgs>>): Prisma__AccountLockClient<$Result.GetResult<Prisma.$AccountLockPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AccountLock.
     * @param {AccountLockUpdateArgs} args - Arguments to update one AccountLock.
     * @example
     * // Update one AccountLock
     * const accountLock = await prisma.accountLock.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountLockUpdateArgs>(args: SelectSubset<T, AccountLockUpdateArgs<ExtArgs>>): Prisma__AccountLockClient<$Result.GetResult<Prisma.$AccountLockPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AccountLocks.
     * @param {AccountLockDeleteManyArgs} args - Arguments to filter AccountLocks to delete.
     * @example
     * // Delete a few AccountLocks
     * const { count } = await prisma.accountLock.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountLockDeleteManyArgs>(args?: SelectSubset<T, AccountLockDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccountLocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountLockUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AccountLocks
     * const accountLock = await prisma.accountLock.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountLockUpdateManyArgs>(args: SelectSubset<T, AccountLockUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccountLocks and returns the data updated in the database.
     * @param {AccountLockUpdateManyAndReturnArgs} args - Arguments to update many AccountLocks.
     * @example
     * // Update many AccountLocks
     * const accountLock = await prisma.accountLock.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AccountLocks and only return the `id`
     * const accountLockWithIdOnly = await prisma.accountLock.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountLockUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountLockUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountLockPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AccountLock.
     * @param {AccountLockUpsertArgs} args - Arguments to update or create a AccountLock.
     * @example
     * // Update or create a AccountLock
     * const accountLock = await prisma.accountLock.upsert({
     *   create: {
     *     // ... data to create a AccountLock
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AccountLock we want to update
     *   }
     * })
     */
    upsert<T extends AccountLockUpsertArgs>(args: SelectSubset<T, AccountLockUpsertArgs<ExtArgs>>): Prisma__AccountLockClient<$Result.GetResult<Prisma.$AccountLockPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AccountLocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountLockCountArgs} args - Arguments to filter AccountLocks to count.
     * @example
     * // Count the number of AccountLocks
     * const count = await prisma.accountLock.count({
     *   where: {
     *     // ... the filter for the AccountLocks we want to count
     *   }
     * })
    **/
    count<T extends AccountLockCountArgs>(
      args?: Subset<T, AccountLockCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountLockCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AccountLock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountLockAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountLockAggregateArgs>(args: Subset<T, AccountLockAggregateArgs>): Prisma.PrismaPromise<GetAccountLockAggregateType<T>>

    /**
     * Group by AccountLock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountLockGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountLockGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountLockGroupByArgs['orderBy'] }
        : { orderBy?: AccountLockGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountLockGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountLockGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AccountLock model
   */
  readonly fields: AccountLockFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AccountLock.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountLockClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AccountLock model
   */
  interface AccountLockFieldRefs {
    readonly id: FieldRef<"AccountLock", 'String'>
    readonly userId: FieldRef<"AccountLock", 'String'>
    readonly reason: FieldRef<"AccountLock", 'String'>
    readonly failedAttempts: FieldRef<"AccountLock", 'Int'>
    readonly lockedAt: FieldRef<"AccountLock", 'DateTime'>
    readonly expiresAt: FieldRef<"AccountLock", 'DateTime'>
    readonly unlockedAt: FieldRef<"AccountLock", 'DateTime'>
    readonly ip: FieldRef<"AccountLock", 'String'>
    readonly userAgent: FieldRef<"AccountLock", 'String'>
    readonly createdAt: FieldRef<"AccountLock", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AccountLock findUnique
   */
  export type AccountLockFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountLock
     */
    select?: AccountLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountLock
     */
    omit?: AccountLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountLockInclude<ExtArgs> | null
    /**
     * Filter, which AccountLock to fetch.
     */
    where: AccountLockWhereUniqueInput
  }

  /**
   * AccountLock findUniqueOrThrow
   */
  export type AccountLockFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountLock
     */
    select?: AccountLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountLock
     */
    omit?: AccountLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountLockInclude<ExtArgs> | null
    /**
     * Filter, which AccountLock to fetch.
     */
    where: AccountLockWhereUniqueInput
  }

  /**
   * AccountLock findFirst
   */
  export type AccountLockFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountLock
     */
    select?: AccountLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountLock
     */
    omit?: AccountLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountLockInclude<ExtArgs> | null
    /**
     * Filter, which AccountLock to fetch.
     */
    where?: AccountLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountLocks to fetch.
     */
    orderBy?: AccountLockOrderByWithRelationInput | AccountLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccountLocks.
     */
    cursor?: AccountLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountLocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccountLocks.
     */
    distinct?: AccountLockScalarFieldEnum | AccountLockScalarFieldEnum[]
  }

  /**
   * AccountLock findFirstOrThrow
   */
  export type AccountLockFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountLock
     */
    select?: AccountLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountLock
     */
    omit?: AccountLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountLockInclude<ExtArgs> | null
    /**
     * Filter, which AccountLock to fetch.
     */
    where?: AccountLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountLocks to fetch.
     */
    orderBy?: AccountLockOrderByWithRelationInput | AccountLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccountLocks.
     */
    cursor?: AccountLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountLocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccountLocks.
     */
    distinct?: AccountLockScalarFieldEnum | AccountLockScalarFieldEnum[]
  }

  /**
   * AccountLock findMany
   */
  export type AccountLockFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountLock
     */
    select?: AccountLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountLock
     */
    omit?: AccountLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountLockInclude<ExtArgs> | null
    /**
     * Filter, which AccountLocks to fetch.
     */
    where?: AccountLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountLocks to fetch.
     */
    orderBy?: AccountLockOrderByWithRelationInput | AccountLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AccountLocks.
     */
    cursor?: AccountLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountLocks.
     */
    skip?: number
    distinct?: AccountLockScalarFieldEnum | AccountLockScalarFieldEnum[]
  }

  /**
   * AccountLock create
   */
  export type AccountLockCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountLock
     */
    select?: AccountLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountLock
     */
    omit?: AccountLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountLockInclude<ExtArgs> | null
    /**
     * The data needed to create a AccountLock.
     */
    data: XOR<AccountLockCreateInput, AccountLockUncheckedCreateInput>
  }

  /**
   * AccountLock createMany
   */
  export type AccountLockCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AccountLocks.
     */
    data: AccountLockCreateManyInput | AccountLockCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AccountLock createManyAndReturn
   */
  export type AccountLockCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountLock
     */
    select?: AccountLockSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AccountLock
     */
    omit?: AccountLockOmit<ExtArgs> | null
    /**
     * The data used to create many AccountLocks.
     */
    data: AccountLockCreateManyInput | AccountLockCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountLockIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AccountLock update
   */
  export type AccountLockUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountLock
     */
    select?: AccountLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountLock
     */
    omit?: AccountLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountLockInclude<ExtArgs> | null
    /**
     * The data needed to update a AccountLock.
     */
    data: XOR<AccountLockUpdateInput, AccountLockUncheckedUpdateInput>
    /**
     * Choose, which AccountLock to update.
     */
    where: AccountLockWhereUniqueInput
  }

  /**
   * AccountLock updateMany
   */
  export type AccountLockUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AccountLocks.
     */
    data: XOR<AccountLockUpdateManyMutationInput, AccountLockUncheckedUpdateManyInput>
    /**
     * Filter which AccountLocks to update
     */
    where?: AccountLockWhereInput
    /**
     * Limit how many AccountLocks to update.
     */
    limit?: number
  }

  /**
   * AccountLock updateManyAndReturn
   */
  export type AccountLockUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountLock
     */
    select?: AccountLockSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AccountLock
     */
    omit?: AccountLockOmit<ExtArgs> | null
    /**
     * The data used to update AccountLocks.
     */
    data: XOR<AccountLockUpdateManyMutationInput, AccountLockUncheckedUpdateManyInput>
    /**
     * Filter which AccountLocks to update
     */
    where?: AccountLockWhereInput
    /**
     * Limit how many AccountLocks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountLockIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AccountLock upsert
   */
  export type AccountLockUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountLock
     */
    select?: AccountLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountLock
     */
    omit?: AccountLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountLockInclude<ExtArgs> | null
    /**
     * The filter to search for the AccountLock to update in case it exists.
     */
    where: AccountLockWhereUniqueInput
    /**
     * In case the AccountLock found by the `where` argument doesn't exist, create a new AccountLock with this data.
     */
    create: XOR<AccountLockCreateInput, AccountLockUncheckedCreateInput>
    /**
     * In case the AccountLock was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountLockUpdateInput, AccountLockUncheckedUpdateInput>
  }

  /**
   * AccountLock delete
   */
  export type AccountLockDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountLock
     */
    select?: AccountLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountLock
     */
    omit?: AccountLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountLockInclude<ExtArgs> | null
    /**
     * Filter which AccountLock to delete.
     */
    where: AccountLockWhereUniqueInput
  }

  /**
   * AccountLock deleteMany
   */
  export type AccountLockDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccountLocks to delete
     */
    where?: AccountLockWhereInput
    /**
     * Limit how many AccountLocks to delete.
     */
    limit?: number
  }

  /**
   * AccountLock without action
   */
  export type AccountLockDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountLock
     */
    select?: AccountLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountLock
     */
    omit?: AccountLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountLockInclude<ExtArgs> | null
  }


  /**
   * Model Token
   */

  export type AggregateToken = {
    _count: TokenCountAggregateOutputType | null
    _avg: TokenAvgAggregateOutputType | null
    _sum: TokenSumAggregateOutputType | null
    _min: TokenMinAggregateOutputType | null
    _max: TokenMaxAggregateOutputType | null
  }

  export type TokenAvgAggregateOutputType = {
    maxUses: number | null
    useCount: number | null
  }

  export type TokenSumAggregateOutputType = {
    maxUses: number | null
    useCount: number | null
  }

  export type TokenMinAggregateOutputType = {
    id: string | null
    token: string | null
    type: $Enums.ETokenType | null
    expiresIn: Date | null
    usedAt: Date | null
    maxUses: number | null
    useCount: number | null
    userId: string | null
    createdIp: string | null
    usedIp: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TokenMaxAggregateOutputType = {
    id: string | null
    token: string | null
    type: $Enums.ETokenType | null
    expiresIn: Date | null
    usedAt: Date | null
    maxUses: number | null
    useCount: number | null
    userId: string | null
    createdIp: string | null
    usedIp: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TokenCountAggregateOutputType = {
    id: number
    token: number
    type: number
    expiresIn: number
    usedAt: number
    maxUses: number
    useCount: number
    userId: number
    createdIp: number
    usedIp: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TokenAvgAggregateInputType = {
    maxUses?: true
    useCount?: true
  }

  export type TokenSumAggregateInputType = {
    maxUses?: true
    useCount?: true
  }

  export type TokenMinAggregateInputType = {
    id?: true
    token?: true
    type?: true
    expiresIn?: true
    usedAt?: true
    maxUses?: true
    useCount?: true
    userId?: true
    createdIp?: true
    usedIp?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TokenMaxAggregateInputType = {
    id?: true
    token?: true
    type?: true
    expiresIn?: true
    usedAt?: true
    maxUses?: true
    useCount?: true
    userId?: true
    createdIp?: true
    usedIp?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TokenCountAggregateInputType = {
    id?: true
    token?: true
    type?: true
    expiresIn?: true
    usedAt?: true
    maxUses?: true
    useCount?: true
    userId?: true
    createdIp?: true
    usedIp?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Token to aggregate.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tokens
    **/
    _count?: true | TokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TokenAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TokenSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TokenMaxAggregateInputType
  }

  export type GetTokenAggregateType<T extends TokenAggregateArgs> = {
        [P in keyof T & keyof AggregateToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateToken[P]>
      : GetScalarType<T[P], AggregateToken[P]>
  }




  export type TokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TokenWhereInput
    orderBy?: TokenOrderByWithAggregationInput | TokenOrderByWithAggregationInput[]
    by: TokenScalarFieldEnum[] | TokenScalarFieldEnum
    having?: TokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TokenCountAggregateInputType | true
    _avg?: TokenAvgAggregateInputType
    _sum?: TokenSumAggregateInputType
    _min?: TokenMinAggregateInputType
    _max?: TokenMaxAggregateInputType
  }

  export type TokenGroupByOutputType = {
    id: string
    token: string
    type: $Enums.ETokenType
    expiresIn: Date
    usedAt: Date | null
    maxUses: number
    useCount: number
    userId: string | null
    createdIp: string | null
    usedIp: string | null
    createdAt: Date
    updatedAt: Date
    _count: TokenCountAggregateOutputType | null
    _avg: TokenAvgAggregateOutputType | null
    _sum: TokenSumAggregateOutputType | null
    _min: TokenMinAggregateOutputType | null
    _max: TokenMaxAggregateOutputType | null
  }

  type GetTokenGroupByPayload<T extends TokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TokenGroupByOutputType[P]>
            : GetScalarType<T[P], TokenGroupByOutputType[P]>
        }
      >
    >


  export type TokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    type?: boolean
    expiresIn?: boolean
    usedAt?: boolean
    maxUses?: boolean
    useCount?: boolean
    userId?: boolean
    createdIp?: boolean
    usedIp?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Token$userArgs<ExtArgs>
  }, ExtArgs["result"]["token"]>

  export type TokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    type?: boolean
    expiresIn?: boolean
    usedAt?: boolean
    maxUses?: boolean
    useCount?: boolean
    userId?: boolean
    createdIp?: boolean
    usedIp?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Token$userArgs<ExtArgs>
  }, ExtArgs["result"]["token"]>

  export type TokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    type?: boolean
    expiresIn?: boolean
    usedAt?: boolean
    maxUses?: boolean
    useCount?: boolean
    userId?: boolean
    createdIp?: boolean
    usedIp?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Token$userArgs<ExtArgs>
  }, ExtArgs["result"]["token"]>

  export type TokenSelectScalar = {
    id?: boolean
    token?: boolean
    type?: boolean
    expiresIn?: boolean
    usedAt?: boolean
    maxUses?: boolean
    useCount?: boolean
    userId?: boolean
    createdIp?: boolean
    usedIp?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "token" | "type" | "expiresIn" | "usedAt" | "maxUses" | "useCount" | "userId" | "createdIp" | "usedIp" | "createdAt" | "updatedAt", ExtArgs["result"]["token"]>
  export type TokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Token$userArgs<ExtArgs>
  }
  export type TokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Token$userArgs<ExtArgs>
  }
  export type TokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Token$userArgs<ExtArgs>
  }

  export type $TokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Token"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      token: string
      type: $Enums.ETokenType
      expiresIn: Date
      usedAt: Date | null
      maxUses: number
      useCount: number
      userId: string | null
      createdIp: string | null
      usedIp: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["token"]>
    composites: {}
  }

  type TokenGetPayload<S extends boolean | null | undefined | TokenDefaultArgs> = $Result.GetResult<Prisma.$TokenPayload, S>

  type TokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TokenCountAggregateInputType | true
    }

  export interface TokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Token'], meta: { name: 'Token' } }
    /**
     * Find zero or one Token that matches the filter.
     * @param {TokenFindUniqueArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TokenFindUniqueArgs>(args: SelectSubset<T, TokenFindUniqueArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Token that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TokenFindUniqueOrThrowArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TokenFindUniqueOrThrowArgs>(args: SelectSubset<T, TokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Token that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenFindFirstArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TokenFindFirstArgs>(args?: SelectSubset<T, TokenFindFirstArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Token that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenFindFirstOrThrowArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TokenFindFirstOrThrowArgs>(args?: SelectSubset<T, TokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tokens
     * const tokens = await prisma.token.findMany()
     * 
     * // Get first 10 Tokens
     * const tokens = await prisma.token.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tokenWithIdOnly = await prisma.token.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TokenFindManyArgs>(args?: SelectSubset<T, TokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Token.
     * @param {TokenCreateArgs} args - Arguments to create a Token.
     * @example
     * // Create one Token
     * const Token = await prisma.token.create({
     *   data: {
     *     // ... data to create a Token
     *   }
     * })
     * 
     */
    create<T extends TokenCreateArgs>(args: SelectSubset<T, TokenCreateArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tokens.
     * @param {TokenCreateManyArgs} args - Arguments to create many Tokens.
     * @example
     * // Create many Tokens
     * const token = await prisma.token.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TokenCreateManyArgs>(args?: SelectSubset<T, TokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tokens and returns the data saved in the database.
     * @param {TokenCreateManyAndReturnArgs} args - Arguments to create many Tokens.
     * @example
     * // Create many Tokens
     * const token = await prisma.token.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tokens and only return the `id`
     * const tokenWithIdOnly = await prisma.token.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TokenCreateManyAndReturnArgs>(args?: SelectSubset<T, TokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Token.
     * @param {TokenDeleteArgs} args - Arguments to delete one Token.
     * @example
     * // Delete one Token
     * const Token = await prisma.token.delete({
     *   where: {
     *     // ... filter to delete one Token
     *   }
     * })
     * 
     */
    delete<T extends TokenDeleteArgs>(args: SelectSubset<T, TokenDeleteArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Token.
     * @param {TokenUpdateArgs} args - Arguments to update one Token.
     * @example
     * // Update one Token
     * const token = await prisma.token.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TokenUpdateArgs>(args: SelectSubset<T, TokenUpdateArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tokens.
     * @param {TokenDeleteManyArgs} args - Arguments to filter Tokens to delete.
     * @example
     * // Delete a few Tokens
     * const { count } = await prisma.token.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TokenDeleteManyArgs>(args?: SelectSubset<T, TokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tokens
     * const token = await prisma.token.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TokenUpdateManyArgs>(args: SelectSubset<T, TokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tokens and returns the data updated in the database.
     * @param {TokenUpdateManyAndReturnArgs} args - Arguments to update many Tokens.
     * @example
     * // Update many Tokens
     * const token = await prisma.token.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tokens and only return the `id`
     * const tokenWithIdOnly = await prisma.token.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TokenUpdateManyAndReturnArgs>(args: SelectSubset<T, TokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Token.
     * @param {TokenUpsertArgs} args - Arguments to update or create a Token.
     * @example
     * // Update or create a Token
     * const token = await prisma.token.upsert({
     *   create: {
     *     // ... data to create a Token
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Token we want to update
     *   }
     * })
     */
    upsert<T extends TokenUpsertArgs>(args: SelectSubset<T, TokenUpsertArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenCountArgs} args - Arguments to filter Tokens to count.
     * @example
     * // Count the number of Tokens
     * const count = await prisma.token.count({
     *   where: {
     *     // ... the filter for the Tokens we want to count
     *   }
     * })
    **/
    count<T extends TokenCountArgs>(
      args?: Subset<T, TokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Token.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TokenAggregateArgs>(args: Subset<T, TokenAggregateArgs>): Prisma.PrismaPromise<GetTokenAggregateType<T>>

    /**
     * Group by Token.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TokenGroupByArgs['orderBy'] }
        : { orderBy?: TokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Token model
   */
  readonly fields: TokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Token.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Token$userArgs<ExtArgs> = {}>(args?: Subset<T, Token$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Token model
   */
  interface TokenFieldRefs {
    readonly id: FieldRef<"Token", 'String'>
    readonly token: FieldRef<"Token", 'String'>
    readonly type: FieldRef<"Token", 'ETokenType'>
    readonly expiresIn: FieldRef<"Token", 'DateTime'>
    readonly usedAt: FieldRef<"Token", 'DateTime'>
    readonly maxUses: FieldRef<"Token", 'Int'>
    readonly useCount: FieldRef<"Token", 'Int'>
    readonly userId: FieldRef<"Token", 'String'>
    readonly createdIp: FieldRef<"Token", 'String'>
    readonly usedIp: FieldRef<"Token", 'String'>
    readonly createdAt: FieldRef<"Token", 'DateTime'>
    readonly updatedAt: FieldRef<"Token", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Token findUnique
   */
  export type TokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token findUniqueOrThrow
   */
  export type TokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token findFirst
   */
  export type TokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tokens.
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tokens.
     */
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * Token findFirstOrThrow
   */
  export type TokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tokens.
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tokens.
     */
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * Token findMany
   */
  export type TokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Tokens to fetch.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tokens.
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * Token create
   */
  export type TokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * The data needed to create a Token.
     */
    data: XOR<TokenCreateInput, TokenUncheckedCreateInput>
  }

  /**
   * Token createMany
   */
  export type TokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tokens.
     */
    data: TokenCreateManyInput | TokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Token createManyAndReturn
   */
  export type TokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * The data used to create many Tokens.
     */
    data: TokenCreateManyInput | TokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Token update
   */
  export type TokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * The data needed to update a Token.
     */
    data: XOR<TokenUpdateInput, TokenUncheckedUpdateInput>
    /**
     * Choose, which Token to update.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token updateMany
   */
  export type TokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tokens.
     */
    data: XOR<TokenUpdateManyMutationInput, TokenUncheckedUpdateManyInput>
    /**
     * Filter which Tokens to update
     */
    where?: TokenWhereInput
    /**
     * Limit how many Tokens to update.
     */
    limit?: number
  }

  /**
   * Token updateManyAndReturn
   */
  export type TokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * The data used to update Tokens.
     */
    data: XOR<TokenUpdateManyMutationInput, TokenUncheckedUpdateManyInput>
    /**
     * Filter which Tokens to update
     */
    where?: TokenWhereInput
    /**
     * Limit how many Tokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Token upsert
   */
  export type TokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * The filter to search for the Token to update in case it exists.
     */
    where: TokenWhereUniqueInput
    /**
     * In case the Token found by the `where` argument doesn't exist, create a new Token with this data.
     */
    create: XOR<TokenCreateInput, TokenUncheckedCreateInput>
    /**
     * In case the Token was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TokenUpdateInput, TokenUncheckedUpdateInput>
  }

  /**
   * Token delete
   */
  export type TokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter which Token to delete.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token deleteMany
   */
  export type TokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tokens to delete
     */
    where?: TokenWhereInput
    /**
     * Limit how many Tokens to delete.
     */
    limit?: number
  }

  /**
   * Token.user
   */
  export type Token$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Token without action
   */
  export type TokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
  }


  /**
   * Model BackupCode
   */

  export type AggregateBackupCode = {
    _count: BackupCodeCountAggregateOutputType | null
    _min: BackupCodeMinAggregateOutputType | null
    _max: BackupCodeMaxAggregateOutputType | null
  }

  export type BackupCodeMinAggregateOutputType = {
    id: string | null
    userId: string | null
    authMethodId: string | null
    type: $Enums.E2FAMethod | null
    code: string | null
    usedAt: Date | null
    usedIp: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type BackupCodeMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    authMethodId: string | null
    type: $Enums.E2FAMethod | null
    code: string | null
    usedAt: Date | null
    usedIp: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type BackupCodeCountAggregateOutputType = {
    id: number
    userId: number
    authMethodId: number
    type: number
    code: number
    usedAt: number
    usedIp: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type BackupCodeMinAggregateInputType = {
    id?: true
    userId?: true
    authMethodId?: true
    type?: true
    code?: true
    usedAt?: true
    usedIp?: true
    expiresAt?: true
    createdAt?: true
  }

  export type BackupCodeMaxAggregateInputType = {
    id?: true
    userId?: true
    authMethodId?: true
    type?: true
    code?: true
    usedAt?: true
    usedIp?: true
    expiresAt?: true
    createdAt?: true
  }

  export type BackupCodeCountAggregateInputType = {
    id?: true
    userId?: true
    authMethodId?: true
    type?: true
    code?: true
    usedAt?: true
    usedIp?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type BackupCodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackupCode to aggregate.
     */
    where?: BackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupCodes to fetch.
     */
    orderBy?: BackupCodeOrderByWithRelationInput | BackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BackupCodes
    **/
    _count?: true | BackupCodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BackupCodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BackupCodeMaxAggregateInputType
  }

  export type GetBackupCodeAggregateType<T extends BackupCodeAggregateArgs> = {
        [P in keyof T & keyof AggregateBackupCode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBackupCode[P]>
      : GetScalarType<T[P], AggregateBackupCode[P]>
  }




  export type BackupCodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BackupCodeWhereInput
    orderBy?: BackupCodeOrderByWithAggregationInput | BackupCodeOrderByWithAggregationInput[]
    by: BackupCodeScalarFieldEnum[] | BackupCodeScalarFieldEnum
    having?: BackupCodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BackupCodeCountAggregateInputType | true
    _min?: BackupCodeMinAggregateInputType
    _max?: BackupCodeMaxAggregateInputType
  }

  export type BackupCodeGroupByOutputType = {
    id: string
    userId: string
    authMethodId: string | null
    type: $Enums.E2FAMethod
    code: string
    usedAt: Date | null
    usedIp: string | null
    expiresAt: Date | null
    createdAt: Date
    _count: BackupCodeCountAggregateOutputType | null
    _min: BackupCodeMinAggregateOutputType | null
    _max: BackupCodeMaxAggregateOutputType | null
  }

  type GetBackupCodeGroupByPayload<T extends BackupCodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BackupCodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BackupCodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BackupCodeGroupByOutputType[P]>
            : GetScalarType<T[P], BackupCodeGroupByOutputType[P]>
        }
      >
    >


  export type BackupCodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    authMethodId?: boolean
    type?: boolean
    code?: boolean
    usedAt?: boolean
    usedIp?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["backupCode"]>

  export type BackupCodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    authMethodId?: boolean
    type?: boolean
    code?: boolean
    usedAt?: boolean
    usedIp?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["backupCode"]>

  export type BackupCodeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    authMethodId?: boolean
    type?: boolean
    code?: boolean
    usedAt?: boolean
    usedIp?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["backupCode"]>

  export type BackupCodeSelectScalar = {
    id?: boolean
    userId?: boolean
    authMethodId?: boolean
    type?: boolean
    code?: boolean
    usedAt?: boolean
    usedIp?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type BackupCodeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "authMethodId" | "type" | "code" | "usedAt" | "usedIp" | "expiresAt" | "createdAt", ExtArgs["result"]["backupCode"]>
  export type BackupCodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type BackupCodeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type BackupCodeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $BackupCodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BackupCode"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      /**
       * Link to specific authentication method (optional)
       */
      authMethodId: string | null
      /**
       * Which 2FA method this backup code is for
       */
      type: $Enums.E2FAMethod
      /**
       * Hashed backup code (Argon2id)
       */
      code: string
      usedAt: Date | null
      usedIp: string | null
      /**
       * Optional expiration for compliance
       */
      expiresAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["backupCode"]>
    composites: {}
  }

  type BackupCodeGetPayload<S extends boolean | null | undefined | BackupCodeDefaultArgs> = $Result.GetResult<Prisma.$BackupCodePayload, S>

  type BackupCodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BackupCodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BackupCodeCountAggregateInputType | true
    }

  export interface BackupCodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BackupCode'], meta: { name: 'BackupCode' } }
    /**
     * Find zero or one BackupCode that matches the filter.
     * @param {BackupCodeFindUniqueArgs} args - Arguments to find a BackupCode
     * @example
     * // Get one BackupCode
     * const backupCode = await prisma.backupCode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BackupCodeFindUniqueArgs>(args: SelectSubset<T, BackupCodeFindUniqueArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BackupCode that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BackupCodeFindUniqueOrThrowArgs} args - Arguments to find a BackupCode
     * @example
     * // Get one BackupCode
     * const backupCode = await prisma.backupCode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BackupCodeFindUniqueOrThrowArgs>(args: SelectSubset<T, BackupCodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BackupCode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCodeFindFirstArgs} args - Arguments to find a BackupCode
     * @example
     * // Get one BackupCode
     * const backupCode = await prisma.backupCode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BackupCodeFindFirstArgs>(args?: SelectSubset<T, BackupCodeFindFirstArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BackupCode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCodeFindFirstOrThrowArgs} args - Arguments to find a BackupCode
     * @example
     * // Get one BackupCode
     * const backupCode = await prisma.backupCode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BackupCodeFindFirstOrThrowArgs>(args?: SelectSubset<T, BackupCodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BackupCodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BackupCodes
     * const backupCodes = await prisma.backupCode.findMany()
     * 
     * // Get first 10 BackupCodes
     * const backupCodes = await prisma.backupCode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const backupCodeWithIdOnly = await prisma.backupCode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BackupCodeFindManyArgs>(args?: SelectSubset<T, BackupCodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BackupCode.
     * @param {BackupCodeCreateArgs} args - Arguments to create a BackupCode.
     * @example
     * // Create one BackupCode
     * const BackupCode = await prisma.backupCode.create({
     *   data: {
     *     // ... data to create a BackupCode
     *   }
     * })
     * 
     */
    create<T extends BackupCodeCreateArgs>(args: SelectSubset<T, BackupCodeCreateArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BackupCodes.
     * @param {BackupCodeCreateManyArgs} args - Arguments to create many BackupCodes.
     * @example
     * // Create many BackupCodes
     * const backupCode = await prisma.backupCode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BackupCodeCreateManyArgs>(args?: SelectSubset<T, BackupCodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BackupCodes and returns the data saved in the database.
     * @param {BackupCodeCreateManyAndReturnArgs} args - Arguments to create many BackupCodes.
     * @example
     * // Create many BackupCodes
     * const backupCode = await prisma.backupCode.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BackupCodes and only return the `id`
     * const backupCodeWithIdOnly = await prisma.backupCode.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BackupCodeCreateManyAndReturnArgs>(args?: SelectSubset<T, BackupCodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BackupCode.
     * @param {BackupCodeDeleteArgs} args - Arguments to delete one BackupCode.
     * @example
     * // Delete one BackupCode
     * const BackupCode = await prisma.backupCode.delete({
     *   where: {
     *     // ... filter to delete one BackupCode
     *   }
     * })
     * 
     */
    delete<T extends BackupCodeDeleteArgs>(args: SelectSubset<T, BackupCodeDeleteArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BackupCode.
     * @param {BackupCodeUpdateArgs} args - Arguments to update one BackupCode.
     * @example
     * // Update one BackupCode
     * const backupCode = await prisma.backupCode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BackupCodeUpdateArgs>(args: SelectSubset<T, BackupCodeUpdateArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BackupCodes.
     * @param {BackupCodeDeleteManyArgs} args - Arguments to filter BackupCodes to delete.
     * @example
     * // Delete a few BackupCodes
     * const { count } = await prisma.backupCode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BackupCodeDeleteManyArgs>(args?: SelectSubset<T, BackupCodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BackupCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BackupCodes
     * const backupCode = await prisma.backupCode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BackupCodeUpdateManyArgs>(args: SelectSubset<T, BackupCodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BackupCodes and returns the data updated in the database.
     * @param {BackupCodeUpdateManyAndReturnArgs} args - Arguments to update many BackupCodes.
     * @example
     * // Update many BackupCodes
     * const backupCode = await prisma.backupCode.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BackupCodes and only return the `id`
     * const backupCodeWithIdOnly = await prisma.backupCode.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BackupCodeUpdateManyAndReturnArgs>(args: SelectSubset<T, BackupCodeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BackupCode.
     * @param {BackupCodeUpsertArgs} args - Arguments to update or create a BackupCode.
     * @example
     * // Update or create a BackupCode
     * const backupCode = await prisma.backupCode.upsert({
     *   create: {
     *     // ... data to create a BackupCode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BackupCode we want to update
     *   }
     * })
     */
    upsert<T extends BackupCodeUpsertArgs>(args: SelectSubset<T, BackupCodeUpsertArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BackupCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCodeCountArgs} args - Arguments to filter BackupCodes to count.
     * @example
     * // Count the number of BackupCodes
     * const count = await prisma.backupCode.count({
     *   where: {
     *     // ... the filter for the BackupCodes we want to count
     *   }
     * })
    **/
    count<T extends BackupCodeCountArgs>(
      args?: Subset<T, BackupCodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BackupCodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BackupCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BackupCodeAggregateArgs>(args: Subset<T, BackupCodeAggregateArgs>): Prisma.PrismaPromise<GetBackupCodeAggregateType<T>>

    /**
     * Group by BackupCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BackupCodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BackupCodeGroupByArgs['orderBy'] }
        : { orderBy?: BackupCodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BackupCodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBackupCodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BackupCode model
   */
  readonly fields: BackupCodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BackupCode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BackupCodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BackupCode model
   */
  interface BackupCodeFieldRefs {
    readonly id: FieldRef<"BackupCode", 'String'>
    readonly userId: FieldRef<"BackupCode", 'String'>
    readonly authMethodId: FieldRef<"BackupCode", 'String'>
    readonly type: FieldRef<"BackupCode", 'E2FAMethod'>
    readonly code: FieldRef<"BackupCode", 'String'>
    readonly usedAt: FieldRef<"BackupCode", 'DateTime'>
    readonly usedIp: FieldRef<"BackupCode", 'String'>
    readonly expiresAt: FieldRef<"BackupCode", 'DateTime'>
    readonly createdAt: FieldRef<"BackupCode", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BackupCode findUnique
   */
  export type BackupCodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupCode
     */
    omit?: BackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which BackupCode to fetch.
     */
    where: BackupCodeWhereUniqueInput
  }

  /**
   * BackupCode findUniqueOrThrow
   */
  export type BackupCodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupCode
     */
    omit?: BackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which BackupCode to fetch.
     */
    where: BackupCodeWhereUniqueInput
  }

  /**
   * BackupCode findFirst
   */
  export type BackupCodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupCode
     */
    omit?: BackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which BackupCode to fetch.
     */
    where?: BackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupCodes to fetch.
     */
    orderBy?: BackupCodeOrderByWithRelationInput | BackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackupCodes.
     */
    cursor?: BackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackupCodes.
     */
    distinct?: BackupCodeScalarFieldEnum | BackupCodeScalarFieldEnum[]
  }

  /**
   * BackupCode findFirstOrThrow
   */
  export type BackupCodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupCode
     */
    omit?: BackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which BackupCode to fetch.
     */
    where?: BackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupCodes to fetch.
     */
    orderBy?: BackupCodeOrderByWithRelationInput | BackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackupCodes.
     */
    cursor?: BackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackupCodes.
     */
    distinct?: BackupCodeScalarFieldEnum | BackupCodeScalarFieldEnum[]
  }

  /**
   * BackupCode findMany
   */
  export type BackupCodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupCode
     */
    omit?: BackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which BackupCodes to fetch.
     */
    where?: BackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupCodes to fetch.
     */
    orderBy?: BackupCodeOrderByWithRelationInput | BackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BackupCodes.
     */
    cursor?: BackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupCodes.
     */
    skip?: number
    distinct?: BackupCodeScalarFieldEnum | BackupCodeScalarFieldEnum[]
  }

  /**
   * BackupCode create
   */
  export type BackupCodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupCode
     */
    omit?: BackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * The data needed to create a BackupCode.
     */
    data: XOR<BackupCodeCreateInput, BackupCodeUncheckedCreateInput>
  }

  /**
   * BackupCode createMany
   */
  export type BackupCodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BackupCodes.
     */
    data: BackupCodeCreateManyInput | BackupCodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BackupCode createManyAndReturn
   */
  export type BackupCodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BackupCode
     */
    omit?: BackupCodeOmit<ExtArgs> | null
    /**
     * The data used to create many BackupCodes.
     */
    data: BackupCodeCreateManyInput | BackupCodeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BackupCode update
   */
  export type BackupCodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupCode
     */
    omit?: BackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * The data needed to update a BackupCode.
     */
    data: XOR<BackupCodeUpdateInput, BackupCodeUncheckedUpdateInput>
    /**
     * Choose, which BackupCode to update.
     */
    where: BackupCodeWhereUniqueInput
  }

  /**
   * BackupCode updateMany
   */
  export type BackupCodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BackupCodes.
     */
    data: XOR<BackupCodeUpdateManyMutationInput, BackupCodeUncheckedUpdateManyInput>
    /**
     * Filter which BackupCodes to update
     */
    where?: BackupCodeWhereInput
    /**
     * Limit how many BackupCodes to update.
     */
    limit?: number
  }

  /**
   * BackupCode updateManyAndReturn
   */
  export type BackupCodeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BackupCode
     */
    omit?: BackupCodeOmit<ExtArgs> | null
    /**
     * The data used to update BackupCodes.
     */
    data: XOR<BackupCodeUpdateManyMutationInput, BackupCodeUncheckedUpdateManyInput>
    /**
     * Filter which BackupCodes to update
     */
    where?: BackupCodeWhereInput
    /**
     * Limit how many BackupCodes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BackupCode upsert
   */
  export type BackupCodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupCode
     */
    omit?: BackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * The filter to search for the BackupCode to update in case it exists.
     */
    where: BackupCodeWhereUniqueInput
    /**
     * In case the BackupCode found by the `where` argument doesn't exist, create a new BackupCode with this data.
     */
    create: XOR<BackupCodeCreateInput, BackupCodeUncheckedCreateInput>
    /**
     * In case the BackupCode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BackupCodeUpdateInput, BackupCodeUncheckedUpdateInput>
  }

  /**
   * BackupCode delete
   */
  export type BackupCodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupCode
     */
    omit?: BackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * Filter which BackupCode to delete.
     */
    where: BackupCodeWhereUniqueInput
  }

  /**
   * BackupCode deleteMany
   */
  export type BackupCodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackupCodes to delete
     */
    where?: BackupCodeWhereInput
    /**
     * Limit how many BackupCodes to delete.
     */
    limit?: number
  }

  /**
   * BackupCode without action
   */
  export type BackupCodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupCode
     */
    omit?: BackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    category: $Enums.EAuditCategory | null
    success: boolean | null
    ip: string | null
    userAgent: string | null
    country: string | null
    city: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    category: $Enums.EAuditCategory | null
    success: boolean | null
    ip: string | null
    userAgent: string | null
    country: string | null
    city: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    userId: number
    action: number
    category: number
    success: number
    ip: number
    userAgent: number
    country: number
    city: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    category?: true
    success?: true
    ip?: true
    userAgent?: true
    country?: true
    city?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    category?: true
    success?: true
    ip?: true
    userAgent?: true
    country?: true
    city?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    category?: true
    success?: true
    ip?: true
    userAgent?: true
    country?: true
    city?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    userId: string
    action: string
    category: $Enums.EAuditCategory
    success: boolean
    ip: string | null
    userAgent: string | null
    country: string | null
    city: string | null
    metadata: JsonValue | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    category?: boolean
    success?: boolean
    ip?: boolean
    userAgent?: boolean
    country?: boolean
    city?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    category?: boolean
    success?: boolean
    ip?: boolean
    userAgent?: boolean
    country?: boolean
    city?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    category?: boolean
    success?: boolean
    ip?: boolean
    userAgent?: boolean
    country?: boolean
    city?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    userId?: boolean
    action?: boolean
    category?: boolean
    success?: boolean
    ip?: boolean
    userAgent?: boolean
    country?: boolean
    city?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "action" | "category" | "success" | "ip" | "userAgent" | "country" | "city" | "metadata" | "createdAt", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      action: string
      category: $Enums.EAuditCategory
      success: boolean
      ip: string | null
      userAgent: string | null
      country: string | null
      city: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly category: FieldRef<"AuditLog", 'EAuditCategory'>
    readonly success: FieldRef<"AuditLog", 'Boolean'>
    readonly ip: FieldRef<"AuditLog", 'String'>
    readonly userAgent: FieldRef<"AuditLog", 'String'>
    readonly country: FieldRef<"AuditLog", 'String'>
    readonly city: FieldRef<"AuditLog", 'String'>
    readonly metadata: FieldRef<"AuditLog", 'Json'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    fullName: 'fullName',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: 'phone',
    email: 'email',
    avatar: 'avatar',
    bio: 'bio',
    password: 'password',
    isEmailVerified: 'isEmailVerified',
    emailVerifiedAt: 'emailVerifiedAt',
    isUnsubscribed: 'isUnsubscribed',
    emailBouncedAt: 'emailBouncedAt',
    isPhoneVerified: 'isPhoneVerified',
    phoneVerifiedAt: 'phoneVerifiedAt',
    phoneBouncedAt: 'phoneBouncedAt',
    is2FAEnabled: 'is2FAEnabled',
    preferred2FAMethod: 'preferred2FAMethod',
    require2FA: 'require2FA',
    lastLoginAt: 'lastLoginAt',
    lastLoginIp: 'lastLoginIp',
    passwordChangedAt: 'passwordChangedAt',
    riskScore: 'riskScore',
    lastRiskAssessAt: 'lastRiskAssessAt',
    deletedAt: 'deletedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AuthenticationMethodScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    method: 'method',
    data: 'data',
    name: 'name',
    isActive: 'isActive',
    isPrimary: 'isPrimary',
    lastUsedAt: 'lastUsedAt',
    useCount: 'useCount',
    credentialId: 'credentialId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AuthenticationMethodScalarFieldEnum = (typeof AuthenticationMethodScalarFieldEnum)[keyof typeof AuthenticationMethodScalarFieldEnum]


  export const TrustedDeviceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    deviceId: 'deviceId',
    fingerprint: 'fingerprint',
    name: 'name',
    userAgent: 'userAgent',
    browser: 'browser',
    os: 'os',
    device: 'device',
    trustScore: 'trustScore',
    lastIp: 'lastIp',
    lastCountry: 'lastCountry',
    lastCity: 'lastCity',
    isActive: 'isActive',
    lastSeenAt: 'lastSeenAt',
    expiresAt: 'expiresAt',
    revokedAt: 'revokedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TrustedDeviceScalarFieldEnum = (typeof TrustedDeviceScalarFieldEnum)[keyof typeof TrustedDeviceScalarFieldEnum]


  export const SecurityEventScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    event: 'event',
    severity: 'severity',
    ip: 'ip',
    userAgent: 'userAgent',
    country: 'country',
    city: 'city',
    deviceId: 'deviceId',
    riskScore: 'riskScore',
    riskFactors: 'riskFactors',
    resolved: 'resolved',
    resolvedAt: 'resolvedAt',
    resolvedBy: 'resolvedBy',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type SecurityEventScalarFieldEnum = (typeof SecurityEventScalarFieldEnum)[keyof typeof SecurityEventScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    token: 'token',
    refreshToken: 'refreshToken',
    deviceId: 'deviceId',
    userAgent: 'userAgent',
    ip: 'ip',
    country: 'country',
    city: 'city',
    browser: 'browser',
    os: 'os',
    device: 'device',
    isTrusted: 'isTrusted',
    riskScore: 'riskScore',
    is2FAVerified: 'is2FAVerified',
    verified2FAAt: 'verified2FAAt',
    expiresAt: 'expiresAt',
    lastUsedAt: 'lastUsedAt',
    revokedAt: 'revokedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const AccountLockScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    reason: 'reason',
    failedAttempts: 'failedAttempts',
    lockedAt: 'lockedAt',
    expiresAt: 'expiresAt',
    unlockedAt: 'unlockedAt',
    ip: 'ip',
    userAgent: 'userAgent',
    createdAt: 'createdAt'
  };

  export type AccountLockScalarFieldEnum = (typeof AccountLockScalarFieldEnum)[keyof typeof AccountLockScalarFieldEnum]


  export const TokenScalarFieldEnum: {
    id: 'id',
    token: 'token',
    type: 'type',
    expiresIn: 'expiresIn',
    usedAt: 'usedAt',
    maxUses: 'maxUses',
    useCount: 'useCount',
    userId: 'userId',
    createdIp: 'createdIp',
    usedIp: 'usedIp',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TokenScalarFieldEnum = (typeof TokenScalarFieldEnum)[keyof typeof TokenScalarFieldEnum]


  export const BackupCodeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    authMethodId: 'authMethodId',
    type: 'type',
    code: 'code',
    usedAt: 'usedAt',
    usedIp: 'usedIp',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type BackupCodeScalarFieldEnum = (typeof BackupCodeScalarFieldEnum)[keyof typeof BackupCodeScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    action: 'action',
    category: 'category',
    success: 'success',
    ip: 'ip',
    userAgent: 'userAgent',
    country: 'country',
    city: 'city',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'E2FAMethod'
   */
  export type EnumE2FAMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'E2FAMethod'>
    


  /**
   * Reference to a field of type 'E2FAMethod[]'
   */
  export type ListEnumE2FAMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'E2FAMethod[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'ESecurityEvent'
   */
  export type EnumESecurityEventFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ESecurityEvent'>
    


  /**
   * Reference to a field of type 'ESecurityEvent[]'
   */
  export type ListEnumESecurityEventFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ESecurityEvent[]'>
    


  /**
   * Reference to a field of type 'ESecuritySeverity'
   */
  export type EnumESecuritySeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ESecuritySeverity'>
    


  /**
   * Reference to a field of type 'ESecuritySeverity[]'
   */
  export type ListEnumESecuritySeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ESecuritySeverity[]'>
    


  /**
   * Reference to a field of type 'ETokenType'
   */
  export type EnumETokenTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ETokenType'>
    


  /**
   * Reference to a field of type 'ETokenType[]'
   */
  export type ListEnumETokenTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ETokenType[]'>
    


  /**
   * Reference to a field of type 'EAuditCategory'
   */
  export type EnumEAuditCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EAuditCategory'>
    


  /**
   * Reference to a field of type 'EAuditCategory[]'
   */
  export type ListEnumEAuditCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EAuditCategory[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    avatar?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    isEmailVerified?: BoolFilter<"User"> | boolean
    emailVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    isUnsubscribed?: BoolNullableFilter<"User"> | boolean | null
    emailBouncedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    isPhoneVerified?: BoolFilter<"User"> | boolean
    phoneVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    phoneBouncedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    is2FAEnabled?: BoolFilter<"User"> | boolean
    preferred2FAMethod?: EnumE2FAMethodNullableFilter<"User"> | $Enums.E2FAMethod | null
    require2FA?: BoolFilter<"User"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    lastLoginIp?: StringNullableFilter<"User"> | string | null
    passwordChangedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    riskScore?: FloatNullableFilter<"User"> | number | null
    lastRiskAssessAt?: DateTimeNullableFilter<"User"> | Date | string | null
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    authenticationMethods?: AuthenticationMethodListRelationFilter
    backupCodes?: BackupCodeListRelationFilter
    trustedDevices?: TrustedDeviceListRelationFilter
    auditLogs?: AuditLogListRelationFilter
    tokens?: TokenListRelationFilter
    sessions?: SessionListRelationFilter
    accountLocks?: AccountLockListRelationFilter
    securityEvents?: SecurityEventListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    fullName?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrder
    avatar?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    password?: SortOrder
    isEmailVerified?: SortOrder
    emailVerifiedAt?: SortOrderInput | SortOrder
    isUnsubscribed?: SortOrderInput | SortOrder
    emailBouncedAt?: SortOrderInput | SortOrder
    isPhoneVerified?: SortOrder
    phoneVerifiedAt?: SortOrderInput | SortOrder
    phoneBouncedAt?: SortOrderInput | SortOrder
    is2FAEnabled?: SortOrder
    preferred2FAMethod?: SortOrderInput | SortOrder
    require2FA?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    lastLoginIp?: SortOrderInput | SortOrder
    passwordChangedAt?: SortOrderInput | SortOrder
    riskScore?: SortOrderInput | SortOrder
    lastRiskAssessAt?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    authenticationMethods?: AuthenticationMethodOrderByRelationAggregateInput
    backupCodes?: BackupCodeOrderByRelationAggregateInput
    trustedDevices?: TrustedDeviceOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
    tokens?: TokenOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    accountLocks?: AccountLockOrderByRelationAggregateInput
    securityEvents?: SecurityEventOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    phone?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    fullName?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    isEmailVerified?: BoolFilter<"User"> | boolean
    emailVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    isUnsubscribed?: BoolNullableFilter<"User"> | boolean | null
    emailBouncedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    isPhoneVerified?: BoolFilter<"User"> | boolean
    phoneVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    phoneBouncedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    is2FAEnabled?: BoolFilter<"User"> | boolean
    preferred2FAMethod?: EnumE2FAMethodNullableFilter<"User"> | $Enums.E2FAMethod | null
    require2FA?: BoolFilter<"User"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    lastLoginIp?: StringNullableFilter<"User"> | string | null
    passwordChangedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    riskScore?: FloatNullableFilter<"User"> | number | null
    lastRiskAssessAt?: DateTimeNullableFilter<"User"> | Date | string | null
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    authenticationMethods?: AuthenticationMethodListRelationFilter
    backupCodes?: BackupCodeListRelationFilter
    trustedDevices?: TrustedDeviceListRelationFilter
    auditLogs?: AuditLogListRelationFilter
    tokens?: TokenListRelationFilter
    sessions?: SessionListRelationFilter
    accountLocks?: AccountLockListRelationFilter
    securityEvents?: SecurityEventListRelationFilter
  }, "id" | "phone" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    fullName?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrder
    avatar?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    password?: SortOrder
    isEmailVerified?: SortOrder
    emailVerifiedAt?: SortOrderInput | SortOrder
    isUnsubscribed?: SortOrderInput | SortOrder
    emailBouncedAt?: SortOrderInput | SortOrder
    isPhoneVerified?: SortOrder
    phoneVerifiedAt?: SortOrderInput | SortOrder
    phoneBouncedAt?: SortOrderInput | SortOrder
    is2FAEnabled?: SortOrder
    preferred2FAMethod?: SortOrderInput | SortOrder
    require2FA?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    lastLoginIp?: SortOrderInput | SortOrder
    passwordChangedAt?: SortOrderInput | SortOrder
    riskScore?: SortOrderInput | SortOrder
    lastRiskAssessAt?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    fullName?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringNullableWithAggregatesFilter<"User"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    bio?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringWithAggregatesFilter<"User"> | string
    isEmailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    emailVerifiedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    isUnsubscribed?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    emailBouncedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    isPhoneVerified?: BoolWithAggregatesFilter<"User"> | boolean
    phoneVerifiedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    phoneBouncedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    is2FAEnabled?: BoolWithAggregatesFilter<"User"> | boolean
    preferred2FAMethod?: EnumE2FAMethodNullableWithAggregatesFilter<"User"> | $Enums.E2FAMethod | null
    require2FA?: BoolWithAggregatesFilter<"User"> | boolean
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    lastLoginIp?: StringNullableWithAggregatesFilter<"User"> | string | null
    passwordChangedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    riskScore?: FloatNullableWithAggregatesFilter<"User"> | number | null
    lastRiskAssessAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    deletedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AuthenticationMethodWhereInput = {
    AND?: AuthenticationMethodWhereInput | AuthenticationMethodWhereInput[]
    OR?: AuthenticationMethodWhereInput[]
    NOT?: AuthenticationMethodWhereInput | AuthenticationMethodWhereInput[]
    id?: StringFilter<"AuthenticationMethod"> | string
    userId?: StringFilter<"AuthenticationMethod"> | string
    method?: EnumE2FAMethodFilter<"AuthenticationMethod"> | $Enums.E2FAMethod
    data?: JsonFilter<"AuthenticationMethod">
    name?: StringNullableFilter<"AuthenticationMethod"> | string | null
    isActive?: BoolFilter<"AuthenticationMethod"> | boolean
    isPrimary?: BoolFilter<"AuthenticationMethod"> | boolean
    lastUsedAt?: DateTimeNullableFilter<"AuthenticationMethod"> | Date | string | null
    useCount?: IntFilter<"AuthenticationMethod"> | number
    credentialId?: StringNullableFilter<"AuthenticationMethod"> | string | null
    createdAt?: DateTimeFilter<"AuthenticationMethod"> | Date | string
    updatedAt?: DateTimeFilter<"AuthenticationMethod"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AuthenticationMethodOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    method?: SortOrder
    data?: SortOrder
    name?: SortOrderInput | SortOrder
    isActive?: SortOrder
    isPrimary?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    useCount?: SortOrder
    credentialId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AuthenticationMethodWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    credentialId?: string
    userId_method_credentialId?: AuthenticationMethodUserIdMethodCredentialIdCompoundUniqueInput
    AND?: AuthenticationMethodWhereInput | AuthenticationMethodWhereInput[]
    OR?: AuthenticationMethodWhereInput[]
    NOT?: AuthenticationMethodWhereInput | AuthenticationMethodWhereInput[]
    userId?: StringFilter<"AuthenticationMethod"> | string
    method?: EnumE2FAMethodFilter<"AuthenticationMethod"> | $Enums.E2FAMethod
    data?: JsonFilter<"AuthenticationMethod">
    name?: StringNullableFilter<"AuthenticationMethod"> | string | null
    isActive?: BoolFilter<"AuthenticationMethod"> | boolean
    isPrimary?: BoolFilter<"AuthenticationMethod"> | boolean
    lastUsedAt?: DateTimeNullableFilter<"AuthenticationMethod"> | Date | string | null
    useCount?: IntFilter<"AuthenticationMethod"> | number
    createdAt?: DateTimeFilter<"AuthenticationMethod"> | Date | string
    updatedAt?: DateTimeFilter<"AuthenticationMethod"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "credentialId" | "userId_method_credentialId">

  export type AuthenticationMethodOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    method?: SortOrder
    data?: SortOrder
    name?: SortOrderInput | SortOrder
    isActive?: SortOrder
    isPrimary?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    useCount?: SortOrder
    credentialId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AuthenticationMethodCountOrderByAggregateInput
    _avg?: AuthenticationMethodAvgOrderByAggregateInput
    _max?: AuthenticationMethodMaxOrderByAggregateInput
    _min?: AuthenticationMethodMinOrderByAggregateInput
    _sum?: AuthenticationMethodSumOrderByAggregateInput
  }

  export type AuthenticationMethodScalarWhereWithAggregatesInput = {
    AND?: AuthenticationMethodScalarWhereWithAggregatesInput | AuthenticationMethodScalarWhereWithAggregatesInput[]
    OR?: AuthenticationMethodScalarWhereWithAggregatesInput[]
    NOT?: AuthenticationMethodScalarWhereWithAggregatesInput | AuthenticationMethodScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuthenticationMethod"> | string
    userId?: StringWithAggregatesFilter<"AuthenticationMethod"> | string
    method?: EnumE2FAMethodWithAggregatesFilter<"AuthenticationMethod"> | $Enums.E2FAMethod
    data?: JsonWithAggregatesFilter<"AuthenticationMethod">
    name?: StringNullableWithAggregatesFilter<"AuthenticationMethod"> | string | null
    isActive?: BoolWithAggregatesFilter<"AuthenticationMethod"> | boolean
    isPrimary?: BoolWithAggregatesFilter<"AuthenticationMethod"> | boolean
    lastUsedAt?: DateTimeNullableWithAggregatesFilter<"AuthenticationMethod"> | Date | string | null
    useCount?: IntWithAggregatesFilter<"AuthenticationMethod"> | number
    credentialId?: StringNullableWithAggregatesFilter<"AuthenticationMethod"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuthenticationMethod"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AuthenticationMethod"> | Date | string
  }

  export type TrustedDeviceWhereInput = {
    AND?: TrustedDeviceWhereInput | TrustedDeviceWhereInput[]
    OR?: TrustedDeviceWhereInput[]
    NOT?: TrustedDeviceWhereInput | TrustedDeviceWhereInput[]
    id?: StringFilter<"TrustedDevice"> | string
    userId?: StringFilter<"TrustedDevice"> | string
    deviceId?: StringFilter<"TrustedDevice"> | string
    fingerprint?: JsonFilter<"TrustedDevice">
    name?: StringNullableFilter<"TrustedDevice"> | string | null
    userAgent?: StringFilter<"TrustedDevice"> | string
    browser?: StringNullableFilter<"TrustedDevice"> | string | null
    os?: StringNullableFilter<"TrustedDevice"> | string | null
    device?: StringNullableFilter<"TrustedDevice"> | string | null
    trustScore?: FloatFilter<"TrustedDevice"> | number
    lastIp?: StringNullableFilter<"TrustedDevice"> | string | null
    lastCountry?: StringNullableFilter<"TrustedDevice"> | string | null
    lastCity?: StringNullableFilter<"TrustedDevice"> | string | null
    isActive?: BoolFilter<"TrustedDevice"> | boolean
    lastSeenAt?: DateTimeFilter<"TrustedDevice"> | Date | string
    expiresAt?: DateTimeNullableFilter<"TrustedDevice"> | Date | string | null
    revokedAt?: DateTimeNullableFilter<"TrustedDevice"> | Date | string | null
    createdAt?: DateTimeFilter<"TrustedDevice"> | Date | string
    updatedAt?: DateTimeFilter<"TrustedDevice"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TrustedDeviceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    deviceId?: SortOrder
    fingerprint?: SortOrder
    name?: SortOrderInput | SortOrder
    userAgent?: SortOrder
    browser?: SortOrderInput | SortOrder
    os?: SortOrderInput | SortOrder
    device?: SortOrderInput | SortOrder
    trustScore?: SortOrder
    lastIp?: SortOrderInput | SortOrder
    lastCountry?: SortOrderInput | SortOrder
    lastCity?: SortOrderInput | SortOrder
    isActive?: SortOrder
    lastSeenAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TrustedDeviceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    deviceId?: string
    AND?: TrustedDeviceWhereInput | TrustedDeviceWhereInput[]
    OR?: TrustedDeviceWhereInput[]
    NOT?: TrustedDeviceWhereInput | TrustedDeviceWhereInput[]
    userId?: StringFilter<"TrustedDevice"> | string
    fingerprint?: JsonFilter<"TrustedDevice">
    name?: StringNullableFilter<"TrustedDevice"> | string | null
    userAgent?: StringFilter<"TrustedDevice"> | string
    browser?: StringNullableFilter<"TrustedDevice"> | string | null
    os?: StringNullableFilter<"TrustedDevice"> | string | null
    device?: StringNullableFilter<"TrustedDevice"> | string | null
    trustScore?: FloatFilter<"TrustedDevice"> | number
    lastIp?: StringNullableFilter<"TrustedDevice"> | string | null
    lastCountry?: StringNullableFilter<"TrustedDevice"> | string | null
    lastCity?: StringNullableFilter<"TrustedDevice"> | string | null
    isActive?: BoolFilter<"TrustedDevice"> | boolean
    lastSeenAt?: DateTimeFilter<"TrustedDevice"> | Date | string
    expiresAt?: DateTimeNullableFilter<"TrustedDevice"> | Date | string | null
    revokedAt?: DateTimeNullableFilter<"TrustedDevice"> | Date | string | null
    createdAt?: DateTimeFilter<"TrustedDevice"> | Date | string
    updatedAt?: DateTimeFilter<"TrustedDevice"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "deviceId">

  export type TrustedDeviceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    deviceId?: SortOrder
    fingerprint?: SortOrder
    name?: SortOrderInput | SortOrder
    userAgent?: SortOrder
    browser?: SortOrderInput | SortOrder
    os?: SortOrderInput | SortOrder
    device?: SortOrderInput | SortOrder
    trustScore?: SortOrder
    lastIp?: SortOrderInput | SortOrder
    lastCountry?: SortOrderInput | SortOrder
    lastCity?: SortOrderInput | SortOrder
    isActive?: SortOrder
    lastSeenAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TrustedDeviceCountOrderByAggregateInput
    _avg?: TrustedDeviceAvgOrderByAggregateInput
    _max?: TrustedDeviceMaxOrderByAggregateInput
    _min?: TrustedDeviceMinOrderByAggregateInput
    _sum?: TrustedDeviceSumOrderByAggregateInput
  }

  export type TrustedDeviceScalarWhereWithAggregatesInput = {
    AND?: TrustedDeviceScalarWhereWithAggregatesInput | TrustedDeviceScalarWhereWithAggregatesInput[]
    OR?: TrustedDeviceScalarWhereWithAggregatesInput[]
    NOT?: TrustedDeviceScalarWhereWithAggregatesInput | TrustedDeviceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TrustedDevice"> | string
    userId?: StringWithAggregatesFilter<"TrustedDevice"> | string
    deviceId?: StringWithAggregatesFilter<"TrustedDevice"> | string
    fingerprint?: JsonWithAggregatesFilter<"TrustedDevice">
    name?: StringNullableWithAggregatesFilter<"TrustedDevice"> | string | null
    userAgent?: StringWithAggregatesFilter<"TrustedDevice"> | string
    browser?: StringNullableWithAggregatesFilter<"TrustedDevice"> | string | null
    os?: StringNullableWithAggregatesFilter<"TrustedDevice"> | string | null
    device?: StringNullableWithAggregatesFilter<"TrustedDevice"> | string | null
    trustScore?: FloatWithAggregatesFilter<"TrustedDevice"> | number
    lastIp?: StringNullableWithAggregatesFilter<"TrustedDevice"> | string | null
    lastCountry?: StringNullableWithAggregatesFilter<"TrustedDevice"> | string | null
    lastCity?: StringNullableWithAggregatesFilter<"TrustedDevice"> | string | null
    isActive?: BoolWithAggregatesFilter<"TrustedDevice"> | boolean
    lastSeenAt?: DateTimeWithAggregatesFilter<"TrustedDevice"> | Date | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"TrustedDevice"> | Date | string | null
    revokedAt?: DateTimeNullableWithAggregatesFilter<"TrustedDevice"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TrustedDevice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TrustedDevice"> | Date | string
  }

  export type SecurityEventWhereInput = {
    AND?: SecurityEventWhereInput | SecurityEventWhereInput[]
    OR?: SecurityEventWhereInput[]
    NOT?: SecurityEventWhereInput | SecurityEventWhereInput[]
    id?: StringFilter<"SecurityEvent"> | string
    userId?: StringFilter<"SecurityEvent"> | string
    event?: EnumESecurityEventFilter<"SecurityEvent"> | $Enums.ESecurityEvent
    severity?: EnumESecuritySeverityFilter<"SecurityEvent"> | $Enums.ESecuritySeverity
    ip?: StringNullableFilter<"SecurityEvent"> | string | null
    userAgent?: StringNullableFilter<"SecurityEvent"> | string | null
    country?: StringNullableFilter<"SecurityEvent"> | string | null
    city?: StringNullableFilter<"SecurityEvent"> | string | null
    deviceId?: StringNullableFilter<"SecurityEvent"> | string | null
    riskScore?: FloatNullableFilter<"SecurityEvent"> | number | null
    riskFactors?: JsonNullableFilter<"SecurityEvent">
    resolved?: BoolFilter<"SecurityEvent"> | boolean
    resolvedAt?: DateTimeNullableFilter<"SecurityEvent"> | Date | string | null
    resolvedBy?: StringNullableFilter<"SecurityEvent"> | string | null
    metadata?: JsonNullableFilter<"SecurityEvent">
    createdAt?: DateTimeFilter<"SecurityEvent"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SecurityEventOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    event?: SortOrder
    severity?: SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    deviceId?: SortOrderInput | SortOrder
    riskScore?: SortOrderInput | SortOrder
    riskFactors?: SortOrderInput | SortOrder
    resolved?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    resolvedBy?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SecurityEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SecurityEventWhereInput | SecurityEventWhereInput[]
    OR?: SecurityEventWhereInput[]
    NOT?: SecurityEventWhereInput | SecurityEventWhereInput[]
    userId?: StringFilter<"SecurityEvent"> | string
    event?: EnumESecurityEventFilter<"SecurityEvent"> | $Enums.ESecurityEvent
    severity?: EnumESecuritySeverityFilter<"SecurityEvent"> | $Enums.ESecuritySeverity
    ip?: StringNullableFilter<"SecurityEvent"> | string | null
    userAgent?: StringNullableFilter<"SecurityEvent"> | string | null
    country?: StringNullableFilter<"SecurityEvent"> | string | null
    city?: StringNullableFilter<"SecurityEvent"> | string | null
    deviceId?: StringNullableFilter<"SecurityEvent"> | string | null
    riskScore?: FloatNullableFilter<"SecurityEvent"> | number | null
    riskFactors?: JsonNullableFilter<"SecurityEvent">
    resolved?: BoolFilter<"SecurityEvent"> | boolean
    resolvedAt?: DateTimeNullableFilter<"SecurityEvent"> | Date | string | null
    resolvedBy?: StringNullableFilter<"SecurityEvent"> | string | null
    metadata?: JsonNullableFilter<"SecurityEvent">
    createdAt?: DateTimeFilter<"SecurityEvent"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type SecurityEventOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    event?: SortOrder
    severity?: SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    deviceId?: SortOrderInput | SortOrder
    riskScore?: SortOrderInput | SortOrder
    riskFactors?: SortOrderInput | SortOrder
    resolved?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    resolvedBy?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SecurityEventCountOrderByAggregateInput
    _avg?: SecurityEventAvgOrderByAggregateInput
    _max?: SecurityEventMaxOrderByAggregateInput
    _min?: SecurityEventMinOrderByAggregateInput
    _sum?: SecurityEventSumOrderByAggregateInput
  }

  export type SecurityEventScalarWhereWithAggregatesInput = {
    AND?: SecurityEventScalarWhereWithAggregatesInput | SecurityEventScalarWhereWithAggregatesInput[]
    OR?: SecurityEventScalarWhereWithAggregatesInput[]
    NOT?: SecurityEventScalarWhereWithAggregatesInput | SecurityEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SecurityEvent"> | string
    userId?: StringWithAggregatesFilter<"SecurityEvent"> | string
    event?: EnumESecurityEventWithAggregatesFilter<"SecurityEvent"> | $Enums.ESecurityEvent
    severity?: EnumESecuritySeverityWithAggregatesFilter<"SecurityEvent"> | $Enums.ESecuritySeverity
    ip?: StringNullableWithAggregatesFilter<"SecurityEvent"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"SecurityEvent"> | string | null
    country?: StringNullableWithAggregatesFilter<"SecurityEvent"> | string | null
    city?: StringNullableWithAggregatesFilter<"SecurityEvent"> | string | null
    deviceId?: StringNullableWithAggregatesFilter<"SecurityEvent"> | string | null
    riskScore?: FloatNullableWithAggregatesFilter<"SecurityEvent"> | number | null
    riskFactors?: JsonNullableWithAggregatesFilter<"SecurityEvent">
    resolved?: BoolWithAggregatesFilter<"SecurityEvent"> | boolean
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"SecurityEvent"> | Date | string | null
    resolvedBy?: StringNullableWithAggregatesFilter<"SecurityEvent"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"SecurityEvent">
    createdAt?: DateTimeWithAggregatesFilter<"SecurityEvent"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    token?: StringFilter<"Session"> | string
    refreshToken?: StringNullableFilter<"Session"> | string | null
    deviceId?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    ip?: StringNullableFilter<"Session"> | string | null
    country?: StringNullableFilter<"Session"> | string | null
    city?: StringNullableFilter<"Session"> | string | null
    browser?: StringNullableFilter<"Session"> | string | null
    os?: StringNullableFilter<"Session"> | string | null
    device?: StringNullableFilter<"Session"> | string | null
    isTrusted?: BoolFilter<"Session"> | boolean
    riskScore?: FloatNullableFilter<"Session"> | number | null
    is2FAVerified?: BoolFilter<"Session"> | boolean
    verified2FAAt?: DateTimeNullableFilter<"Session"> | Date | string | null
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    lastUsedAt?: DateTimeFilter<"Session"> | Date | string
    revokedAt?: DateTimeNullableFilter<"Session"> | Date | string | null
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    deviceId?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    ip?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    browser?: SortOrderInput | SortOrder
    os?: SortOrderInput | SortOrder
    device?: SortOrderInput | SortOrder
    isTrusted?: SortOrder
    riskScore?: SortOrderInput | SortOrder
    is2FAVerified?: SortOrder
    verified2FAAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    refreshToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    deviceId?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    ip?: StringNullableFilter<"Session"> | string | null
    country?: StringNullableFilter<"Session"> | string | null
    city?: StringNullableFilter<"Session"> | string | null
    browser?: StringNullableFilter<"Session"> | string | null
    os?: StringNullableFilter<"Session"> | string | null
    device?: StringNullableFilter<"Session"> | string | null
    isTrusted?: BoolFilter<"Session"> | boolean
    riskScore?: FloatNullableFilter<"Session"> | number | null
    is2FAVerified?: BoolFilter<"Session"> | boolean
    verified2FAAt?: DateTimeNullableFilter<"Session"> | Date | string | null
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    lastUsedAt?: DateTimeFilter<"Session"> | Date | string
    revokedAt?: DateTimeNullableFilter<"Session"> | Date | string | null
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token" | "refreshToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    deviceId?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    ip?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    browser?: SortOrderInput | SortOrder
    os?: SortOrderInput | SortOrder
    device?: SortOrderInput | SortOrder
    isTrusted?: SortOrder
    riskScore?: SortOrderInput | SortOrder
    is2FAVerified?: SortOrder
    verified2FAAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _avg?: SessionAvgOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
    _sum?: SessionSumOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    token?: StringWithAggregatesFilter<"Session"> | string
    refreshToken?: StringNullableWithAggregatesFilter<"Session"> | string | null
    deviceId?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null
    ip?: StringNullableWithAggregatesFilter<"Session"> | string | null
    country?: StringNullableWithAggregatesFilter<"Session"> | string | null
    city?: StringNullableWithAggregatesFilter<"Session"> | string | null
    browser?: StringNullableWithAggregatesFilter<"Session"> | string | null
    os?: StringNullableWithAggregatesFilter<"Session"> | string | null
    device?: StringNullableWithAggregatesFilter<"Session"> | string | null
    isTrusted?: BoolWithAggregatesFilter<"Session"> | boolean
    riskScore?: FloatNullableWithAggregatesFilter<"Session"> | number | null
    is2FAVerified?: BoolWithAggregatesFilter<"Session"> | boolean
    verified2FAAt?: DateTimeNullableWithAggregatesFilter<"Session"> | Date | string | null
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    lastUsedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    revokedAt?: DateTimeNullableWithAggregatesFilter<"Session"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type AccountLockWhereInput = {
    AND?: AccountLockWhereInput | AccountLockWhereInput[]
    OR?: AccountLockWhereInput[]
    NOT?: AccountLockWhereInput | AccountLockWhereInput[]
    id?: StringFilter<"AccountLock"> | string
    userId?: StringFilter<"AccountLock"> | string
    reason?: StringFilter<"AccountLock"> | string
    failedAttempts?: IntFilter<"AccountLock"> | number
    lockedAt?: DateTimeFilter<"AccountLock"> | Date | string
    expiresAt?: DateTimeNullableFilter<"AccountLock"> | Date | string | null
    unlockedAt?: DateTimeNullableFilter<"AccountLock"> | Date | string | null
    ip?: StringNullableFilter<"AccountLock"> | string | null
    userAgent?: StringNullableFilter<"AccountLock"> | string | null
    createdAt?: DateTimeFilter<"AccountLock"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountLockOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    reason?: SortOrder
    failedAttempts?: SortOrder
    lockedAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    unlockedAt?: SortOrderInput | SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountLockWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AccountLockWhereInput | AccountLockWhereInput[]
    OR?: AccountLockWhereInput[]
    NOT?: AccountLockWhereInput | AccountLockWhereInput[]
    userId?: StringFilter<"AccountLock"> | string
    reason?: StringFilter<"AccountLock"> | string
    failedAttempts?: IntFilter<"AccountLock"> | number
    lockedAt?: DateTimeFilter<"AccountLock"> | Date | string
    expiresAt?: DateTimeNullableFilter<"AccountLock"> | Date | string | null
    unlockedAt?: DateTimeNullableFilter<"AccountLock"> | Date | string | null
    ip?: StringNullableFilter<"AccountLock"> | string | null
    userAgent?: StringNullableFilter<"AccountLock"> | string | null
    createdAt?: DateTimeFilter<"AccountLock"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AccountLockOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    reason?: SortOrder
    failedAttempts?: SortOrder
    lockedAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    unlockedAt?: SortOrderInput | SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AccountLockCountOrderByAggregateInput
    _avg?: AccountLockAvgOrderByAggregateInput
    _max?: AccountLockMaxOrderByAggregateInput
    _min?: AccountLockMinOrderByAggregateInput
    _sum?: AccountLockSumOrderByAggregateInput
  }

  export type AccountLockScalarWhereWithAggregatesInput = {
    AND?: AccountLockScalarWhereWithAggregatesInput | AccountLockScalarWhereWithAggregatesInput[]
    OR?: AccountLockScalarWhereWithAggregatesInput[]
    NOT?: AccountLockScalarWhereWithAggregatesInput | AccountLockScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AccountLock"> | string
    userId?: StringWithAggregatesFilter<"AccountLock"> | string
    reason?: StringWithAggregatesFilter<"AccountLock"> | string
    failedAttempts?: IntWithAggregatesFilter<"AccountLock"> | number
    lockedAt?: DateTimeWithAggregatesFilter<"AccountLock"> | Date | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"AccountLock"> | Date | string | null
    unlockedAt?: DateTimeNullableWithAggregatesFilter<"AccountLock"> | Date | string | null
    ip?: StringNullableWithAggregatesFilter<"AccountLock"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"AccountLock"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AccountLock"> | Date | string
  }

  export type TokenWhereInput = {
    AND?: TokenWhereInput | TokenWhereInput[]
    OR?: TokenWhereInput[]
    NOT?: TokenWhereInput | TokenWhereInput[]
    id?: StringFilter<"Token"> | string
    token?: StringFilter<"Token"> | string
    type?: EnumETokenTypeFilter<"Token"> | $Enums.ETokenType
    expiresIn?: DateTimeFilter<"Token"> | Date | string
    usedAt?: DateTimeNullableFilter<"Token"> | Date | string | null
    maxUses?: IntFilter<"Token"> | number
    useCount?: IntFilter<"Token"> | number
    userId?: StringNullableFilter<"Token"> | string | null
    createdIp?: StringNullableFilter<"Token"> | string | null
    usedIp?: StringNullableFilter<"Token"> | string | null
    createdAt?: DateTimeFilter<"Token"> | Date | string
    updatedAt?: DateTimeFilter<"Token"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type TokenOrderByWithRelationInput = {
    id?: SortOrder
    token?: SortOrder
    type?: SortOrder
    expiresIn?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    maxUses?: SortOrder
    useCount?: SortOrder
    userId?: SortOrderInput | SortOrder
    createdIp?: SortOrderInput | SortOrder
    usedIp?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    userId_type?: TokenUserIdTypeCompoundUniqueInput
    AND?: TokenWhereInput | TokenWhereInput[]
    OR?: TokenWhereInput[]
    NOT?: TokenWhereInput | TokenWhereInput[]
    type?: EnumETokenTypeFilter<"Token"> | $Enums.ETokenType
    expiresIn?: DateTimeFilter<"Token"> | Date | string
    usedAt?: DateTimeNullableFilter<"Token"> | Date | string | null
    maxUses?: IntFilter<"Token"> | number
    useCount?: IntFilter<"Token"> | number
    userId?: StringNullableFilter<"Token"> | string | null
    createdIp?: StringNullableFilter<"Token"> | string | null
    usedIp?: StringNullableFilter<"Token"> | string | null
    createdAt?: DateTimeFilter<"Token"> | Date | string
    updatedAt?: DateTimeFilter<"Token"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "token" | "userId_type">

  export type TokenOrderByWithAggregationInput = {
    id?: SortOrder
    token?: SortOrder
    type?: SortOrder
    expiresIn?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    maxUses?: SortOrder
    useCount?: SortOrder
    userId?: SortOrderInput | SortOrder
    createdIp?: SortOrderInput | SortOrder
    usedIp?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TokenCountOrderByAggregateInput
    _avg?: TokenAvgOrderByAggregateInput
    _max?: TokenMaxOrderByAggregateInput
    _min?: TokenMinOrderByAggregateInput
    _sum?: TokenSumOrderByAggregateInput
  }

  export type TokenScalarWhereWithAggregatesInput = {
    AND?: TokenScalarWhereWithAggregatesInput | TokenScalarWhereWithAggregatesInput[]
    OR?: TokenScalarWhereWithAggregatesInput[]
    NOT?: TokenScalarWhereWithAggregatesInput | TokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Token"> | string
    token?: StringWithAggregatesFilter<"Token"> | string
    type?: EnumETokenTypeWithAggregatesFilter<"Token"> | $Enums.ETokenType
    expiresIn?: DateTimeWithAggregatesFilter<"Token"> | Date | string
    usedAt?: DateTimeNullableWithAggregatesFilter<"Token"> | Date | string | null
    maxUses?: IntWithAggregatesFilter<"Token"> | number
    useCount?: IntWithAggregatesFilter<"Token"> | number
    userId?: StringNullableWithAggregatesFilter<"Token"> | string | null
    createdIp?: StringNullableWithAggregatesFilter<"Token"> | string | null
    usedIp?: StringNullableWithAggregatesFilter<"Token"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Token"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Token"> | Date | string
  }

  export type BackupCodeWhereInput = {
    AND?: BackupCodeWhereInput | BackupCodeWhereInput[]
    OR?: BackupCodeWhereInput[]
    NOT?: BackupCodeWhereInput | BackupCodeWhereInput[]
    id?: StringFilter<"BackupCode"> | string
    userId?: StringFilter<"BackupCode"> | string
    authMethodId?: StringNullableFilter<"BackupCode"> | string | null
    type?: EnumE2FAMethodFilter<"BackupCode"> | $Enums.E2FAMethod
    code?: StringFilter<"BackupCode"> | string
    usedAt?: DateTimeNullableFilter<"BackupCode"> | Date | string | null
    usedIp?: StringNullableFilter<"BackupCode"> | string | null
    expiresAt?: DateTimeNullableFilter<"BackupCode"> | Date | string | null
    createdAt?: DateTimeFilter<"BackupCode"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type BackupCodeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    authMethodId?: SortOrderInput | SortOrder
    type?: SortOrder
    code?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    usedIp?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type BackupCodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BackupCodeWhereInput | BackupCodeWhereInput[]
    OR?: BackupCodeWhereInput[]
    NOT?: BackupCodeWhereInput | BackupCodeWhereInput[]
    userId?: StringFilter<"BackupCode"> | string
    authMethodId?: StringNullableFilter<"BackupCode"> | string | null
    type?: EnumE2FAMethodFilter<"BackupCode"> | $Enums.E2FAMethod
    code?: StringFilter<"BackupCode"> | string
    usedAt?: DateTimeNullableFilter<"BackupCode"> | Date | string | null
    usedIp?: StringNullableFilter<"BackupCode"> | string | null
    expiresAt?: DateTimeNullableFilter<"BackupCode"> | Date | string | null
    createdAt?: DateTimeFilter<"BackupCode"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type BackupCodeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    authMethodId?: SortOrderInput | SortOrder
    type?: SortOrder
    code?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    usedIp?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: BackupCodeCountOrderByAggregateInput
    _max?: BackupCodeMaxOrderByAggregateInput
    _min?: BackupCodeMinOrderByAggregateInput
  }

  export type BackupCodeScalarWhereWithAggregatesInput = {
    AND?: BackupCodeScalarWhereWithAggregatesInput | BackupCodeScalarWhereWithAggregatesInput[]
    OR?: BackupCodeScalarWhereWithAggregatesInput[]
    NOT?: BackupCodeScalarWhereWithAggregatesInput | BackupCodeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BackupCode"> | string
    userId?: StringWithAggregatesFilter<"BackupCode"> | string
    authMethodId?: StringNullableWithAggregatesFilter<"BackupCode"> | string | null
    type?: EnumE2FAMethodWithAggregatesFilter<"BackupCode"> | $Enums.E2FAMethod
    code?: StringWithAggregatesFilter<"BackupCode"> | string
    usedAt?: DateTimeNullableWithAggregatesFilter<"BackupCode"> | Date | string | null
    usedIp?: StringNullableWithAggregatesFilter<"BackupCode"> | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"BackupCode"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BackupCode"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    category?: EnumEAuditCategoryFilter<"AuditLog"> | $Enums.EAuditCategory
    success?: BoolFilter<"AuditLog"> | boolean
    ip?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    country?: StringNullableFilter<"AuditLog"> | string | null
    city?: StringNullableFilter<"AuditLog"> | string | null
    metadata?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    category?: SortOrder
    success?: SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    category?: EnumEAuditCategoryFilter<"AuditLog"> | $Enums.EAuditCategory
    success?: BoolFilter<"AuditLog"> | boolean
    ip?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    country?: StringNullableFilter<"AuditLog"> | string | null
    city?: StringNullableFilter<"AuditLog"> | string | null
    metadata?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    category?: SortOrder
    success?: SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    userId?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    category?: EnumEAuditCategoryWithAggregatesFilter<"AuditLog"> | $Enums.EAuditCategory
    success?: BoolWithAggregatesFilter<"AuditLog"> | boolean
    ip?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    country?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    city?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"AuditLog">
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    tokens?: TokenCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodUncheckedCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeUncheckedCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceUncheckedCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockUncheckedCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    tokens?: TokenUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUncheckedUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUncheckedUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUncheckedUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUncheckedUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthenticationMethodCreateInput = {
    id?: string
    method: $Enums.E2FAMethod
    data: JsonNullValueInput | InputJsonValue
    name?: string | null
    isActive?: boolean
    isPrimary?: boolean
    lastUsedAt?: Date | string | null
    useCount?: number
    credentialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAuthenticationMethodsInput
  }

  export type AuthenticationMethodUncheckedCreateInput = {
    id?: string
    userId: string
    method: $Enums.E2FAMethod
    data: JsonNullValueInput | InputJsonValue
    name?: string | null
    isActive?: boolean
    isPrimary?: boolean
    lastUsedAt?: Date | string | null
    useCount?: number
    credentialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthenticationMethodUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod
    data?: JsonNullValueInput | InputJsonValue
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    credentialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAuthenticationMethodsNestedInput
  }

  export type AuthenticationMethodUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    method?: EnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod
    data?: JsonNullValueInput | InputJsonValue
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    credentialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthenticationMethodCreateManyInput = {
    id?: string
    userId: string
    method: $Enums.E2FAMethod
    data: JsonNullValueInput | InputJsonValue
    name?: string | null
    isActive?: boolean
    isPrimary?: boolean
    lastUsedAt?: Date | string | null
    useCount?: number
    credentialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthenticationMethodUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod
    data?: JsonNullValueInput | InputJsonValue
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    credentialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthenticationMethodUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    method?: EnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod
    data?: JsonNullValueInput | InputJsonValue
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    credentialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustedDeviceCreateInput = {
    id?: string
    deviceId: string
    fingerprint: JsonNullValueInput | InputJsonValue
    name?: string | null
    userAgent: string
    browser?: string | null
    os?: string | null
    device?: string | null
    trustScore?: number
    lastIp?: string | null
    lastCountry?: string | null
    lastCity?: string | null
    isActive?: boolean
    lastSeenAt?: Date | string
    expiresAt?: Date | string | null
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTrustedDevicesInput
  }

  export type TrustedDeviceUncheckedCreateInput = {
    id?: string
    userId: string
    deviceId: string
    fingerprint: JsonNullValueInput | InputJsonValue
    name?: string | null
    userAgent: string
    browser?: string | null
    os?: string | null
    device?: string | null
    trustScore?: number
    lastIp?: string | null
    lastCountry?: string | null
    lastCity?: string | null
    isActive?: boolean
    lastSeenAt?: Date | string
    expiresAt?: Date | string | null
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrustedDeviceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    fingerprint?: JsonNullValueInput | InputJsonValue
    name?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: StringFieldUpdateOperationsInput | string
    browser?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    trustScore?: FloatFieldUpdateOperationsInput | number
    lastIp?: NullableStringFieldUpdateOperationsInput | string | null
    lastCountry?: NullableStringFieldUpdateOperationsInput | string | null
    lastCity?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTrustedDevicesNestedInput
  }

  export type TrustedDeviceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    fingerprint?: JsonNullValueInput | InputJsonValue
    name?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: StringFieldUpdateOperationsInput | string
    browser?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    trustScore?: FloatFieldUpdateOperationsInput | number
    lastIp?: NullableStringFieldUpdateOperationsInput | string | null
    lastCountry?: NullableStringFieldUpdateOperationsInput | string | null
    lastCity?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustedDeviceCreateManyInput = {
    id?: string
    userId: string
    deviceId: string
    fingerprint: JsonNullValueInput | InputJsonValue
    name?: string | null
    userAgent: string
    browser?: string | null
    os?: string | null
    device?: string | null
    trustScore?: number
    lastIp?: string | null
    lastCountry?: string | null
    lastCity?: string | null
    isActive?: boolean
    lastSeenAt?: Date | string
    expiresAt?: Date | string | null
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrustedDeviceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    fingerprint?: JsonNullValueInput | InputJsonValue
    name?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: StringFieldUpdateOperationsInput | string
    browser?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    trustScore?: FloatFieldUpdateOperationsInput | number
    lastIp?: NullableStringFieldUpdateOperationsInput | string | null
    lastCountry?: NullableStringFieldUpdateOperationsInput | string | null
    lastCity?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustedDeviceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    fingerprint?: JsonNullValueInput | InputJsonValue
    name?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: StringFieldUpdateOperationsInput | string
    browser?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    trustScore?: FloatFieldUpdateOperationsInput | number
    lastIp?: NullableStringFieldUpdateOperationsInput | string | null
    lastCountry?: NullableStringFieldUpdateOperationsInput | string | null
    lastCity?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityEventCreateInput = {
    id?: string
    event: $Enums.ESecurityEvent
    severity?: $Enums.ESecuritySeverity
    ip?: string | null
    userAgent?: string | null
    country?: string | null
    city?: string | null
    deviceId?: string | null
    riskScore?: number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    resolved?: boolean
    resolvedAt?: Date | string | null
    resolvedBy?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSecurityEventsInput
  }

  export type SecurityEventUncheckedCreateInput = {
    id?: string
    userId: string
    event: $Enums.ESecurityEvent
    severity?: $Enums.ESecuritySeverity
    ip?: string | null
    userAgent?: string | null
    country?: string | null
    city?: string | null
    deviceId?: string | null
    riskScore?: number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    resolved?: boolean
    resolvedAt?: Date | string | null
    resolvedBy?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SecurityEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: EnumESecurityEventFieldUpdateOperationsInput | $Enums.ESecurityEvent
    severity?: EnumESecuritySeverityFieldUpdateOperationsInput | $Enums.ESecuritySeverity
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    resolved?: BoolFieldUpdateOperationsInput | boolean
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSecurityEventsNestedInput
  }

  export type SecurityEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    event?: EnumESecurityEventFieldUpdateOperationsInput | $Enums.ESecurityEvent
    severity?: EnumESecuritySeverityFieldUpdateOperationsInput | $Enums.ESecuritySeverity
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    resolved?: BoolFieldUpdateOperationsInput | boolean
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityEventCreateManyInput = {
    id?: string
    userId: string
    event: $Enums.ESecurityEvent
    severity?: $Enums.ESecuritySeverity
    ip?: string | null
    userAgent?: string | null
    country?: string | null
    city?: string | null
    deviceId?: string | null
    riskScore?: number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    resolved?: boolean
    resolvedAt?: Date | string | null
    resolvedBy?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SecurityEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: EnumESecurityEventFieldUpdateOperationsInput | $Enums.ESecurityEvent
    severity?: EnumESecuritySeverityFieldUpdateOperationsInput | $Enums.ESecuritySeverity
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    resolved?: BoolFieldUpdateOperationsInput | boolean
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    event?: EnumESecurityEventFieldUpdateOperationsInput | $Enums.ESecurityEvent
    severity?: EnumESecuritySeverityFieldUpdateOperationsInput | $Enums.ESecuritySeverity
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    resolved?: BoolFieldUpdateOperationsInput | boolean
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    token: string
    refreshToken?: string | null
    deviceId?: string | null
    userAgent?: string | null
    ip?: string | null
    country?: string | null
    city?: string | null
    browser?: string | null
    os?: string | null
    device?: string | null
    isTrusted?: boolean
    riskScore?: number | null
    is2FAVerified?: boolean
    verified2FAAt?: Date | string | null
    expiresAt: Date | string
    lastUsedAt?: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    userId: string
    token: string
    refreshToken?: string | null
    deviceId?: string | null
    userAgent?: string | null
    ip?: string | null
    country?: string | null
    city?: string | null
    browser?: string | null
    os?: string | null
    device?: string | null
    isTrusted?: boolean
    riskScore?: number | null
    is2FAVerified?: boolean
    verified2FAAt?: Date | string | null
    expiresAt: Date | string
    lastUsedAt?: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    browser?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    isTrusted?: BoolFieldUpdateOperationsInput | boolean
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    is2FAVerified?: BoolFieldUpdateOperationsInput | boolean
    verified2FAAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    browser?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    isTrusted?: BoolFieldUpdateOperationsInput | boolean
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    is2FAVerified?: BoolFieldUpdateOperationsInput | boolean
    verified2FAAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    userId: string
    token: string
    refreshToken?: string | null
    deviceId?: string | null
    userAgent?: string | null
    ip?: string | null
    country?: string | null
    city?: string | null
    browser?: string | null
    os?: string | null
    device?: string | null
    isTrusted?: boolean
    riskScore?: number | null
    is2FAVerified?: boolean
    verified2FAAt?: Date | string | null
    expiresAt: Date | string
    lastUsedAt?: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    browser?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    isTrusted?: BoolFieldUpdateOperationsInput | boolean
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    is2FAVerified?: BoolFieldUpdateOperationsInput | boolean
    verified2FAAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    browser?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    isTrusted?: BoolFieldUpdateOperationsInput | boolean
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    is2FAVerified?: BoolFieldUpdateOperationsInput | boolean
    verified2FAAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountLockCreateInput = {
    id?: string
    reason: string
    failedAttempts?: number
    lockedAt?: Date | string
    expiresAt?: Date | string | null
    unlockedAt?: Date | string | null
    ip?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutAccountLocksInput
  }

  export type AccountLockUncheckedCreateInput = {
    id?: string
    userId: string
    reason: string
    failedAttempts?: number
    lockedAt?: Date | string
    expiresAt?: Date | string | null
    unlockedAt?: Date | string | null
    ip?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AccountLockUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    failedAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountLocksNestedInput
  }

  export type AccountLockUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    failedAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountLockCreateManyInput = {
    id?: string
    userId: string
    reason: string
    failedAttempts?: number
    lockedAt?: Date | string
    expiresAt?: Date | string | null
    unlockedAt?: Date | string | null
    ip?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AccountLockUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    failedAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountLockUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    failedAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenCreateInput = {
    id?: string
    token: string
    type: $Enums.ETokenType
    expiresIn: Date | string
    usedAt?: Date | string | null
    maxUses?: number
    useCount?: number
    createdIp?: string | null
    usedIp?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutTokensInput
  }

  export type TokenUncheckedCreateInput = {
    id?: string
    token: string
    type: $Enums.ETokenType
    expiresIn: Date | string
    usedAt?: Date | string | null
    maxUses?: number
    useCount?: number
    userId?: string | null
    createdIp?: string | null
    usedIp?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    type?: EnumETokenTypeFieldUpdateOperationsInput | $Enums.ETokenType
    expiresIn?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    maxUses?: IntFieldUpdateOperationsInput | number
    useCount?: IntFieldUpdateOperationsInput | number
    createdIp?: NullableStringFieldUpdateOperationsInput | string | null
    usedIp?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutTokensNestedInput
  }

  export type TokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    type?: EnumETokenTypeFieldUpdateOperationsInput | $Enums.ETokenType
    expiresIn?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    maxUses?: IntFieldUpdateOperationsInput | number
    useCount?: IntFieldUpdateOperationsInput | number
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdIp?: NullableStringFieldUpdateOperationsInput | string | null
    usedIp?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenCreateManyInput = {
    id?: string
    token: string
    type: $Enums.ETokenType
    expiresIn: Date | string
    usedAt?: Date | string | null
    maxUses?: number
    useCount?: number
    userId?: string | null
    createdIp?: string | null
    usedIp?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    type?: EnumETokenTypeFieldUpdateOperationsInput | $Enums.ETokenType
    expiresIn?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    maxUses?: IntFieldUpdateOperationsInput | number
    useCount?: IntFieldUpdateOperationsInput | number
    createdIp?: NullableStringFieldUpdateOperationsInput | string | null
    usedIp?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    type?: EnumETokenTypeFieldUpdateOperationsInput | $Enums.ETokenType
    expiresIn?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    maxUses?: IntFieldUpdateOperationsInput | number
    useCount?: IntFieldUpdateOperationsInput | number
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdIp?: NullableStringFieldUpdateOperationsInput | string | null
    usedIp?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupCodeCreateInput = {
    id?: string
    authMethodId?: string | null
    type?: $Enums.E2FAMethod
    code: string
    usedAt?: Date | string | null
    usedIp?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutBackupCodesInput
  }

  export type BackupCodeUncheckedCreateInput = {
    id?: string
    userId: string
    authMethodId?: string | null
    type?: $Enums.E2FAMethod
    code: string
    usedAt?: Date | string | null
    usedIp?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type BackupCodeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authMethodId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod
    code?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedIp?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBackupCodesNestedInput
  }

  export type BackupCodeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    authMethodId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod
    code?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedIp?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupCodeCreateManyInput = {
    id?: string
    userId: string
    authMethodId?: string | null
    type?: $Enums.E2FAMethod
    code: string
    usedAt?: Date | string | null
    usedIp?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type BackupCodeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    authMethodId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod
    code?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedIp?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupCodeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    authMethodId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod
    code?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedIp?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    action: string
    category?: $Enums.EAuditCategory
    success?: boolean
    ip?: string | null
    userAgent?: string | null
    country?: string | null
    city?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    userId: string
    action: string
    category?: $Enums.EAuditCategory
    success?: boolean
    ip?: string | null
    userAgent?: string | null
    country?: string | null
    city?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    category?: EnumEAuditCategoryFieldUpdateOperationsInput | $Enums.EAuditCategory
    success?: BoolFieldUpdateOperationsInput | boolean
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    category?: EnumEAuditCategoryFieldUpdateOperationsInput | $Enums.EAuditCategory
    success?: BoolFieldUpdateOperationsInput | boolean
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    userId: string
    action: string
    category?: $Enums.EAuditCategory
    success?: boolean
    ip?: string | null
    userAgent?: string | null
    country?: string | null
    city?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    category?: EnumEAuditCategoryFieldUpdateOperationsInput | $Enums.EAuditCategory
    success?: BoolFieldUpdateOperationsInput | boolean
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    category?: EnumEAuditCategoryFieldUpdateOperationsInput | $Enums.EAuditCategory
    success?: BoolFieldUpdateOperationsInput | boolean
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type EnumE2FAMethodNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.E2FAMethod | EnumE2FAMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumE2FAMethodNullableFilter<$PrismaModel> | $Enums.E2FAMethod | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AuthenticationMethodListRelationFilter = {
    every?: AuthenticationMethodWhereInput
    some?: AuthenticationMethodWhereInput
    none?: AuthenticationMethodWhereInput
  }

  export type BackupCodeListRelationFilter = {
    every?: BackupCodeWhereInput
    some?: BackupCodeWhereInput
    none?: BackupCodeWhereInput
  }

  export type TrustedDeviceListRelationFilter = {
    every?: TrustedDeviceWhereInput
    some?: TrustedDeviceWhereInput
    none?: TrustedDeviceWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type TokenListRelationFilter = {
    every?: TokenWhereInput
    some?: TokenWhereInput
    none?: TokenWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type AccountLockListRelationFilter = {
    every?: AccountLockWhereInput
    some?: AccountLockWhereInput
    none?: AccountLockWhereInput
  }

  export type SecurityEventListRelationFilter = {
    every?: SecurityEventWhereInput
    some?: SecurityEventWhereInput
    none?: SecurityEventWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AuthenticationMethodOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BackupCodeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TrustedDeviceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountLockOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SecurityEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    avatar?: SortOrder
    bio?: SortOrder
    password?: SortOrder
    isEmailVerified?: SortOrder
    emailVerifiedAt?: SortOrder
    isUnsubscribed?: SortOrder
    emailBouncedAt?: SortOrder
    isPhoneVerified?: SortOrder
    phoneVerifiedAt?: SortOrder
    phoneBouncedAt?: SortOrder
    is2FAEnabled?: SortOrder
    preferred2FAMethod?: SortOrder
    require2FA?: SortOrder
    lastLoginAt?: SortOrder
    lastLoginIp?: SortOrder
    passwordChangedAt?: SortOrder
    riskScore?: SortOrder
    lastRiskAssessAt?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    riskScore?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    avatar?: SortOrder
    bio?: SortOrder
    password?: SortOrder
    isEmailVerified?: SortOrder
    emailVerifiedAt?: SortOrder
    isUnsubscribed?: SortOrder
    emailBouncedAt?: SortOrder
    isPhoneVerified?: SortOrder
    phoneVerifiedAt?: SortOrder
    phoneBouncedAt?: SortOrder
    is2FAEnabled?: SortOrder
    preferred2FAMethod?: SortOrder
    require2FA?: SortOrder
    lastLoginAt?: SortOrder
    lastLoginIp?: SortOrder
    passwordChangedAt?: SortOrder
    riskScore?: SortOrder
    lastRiskAssessAt?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    avatar?: SortOrder
    bio?: SortOrder
    password?: SortOrder
    isEmailVerified?: SortOrder
    emailVerifiedAt?: SortOrder
    isUnsubscribed?: SortOrder
    emailBouncedAt?: SortOrder
    isPhoneVerified?: SortOrder
    phoneVerifiedAt?: SortOrder
    phoneBouncedAt?: SortOrder
    is2FAEnabled?: SortOrder
    preferred2FAMethod?: SortOrder
    require2FA?: SortOrder
    lastLoginAt?: SortOrder
    lastLoginIp?: SortOrder
    passwordChangedAt?: SortOrder
    riskScore?: SortOrder
    lastRiskAssessAt?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    riskScore?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type EnumE2FAMethodNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.E2FAMethod | EnumE2FAMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumE2FAMethodNullableWithAggregatesFilter<$PrismaModel> | $Enums.E2FAMethod | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumE2FAMethodNullableFilter<$PrismaModel>
    _max?: NestedEnumE2FAMethodNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumE2FAMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.E2FAMethod | EnumE2FAMethodFieldRefInput<$PrismaModel>
    in?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumE2FAMethodFilter<$PrismaModel> | $Enums.E2FAMethod
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AuthenticationMethodUserIdMethodCredentialIdCompoundUniqueInput = {
    userId: string
    method: $Enums.E2FAMethod
    credentialId: string
  }

  export type AuthenticationMethodCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    method?: SortOrder
    data?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    isPrimary?: SortOrder
    lastUsedAt?: SortOrder
    useCount?: SortOrder
    credentialId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthenticationMethodAvgOrderByAggregateInput = {
    useCount?: SortOrder
  }

  export type AuthenticationMethodMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    method?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    isPrimary?: SortOrder
    lastUsedAt?: SortOrder
    useCount?: SortOrder
    credentialId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthenticationMethodMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    method?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    isPrimary?: SortOrder
    lastUsedAt?: SortOrder
    useCount?: SortOrder
    credentialId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthenticationMethodSumOrderByAggregateInput = {
    useCount?: SortOrder
  }

  export type EnumE2FAMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.E2FAMethod | EnumE2FAMethodFieldRefInput<$PrismaModel>
    in?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumE2FAMethodWithAggregatesFilter<$PrismaModel> | $Enums.E2FAMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumE2FAMethodFilter<$PrismaModel>
    _max?: NestedEnumE2FAMethodFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type TrustedDeviceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    deviceId?: SortOrder
    fingerprint?: SortOrder
    name?: SortOrder
    userAgent?: SortOrder
    browser?: SortOrder
    os?: SortOrder
    device?: SortOrder
    trustScore?: SortOrder
    lastIp?: SortOrder
    lastCountry?: SortOrder
    lastCity?: SortOrder
    isActive?: SortOrder
    lastSeenAt?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrustedDeviceAvgOrderByAggregateInput = {
    trustScore?: SortOrder
  }

  export type TrustedDeviceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    deviceId?: SortOrder
    name?: SortOrder
    userAgent?: SortOrder
    browser?: SortOrder
    os?: SortOrder
    device?: SortOrder
    trustScore?: SortOrder
    lastIp?: SortOrder
    lastCountry?: SortOrder
    lastCity?: SortOrder
    isActive?: SortOrder
    lastSeenAt?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrustedDeviceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    deviceId?: SortOrder
    name?: SortOrder
    userAgent?: SortOrder
    browser?: SortOrder
    os?: SortOrder
    device?: SortOrder
    trustScore?: SortOrder
    lastIp?: SortOrder
    lastCountry?: SortOrder
    lastCity?: SortOrder
    isActive?: SortOrder
    lastSeenAt?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrustedDeviceSumOrderByAggregateInput = {
    trustScore?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumESecurityEventFilter<$PrismaModel = never> = {
    equals?: $Enums.ESecurityEvent | EnumESecurityEventFieldRefInput<$PrismaModel>
    in?: $Enums.ESecurityEvent[] | ListEnumESecurityEventFieldRefInput<$PrismaModel>
    notIn?: $Enums.ESecurityEvent[] | ListEnumESecurityEventFieldRefInput<$PrismaModel>
    not?: NestedEnumESecurityEventFilter<$PrismaModel> | $Enums.ESecurityEvent
  }

  export type EnumESecuritySeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.ESecuritySeverity | EnumESecuritySeverityFieldRefInput<$PrismaModel>
    in?: $Enums.ESecuritySeverity[] | ListEnumESecuritySeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.ESecuritySeverity[] | ListEnumESecuritySeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumESecuritySeverityFilter<$PrismaModel> | $Enums.ESecuritySeverity
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SecurityEventCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    event?: SortOrder
    severity?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    country?: SortOrder
    city?: SortOrder
    deviceId?: SortOrder
    riskScore?: SortOrder
    riskFactors?: SortOrder
    resolved?: SortOrder
    resolvedAt?: SortOrder
    resolvedBy?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type SecurityEventAvgOrderByAggregateInput = {
    riskScore?: SortOrder
  }

  export type SecurityEventMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    event?: SortOrder
    severity?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    country?: SortOrder
    city?: SortOrder
    deviceId?: SortOrder
    riskScore?: SortOrder
    resolved?: SortOrder
    resolvedAt?: SortOrder
    resolvedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type SecurityEventMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    event?: SortOrder
    severity?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    country?: SortOrder
    city?: SortOrder
    deviceId?: SortOrder
    riskScore?: SortOrder
    resolved?: SortOrder
    resolvedAt?: SortOrder
    resolvedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type SecurityEventSumOrderByAggregateInput = {
    riskScore?: SortOrder
  }

  export type EnumESecurityEventWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ESecurityEvent | EnumESecurityEventFieldRefInput<$PrismaModel>
    in?: $Enums.ESecurityEvent[] | ListEnumESecurityEventFieldRefInput<$PrismaModel>
    notIn?: $Enums.ESecurityEvent[] | ListEnumESecurityEventFieldRefInput<$PrismaModel>
    not?: NestedEnumESecurityEventWithAggregatesFilter<$PrismaModel> | $Enums.ESecurityEvent
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumESecurityEventFilter<$PrismaModel>
    _max?: NestedEnumESecurityEventFilter<$PrismaModel>
  }

  export type EnumESecuritySeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ESecuritySeverity | EnumESecuritySeverityFieldRefInput<$PrismaModel>
    in?: $Enums.ESecuritySeverity[] | ListEnumESecuritySeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.ESecuritySeverity[] | ListEnumESecuritySeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumESecuritySeverityWithAggregatesFilter<$PrismaModel> | $Enums.ESecuritySeverity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumESecuritySeverityFilter<$PrismaModel>
    _max?: NestedEnumESecuritySeverityFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    refreshToken?: SortOrder
    deviceId?: SortOrder
    userAgent?: SortOrder
    ip?: SortOrder
    country?: SortOrder
    city?: SortOrder
    browser?: SortOrder
    os?: SortOrder
    device?: SortOrder
    isTrusted?: SortOrder
    riskScore?: SortOrder
    is2FAVerified?: SortOrder
    verified2FAAt?: SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionAvgOrderByAggregateInput = {
    riskScore?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    refreshToken?: SortOrder
    deviceId?: SortOrder
    userAgent?: SortOrder
    ip?: SortOrder
    country?: SortOrder
    city?: SortOrder
    browser?: SortOrder
    os?: SortOrder
    device?: SortOrder
    isTrusted?: SortOrder
    riskScore?: SortOrder
    is2FAVerified?: SortOrder
    verified2FAAt?: SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    refreshToken?: SortOrder
    deviceId?: SortOrder
    userAgent?: SortOrder
    ip?: SortOrder
    country?: SortOrder
    city?: SortOrder
    browser?: SortOrder
    os?: SortOrder
    device?: SortOrder
    isTrusted?: SortOrder
    riskScore?: SortOrder
    is2FAVerified?: SortOrder
    verified2FAAt?: SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionSumOrderByAggregateInput = {
    riskScore?: SortOrder
  }

  export type AccountLockCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    reason?: SortOrder
    failedAttempts?: SortOrder
    lockedAt?: SortOrder
    expiresAt?: SortOrder
    unlockedAt?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AccountLockAvgOrderByAggregateInput = {
    failedAttempts?: SortOrder
  }

  export type AccountLockMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    reason?: SortOrder
    failedAttempts?: SortOrder
    lockedAt?: SortOrder
    expiresAt?: SortOrder
    unlockedAt?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AccountLockMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    reason?: SortOrder
    failedAttempts?: SortOrder
    lockedAt?: SortOrder
    expiresAt?: SortOrder
    unlockedAt?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AccountLockSumOrderByAggregateInput = {
    failedAttempts?: SortOrder
  }

  export type EnumETokenTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ETokenType | EnumETokenTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ETokenType[] | ListEnumETokenTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ETokenType[] | ListEnumETokenTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumETokenTypeFilter<$PrismaModel> | $Enums.ETokenType
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type TokenUserIdTypeCompoundUniqueInput = {
    userId: string
    type: $Enums.ETokenType
  }

  export type TokenCountOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    type?: SortOrder
    expiresIn?: SortOrder
    usedAt?: SortOrder
    maxUses?: SortOrder
    useCount?: SortOrder
    userId?: SortOrder
    createdIp?: SortOrder
    usedIp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TokenAvgOrderByAggregateInput = {
    maxUses?: SortOrder
    useCount?: SortOrder
  }

  export type TokenMaxOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    type?: SortOrder
    expiresIn?: SortOrder
    usedAt?: SortOrder
    maxUses?: SortOrder
    useCount?: SortOrder
    userId?: SortOrder
    createdIp?: SortOrder
    usedIp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TokenMinOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    type?: SortOrder
    expiresIn?: SortOrder
    usedAt?: SortOrder
    maxUses?: SortOrder
    useCount?: SortOrder
    userId?: SortOrder
    createdIp?: SortOrder
    usedIp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TokenSumOrderByAggregateInput = {
    maxUses?: SortOrder
    useCount?: SortOrder
  }

  export type EnumETokenTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ETokenType | EnumETokenTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ETokenType[] | ListEnumETokenTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ETokenType[] | ListEnumETokenTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumETokenTypeWithAggregatesFilter<$PrismaModel> | $Enums.ETokenType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumETokenTypeFilter<$PrismaModel>
    _max?: NestedEnumETokenTypeFilter<$PrismaModel>
  }

  export type BackupCodeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    authMethodId?: SortOrder
    type?: SortOrder
    code?: SortOrder
    usedAt?: SortOrder
    usedIp?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type BackupCodeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    authMethodId?: SortOrder
    type?: SortOrder
    code?: SortOrder
    usedAt?: SortOrder
    usedIp?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type BackupCodeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    authMethodId?: SortOrder
    type?: SortOrder
    code?: SortOrder
    usedAt?: SortOrder
    usedIp?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumEAuditCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.EAuditCategory | EnumEAuditCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.EAuditCategory[] | ListEnumEAuditCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.EAuditCategory[] | ListEnumEAuditCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumEAuditCategoryFilter<$PrismaModel> | $Enums.EAuditCategory
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    category?: SortOrder
    success?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    country?: SortOrder
    city?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    category?: SortOrder
    success?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    country?: SortOrder
    city?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    category?: SortOrder
    success?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    country?: SortOrder
    city?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumEAuditCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EAuditCategory | EnumEAuditCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.EAuditCategory[] | ListEnumEAuditCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.EAuditCategory[] | ListEnumEAuditCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumEAuditCategoryWithAggregatesFilter<$PrismaModel> | $Enums.EAuditCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEAuditCategoryFilter<$PrismaModel>
    _max?: NestedEnumEAuditCategoryFilter<$PrismaModel>
  }

  export type AuthenticationMethodCreateNestedManyWithoutUserInput = {
    create?: XOR<AuthenticationMethodCreateWithoutUserInput, AuthenticationMethodUncheckedCreateWithoutUserInput> | AuthenticationMethodCreateWithoutUserInput[] | AuthenticationMethodUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthenticationMethodCreateOrConnectWithoutUserInput | AuthenticationMethodCreateOrConnectWithoutUserInput[]
    createMany?: AuthenticationMethodCreateManyUserInputEnvelope
    connect?: AuthenticationMethodWhereUniqueInput | AuthenticationMethodWhereUniqueInput[]
  }

  export type BackupCodeCreateNestedManyWithoutUserInput = {
    create?: XOR<BackupCodeCreateWithoutUserInput, BackupCodeUncheckedCreateWithoutUserInput> | BackupCodeCreateWithoutUserInput[] | BackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BackupCodeCreateOrConnectWithoutUserInput | BackupCodeCreateOrConnectWithoutUserInput[]
    createMany?: BackupCodeCreateManyUserInputEnvelope
    connect?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
  }

  export type TrustedDeviceCreateNestedManyWithoutUserInput = {
    create?: XOR<TrustedDeviceCreateWithoutUserInput, TrustedDeviceUncheckedCreateWithoutUserInput> | TrustedDeviceCreateWithoutUserInput[] | TrustedDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TrustedDeviceCreateOrConnectWithoutUserInput | TrustedDeviceCreateOrConnectWithoutUserInput[]
    createMany?: TrustedDeviceCreateManyUserInputEnvelope
    connect?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type TokenCreateNestedManyWithoutUserInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput> | TokenCreateWithoutUserInput[] | TokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput | TokenCreateOrConnectWithoutUserInput[]
    createMany?: TokenCreateManyUserInputEnvelope
    connect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountLockCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountLockCreateWithoutUserInput, AccountLockUncheckedCreateWithoutUserInput> | AccountLockCreateWithoutUserInput[] | AccountLockUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountLockCreateOrConnectWithoutUserInput | AccountLockCreateOrConnectWithoutUserInput[]
    createMany?: AccountLockCreateManyUserInputEnvelope
    connect?: AccountLockWhereUniqueInput | AccountLockWhereUniqueInput[]
  }

  export type SecurityEventCreateNestedManyWithoutUserInput = {
    create?: XOR<SecurityEventCreateWithoutUserInput, SecurityEventUncheckedCreateWithoutUserInput> | SecurityEventCreateWithoutUserInput[] | SecurityEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SecurityEventCreateOrConnectWithoutUserInput | SecurityEventCreateOrConnectWithoutUserInput[]
    createMany?: SecurityEventCreateManyUserInputEnvelope
    connect?: SecurityEventWhereUniqueInput | SecurityEventWhereUniqueInput[]
  }

  export type AuthenticationMethodUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuthenticationMethodCreateWithoutUserInput, AuthenticationMethodUncheckedCreateWithoutUserInput> | AuthenticationMethodCreateWithoutUserInput[] | AuthenticationMethodUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthenticationMethodCreateOrConnectWithoutUserInput | AuthenticationMethodCreateOrConnectWithoutUserInput[]
    createMany?: AuthenticationMethodCreateManyUserInputEnvelope
    connect?: AuthenticationMethodWhereUniqueInput | AuthenticationMethodWhereUniqueInput[]
  }

  export type BackupCodeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BackupCodeCreateWithoutUserInput, BackupCodeUncheckedCreateWithoutUserInput> | BackupCodeCreateWithoutUserInput[] | BackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BackupCodeCreateOrConnectWithoutUserInput | BackupCodeCreateOrConnectWithoutUserInput[]
    createMany?: BackupCodeCreateManyUserInputEnvelope
    connect?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
  }

  export type TrustedDeviceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TrustedDeviceCreateWithoutUserInput, TrustedDeviceUncheckedCreateWithoutUserInput> | TrustedDeviceCreateWithoutUserInput[] | TrustedDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TrustedDeviceCreateOrConnectWithoutUserInput | TrustedDeviceCreateOrConnectWithoutUserInput[]
    createMany?: TrustedDeviceCreateManyUserInputEnvelope
    connect?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type TokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput> | TokenCreateWithoutUserInput[] | TokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput | TokenCreateOrConnectWithoutUserInput[]
    createMany?: TokenCreateManyUserInputEnvelope
    connect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountLockUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountLockCreateWithoutUserInput, AccountLockUncheckedCreateWithoutUserInput> | AccountLockCreateWithoutUserInput[] | AccountLockUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountLockCreateOrConnectWithoutUserInput | AccountLockCreateOrConnectWithoutUserInput[]
    createMany?: AccountLockCreateManyUserInputEnvelope
    connect?: AccountLockWhereUniqueInput | AccountLockWhereUniqueInput[]
  }

  export type SecurityEventUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SecurityEventCreateWithoutUserInput, SecurityEventUncheckedCreateWithoutUserInput> | SecurityEventCreateWithoutUserInput[] | SecurityEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SecurityEventCreateOrConnectWithoutUserInput | SecurityEventCreateOrConnectWithoutUserInput[]
    createMany?: SecurityEventCreateManyUserInputEnvelope
    connect?: SecurityEventWhereUniqueInput | SecurityEventWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NullableEnumE2FAMethodFieldUpdateOperationsInput = {
    set?: $Enums.E2FAMethod | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AuthenticationMethodUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuthenticationMethodCreateWithoutUserInput, AuthenticationMethodUncheckedCreateWithoutUserInput> | AuthenticationMethodCreateWithoutUserInput[] | AuthenticationMethodUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthenticationMethodCreateOrConnectWithoutUserInput | AuthenticationMethodCreateOrConnectWithoutUserInput[]
    upsert?: AuthenticationMethodUpsertWithWhereUniqueWithoutUserInput | AuthenticationMethodUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuthenticationMethodCreateManyUserInputEnvelope
    set?: AuthenticationMethodWhereUniqueInput | AuthenticationMethodWhereUniqueInput[]
    disconnect?: AuthenticationMethodWhereUniqueInput | AuthenticationMethodWhereUniqueInput[]
    delete?: AuthenticationMethodWhereUniqueInput | AuthenticationMethodWhereUniqueInput[]
    connect?: AuthenticationMethodWhereUniqueInput | AuthenticationMethodWhereUniqueInput[]
    update?: AuthenticationMethodUpdateWithWhereUniqueWithoutUserInput | AuthenticationMethodUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuthenticationMethodUpdateManyWithWhereWithoutUserInput | AuthenticationMethodUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuthenticationMethodScalarWhereInput | AuthenticationMethodScalarWhereInput[]
  }

  export type BackupCodeUpdateManyWithoutUserNestedInput = {
    create?: XOR<BackupCodeCreateWithoutUserInput, BackupCodeUncheckedCreateWithoutUserInput> | BackupCodeCreateWithoutUserInput[] | BackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BackupCodeCreateOrConnectWithoutUserInput | BackupCodeCreateOrConnectWithoutUserInput[]
    upsert?: BackupCodeUpsertWithWhereUniqueWithoutUserInput | BackupCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BackupCodeCreateManyUserInputEnvelope
    set?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    disconnect?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    delete?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    connect?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    update?: BackupCodeUpdateWithWhereUniqueWithoutUserInput | BackupCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BackupCodeUpdateManyWithWhereWithoutUserInput | BackupCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BackupCodeScalarWhereInput | BackupCodeScalarWhereInput[]
  }

  export type TrustedDeviceUpdateManyWithoutUserNestedInput = {
    create?: XOR<TrustedDeviceCreateWithoutUserInput, TrustedDeviceUncheckedCreateWithoutUserInput> | TrustedDeviceCreateWithoutUserInput[] | TrustedDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TrustedDeviceCreateOrConnectWithoutUserInput | TrustedDeviceCreateOrConnectWithoutUserInput[]
    upsert?: TrustedDeviceUpsertWithWhereUniqueWithoutUserInput | TrustedDeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TrustedDeviceCreateManyUserInputEnvelope
    set?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    disconnect?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    delete?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    connect?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    update?: TrustedDeviceUpdateWithWhereUniqueWithoutUserInput | TrustedDeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TrustedDeviceUpdateManyWithWhereWithoutUserInput | TrustedDeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TrustedDeviceScalarWhereInput | TrustedDeviceScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type TokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput> | TokenCreateWithoutUserInput[] | TokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput | TokenCreateOrConnectWithoutUserInput[]
    upsert?: TokenUpsertWithWhereUniqueWithoutUserInput | TokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TokenCreateManyUserInputEnvelope
    set?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    disconnect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    delete?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    connect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    update?: TokenUpdateWithWhereUniqueWithoutUserInput | TokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TokenUpdateManyWithWhereWithoutUserInput | TokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TokenScalarWhereInput | TokenScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountLockUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountLockCreateWithoutUserInput, AccountLockUncheckedCreateWithoutUserInput> | AccountLockCreateWithoutUserInput[] | AccountLockUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountLockCreateOrConnectWithoutUserInput | AccountLockCreateOrConnectWithoutUserInput[]
    upsert?: AccountLockUpsertWithWhereUniqueWithoutUserInput | AccountLockUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountLockCreateManyUserInputEnvelope
    set?: AccountLockWhereUniqueInput | AccountLockWhereUniqueInput[]
    disconnect?: AccountLockWhereUniqueInput | AccountLockWhereUniqueInput[]
    delete?: AccountLockWhereUniqueInput | AccountLockWhereUniqueInput[]
    connect?: AccountLockWhereUniqueInput | AccountLockWhereUniqueInput[]
    update?: AccountLockUpdateWithWhereUniqueWithoutUserInput | AccountLockUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountLockUpdateManyWithWhereWithoutUserInput | AccountLockUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountLockScalarWhereInput | AccountLockScalarWhereInput[]
  }

  export type SecurityEventUpdateManyWithoutUserNestedInput = {
    create?: XOR<SecurityEventCreateWithoutUserInput, SecurityEventUncheckedCreateWithoutUserInput> | SecurityEventCreateWithoutUserInput[] | SecurityEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SecurityEventCreateOrConnectWithoutUserInput | SecurityEventCreateOrConnectWithoutUserInput[]
    upsert?: SecurityEventUpsertWithWhereUniqueWithoutUserInput | SecurityEventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SecurityEventCreateManyUserInputEnvelope
    set?: SecurityEventWhereUniqueInput | SecurityEventWhereUniqueInput[]
    disconnect?: SecurityEventWhereUniqueInput | SecurityEventWhereUniqueInput[]
    delete?: SecurityEventWhereUniqueInput | SecurityEventWhereUniqueInput[]
    connect?: SecurityEventWhereUniqueInput | SecurityEventWhereUniqueInput[]
    update?: SecurityEventUpdateWithWhereUniqueWithoutUserInput | SecurityEventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SecurityEventUpdateManyWithWhereWithoutUserInput | SecurityEventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SecurityEventScalarWhereInput | SecurityEventScalarWhereInput[]
  }

  export type AuthenticationMethodUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuthenticationMethodCreateWithoutUserInput, AuthenticationMethodUncheckedCreateWithoutUserInput> | AuthenticationMethodCreateWithoutUserInput[] | AuthenticationMethodUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthenticationMethodCreateOrConnectWithoutUserInput | AuthenticationMethodCreateOrConnectWithoutUserInput[]
    upsert?: AuthenticationMethodUpsertWithWhereUniqueWithoutUserInput | AuthenticationMethodUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuthenticationMethodCreateManyUserInputEnvelope
    set?: AuthenticationMethodWhereUniqueInput | AuthenticationMethodWhereUniqueInput[]
    disconnect?: AuthenticationMethodWhereUniqueInput | AuthenticationMethodWhereUniqueInput[]
    delete?: AuthenticationMethodWhereUniqueInput | AuthenticationMethodWhereUniqueInput[]
    connect?: AuthenticationMethodWhereUniqueInput | AuthenticationMethodWhereUniqueInput[]
    update?: AuthenticationMethodUpdateWithWhereUniqueWithoutUserInput | AuthenticationMethodUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuthenticationMethodUpdateManyWithWhereWithoutUserInput | AuthenticationMethodUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuthenticationMethodScalarWhereInput | AuthenticationMethodScalarWhereInput[]
  }

  export type BackupCodeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BackupCodeCreateWithoutUserInput, BackupCodeUncheckedCreateWithoutUserInput> | BackupCodeCreateWithoutUserInput[] | BackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BackupCodeCreateOrConnectWithoutUserInput | BackupCodeCreateOrConnectWithoutUserInput[]
    upsert?: BackupCodeUpsertWithWhereUniqueWithoutUserInput | BackupCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BackupCodeCreateManyUserInputEnvelope
    set?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    disconnect?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    delete?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    connect?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    update?: BackupCodeUpdateWithWhereUniqueWithoutUserInput | BackupCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BackupCodeUpdateManyWithWhereWithoutUserInput | BackupCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BackupCodeScalarWhereInput | BackupCodeScalarWhereInput[]
  }

  export type TrustedDeviceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TrustedDeviceCreateWithoutUserInput, TrustedDeviceUncheckedCreateWithoutUserInput> | TrustedDeviceCreateWithoutUserInput[] | TrustedDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TrustedDeviceCreateOrConnectWithoutUserInput | TrustedDeviceCreateOrConnectWithoutUserInput[]
    upsert?: TrustedDeviceUpsertWithWhereUniqueWithoutUserInput | TrustedDeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TrustedDeviceCreateManyUserInputEnvelope
    set?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    disconnect?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    delete?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    connect?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    update?: TrustedDeviceUpdateWithWhereUniqueWithoutUserInput | TrustedDeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TrustedDeviceUpdateManyWithWhereWithoutUserInput | TrustedDeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TrustedDeviceScalarWhereInput | TrustedDeviceScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type TokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput> | TokenCreateWithoutUserInput[] | TokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput | TokenCreateOrConnectWithoutUserInput[]
    upsert?: TokenUpsertWithWhereUniqueWithoutUserInput | TokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TokenCreateManyUserInputEnvelope
    set?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    disconnect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    delete?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    connect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    update?: TokenUpdateWithWhereUniqueWithoutUserInput | TokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TokenUpdateManyWithWhereWithoutUserInput | TokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TokenScalarWhereInput | TokenScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountLockUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountLockCreateWithoutUserInput, AccountLockUncheckedCreateWithoutUserInput> | AccountLockCreateWithoutUserInput[] | AccountLockUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountLockCreateOrConnectWithoutUserInput | AccountLockCreateOrConnectWithoutUserInput[]
    upsert?: AccountLockUpsertWithWhereUniqueWithoutUserInput | AccountLockUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountLockCreateManyUserInputEnvelope
    set?: AccountLockWhereUniqueInput | AccountLockWhereUniqueInput[]
    disconnect?: AccountLockWhereUniqueInput | AccountLockWhereUniqueInput[]
    delete?: AccountLockWhereUniqueInput | AccountLockWhereUniqueInput[]
    connect?: AccountLockWhereUniqueInput | AccountLockWhereUniqueInput[]
    update?: AccountLockUpdateWithWhereUniqueWithoutUserInput | AccountLockUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountLockUpdateManyWithWhereWithoutUserInput | AccountLockUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountLockScalarWhereInput | AccountLockScalarWhereInput[]
  }

  export type SecurityEventUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SecurityEventCreateWithoutUserInput, SecurityEventUncheckedCreateWithoutUserInput> | SecurityEventCreateWithoutUserInput[] | SecurityEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SecurityEventCreateOrConnectWithoutUserInput | SecurityEventCreateOrConnectWithoutUserInput[]
    upsert?: SecurityEventUpsertWithWhereUniqueWithoutUserInput | SecurityEventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SecurityEventCreateManyUserInputEnvelope
    set?: SecurityEventWhereUniqueInput | SecurityEventWhereUniqueInput[]
    disconnect?: SecurityEventWhereUniqueInput | SecurityEventWhereUniqueInput[]
    delete?: SecurityEventWhereUniqueInput | SecurityEventWhereUniqueInput[]
    connect?: SecurityEventWhereUniqueInput | SecurityEventWhereUniqueInput[]
    update?: SecurityEventUpdateWithWhereUniqueWithoutUserInput | SecurityEventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SecurityEventUpdateManyWithWhereWithoutUserInput | SecurityEventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SecurityEventScalarWhereInput | SecurityEventScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAuthenticationMethodsInput = {
    create?: XOR<UserCreateWithoutAuthenticationMethodsInput, UserUncheckedCreateWithoutAuthenticationMethodsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuthenticationMethodsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumE2FAMethodFieldUpdateOperationsInput = {
    set?: $Enums.E2FAMethod
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAuthenticationMethodsNestedInput = {
    create?: XOR<UserCreateWithoutAuthenticationMethodsInput, UserUncheckedCreateWithoutAuthenticationMethodsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuthenticationMethodsInput
    upsert?: UserUpsertWithoutAuthenticationMethodsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuthenticationMethodsInput, UserUpdateWithoutAuthenticationMethodsInput>, UserUncheckedUpdateWithoutAuthenticationMethodsInput>
  }

  export type UserCreateNestedOneWithoutTrustedDevicesInput = {
    create?: XOR<UserCreateWithoutTrustedDevicesInput, UserUncheckedCreateWithoutTrustedDevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTrustedDevicesInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutTrustedDevicesNestedInput = {
    create?: XOR<UserCreateWithoutTrustedDevicesInput, UserUncheckedCreateWithoutTrustedDevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTrustedDevicesInput
    upsert?: UserUpsertWithoutTrustedDevicesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTrustedDevicesInput, UserUpdateWithoutTrustedDevicesInput>, UserUncheckedUpdateWithoutTrustedDevicesInput>
  }

  export type UserCreateNestedOneWithoutSecurityEventsInput = {
    create?: XOR<UserCreateWithoutSecurityEventsInput, UserUncheckedCreateWithoutSecurityEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSecurityEventsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumESecurityEventFieldUpdateOperationsInput = {
    set?: $Enums.ESecurityEvent
  }

  export type EnumESecuritySeverityFieldUpdateOperationsInput = {
    set?: $Enums.ESecuritySeverity
  }

  export type UserUpdateOneRequiredWithoutSecurityEventsNestedInput = {
    create?: XOR<UserCreateWithoutSecurityEventsInput, UserUncheckedCreateWithoutSecurityEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSecurityEventsInput
    upsert?: UserUpsertWithoutSecurityEventsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSecurityEventsInput, UserUpdateWithoutSecurityEventsInput>, UserUncheckedUpdateWithoutSecurityEventsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutAccountLocksInput = {
    create?: XOR<UserCreateWithoutAccountLocksInput, UserUncheckedCreateWithoutAccountLocksInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountLocksInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAccountLocksNestedInput = {
    create?: XOR<UserCreateWithoutAccountLocksInput, UserUncheckedCreateWithoutAccountLocksInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountLocksInput
    upsert?: UserUpsertWithoutAccountLocksInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountLocksInput, UserUpdateWithoutAccountLocksInput>, UserUncheckedUpdateWithoutAccountLocksInput>
  }

  export type UserCreateNestedOneWithoutTokensInput = {
    create?: XOR<UserCreateWithoutTokensInput, UserUncheckedCreateWithoutTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutTokensInput
    connect?: UserWhereUniqueInput
  }

  export type EnumETokenTypeFieldUpdateOperationsInput = {
    set?: $Enums.ETokenType
  }

  export type UserUpdateOneWithoutTokensNestedInput = {
    create?: XOR<UserCreateWithoutTokensInput, UserUncheckedCreateWithoutTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutTokensInput
    upsert?: UserUpsertWithoutTokensInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTokensInput, UserUpdateWithoutTokensInput>, UserUncheckedUpdateWithoutTokensInput>
  }

  export type UserCreateNestedOneWithoutBackupCodesInput = {
    create?: XOR<UserCreateWithoutBackupCodesInput, UserUncheckedCreateWithoutBackupCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutBackupCodesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutBackupCodesNestedInput = {
    create?: XOR<UserCreateWithoutBackupCodesInput, UserUncheckedCreateWithoutBackupCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutBackupCodesInput
    upsert?: UserUpsertWithoutBackupCodesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBackupCodesInput, UserUpdateWithoutBackupCodesInput>, UserUncheckedUpdateWithoutBackupCodesInput>
  }

  export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumEAuditCategoryFieldUpdateOperationsInput = {
    set?: $Enums.EAuditCategory
  }

  export type UserUpdateOneRequiredWithoutAuditLogsNestedInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    upsert?: UserUpsertWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuditLogsInput, UserUpdateWithoutAuditLogsInput>, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedEnumE2FAMethodNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.E2FAMethod | EnumE2FAMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumE2FAMethodNullableFilter<$PrismaModel> | $Enums.E2FAMethod | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedEnumE2FAMethodNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.E2FAMethod | EnumE2FAMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumE2FAMethodNullableWithAggregatesFilter<$PrismaModel> | $Enums.E2FAMethod | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumE2FAMethodNullableFilter<$PrismaModel>
    _max?: NestedEnumE2FAMethodNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumE2FAMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.E2FAMethod | EnumE2FAMethodFieldRefInput<$PrismaModel>
    in?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumE2FAMethodFilter<$PrismaModel> | $Enums.E2FAMethod
  }

  export type NestedEnumE2FAMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.E2FAMethod | EnumE2FAMethodFieldRefInput<$PrismaModel>
    in?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.E2FAMethod[] | ListEnumE2FAMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumE2FAMethodWithAggregatesFilter<$PrismaModel> | $Enums.E2FAMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumE2FAMethodFilter<$PrismaModel>
    _max?: NestedEnumE2FAMethodFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumESecurityEventFilter<$PrismaModel = never> = {
    equals?: $Enums.ESecurityEvent | EnumESecurityEventFieldRefInput<$PrismaModel>
    in?: $Enums.ESecurityEvent[] | ListEnumESecurityEventFieldRefInput<$PrismaModel>
    notIn?: $Enums.ESecurityEvent[] | ListEnumESecurityEventFieldRefInput<$PrismaModel>
    not?: NestedEnumESecurityEventFilter<$PrismaModel> | $Enums.ESecurityEvent
  }

  export type NestedEnumESecuritySeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.ESecuritySeverity | EnumESecuritySeverityFieldRefInput<$PrismaModel>
    in?: $Enums.ESecuritySeverity[] | ListEnumESecuritySeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.ESecuritySeverity[] | ListEnumESecuritySeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumESecuritySeverityFilter<$PrismaModel> | $Enums.ESecuritySeverity
  }

  export type NestedEnumESecurityEventWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ESecurityEvent | EnumESecurityEventFieldRefInput<$PrismaModel>
    in?: $Enums.ESecurityEvent[] | ListEnumESecurityEventFieldRefInput<$PrismaModel>
    notIn?: $Enums.ESecurityEvent[] | ListEnumESecurityEventFieldRefInput<$PrismaModel>
    not?: NestedEnumESecurityEventWithAggregatesFilter<$PrismaModel> | $Enums.ESecurityEvent
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumESecurityEventFilter<$PrismaModel>
    _max?: NestedEnumESecurityEventFilter<$PrismaModel>
  }

  export type NestedEnumESecuritySeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ESecuritySeverity | EnumESecuritySeverityFieldRefInput<$PrismaModel>
    in?: $Enums.ESecuritySeverity[] | ListEnumESecuritySeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.ESecuritySeverity[] | ListEnumESecuritySeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumESecuritySeverityWithAggregatesFilter<$PrismaModel> | $Enums.ESecuritySeverity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumESecuritySeverityFilter<$PrismaModel>
    _max?: NestedEnumESecuritySeverityFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumETokenTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ETokenType | EnumETokenTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ETokenType[] | ListEnumETokenTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ETokenType[] | ListEnumETokenTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumETokenTypeFilter<$PrismaModel> | $Enums.ETokenType
  }

  export type NestedEnumETokenTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ETokenType | EnumETokenTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ETokenType[] | ListEnumETokenTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ETokenType[] | ListEnumETokenTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumETokenTypeWithAggregatesFilter<$PrismaModel> | $Enums.ETokenType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumETokenTypeFilter<$PrismaModel>
    _max?: NestedEnumETokenTypeFilter<$PrismaModel>
  }

  export type NestedEnumEAuditCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.EAuditCategory | EnumEAuditCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.EAuditCategory[] | ListEnumEAuditCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.EAuditCategory[] | ListEnumEAuditCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumEAuditCategoryFilter<$PrismaModel> | $Enums.EAuditCategory
  }

  export type NestedEnumEAuditCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EAuditCategory | EnumEAuditCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.EAuditCategory[] | ListEnumEAuditCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.EAuditCategory[] | ListEnumEAuditCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumEAuditCategoryWithAggregatesFilter<$PrismaModel> | $Enums.EAuditCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEAuditCategoryFilter<$PrismaModel>
    _max?: NestedEnumEAuditCategoryFilter<$PrismaModel>
  }

  export type AuthenticationMethodCreateWithoutUserInput = {
    id?: string
    method: $Enums.E2FAMethod
    data: JsonNullValueInput | InputJsonValue
    name?: string | null
    isActive?: boolean
    isPrimary?: boolean
    lastUsedAt?: Date | string | null
    useCount?: number
    credentialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthenticationMethodUncheckedCreateWithoutUserInput = {
    id?: string
    method: $Enums.E2FAMethod
    data: JsonNullValueInput | InputJsonValue
    name?: string | null
    isActive?: boolean
    isPrimary?: boolean
    lastUsedAt?: Date | string | null
    useCount?: number
    credentialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthenticationMethodCreateOrConnectWithoutUserInput = {
    where: AuthenticationMethodWhereUniqueInput
    create: XOR<AuthenticationMethodCreateWithoutUserInput, AuthenticationMethodUncheckedCreateWithoutUserInput>
  }

  export type AuthenticationMethodCreateManyUserInputEnvelope = {
    data: AuthenticationMethodCreateManyUserInput | AuthenticationMethodCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BackupCodeCreateWithoutUserInput = {
    id?: string
    authMethodId?: string | null
    type?: $Enums.E2FAMethod
    code: string
    usedAt?: Date | string | null
    usedIp?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type BackupCodeUncheckedCreateWithoutUserInput = {
    id?: string
    authMethodId?: string | null
    type?: $Enums.E2FAMethod
    code: string
    usedAt?: Date | string | null
    usedIp?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type BackupCodeCreateOrConnectWithoutUserInput = {
    where: BackupCodeWhereUniqueInput
    create: XOR<BackupCodeCreateWithoutUserInput, BackupCodeUncheckedCreateWithoutUserInput>
  }

  export type BackupCodeCreateManyUserInputEnvelope = {
    data: BackupCodeCreateManyUserInput | BackupCodeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TrustedDeviceCreateWithoutUserInput = {
    id?: string
    deviceId: string
    fingerprint: JsonNullValueInput | InputJsonValue
    name?: string | null
    userAgent: string
    browser?: string | null
    os?: string | null
    device?: string | null
    trustScore?: number
    lastIp?: string | null
    lastCountry?: string | null
    lastCity?: string | null
    isActive?: boolean
    lastSeenAt?: Date | string
    expiresAt?: Date | string | null
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrustedDeviceUncheckedCreateWithoutUserInput = {
    id?: string
    deviceId: string
    fingerprint: JsonNullValueInput | InputJsonValue
    name?: string | null
    userAgent: string
    browser?: string | null
    os?: string | null
    device?: string | null
    trustScore?: number
    lastIp?: string | null
    lastCountry?: string | null
    lastCity?: string | null
    isActive?: boolean
    lastSeenAt?: Date | string
    expiresAt?: Date | string | null
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrustedDeviceCreateOrConnectWithoutUserInput = {
    where: TrustedDeviceWhereUniqueInput
    create: XOR<TrustedDeviceCreateWithoutUserInput, TrustedDeviceUncheckedCreateWithoutUserInput>
  }

  export type TrustedDeviceCreateManyUserInputEnvelope = {
    data: TrustedDeviceCreateManyUserInput | TrustedDeviceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutUserInput = {
    id?: string
    action: string
    category?: $Enums.EAuditCategory
    success?: boolean
    ip?: string | null
    userAgent?: string | null
    country?: string | null
    city?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: string
    action: string
    category?: $Enums.EAuditCategory
    success?: boolean
    ip?: string | null
    userAgent?: string | null
    country?: string | null
    city?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TokenCreateWithoutUserInput = {
    id?: string
    token: string
    type: $Enums.ETokenType
    expiresIn: Date | string
    usedAt?: Date | string | null
    maxUses?: number
    useCount?: number
    createdIp?: string | null
    usedIp?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    type: $Enums.ETokenType
    expiresIn: Date | string
    usedAt?: Date | string | null
    maxUses?: number
    useCount?: number
    createdIp?: string | null
    usedIp?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenCreateOrConnectWithoutUserInput = {
    where: TokenWhereUniqueInput
    create: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput>
  }

  export type TokenCreateManyUserInputEnvelope = {
    data: TokenCreateManyUserInput | TokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    token: string
    refreshToken?: string | null
    deviceId?: string | null
    userAgent?: string | null
    ip?: string | null
    country?: string | null
    city?: string | null
    browser?: string | null
    os?: string | null
    device?: string | null
    isTrusted?: boolean
    riskScore?: number | null
    is2FAVerified?: boolean
    verified2FAAt?: Date | string | null
    expiresAt: Date | string
    lastUsedAt?: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    refreshToken?: string | null
    deviceId?: string | null
    userAgent?: string | null
    ip?: string | null
    country?: string | null
    city?: string | null
    browser?: string | null
    os?: string | null
    device?: string | null
    isTrusted?: boolean
    riskScore?: number | null
    is2FAVerified?: boolean
    verified2FAAt?: Date | string | null
    expiresAt: Date | string
    lastUsedAt?: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountLockCreateWithoutUserInput = {
    id?: string
    reason: string
    failedAttempts?: number
    lockedAt?: Date | string
    expiresAt?: Date | string | null
    unlockedAt?: Date | string | null
    ip?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AccountLockUncheckedCreateWithoutUserInput = {
    id?: string
    reason: string
    failedAttempts?: number
    lockedAt?: Date | string
    expiresAt?: Date | string | null
    unlockedAt?: Date | string | null
    ip?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AccountLockCreateOrConnectWithoutUserInput = {
    where: AccountLockWhereUniqueInput
    create: XOR<AccountLockCreateWithoutUserInput, AccountLockUncheckedCreateWithoutUserInput>
  }

  export type AccountLockCreateManyUserInputEnvelope = {
    data: AccountLockCreateManyUserInput | AccountLockCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SecurityEventCreateWithoutUserInput = {
    id?: string
    event: $Enums.ESecurityEvent
    severity?: $Enums.ESecuritySeverity
    ip?: string | null
    userAgent?: string | null
    country?: string | null
    city?: string | null
    deviceId?: string | null
    riskScore?: number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    resolved?: boolean
    resolvedAt?: Date | string | null
    resolvedBy?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SecurityEventUncheckedCreateWithoutUserInput = {
    id?: string
    event: $Enums.ESecurityEvent
    severity?: $Enums.ESecuritySeverity
    ip?: string | null
    userAgent?: string | null
    country?: string | null
    city?: string | null
    deviceId?: string | null
    riskScore?: number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    resolved?: boolean
    resolvedAt?: Date | string | null
    resolvedBy?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SecurityEventCreateOrConnectWithoutUserInput = {
    where: SecurityEventWhereUniqueInput
    create: XOR<SecurityEventCreateWithoutUserInput, SecurityEventUncheckedCreateWithoutUserInput>
  }

  export type SecurityEventCreateManyUserInputEnvelope = {
    data: SecurityEventCreateManyUserInput | SecurityEventCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AuthenticationMethodUpsertWithWhereUniqueWithoutUserInput = {
    where: AuthenticationMethodWhereUniqueInput
    update: XOR<AuthenticationMethodUpdateWithoutUserInput, AuthenticationMethodUncheckedUpdateWithoutUserInput>
    create: XOR<AuthenticationMethodCreateWithoutUserInput, AuthenticationMethodUncheckedCreateWithoutUserInput>
  }

  export type AuthenticationMethodUpdateWithWhereUniqueWithoutUserInput = {
    where: AuthenticationMethodWhereUniqueInput
    data: XOR<AuthenticationMethodUpdateWithoutUserInput, AuthenticationMethodUncheckedUpdateWithoutUserInput>
  }

  export type AuthenticationMethodUpdateManyWithWhereWithoutUserInput = {
    where: AuthenticationMethodScalarWhereInput
    data: XOR<AuthenticationMethodUpdateManyMutationInput, AuthenticationMethodUncheckedUpdateManyWithoutUserInput>
  }

  export type AuthenticationMethodScalarWhereInput = {
    AND?: AuthenticationMethodScalarWhereInput | AuthenticationMethodScalarWhereInput[]
    OR?: AuthenticationMethodScalarWhereInput[]
    NOT?: AuthenticationMethodScalarWhereInput | AuthenticationMethodScalarWhereInput[]
    id?: StringFilter<"AuthenticationMethod"> | string
    userId?: StringFilter<"AuthenticationMethod"> | string
    method?: EnumE2FAMethodFilter<"AuthenticationMethod"> | $Enums.E2FAMethod
    data?: JsonFilter<"AuthenticationMethod">
    name?: StringNullableFilter<"AuthenticationMethod"> | string | null
    isActive?: BoolFilter<"AuthenticationMethod"> | boolean
    isPrimary?: BoolFilter<"AuthenticationMethod"> | boolean
    lastUsedAt?: DateTimeNullableFilter<"AuthenticationMethod"> | Date | string | null
    useCount?: IntFilter<"AuthenticationMethod"> | number
    credentialId?: StringNullableFilter<"AuthenticationMethod"> | string | null
    createdAt?: DateTimeFilter<"AuthenticationMethod"> | Date | string
    updatedAt?: DateTimeFilter<"AuthenticationMethod"> | Date | string
  }

  export type BackupCodeUpsertWithWhereUniqueWithoutUserInput = {
    where: BackupCodeWhereUniqueInput
    update: XOR<BackupCodeUpdateWithoutUserInput, BackupCodeUncheckedUpdateWithoutUserInput>
    create: XOR<BackupCodeCreateWithoutUserInput, BackupCodeUncheckedCreateWithoutUserInput>
  }

  export type BackupCodeUpdateWithWhereUniqueWithoutUserInput = {
    where: BackupCodeWhereUniqueInput
    data: XOR<BackupCodeUpdateWithoutUserInput, BackupCodeUncheckedUpdateWithoutUserInput>
  }

  export type BackupCodeUpdateManyWithWhereWithoutUserInput = {
    where: BackupCodeScalarWhereInput
    data: XOR<BackupCodeUpdateManyMutationInput, BackupCodeUncheckedUpdateManyWithoutUserInput>
  }

  export type BackupCodeScalarWhereInput = {
    AND?: BackupCodeScalarWhereInput | BackupCodeScalarWhereInput[]
    OR?: BackupCodeScalarWhereInput[]
    NOT?: BackupCodeScalarWhereInput | BackupCodeScalarWhereInput[]
    id?: StringFilter<"BackupCode"> | string
    userId?: StringFilter<"BackupCode"> | string
    authMethodId?: StringNullableFilter<"BackupCode"> | string | null
    type?: EnumE2FAMethodFilter<"BackupCode"> | $Enums.E2FAMethod
    code?: StringFilter<"BackupCode"> | string
    usedAt?: DateTimeNullableFilter<"BackupCode"> | Date | string | null
    usedIp?: StringNullableFilter<"BackupCode"> | string | null
    expiresAt?: DateTimeNullableFilter<"BackupCode"> | Date | string | null
    createdAt?: DateTimeFilter<"BackupCode"> | Date | string
  }

  export type TrustedDeviceUpsertWithWhereUniqueWithoutUserInput = {
    where: TrustedDeviceWhereUniqueInput
    update: XOR<TrustedDeviceUpdateWithoutUserInput, TrustedDeviceUncheckedUpdateWithoutUserInput>
    create: XOR<TrustedDeviceCreateWithoutUserInput, TrustedDeviceUncheckedCreateWithoutUserInput>
  }

  export type TrustedDeviceUpdateWithWhereUniqueWithoutUserInput = {
    where: TrustedDeviceWhereUniqueInput
    data: XOR<TrustedDeviceUpdateWithoutUserInput, TrustedDeviceUncheckedUpdateWithoutUserInput>
  }

  export type TrustedDeviceUpdateManyWithWhereWithoutUserInput = {
    where: TrustedDeviceScalarWhereInput
    data: XOR<TrustedDeviceUpdateManyMutationInput, TrustedDeviceUncheckedUpdateManyWithoutUserInput>
  }

  export type TrustedDeviceScalarWhereInput = {
    AND?: TrustedDeviceScalarWhereInput | TrustedDeviceScalarWhereInput[]
    OR?: TrustedDeviceScalarWhereInput[]
    NOT?: TrustedDeviceScalarWhereInput | TrustedDeviceScalarWhereInput[]
    id?: StringFilter<"TrustedDevice"> | string
    userId?: StringFilter<"TrustedDevice"> | string
    deviceId?: StringFilter<"TrustedDevice"> | string
    fingerprint?: JsonFilter<"TrustedDevice">
    name?: StringNullableFilter<"TrustedDevice"> | string | null
    userAgent?: StringFilter<"TrustedDevice"> | string
    browser?: StringNullableFilter<"TrustedDevice"> | string | null
    os?: StringNullableFilter<"TrustedDevice"> | string | null
    device?: StringNullableFilter<"TrustedDevice"> | string | null
    trustScore?: FloatFilter<"TrustedDevice"> | number
    lastIp?: StringNullableFilter<"TrustedDevice"> | string | null
    lastCountry?: StringNullableFilter<"TrustedDevice"> | string | null
    lastCity?: StringNullableFilter<"TrustedDevice"> | string | null
    isActive?: BoolFilter<"TrustedDevice"> | boolean
    lastSeenAt?: DateTimeFilter<"TrustedDevice"> | Date | string
    expiresAt?: DateTimeNullableFilter<"TrustedDevice"> | Date | string | null
    revokedAt?: DateTimeNullableFilter<"TrustedDevice"> | Date | string | null
    createdAt?: DateTimeFilter<"TrustedDevice"> | Date | string
    updatedAt?: DateTimeFilter<"TrustedDevice"> | Date | string
  }

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    category?: EnumEAuditCategoryFilter<"AuditLog"> | $Enums.EAuditCategory
    success?: BoolFilter<"AuditLog"> | boolean
    ip?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    country?: StringNullableFilter<"AuditLog"> | string | null
    city?: StringNullableFilter<"AuditLog"> | string | null
    metadata?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type TokenUpsertWithWhereUniqueWithoutUserInput = {
    where: TokenWhereUniqueInput
    update: XOR<TokenUpdateWithoutUserInput, TokenUncheckedUpdateWithoutUserInput>
    create: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput>
  }

  export type TokenUpdateWithWhereUniqueWithoutUserInput = {
    where: TokenWhereUniqueInput
    data: XOR<TokenUpdateWithoutUserInput, TokenUncheckedUpdateWithoutUserInput>
  }

  export type TokenUpdateManyWithWhereWithoutUserInput = {
    where: TokenScalarWhereInput
    data: XOR<TokenUpdateManyMutationInput, TokenUncheckedUpdateManyWithoutUserInput>
  }

  export type TokenScalarWhereInput = {
    AND?: TokenScalarWhereInput | TokenScalarWhereInput[]
    OR?: TokenScalarWhereInput[]
    NOT?: TokenScalarWhereInput | TokenScalarWhereInput[]
    id?: StringFilter<"Token"> | string
    token?: StringFilter<"Token"> | string
    type?: EnumETokenTypeFilter<"Token"> | $Enums.ETokenType
    expiresIn?: DateTimeFilter<"Token"> | Date | string
    usedAt?: DateTimeNullableFilter<"Token"> | Date | string | null
    maxUses?: IntFilter<"Token"> | number
    useCount?: IntFilter<"Token"> | number
    userId?: StringNullableFilter<"Token"> | string | null
    createdIp?: StringNullableFilter<"Token"> | string | null
    usedIp?: StringNullableFilter<"Token"> | string | null
    createdAt?: DateTimeFilter<"Token"> | Date | string
    updatedAt?: DateTimeFilter<"Token"> | Date | string
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    token?: StringFilter<"Session"> | string
    refreshToken?: StringNullableFilter<"Session"> | string | null
    deviceId?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    ip?: StringNullableFilter<"Session"> | string | null
    country?: StringNullableFilter<"Session"> | string | null
    city?: StringNullableFilter<"Session"> | string | null
    browser?: StringNullableFilter<"Session"> | string | null
    os?: StringNullableFilter<"Session"> | string | null
    device?: StringNullableFilter<"Session"> | string | null
    isTrusted?: BoolFilter<"Session"> | boolean
    riskScore?: FloatNullableFilter<"Session"> | number | null
    is2FAVerified?: BoolFilter<"Session"> | boolean
    verified2FAAt?: DateTimeNullableFilter<"Session"> | Date | string | null
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    lastUsedAt?: DateTimeFilter<"Session"> | Date | string
    revokedAt?: DateTimeNullableFilter<"Session"> | Date | string | null
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type AccountLockUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountLockWhereUniqueInput
    update: XOR<AccountLockUpdateWithoutUserInput, AccountLockUncheckedUpdateWithoutUserInput>
    create: XOR<AccountLockCreateWithoutUserInput, AccountLockUncheckedCreateWithoutUserInput>
  }

  export type AccountLockUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountLockWhereUniqueInput
    data: XOR<AccountLockUpdateWithoutUserInput, AccountLockUncheckedUpdateWithoutUserInput>
  }

  export type AccountLockUpdateManyWithWhereWithoutUserInput = {
    where: AccountLockScalarWhereInput
    data: XOR<AccountLockUpdateManyMutationInput, AccountLockUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountLockScalarWhereInput = {
    AND?: AccountLockScalarWhereInput | AccountLockScalarWhereInput[]
    OR?: AccountLockScalarWhereInput[]
    NOT?: AccountLockScalarWhereInput | AccountLockScalarWhereInput[]
    id?: StringFilter<"AccountLock"> | string
    userId?: StringFilter<"AccountLock"> | string
    reason?: StringFilter<"AccountLock"> | string
    failedAttempts?: IntFilter<"AccountLock"> | number
    lockedAt?: DateTimeFilter<"AccountLock"> | Date | string
    expiresAt?: DateTimeNullableFilter<"AccountLock"> | Date | string | null
    unlockedAt?: DateTimeNullableFilter<"AccountLock"> | Date | string | null
    ip?: StringNullableFilter<"AccountLock"> | string | null
    userAgent?: StringNullableFilter<"AccountLock"> | string | null
    createdAt?: DateTimeFilter<"AccountLock"> | Date | string
  }

  export type SecurityEventUpsertWithWhereUniqueWithoutUserInput = {
    where: SecurityEventWhereUniqueInput
    update: XOR<SecurityEventUpdateWithoutUserInput, SecurityEventUncheckedUpdateWithoutUserInput>
    create: XOR<SecurityEventCreateWithoutUserInput, SecurityEventUncheckedCreateWithoutUserInput>
  }

  export type SecurityEventUpdateWithWhereUniqueWithoutUserInput = {
    where: SecurityEventWhereUniqueInput
    data: XOR<SecurityEventUpdateWithoutUserInput, SecurityEventUncheckedUpdateWithoutUserInput>
  }

  export type SecurityEventUpdateManyWithWhereWithoutUserInput = {
    where: SecurityEventScalarWhereInput
    data: XOR<SecurityEventUpdateManyMutationInput, SecurityEventUncheckedUpdateManyWithoutUserInput>
  }

  export type SecurityEventScalarWhereInput = {
    AND?: SecurityEventScalarWhereInput | SecurityEventScalarWhereInput[]
    OR?: SecurityEventScalarWhereInput[]
    NOT?: SecurityEventScalarWhereInput | SecurityEventScalarWhereInput[]
    id?: StringFilter<"SecurityEvent"> | string
    userId?: StringFilter<"SecurityEvent"> | string
    event?: EnumESecurityEventFilter<"SecurityEvent"> | $Enums.ESecurityEvent
    severity?: EnumESecuritySeverityFilter<"SecurityEvent"> | $Enums.ESecuritySeverity
    ip?: StringNullableFilter<"SecurityEvent"> | string | null
    userAgent?: StringNullableFilter<"SecurityEvent"> | string | null
    country?: StringNullableFilter<"SecurityEvent"> | string | null
    city?: StringNullableFilter<"SecurityEvent"> | string | null
    deviceId?: StringNullableFilter<"SecurityEvent"> | string | null
    riskScore?: FloatNullableFilter<"SecurityEvent"> | number | null
    riskFactors?: JsonNullableFilter<"SecurityEvent">
    resolved?: BoolFilter<"SecurityEvent"> | boolean
    resolvedAt?: DateTimeNullableFilter<"SecurityEvent"> | Date | string | null
    resolvedBy?: StringNullableFilter<"SecurityEvent"> | string | null
    metadata?: JsonNullableFilter<"SecurityEvent">
    createdAt?: DateTimeFilter<"SecurityEvent"> | Date | string
  }

  export type UserCreateWithoutAuthenticationMethodsInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    backupCodes?: BackupCodeCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    tokens?: TokenCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAuthenticationMethodsInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    backupCodes?: BackupCodeUncheckedCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceUncheckedCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockUncheckedCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAuthenticationMethodsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuthenticationMethodsInput, UserUncheckedCreateWithoutAuthenticationMethodsInput>
  }

  export type UserUpsertWithoutAuthenticationMethodsInput = {
    update: XOR<UserUpdateWithoutAuthenticationMethodsInput, UserUncheckedUpdateWithoutAuthenticationMethodsInput>
    create: XOR<UserCreateWithoutAuthenticationMethodsInput, UserUncheckedCreateWithoutAuthenticationMethodsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuthenticationMethodsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuthenticationMethodsInput, UserUncheckedUpdateWithoutAuthenticationMethodsInput>
  }

  export type UserUpdateWithoutAuthenticationMethodsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    backupCodes?: BackupCodeUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    tokens?: TokenUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAuthenticationMethodsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    backupCodes?: BackupCodeUncheckedUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUncheckedUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUncheckedUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutTrustedDevicesInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    tokens?: TokenCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTrustedDevicesInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodUncheckedCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeUncheckedCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockUncheckedCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTrustedDevicesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTrustedDevicesInput, UserUncheckedCreateWithoutTrustedDevicesInput>
  }

  export type UserUpsertWithoutTrustedDevicesInput = {
    update: XOR<UserUpdateWithoutTrustedDevicesInput, UserUncheckedUpdateWithoutTrustedDevicesInput>
    create: XOR<UserCreateWithoutTrustedDevicesInput, UserUncheckedCreateWithoutTrustedDevicesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTrustedDevicesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTrustedDevicesInput, UserUncheckedUpdateWithoutTrustedDevicesInput>
  }

  export type UserUpdateWithoutTrustedDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    tokens?: TokenUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTrustedDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUncheckedUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUncheckedUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUncheckedUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSecurityEventsInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    tokens?: TokenCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSecurityEventsInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodUncheckedCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeUncheckedCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceUncheckedCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSecurityEventsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSecurityEventsInput, UserUncheckedCreateWithoutSecurityEventsInput>
  }

  export type UserUpsertWithoutSecurityEventsInput = {
    update: XOR<UserUpdateWithoutSecurityEventsInput, UserUncheckedUpdateWithoutSecurityEventsInput>
    create: XOR<UserCreateWithoutSecurityEventsInput, UserUncheckedCreateWithoutSecurityEventsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSecurityEventsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSecurityEventsInput, UserUncheckedUpdateWithoutSecurityEventsInput>
  }

  export type UserUpdateWithoutSecurityEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    tokens?: TokenUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSecurityEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUncheckedUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUncheckedUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUncheckedUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    tokens?: TokenCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodUncheckedCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeUncheckedCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceUncheckedCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockUncheckedCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    tokens?: TokenUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUncheckedUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUncheckedUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUncheckedUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUncheckedUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAccountLocksInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    tokens?: TokenCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountLocksInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodUncheckedCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeUncheckedCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceUncheckedCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountLocksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountLocksInput, UserUncheckedCreateWithoutAccountLocksInput>
  }

  export type UserUpsertWithoutAccountLocksInput = {
    update: XOR<UserUpdateWithoutAccountLocksInput, UserUncheckedUpdateWithoutAccountLocksInput>
    create: XOR<UserCreateWithoutAccountLocksInput, UserUncheckedCreateWithoutAccountLocksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountLocksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountLocksInput, UserUncheckedUpdateWithoutAccountLocksInput>
  }

  export type UserUpdateWithoutAccountLocksInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    tokens?: TokenUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountLocksInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUncheckedUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUncheckedUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUncheckedUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutTokensInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTokensInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodUncheckedCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeUncheckedCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceUncheckedCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockUncheckedCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTokensInput, UserUncheckedCreateWithoutTokensInput>
  }

  export type UserUpsertWithoutTokensInput = {
    update: XOR<UserUpdateWithoutTokensInput, UserUncheckedUpdateWithoutTokensInput>
    create: XOR<UserCreateWithoutTokensInput, UserUncheckedCreateWithoutTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTokensInput, UserUncheckedUpdateWithoutTokensInput>
  }

  export type UserUpdateWithoutTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUncheckedUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUncheckedUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUncheckedUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUncheckedUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutBackupCodesInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    tokens?: TokenCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBackupCodesInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodUncheckedCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceUncheckedCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockUncheckedCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBackupCodesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBackupCodesInput, UserUncheckedCreateWithoutBackupCodesInput>
  }

  export type UserUpsertWithoutBackupCodesInput = {
    update: XOR<UserUpdateWithoutBackupCodesInput, UserUncheckedUpdateWithoutBackupCodesInput>
    create: XOR<UserCreateWithoutBackupCodesInput, UserUncheckedCreateWithoutBackupCodesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBackupCodesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBackupCodesInput, UserUncheckedUpdateWithoutBackupCodesInput>
  }

  export type UserUpdateWithoutBackupCodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    tokens?: TokenUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBackupCodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUncheckedUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUncheckedUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUncheckedUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAuditLogsInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceCreateNestedManyWithoutUserInput
    tokens?: TokenCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    fullName: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email: string
    avatar?: string | null
    bio?: string | null
    password: string
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    isUnsubscribed?: boolean | null
    emailBouncedAt?: Date | string | null
    isPhoneVerified?: boolean
    phoneVerifiedAt?: Date | string | null
    phoneBouncedAt?: Date | string | null
    is2FAEnabled?: boolean
    preferred2FAMethod?: $Enums.E2FAMethod | null
    require2FA?: boolean
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    passwordChangedAt?: Date | string | null
    riskScore?: number | null
    lastRiskAssessAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authenticationMethods?: AuthenticationMethodUncheckedCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeUncheckedCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceUncheckedCreateNestedManyWithoutUserInput
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accountLocks?: AccountLockUncheckedCreateNestedManyWithoutUserInput
    securityEvents?: SecurityEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
  }

  export type UserUpsertWithoutAuditLogsInput = {
    update: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUpdateManyWithoutUserNestedInput
    tokens?: TokenUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isUnsubscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneBouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is2FAEnabled?: BoolFieldUpdateOperationsInput | boolean
    preferred2FAMethod?: NullableEnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod | null
    require2FA?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    lastRiskAssessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authenticationMethods?: AuthenticationMethodUncheckedUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUncheckedUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUncheckedUpdateManyWithoutUserNestedInput
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accountLocks?: AccountLockUncheckedUpdateManyWithoutUserNestedInput
    securityEvents?: SecurityEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AuthenticationMethodCreateManyUserInput = {
    id?: string
    method: $Enums.E2FAMethod
    data: JsonNullValueInput | InputJsonValue
    name?: string | null
    isActive?: boolean
    isPrimary?: boolean
    lastUsedAt?: Date | string | null
    useCount?: number
    credentialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackupCodeCreateManyUserInput = {
    id?: string
    authMethodId?: string | null
    type?: $Enums.E2FAMethod
    code: string
    usedAt?: Date | string | null
    usedIp?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type TrustedDeviceCreateManyUserInput = {
    id?: string
    deviceId: string
    fingerprint: JsonNullValueInput | InputJsonValue
    name?: string | null
    userAgent: string
    browser?: string | null
    os?: string | null
    device?: string | null
    trustScore?: number
    lastIp?: string | null
    lastCountry?: string | null
    lastCity?: string | null
    isActive?: boolean
    lastSeenAt?: Date | string
    expiresAt?: Date | string | null
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditLogCreateManyUserInput = {
    id?: string
    action: string
    category?: $Enums.EAuditCategory
    success?: boolean
    ip?: string | null
    userAgent?: string | null
    country?: string | null
    city?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type TokenCreateManyUserInput = {
    id?: string
    token: string
    type: $Enums.ETokenType
    expiresIn: Date | string
    usedAt?: Date | string | null
    maxUses?: number
    useCount?: number
    createdIp?: string | null
    usedIp?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateManyUserInput = {
    id?: string
    token: string
    refreshToken?: string | null
    deviceId?: string | null
    userAgent?: string | null
    ip?: string | null
    country?: string | null
    city?: string | null
    browser?: string | null
    os?: string | null
    device?: string | null
    isTrusted?: boolean
    riskScore?: number | null
    is2FAVerified?: boolean
    verified2FAAt?: Date | string | null
    expiresAt: Date | string
    lastUsedAt?: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountLockCreateManyUserInput = {
    id?: string
    reason: string
    failedAttempts?: number
    lockedAt?: Date | string
    expiresAt?: Date | string | null
    unlockedAt?: Date | string | null
    ip?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type SecurityEventCreateManyUserInput = {
    id?: string
    event: $Enums.ESecurityEvent
    severity?: $Enums.ESecuritySeverity
    ip?: string | null
    userAgent?: string | null
    country?: string | null
    city?: string | null
    deviceId?: string | null
    riskScore?: number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    resolved?: boolean
    resolvedAt?: Date | string | null
    resolvedBy?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuthenticationMethodUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod
    data?: JsonNullValueInput | InputJsonValue
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    credentialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthenticationMethodUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod
    data?: JsonNullValueInput | InputJsonValue
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    credentialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthenticationMethodUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod
    data?: JsonNullValueInput | InputJsonValue
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    credentialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupCodeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    authMethodId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod
    code?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedIp?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupCodeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    authMethodId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod
    code?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedIp?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupCodeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    authMethodId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumE2FAMethodFieldUpdateOperationsInput | $Enums.E2FAMethod
    code?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedIp?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustedDeviceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    fingerprint?: JsonNullValueInput | InputJsonValue
    name?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: StringFieldUpdateOperationsInput | string
    browser?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    trustScore?: FloatFieldUpdateOperationsInput | number
    lastIp?: NullableStringFieldUpdateOperationsInput | string | null
    lastCountry?: NullableStringFieldUpdateOperationsInput | string | null
    lastCity?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustedDeviceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    fingerprint?: JsonNullValueInput | InputJsonValue
    name?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: StringFieldUpdateOperationsInput | string
    browser?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    trustScore?: FloatFieldUpdateOperationsInput | number
    lastIp?: NullableStringFieldUpdateOperationsInput | string | null
    lastCountry?: NullableStringFieldUpdateOperationsInput | string | null
    lastCity?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustedDeviceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    fingerprint?: JsonNullValueInput | InputJsonValue
    name?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: StringFieldUpdateOperationsInput | string
    browser?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    trustScore?: FloatFieldUpdateOperationsInput | number
    lastIp?: NullableStringFieldUpdateOperationsInput | string | null
    lastCountry?: NullableStringFieldUpdateOperationsInput | string | null
    lastCity?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    category?: EnumEAuditCategoryFieldUpdateOperationsInput | $Enums.EAuditCategory
    success?: BoolFieldUpdateOperationsInput | boolean
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    category?: EnumEAuditCategoryFieldUpdateOperationsInput | $Enums.EAuditCategory
    success?: BoolFieldUpdateOperationsInput | boolean
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    category?: EnumEAuditCategoryFieldUpdateOperationsInput | $Enums.EAuditCategory
    success?: BoolFieldUpdateOperationsInput | boolean
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    type?: EnumETokenTypeFieldUpdateOperationsInput | $Enums.ETokenType
    expiresIn?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    maxUses?: IntFieldUpdateOperationsInput | number
    useCount?: IntFieldUpdateOperationsInput | number
    createdIp?: NullableStringFieldUpdateOperationsInput | string | null
    usedIp?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    type?: EnumETokenTypeFieldUpdateOperationsInput | $Enums.ETokenType
    expiresIn?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    maxUses?: IntFieldUpdateOperationsInput | number
    useCount?: IntFieldUpdateOperationsInput | number
    createdIp?: NullableStringFieldUpdateOperationsInput | string | null
    usedIp?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    type?: EnumETokenTypeFieldUpdateOperationsInput | $Enums.ETokenType
    expiresIn?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    maxUses?: IntFieldUpdateOperationsInput | number
    useCount?: IntFieldUpdateOperationsInput | number
    createdIp?: NullableStringFieldUpdateOperationsInput | string | null
    usedIp?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    browser?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    isTrusted?: BoolFieldUpdateOperationsInput | boolean
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    is2FAVerified?: BoolFieldUpdateOperationsInput | boolean
    verified2FAAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    browser?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    isTrusted?: BoolFieldUpdateOperationsInput | boolean
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    is2FAVerified?: BoolFieldUpdateOperationsInput | boolean
    verified2FAAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    browser?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    isTrusted?: BoolFieldUpdateOperationsInput | boolean
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    is2FAVerified?: BoolFieldUpdateOperationsInput | boolean
    verified2FAAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountLockUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    failedAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountLockUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    failedAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountLockUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    failedAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    unlockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityEventUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: EnumESecurityEventFieldUpdateOperationsInput | $Enums.ESecurityEvent
    severity?: EnumESecuritySeverityFieldUpdateOperationsInput | $Enums.ESecuritySeverity
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    resolved?: BoolFieldUpdateOperationsInput | boolean
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityEventUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: EnumESecurityEventFieldUpdateOperationsInput | $Enums.ESecurityEvent
    severity?: EnumESecuritySeverityFieldUpdateOperationsInput | $Enums.ESecuritySeverity
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    resolved?: BoolFieldUpdateOperationsInput | boolean
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityEventUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: EnumESecurityEventFieldUpdateOperationsInput | $Enums.ESecurityEvent
    severity?: EnumESecuritySeverityFieldUpdateOperationsInput | $Enums.ESecuritySeverity
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    resolved?: BoolFieldUpdateOperationsInput | boolean
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}