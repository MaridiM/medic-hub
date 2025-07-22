import { Wrapper } from '@/auth/features'
import { AuthForm } from '@/auth/widgets'

export const Login = () => {
    return (
        <Wrapper>
            <AuthForm type='login' />
        </Wrapper>
    )
}
