export interface IAuthSlice {
    // States
    passwordStep: boolean

    // Actions
    setPasswordStep: (passwordStep: boolean) => void
}
