import { Wrapper } from '@/auth/features'
import { AuthForm } from '@/auth/widgets'


export const Verify = ({ token }: { token: string }) => {
    return (
        <Wrapper>
            <AuthForm type='verify' token={token} />
        </Wrapper>
    )
}
