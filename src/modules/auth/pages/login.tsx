import { AuthWrapper } from '@/auth/features'
import { AuthForm } from '@/auth/widgets'

export const Login = () => {
    return (
        <AuthWrapper>
            <AuthForm type='login' />
        </AuthWrapper>
    )
}
