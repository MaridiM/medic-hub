import { Test, TestingModule } from '@nestjs/testing'

import { UrlService } from '../url.service'

// Мокаем константу, чтобы тесты не зависели от реального .env файла
jest.mock('@/core/config', () => ({
	CLIENT_URL: 'http://localhost:3000',
}))

describe('UrlService', () => {
	let service: UrlService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UrlService],
		}).compile()

		service = module.get<UrlService>(UrlService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('build', () => {
		it('should build a simple URL correctly', () => {
			const path = '/home'
			const expectedUrl = 'http://localhost:3000/home'
			expect(service.build(path)).toBe(expectedUrl)
		})

		it('should handle paths with a leading slash', () => {
			const path = '/about'
			const expectedUrl = 'http://localhost:3000/about'
			expect(service.build(path)).toBe(expectedUrl)
		})

		it('should build a URL with query parameters', () => {
			const path = '/search'
			const query = { q: 'nestjs', page: '1' }
			const expectedUrl = 'http://localhost:3000/search?q=nestjs&page=1'
			expect(service.build(path, query)).toBe(expectedUrl)
		})

		it('should correctly encode special characters in query parameters', () => {
			const path = '/api/data'
			const query = { filter: 'a&b=c d' }
			const expectedUrl = 'http://localhost:3000/api/data?filter=a%26b%3Dc+d'
			expect(service.build(path, query)).toBe(expectedUrl)
		})
	})

	describe('Specific URL Builders', () => {
		it('getVerifyUrl should create the correct verification URL', () => {
			const token = 'test-token-123'
			const expectedUrl = 'http://localhost:3000/auth/verify?token=test-token-123'
			expect(service.getVerifyUrl(token)).toBe(expectedUrl)
		})

		it('getResetPasswordUrl should create the correct reset password URL', () => {
			const token = 'reset-token-456'
			const expectedUrl = 'http://localhost:3000/auth/recovery/reset-token-456'
			expect(service.getResetPasswordUrl(token)).toBe(expectedUrl)
		})

		it('getSecuritySettingsUrl should return the correct URL', () => {
			const expectedUrl = 'http://localhost:3000/settings/security'
			expect(service.getSecuritySettingsUrl()).toBe(expectedUrl)
		})

		it('getSecurityActivityUrl should return the correct URL', () => {
			const expectedUrl = 'http://localhost:3000/settings/security/activity'
			expect(service.getSecurityActivityUrl()).toBe(expectedUrl)
		})

		it('getSecurityDevicesUrl should return the correct URL', () => {
			const expectedUrl = 'http://localhost:3000/settings/security/devices'
			expect(service.getSecurityDevicesUrl()).toBe(expectedUrl)
		})

		it('getEnable2faUrl should return the correct URL', () => {
			const expectedUrl = 'http://localhost:3000/settings/security/2fa'
			expect(service.getEnable2faUrl()).toBe(expectedUrl)
		})

		it('getBackupCodesUrl should return the correct URL', () => {
			const expectedUrl = 'http://localhost:3000/settings/security/backup-codes'
			expect(service.getBackupCodesUrl()).toBe(expectedUrl)
		})

		it('getLockAccountUrl should return the correct URL', () => {
			const expectedUrl = 'http://localhost:3000/security/lock-account'
			expect(service.getLockAccountUrl()).toBe(expectedUrl)
		})

		it('getSupportUrl should return the correct URL', () => {
			const expectedUrl = 'http://localhost:3000/support'
			expect(service.getSupportUrl()).toBe(expectedUrl)
		})
	})
})
