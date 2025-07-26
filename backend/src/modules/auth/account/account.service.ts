import { PrismaService } from '@/core'
import { Injectable } from '@nestjs/common'

import { CreateAccountInput } from './dtos'
import { User } from './models'

@Injectable()
export class AccountService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: CreateAccountInput): Promise<User> {
		return this.prisma.user.create({ data })
	}

	async findOne(id: string): Promise<User> {
		return this.prisma.user.findUnique({ where: { id } })
	}

	async findAll(): Promise<User[]> {
		return this.prisma.user.findMany()
	}
}
