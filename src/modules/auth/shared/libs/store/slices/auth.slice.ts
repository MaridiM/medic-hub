import { StateCreator } from 'zustand'

import { IAuthSlice } from '../types/auth.types'

export const authSlice: StateCreator<IAuthSlice> = (set, get) => ({
    // States
    passwordStep: false,
    isShowTwoFactor: true,
    isTotpEnabled: true,

    // Actions
    setPasswordStep: (passwordStep: boolean) => set({ passwordStep }),
    setIsShowTwoFactor: (isShowTwoFactor: boolean) => set({ isShowTwoFactor }),
    setIsTotpEnabled: (isTotpEnabled: boolean) => set({ isTotpEnabled })
})
