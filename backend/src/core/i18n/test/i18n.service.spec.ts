// Импортируем мок i18n и тестируемый сервис
import { i18n } from '@/core/config/i18n.config'
import { I18nService } from '@/core/i18n'

// 🧪 Мокаем модуль i18n.config — подменяем реальный i18n объект на фиктивный с функцией t
jest.mock('@/core/config/i18n.config', () => ({
	i18n: {
		t: jest.fn(),         // мок функции перевода
		language: 'en',       // дефолтный язык
	},
}))

describe('I18nService', () => {
	let service: I18nService

	// 🔁 Перед каждым тестом создаём новый экземпляр сервиса
	beforeEach(() => {
		service = new I18nService()
	})

	it('should return translated value from i18n.t', () => {
		// ✅ Проверяем, что метод `t()` возвращает значение от мокнутой i18n.t
		jest.mocked(i18n.t).mockReturnValue('Translated text')

		const result = service.t('any.key', { lng: 'en' })

		expect(result).toBe('Translated text')
	})

	it('should return current language from i18n.language', () => {
		// ✅ Проверка метода getLanguage() без параметров — должен вернуть язык из i18n
		const lang = service.getLanguage()
		expect(lang).toBe('en')
	})

	it('should return language from req.language if provided', () => {
		// ✅ Проверка метода getLanguage() с объектом запроса, содержащим язык
		const lang = service.getLanguage({ req: { language: 'ru' } })
		expect(lang).toBe('ru')
	})

	it('should fallback to i18n.language if req.language not set', () => {
		// ✅ Проверка метода getLanguage() с пустым req — должен вернуть fallback
		const lang = service.getLanguage({ req: {} })
		expect(lang).toBe('en')
	})

	it('static t should return translated text', () => {
		// ✅ Проверка статического метода класса I18nService.t()
		jest.mocked(i18n.t).mockReturnValue('Static text')

		const result = I18nService.t('some.key')

		expect(result).toBe('Static text')
	})
})
