import { AuthWrapper } from '@/auth/features'
import { AuthForm } from '@/auth/widgets'

export const ForgotPassword = () => {
    return (
        <AuthWrapper>
            <AuthForm type='forgotPassword' />
        </AuthWrapper>
    )
}
