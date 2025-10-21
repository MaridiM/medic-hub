export const CLIENT_URL = String(process.env.CLIENT_URL) || 'http://localhost:3000'
export const COMPANY_NAME = String(process.env.COMPANY_NAME) || 'MedicHub Inc.'
export const APP_NAME = String(process.env.APP_NAME) || 'DoctorLab'
export const SUPPORT_EMAIL = String(process.env.SUPPORT_EMAIL) || 'maridim.dev@gmail.com'

// RATE LIMITING
export const RATE_LIMIT_LOGIN_POINTS = Number(process.env.RATE_LIMIT_LOGIN_POINTS) || 5
export const RATE_LIMIT_LOGIN_WINDOW_MS = Number(process.env.RATE_LIMIT_LOGIN_WINDOW_MS) || 900 // 15 minutes

export const RATE_LIMIT_RESET_PASSWORD_POINTS = Number(process.env.RATE_LIMIT_RESET_PASSWORD_POINTS) || 3
export const RATE_LIMIT_RESET_PASSWORD_WINDOW_MS = Number(process.env.RATE_LIMIT_RESET_PASSWORD_WINDOW_MS) || 3600 // 3 hours

export const RATE_LIMIT_NEW_PASSWORD_POINTS = Number(process.env.RATE_LIMIT_NEW_PASSWORD_POINTS) || 5
export const RATE_LIMIT_NEW_PASSWORD_WINDOW_MS = Number(process.env.RATE_LIMIT_NEW_PASSWORD_WINDOW_MS) || 900 // 15 minutes

export const RATE_LIMIT_2FA_POINTS = Number(process.env.RATE_LIMIT_2FA_POINTS) || 5
export const RATE_LIMIT_2FA_WINDOW_MS = Number(process.env.RATE_LIMIT_2FA_WINDOW_MS) || 300 // 5 minutes

export const RATE_LIMIT_CHANGE_PASSWORD_POINTS = Number(process.env.RATE_LIMIT_CHANGE_PASSWORD_POINTS) || 5
export const RATE_LIMIT_CHANGE_PASSWORD_WINDOW_MS = Number(process.env.RATE_LIMIT_CHANGE_PASSWORD_WINDOW_MS) || 3600 // 3 hours

export const RATE_LIMIT_VERIFICATION_EMAIL_POINTS = Number(process.env.RATE_LIMIT_VERIFICATION_EMAIL_POINTS) || 5
export const RATE_LIMIT_VERIFICATION_EMAIL_WINDOW_MS =
	Number(process.env.RATE_LIMIT_VERIFICATION_EMAIL_WINDOW_MS) || 3600 // 3 hours
