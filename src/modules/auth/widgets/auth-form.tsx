'use client'

import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Google } from '@/packages/assets/icons'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@/packages/components'
import { PATHS } from '@/packages/config'
import { cn } from '@/packages/utils'

export const AuthForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className='text-center'>
                    <CardTitle className='text-xl uppercase'>Sign In</CardTitle>
                    <CardDescription className='text-text-tertiary'>
                        Login with your email or Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col gap-6'>
                        <div className='flex flex-col gap-6'>
                            <div className='flex flex-col gap-2'>
                                <Button variant='ghost' className='w-full gap-2 tracking-wide'>
                                    <Google className='!size-4' />
                                    Login with Google
                                </Button>
                            </div>
                            <div className='after:border-border/20 text-p-sm relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                                <span className='bg-card text-text-tertiary relative z-10 px-2'>Or continue with</span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <Label htmlFor='email' className='text-text font-normal'>
                                    Email
                                </Label>
                                <Input id='email' type='email' placeholder='m@example.com' required />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <div className='flex items-center'>
                                    <Label htmlFor='password' className='text-text font-normal'>
                                        Password
                                    </Label>
                                    <Link
                                        href={PATHS.auth('forgot-password')}
                                        className='text-p-sm text-text hover:text-text-secondary ml-auto'
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <div className='relative'>
                                    <Input
                                        id='password'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='********'
                                        required
                                    />
                                    <Button
                                        variant='ghost'
                                        className='border-border/20 group absolute top-0 right-0 size-10 h-full min-w-10 rounded-l-none border-l'
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Eye className='!size-4' /> : <EyeOff className='!size-4' />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-6'>
                            <Button type='submit' variant='primary' className='w-full'>
                                Sign In
                            </Button>
                        </div>

                        <footer className='text-text text-p-sm text-center'>
                            Don&apos;t have an account?{' '}
                            <Link href={PATHS.auth('create-account')} className='text-primary hover:text-primary-700'>
                                Sign up
                            </Link>
                        </footer>
                    </div>
                    {/* <div className='flex flex-col gap-6'>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <Label htmlFor='email' className='text-text font-normal'>
                                    Email
                                </Label>
                                <Input id='email' type='email' placeholder='m@example.com' required />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label htmlFor='password' className='text-text font-normal'>
                                    Password
                                </Label>
                                <div className='relative'>
                                    <Input
                                        id='password'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='********'
                                        required
                                    />
                                    <Button
                                        variant='ghost'
                                        className='border-border/20 group absolute top-0 right-0 size-10 h-full min-w-10 rounded-l-none border-l'
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Eye className='!size-4' /> : <EyeOff className='!size-4' />}
                                    </Button>
                                </div>
                            </div>
                            <div className='flex items-center'>
                                <a
                                    href={PATHS.auth('forgot-password')}
                                    className='text-p-sm text-text hover:text-text-secondary ml-auto'
                                >
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div className='flex flex-col gap-6'>
                            <Button type='submit' variant='primary' className='w-full'>
                                Sign In
                            </Button>
                            <div className='after:border-border/20 text-p-sm relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                                <span className='bg-card text-text-tertiary relative z-10 px-2'>Or continue with</span>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Button variant='ghost' className='w-full gap-2 tracking-wide'>
                                    <Google className='!size-4' />
                                    Login with Google
                                </Button>
                            </div>
                        </div>

                        <footer className='text-text text-p-sm text-center'>
                            Don&apos;t have an account?{' '}
                            <Link href={PATHS.auth('create-account')} className='text-primary hover:text-primary-700'>
                                Sign up
                            </Link>
                        </footer>
                    </div> */}
                </CardContent>
            </Card>
            <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
                By clicking continue, you agree to our <a href='#'>Terms of Service</a> and{' '}
                <a href='#'>Privacy Policy</a>.
            </div>
        </div>
    )
}
