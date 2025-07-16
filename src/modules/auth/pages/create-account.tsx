import { AuthWrapper } from '@/auth/features'
import { AuthForm } from '@/auth/widgets'

export const CreateAccount = () => {
    return (
        <AuthWrapper>
            <AuthForm type='createAccount' />
        </AuthWrapper>
    )
}
