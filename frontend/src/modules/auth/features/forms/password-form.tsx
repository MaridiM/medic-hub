'use client'

import { Eye, EyeOff } from 'lucide-react'
import { ComponentProps, PropsWithChildren, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/packages/components'
import { TUseTranslations } from '@/packages/libs/i18n'

import { TPasswordFormSchema } from '@/auth/shared/schemas'

interface IProps extends PropsWithChildren<Omit<ComponentProps<'form'>, 'onSubmit'>> {
    form: UseFormReturn<TPasswordFormSchema>
    onSubmit: (data: TPasswordFormSchema) => void
    t: TUseTranslations
}

export const PasswordForm = ({ children, form, onSubmit, t, ...props }: IProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <Form key='password-form' {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4' {...props}>
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('inputs.password.label')}</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Input
                                        id='password'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={t('inputs.password.placeholder')}
                                        className='pr-14'
                                        autoComplete='off'
                                        {...field}
                                    />
                                    <Button
                                        type='button'
                                        className='absolute top-0 right-0 size-10 h-full min-w-10 rounded-l-none bg-transparent hover:bg-transparent'
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Eye className='!size-4' /> : <EyeOff className='!size-4' />}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage className='!text-p-xs text-destructive' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('inputs.confirmPassword.label')}</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Input
                                        id='confirmPassword'
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder={t('inputs.confirmPassword.placeholder')}
                                        className='pr-14'
                                        autoComplete='off'
                                        {...field}
                                    />
                                    <Button
                                        type='button'
                                        className='absolute top-0 right-0 size-10 h-full min-w-10 rounded-l-none bg-transparent hover:bg-transparent'
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
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
                {children}
            </form>
        </Form>
    )
}
