import { type ValidationArguments, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator'

import { DEFAULT_LANGUAGE, I18nService } from '@/core'

// import { NewPasswordInput } from '@/modules/auth/recovery/inputs/new-password.input'

@ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {
	constructor(private readonly i18n: I18nService) {}

	validate(passwordRepeat: string, args: ValidationArguments): boolean {
		// const object = args.object as NewPasswordInput
		interface PasswordObject {
			password: string
		}
		const object = args.object as PasswordObject
		return object.password === passwordRepeat
	}

	defaultMessage?(_validationArguments?: ValidationArguments): string {
		interface RequestObject {
			req?: { language?: string }
		}
		const object = _validationArguments?.object as RequestObject
		const lang = object.req?.language || DEFAULT_LANGUAGE
		return this.i18n.t('common.password_not_matching', { lng: lang }) as string
	}
}
