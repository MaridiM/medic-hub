import { StateCreator } from 'zustand'

import { type TStatus } from '@/auth/shared/types'

import { IAuthSlice } from '../types/auth.types'

export const authSlice: StateCreator<IAuthSlice> = set => ({
    // ===============================================
    // States
    // ===============================================

    // Pages
    passwordStep: false,
    statusPage: null,

    // 2FA
    isShowTwoFactor: false,
    isTotpEnabled: false,

    // ===============================================
    // Actions
    // ===============================================

    // Pages
    setPasswordStep: (passwordStep: boolean) => set({ passwordStep }),
    setStatusPage: (statusPage: TStatus | null) => set({ statusPage }),

    // 2FA
    setIsShowTwoFactor: (isShowTwoFactor: boolean) => set({ isShowTwoFactor }),
    setIsTotpEnabled: (isTotpEnabled: boolean) => set({ isTotpEnabled })
})
