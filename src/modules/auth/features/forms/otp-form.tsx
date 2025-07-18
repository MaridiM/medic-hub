import { ComponentProps, PropsWithChildren } from 'react'
import { UseFormReturn } from 'react-hook-form'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot
} from '@/packages/components'
import { TUseTranslations } from '@/packages/libs/i18n'

import { OtpAlert, type TStatus } from '@/auth/shared/components'
import { TOtpFormSchema } from '@/auth/shared/schemas'

interface IProps extends PropsWithChildren<ComponentProps<'form'>> {
    form: UseFormReturn<TOtpFormSchema>
    t: TUseTranslations
    status?: TStatus | null
    alertDuration?: number
}

export const OtpForm = ({ children, form, t, status, alertDuration, ...props }: IProps) => {
    return (
        <Form {...form} {...props}>
            <form className='space-y-4'>
                {status === 'success' ? (
                    <OtpAlert status={status} title={t(`2fa.status.${status}`)} duration={alertDuration} />
                ) : (
                    <>
                        <FormField
                            control={form.control}
                            name='code'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <InputOTP
                                            maxLength={6}
                                            {...field}
                                            containerClassName='flex w-full justify-center'
                                        >
                                            <InputOTPGroup className='flex w-full justify-between'>
                                                <InputOTPSlot
                                                    index={0}
                                                    className='size-12 rounded-md'
                                                />
                                                <InputOTPSlot
                                                    index={1}
                                                    className='size-12 rounded-md'
                                                />
                                                <InputOTPSlot
                                                    index={2}
                                                    className='size-12 rounded-md'
                                                />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup className='flex w-full justify-between'>
                                                <InputOTPSlot
                                                    index={3}
                                                    className='size-12 rounded-md'
                                                />
                                                <InputOTPSlot
                                                    index={4}
                                                    className='size-12 rounded-md'
                                                />
                                                <InputOTPSlot
                                                    index={5}
                                                    className='size-12 rounded-md'
                                                />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {status && <OtpAlert status={status} title={t(`2fa.status.${status}`)} />}
                        {children}
                    </>
                )}
            </form>
        </Form>
    )
}
