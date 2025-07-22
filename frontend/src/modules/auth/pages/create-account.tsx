import { Wrapper } from '@/auth/features'
import { AuthForm } from '@/auth/widgets'

export const CreateAccount = () => {
    return (
        <Wrapper>
            <AuthForm type='createAccount' />
        </Wrapper>
    )
}
