import { Wrapper } from '@/auth/features'
import { AuthForm } from '@/auth/widgets'

export const ChangePassword = () => {
    return (
        <Wrapper>
            <AuthForm type='changePassword' />
        </Wrapper>
    )
}
