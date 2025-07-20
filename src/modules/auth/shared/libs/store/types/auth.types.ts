import { TStatus } from '@/auth/shared/types'

export interface IAuthSlice {
    // ===============================================
    // States
    // ===============================================
    // Pages
    passwordStep: boolean
    statusPage: TStatus | null

    // 2FA
    isShowTwoFactor: boolean
    isTotpEnabled: boolean

    // ===============================================
    // Actions
    // ===============================================
    // Pages
    setPasswordStep: (passwordStep: boolean) => void
    setStatusPage: (statusPage: TStatus | null) => void

    // 2FA
    setIsShowTwoFactor: (isShowTwoFactor: boolean) => void
    setIsTotpEnabled: (isTotpEnabled: boolean) => void
}
