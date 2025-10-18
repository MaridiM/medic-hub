import { HashUtil } from '@/shared/utils'
import { BadRequestException, Logger } from '@nestjs/common'
import { EUserRole, Prisma, PrismaClient } from '@prisma/__generated__'

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

		// Clear existing data for a clean seed
		await prisma.$transaction([prisma.user.deleteMany()])
		Logger.log('🧹 Cleaned existing users')

		// Hash passwords
		const superAdminPassword = await HashUtil.hash('SuperAdmin123!')
		const regularUserPassword = await HashUtil.hash('12345678')

		// Create Super Admin
		const superAdmin = await prisma.user.upsert({
			where: { email: 'maridim.dev@gmail.com' },
			update: {
				roles: [EUserRole.USER, EUserRole.SUPER_ADMIN],
				password: superAdminPassword,
			},
			create: {
				email: 'maridim.dev@gmail.com',
				fullName: 'Super Admin',
				firstName: 'Admin',
				lastName: 'Super',
				password: superAdminPassword,
				isEmailVerified: true,
				roles: [EUserRole.USER, EUserRole.SUPER_ADMIN],
			},
		})

		Logger.log(`✅ Created Super Admin: ${superAdmin.email}`)

		// Create Regular User for testing
		const regularUser = await prisma.user.upsert({
			where: { email: 'user@example.com' },
			update: {
				roles: [EUserRole.USER],
			},
			create: {
				email: 'user@example.com',
				fullName: 'John Doe',
				firstName: 'John',
				lastName: 'Doe',
				password: regularUserPassword,
				isEmailVerified: true,
				roles: [EUserRole.USER],
			},
		})

		Logger.log(`✅ Created Regular User: ${regularUser.email}`)

		// Display credentials
		Logger.log('\n========== Login Credentials ==========')
		Logger.log('👤 Super Admin:')
		Logger.log('   📧 Email: maridim.dev@gmail.com')
		Logger.log('   🔑 Password: SuperAdmin123!')
		Logger.log('   👑 Roles: USER, SUPER_ADMIN')
		Logger.log('')
		Logger.log('👤 Regular User:')
		Logger.log('   📧 Email: user@example.com')
		Logger.log('   🔑 Password: 12345678')
		Logger.log('   👤 Roles: USER')
		Logger.log('=======================================\n')
	} catch (error) {
		Logger.error(error)
		throw new BadRequestException('❌ Error seeding database')
	} finally {
		Logger.log('☑️ Closing database connection...')
		await prisma.$disconnect()
		Logger.log('☑️ Database connection closed successfully')
	}
}

main().catch(e => {
	console.error('❌ Seed failed:', e)
	process.exit(1)
})
