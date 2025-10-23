import { ESecuritySeverity } from '@prisma/__generated__'

import { ERiskLevel } from '../types'

export class RiskMapperUtil {
	/**
	 * Maps a risk level to a security event severity.
	 * @param level - The risk level from the assessment.
	 * @returns The corresponding security severity.
	 */
	static mapLevelToSeverity(level: ERiskLevel): ESecuritySeverity {
		switch (level) {
			case ERiskLevel.CRITICAL:
				return ESecuritySeverity.CRITICAL
			case ERiskLevel.HIGH:
				return ESecuritySeverity.HIGH
			case ERiskLevel.MEDIUM:
				return ESecuritySeverity.MEDIUM
			case ERiskLevel.LOW:
			case ERiskLevel.VERY_LOW:
			default:
				return ESecuritySeverity.LOW
		}
	}
}
