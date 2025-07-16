import { StateCreator } from 'zustand'

import { IAuthSlice } from '../types/auth.types'

export const authSlice: StateCreator<IAuthSlice> = (set, get) => ({
    // States
    passwordStep: false,

    // Actions
    setPasswordStep: (passwordStep: boolean) => set({ passwordStep })
})
