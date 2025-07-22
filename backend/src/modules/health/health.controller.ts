import { PrismaService } from '@/core'
import { Controller, Get } from '@nestjs/common'
import {
	HealthCheck,
	HealthCheckService,
	TypeOrmHealthIndicator, // Добавлен импорт
} from '@nestjs/terminus'

@Controller('api/health')
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private prisma: PrismaService,
		private db: TypeOrmHealthIndicator, // Добавлен health indicator
	) {}

	@Get()
	@HealthCheck()
	async check() {
		return this.health.check([	
			() => this.db.pingCheck('database', { timeout: 3000 }),
			async () => {
				try {
					await this.prisma.$queryRaw`SELECT 1`
					return { prisma: { status: 'up' } }
				} catch (error) {
					return { prisma: { status: 'down' } }
				}
			},
		])
	}
}
