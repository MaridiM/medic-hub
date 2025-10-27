import { CLIENT_URL, COMPANY_NAME } from '@/core/config'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class UrlService {
	private readonly logger = new Logger(UrlService.name)
	private readonly baseUrl: string

	constructor() {
		// Validate CLIENT_URL at startup
		if (!CLIENT_URL) {
			this.logger.error(
				'CLIENT_URL is not defined. Please set CLIENT_URL to a full origin URL, e.g. http://localhost:3000',
			)
			throw new Error('Invalid CLIENT_URL: missing value')
		}

		try {
			// This will throw if CLIENT_URL is not a valid absolute URL
			// (e.g. just "localhost:3000" without http://)
			// We only keep the origin part to avoid accidental paths.
			const parsed = new URL(CLIENT_URL)
			this.baseUrl = parsed.origin
		} catch (err) {
			this.logger.error(
				`CLIENT_URL is invalid ("${CLIENT_URL}"). It must include protocol, e.g. http://localhost:3000`,
			)
			throw err
		}
	}

	/**
	 * Builds a full client-side URL.
	 * @param path - The path segment (e.g. '/auth/login').
	 * @param query - Optional query parameters.
	 * @returns Fully-qualified URL string.
	 */
	build(path: string, query?: Record<string, string>): string {
		// new URL(relativePath, absoluteBase)
		const url = new URL(path, this.baseUrl)

		if (query) {
			for (const [key, value] of Object.entries(query)) {
				url.searchParams.append(key, value)
			}
		}

		return url.toString()
	}

	// === Authentication URLs ===
	getVerifyUrl(token: string): string {
		return this.build('/auth/verify', { token })
	}

	getResetPasswordUrl(token: string): string {
		return this.build(`/auth/recovery/${token}`)
	}

	getRecoveryPasswordUrl(): string {
		return this.build('/auth/recovery')
	}

	// === Security & Settings URLs ===
	getSecuritySettingsUrl(): string {
		return this.build('/settings/security')
	}

	getSecurityActivityUrl(): string {
		return this.build('/settings/security/activity')
	}

	getSecurityDevicesUrl(): string {
		return this.build('/settings/security/devices')
	}

	getEnable2faUrl(): string {
		return this.build('/settings/security/2fa')
	}

	getBackupCodesUrl(): string {
		return this.build('/settings/security/backup-codes')
	}

	// === Emergency/Action URLs ===
	getLockAccountUrl(): string {
		return this.build('/security/lock-account')
	}

	// === General URLs ===
	getSupportUrl(): string {
		return this.build('/support')
	}
}
