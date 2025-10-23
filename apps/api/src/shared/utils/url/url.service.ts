import { CLIENT_URL } from '@/core/config'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UrlService {
	private readonly baseUrl = CLIENT_URL

	/**
	 * Builds a full client-side URL.
	 * @param path - The path segment (e.g., '/auth/login').
	 * @param query - Optional query parameters.
	 * @returns The full URL.
	 */
	build(path: string, query?: Record<string, string>): string {
		const url = new URL(path, this.baseUrl)
		if (query) {
			Object.entries(query).forEach(([key, value]) => {
				url.searchParams.append(key, value)
			})
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
