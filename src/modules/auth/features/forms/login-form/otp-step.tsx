import { type UseFormReturn } from 'react-hook-form'

import { TryAgain } from '@/modules/auth/shared/components'

import { Button } from '@/packages/components'
import { type TUseTranslations } from '@/packages/libs/i18n'

import { TOtpFormSchema } from '@/auth/shared/schemas'
import type { TStatus } from '@/auth/shared/types'

import { OtpForm } from './otp-form'

interface IProps {
    t: TUseTranslations
    form: UseFormReturn<TOtpFormSchema>
    status: TStatus | null
    remaining: number
    isTotpEnabled: boolean
    onBack: () => void
    setOTPStatus: (status: TStatus | null) => void
}
export const OtpStep = ({ t, form, status, remaining, isTotpEnabled, onBack, setOTPStatus }: IProps) => {
    return (
        <OtpForm form={form} t={t} status={status} alertDuration={remaining}>
            <div className='mt-6 flex flex-col items-center gap-6'>
                {!isTotpEnabled && (
                    <TryAgain
                        text={t('2fa.tryAgain.text')}
                        link={t('2fa.tryAgain.link')}
                        onClick={
                            !isTotpEnabled
                                ? () => {
                                      console.log('RESEND CODE')
                                      setOTPStatus(null)
                                      form.reset()
                                  }
                                : undefined
                        }
                    />
                )}
                <Button type='button' variant='ghost' className='mx-auto w-fit' onClick={onBack}>
                    {t('form.back')}
                </Button>
            </div>
        </OtpForm>
    )
}
