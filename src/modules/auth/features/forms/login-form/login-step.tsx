import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { type UseFormReturn } from 'react-hook-form'

import { FormLink, Social } from '@/modules/auth/shared/components'
import { type TLoginFormSchema } from '@/modules/auth/shared/schemas'

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { type TUseTranslations } from '@/packages/libs/i18n'

interface IProps {
    t: TUseTranslations
    form: UseFormReturn<TLoginFormSchema>
    showPassword: boolean
    togglePassword: () => void
    onSubmit: (data: TLoginFormSchema) => void
    onSignUp: () => void
}

export const LoginStep = ({ t, form, showPassword, togglePassword, onSubmit, onSignUp }: IProps) => {
    return (
        <>
            <Social t={t} />
            <Form key='login-form' {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('inputs.email.label')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type='email'
                                        placeholder={t('inputs.email.placeholder')}
                                        autoComplete='email'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='!text-p-xs text-destructive' />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t('inputs.password.label')}
                                    <Link
                                        href={PATHS.auth('recovery')}
                                        className='text-p-sm text-text-secondary hover:text-text-tertiary ml-auto font-normal'
                                    >
                                        {t('form.resetPassword')}
                                    </Link>
                                </FormLabel>
                                <FormControl>
                                    <div className='relative'>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder={t('inputs.password.placeholder')}
                                            autoComplete='off'
                                            className='pr-14'
                                            {...field}
                                        />
                                        <Button
                                            type='button'
                                            className='absolute top-0 right-0 size-10 h-full min-w-10 rounded-l-none bg-transparent'
                                            onClick={togglePassword}
                                        >
                                            {showPassword ? (
                                                <Eye className='!size-4' />
                                            ) : (
                                                <EyeOff className='!size-4' />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage className='!text-p-xs text-destructive' />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' variant='primary' className='mt-6 w-full' disabled={!form.formState.isValid}>
                        {t('form.submit')}
                    </Button>
                </form>
            </Form>
            <FormLink
                href={PATHS.auth('create-account')}
                text={t('form.noAccount')}
                buttonText={t('form.signUp')}
                onClick={onSignUp}
            />
        </>
    )
}
