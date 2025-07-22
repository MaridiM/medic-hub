import { type ValidationArguments, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator'

// import { NewPasswordInput } from '@/modules/auth/recovery/inputs/new-password.input'

@ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {
 	validate(passwordRepeat: string, args: ValidationArguments): boolean {
 		// const object = args.object as NewPasswordInput
 		const object = args.object as any
 		return object.password === passwordRepeat
 	}

 	defaultMessage?(_validationArguments?: ValidationArguments): string {
 		return 'Пароли не совпадают'
 	}
 }
