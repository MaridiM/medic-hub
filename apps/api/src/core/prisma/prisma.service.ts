import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/__generated__'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	// Connect with db
	async onModuleInit(): Promise<void> {
		await this.$connect()
	}
	// Disconnect with db
	async onModuleDestroy(): Promise<void> {
		await this.$disconnect()
	}
}
