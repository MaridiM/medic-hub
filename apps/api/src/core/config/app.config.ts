import * as dotenv from 'dotenv'

import { CronExpression } from '@nestjs/schedule'

dotenv.config()

export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
export const COMPANY_NAME = process.env.COMPANY_NAME || 'MedicHub Inc.'
export const APP_NAME = process.env.APP_NAME || 'DoctorLab'
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'maridim.dev@gmail.com'

// RATE LIMITING
export const RATE_LIMIT_LOGIN_POINTS = +process.env.RATE_LIMIT_LOGIN_POINTS || 5
export const RATE_LIMIT_LOGIN_WINDOW_MS = +process.env.RATE_LIMIT_LOGIN_WINDOW_MS || 900 // 15 minutes

export const RATE_LIMIT_RESET_PASSWORD_POINTS = +process.env.RATE_LIMIT_RESET_PASSWORD_POINTS || 3
export const RATE_LIMIT_RESET_PASSWORD_WINDOW_MS = +process.env.RATE_LIMIT_RESET_PASSWORD_WINDOW_MS || 3600 // 3 hours

export const RATE_LIMIT_NEW_PASSWORD_POINTS = +process.env.RATE_LIMIT_NEW_PASSWORD_POINTS || 5
export const RATE_LIMIT_NEW_PASSWORD_WINDOW_MS = +process.env.RATE_LIMIT_NEW_PASSWORD_WINDOW_MS || 900 // 15 minutes

export const RATE_LIMIT_2FA_POINTS = +process.env.RATE_LIMIT_2FA_POINTS || 5
export const RATE_LIMIT_2FA_WINDOW_MS = +process.env.RATE_LIMIT_2FA_WINDOW_MS || 300 // 5 minutes

export const RATE_LIMIT_CHANGE_PASSWORD_POINTS = +process.env.RATE_LIMIT_CHANGE_PASSWORD_POINTS || 5
export const RATE_LIMIT_CHANGE_PASSWORD_WINDOW_MS = +process.env.RATE_LIMIT_CHANGE_PASSWORD_WINDOW_MS || 3600 // 3 hours

export const RATE_LIMIT_VERIFICATION_EMAIL_POINTS = +process.env.RATE_LIMIT_VERIFICATION_EMAIL_POINTS || 5
export const RATE_LIMIT_VERIFICATION_EMAIL_WINDOW_MS = +process.env.RATE_LIMIT_VERIFICATION_EMAIL_WINDOW_MS || 3600 // 3 hours

// CRON JOB SCHEDULES
export const CRON_CLEANUP_BACKUP_CODES =
	process.env.CRON_CLEANUP_BACKUP_CODES || CronExpression.EVERY_DAY_AT_2AM || '0 2 * * *' // Runs daily at 2:00 AM
export const CRON_CLEANUP_DEVICES = process.env.CRON_CLEANUP_DEVICES || CronExpression.EVERY_DAY_AT_6AM || '0 6 * * *' // Runs daily at 3:00 AM (or 6:00 AM as shown in logs)
export const CRON_CLEANUP_EVENTS = process.env.CRON_CLEANUP_EVENTS || CronExpression.EVERY_WEEK || '0 0 * * 0' // Runs weekly on Sunday at 0:00 AM
export const CRON_ENFORCE_DEVICE_LIMITS =
	process.env.CRON_ENFORCE_DEVICE_LIMITS || CronExpression.EVERY_6_HOURS || '0 */3 * * *' // Runs every 6 hours (adjusted to match logs at 9:00)
