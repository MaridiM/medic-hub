declare module 'class-validator' {
	export interface ValidationArguments {
		context?: {
			lang?: string
			[key: string]: any
		}
	}
}

// Важно: убедитесь, что этот файл является модулем
export {}
