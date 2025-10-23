export interface ILocationDTO {
	country: string
	city: string
	latitude: number
	longitude: number
}

export interface IDeviceDTO {
	browser: string
	os: string
	type: string
}

export interface ISessionMetadataDTO {
	location: ILocationDTO
	device: IDeviceDTO
	ip: string
}
