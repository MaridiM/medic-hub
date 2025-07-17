import React, { ComponentProps, PropsWithChildren } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { FormControl, FormItem, FormLabel, FormMessage, Input } from '@/packages/components'
import { Form } from '@/packages/components'
import { FormField } from '@/packages/components'
import { TUseTranslations } from '@/packages/libs/i18n'

import { TCreateAccountFormSchema } from '@/auth/shared/schemas'

interface IProps extends PropsWithChildren<Omit<ComponentProps<'form'>, 'onSubmit'>> {
    form: UseFormReturn<TCreateAccountFormSchema>
    t: TUseTranslations
}

export const ContactForm = ({ children, form, t, ...props }: IProps) => {
    return (
        <Form key='contact-info-form' {...form}>
            <form className='space-y-4' {...props}>
                <FormField
                    control={form.control}
                    name='fullName'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('inputs.fullName.label')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('inputs.fullName.placeholder')} autoComplete='name' {...field} />
                            </FormControl>
                            <FormMessage className='!text-p-xs' />
                        </FormItem>
                    )}
                />
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
                            <FormMessage className='!text-p-xs' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('inputs.phone.label')}</FormLabel>
                            <FormControl>
                                <Input
                                    type='tel'
                                    placeholder={t('inputs.phone.placeholder')}
                                    autoComplete='tel'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className='!text-p-xs' />
                        </FormItem>
                    )}
                />

                {children}
            </form>
        </Form>
    )
}
