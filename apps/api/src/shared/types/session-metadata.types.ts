export interface ILocation {
	country: string
	city: string
	latitude: number
	longitude: number
}

export interface IDevice {
	browser: string
	os: string
	type: string
}

export interface ISessionMetadata {
	location: ILocation
	device: IDevice
	ip: string
}
