import { AuthWrapper } from '@/auth/features'
import { AuthForm } from '@/auth/widgets'

export const ChangePassword = () => {
    return (
        <AuthWrapper>
            <AuthForm type='changePassword' />
        </AuthWrapper>
    )
}
