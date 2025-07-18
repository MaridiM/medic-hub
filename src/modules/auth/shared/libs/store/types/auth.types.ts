export interface IAuthSlice {
    // States
    passwordStep: boolean
    isShowTwoFactor: boolean
    isTotpEnabled: boolean

    // Actions
    setPasswordStep: (passwordStep: boolean) => void
    setIsShowTwoFactor: (isShowTwoFactor: boolean) => void
    setIsTotpEnabled: (isTotpEnabled: boolean) => void
}
