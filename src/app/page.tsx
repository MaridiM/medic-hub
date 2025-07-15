import { redirect } from 'next/navigation'

import { PATHS } from '@/packages/config'

export default function Index() {
    return redirect(PATHS.auth())
}
