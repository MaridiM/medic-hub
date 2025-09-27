export const PATHS = {
	VERIFY_EMAIL: (domain: string, token: string) => `${domain}/auth/verify?token=${token}`,
}
