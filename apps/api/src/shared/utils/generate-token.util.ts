import { v4 as uuidv4 } from 'uuid'

import { PrismaService } from '@/core'
import { ETokenType, type User } from '@prisma/__generated__'

/**
 * Function for generation uuid or numeric code
 * @param prismaService - prisma service
 * @param user - current user
 * @param type - token type
 * @param isUUID - if true then generate uuid if false (default) generate numeric code from 6 letters
 * @returns return new token
 */
export async function generateToken(
	prismaService: PrismaService,
	user: User,
	type: ETokenType,
	isUUID: boolean = true,
) {
	let token: string

	if (isUUID) {
		token = uuidv4()
	} else {
		token = Math.floor(Math.random() * (1000000 - 100000) + 100000).toString()
	}

	const expiresIn = new Date(new Date().getTime() + 300000) // 5 min

	const existingToken = await prismaService.token.findFirst({
		where: {
			type,
			user: { id: user.id },
		},
	})

	if (existingToken) {
		await prismaService.token.delete({ where: { id: existingToken.id } })
	}

	const newToken = await prismaService.token.create({
		data: {
			token,
			expiresIn,
			type,
			user: {
				connect: { id: user.id },
			},
		},
		// include: {
		// 	user: {
		// 		include: { notificationSettings: true },
		// 	},
		// },
	})

	return newToken
}
