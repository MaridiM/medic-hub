import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/packages/components'

import { SendMessageIcon } from '@/auth/shared/assets/icons'

export const AuthStatusMessage = () => {
    return (
        <Card>
            <CardHeader className='flex flex-col items-center justify-center gap-4'>
                <SendMessageIcon />
                <CardTitle className='text-h4 text-center leading-6'>
                    Confirmation code sent <br />
                    to your E-Mail
                </CardTitle>
                <CardDescription className='text-text-tertiary text-p-xs text-center'>
                    We have sent a confirmation code to your email address. If you don&apos;t see the email with the code in
                    your inbox, please check your spam folder. After successful confirmation, you will be able to change
                    your password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button type='button' variant='ghost' className='w-full'>
                    Back to login
                </Button>
            </CardContent>
        </Card>
    )
}
