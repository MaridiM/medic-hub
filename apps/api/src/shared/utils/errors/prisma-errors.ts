import { Prisma } from '@prisma/__generated__'

export function isPrismaError(e: unknown, code?: string): e is Prisma.PrismaClientKnownRequestError {
	const err = e as Prisma.PrismaClientKnownRequestError
	return !!err && err.name === 'PrismaClientKnownRequestError' && (code ? err.code === code : true)
}
