export const PATHS = {
	VERIFY_EMAIL: (domain: string, token: string) => `${domain}/auth/verify?token=${token}`,
	RECOVERY_PASSWORD: (domain: string) => `${domain}/auth/recovery`,
	RESET_PASSWORD: (domain: string, token: string) => `${domain}/auth/recovery/${token}`,
}
