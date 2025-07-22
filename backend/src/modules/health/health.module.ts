import { PrismaService } from '@/core'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { HealthController } from './health.controller'

// Добавлен импорт

@Module({
	imports: [TerminusModule],
	controllers: [HealthController],
	providers: [PrismaService], // Добавлен провайдер
})
export class HealthModule {}
