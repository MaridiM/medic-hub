import { create } from 'zustand'

import { authSlice } from './slices'
import { IAuthSlice } from './types'

type TBoundStore = IAuthSlice

export const useAuthStore = create<TBoundStore>()((...args) => ({
    ...authSlice(...args)
}))
