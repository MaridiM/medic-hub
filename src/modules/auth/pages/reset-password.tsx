import { Wrapper } from '@/auth/features'
import { AuthForm } from '@/auth/widgets'

export const ResetPassword = () => {
    return (
        <Wrapper>
            <AuthForm type='resetPassword' />
        </Wrapper>
    )
}
