import { type ValidationArguments, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator'

import { DEFAULT_LANGUAGE, I18nService } from '@/core'

// import { NewPasswordInput } from '@/modules/auth/recovery/inputs/new-password.input'

@ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {
	constructor(private readonly i18n: I18nService) {}

	validate(passwordRepeat: string, args: ValidationArguments): boolean {
		// const object = args.object as NewPasswordInput
		const object = args.object as any
		return object.password === passwordRepeat
	}

	defaultMessage?(_validationArguments?: ValidationArguments): string {
		const req = (_validationArguments?.object as any)?.req
		const lang = req?.language || DEFAULT_LANGUAGE
		return this.i18n.t('common.password_not_matching', { lng: lang }) as string
	}
}
