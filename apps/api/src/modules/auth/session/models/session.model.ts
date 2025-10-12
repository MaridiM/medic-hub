import type { IDevice, ILocation, ISessionMetadata } from '@/shared/types'
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Location implements ILocation {
	@Field(() => String)
	country: string

	@Field(() => String)
	city: string

	@Field(() => Number)
	latitude: number

	@Field(() => Number)
	longitude: number
}

@ObjectType()
export class Device implements IDevice {
	@Field(() => String)
	browser: string

	@Field(() => String)
	os: string

	@Field(() => String)
	type: string
}

@ObjectType()
export class SessionMetadata implements ISessionMetadata {
	@Field(() => Location)
	location: Location

	@Field(() => Device)
	device: Device

	@Field(() => String)
	ip: string
}

@ObjectType()
export class Session {
	@Field(() => ID)
	id: string

	@Field(() => String)
	userId: string

	@Field(() => SessionMetadata)
	metadata: SessionMetadata

	@Field(() => String)
	createdAt: string
}
