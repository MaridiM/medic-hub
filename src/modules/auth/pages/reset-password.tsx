import { AuthWrapper } from '@/auth/features'
import { AuthForm } from '@/auth/widgets'

export const ResetPassword = () => {
    return (
        <AuthWrapper>
            <AuthForm type='resetPassword' />
        </AuthWrapper>
    )
}
