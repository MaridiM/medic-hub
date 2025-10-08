import { HashUtil } from '@/shared/utils'
import { BadRequestException, Logger } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/__generated__'

const prisma = new PrismaClient({
	transactionOptions: {
		maxWait: 5000,
		timeout: 15000,
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
	},
})

async function main() {
	try {
		Logger.log('☑️ Seeding database...')

		await prisma.$transaction([prisma.user.deleteMany()])

		// Создание тестового пользователя
		const hashedPassword = await HashUtil.hash('12345678')

		const user = await prisma.user.upsert({
			where: { email: 'maridim.dev@gmail.com' },
			update: {},
			create: {
				email: 'maridim.dev@gmail.com',
				fullName: 'maridiM',
				firstName: 'Test',
				lastName: 'User',
				password: hashedPassword,
				isEmailVerified: true,
			},
		})

		console.log('✅ Created test user:', user.email)
		console.log('📧 Email: maridim.dev@gmail.com')
		console.log('🔑 Password: 12345678')
	} catch (error) {
		Logger.error(error)
		throw new BadRequestException('❌ Ошибка при заполнении базы данных')
	} finally {
		Logger.log('☑️ Закрытие соединения с базой данных...')
		await prisma.$disconnect()
		Logger.log('☑️ Соединение с базой данных успешно закрыто')
	}
}

main().catch(e => {
	console.error('❌ Seed failed:', e)
	process.exit(1)
})
