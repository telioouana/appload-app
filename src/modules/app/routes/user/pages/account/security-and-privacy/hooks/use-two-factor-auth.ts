import { create } from "zustand"

interface Props {
    isOpen: boolean
    isEnabled: boolean
    onClose: () => void
    onOpenChange: (isEnabled: boolean) => void
}

export const useTwoFactorAuth = create<Props>(( set) => ({
    isOpen: false,
    isEnabled: false,
    onClose: () => set({ isOpen: false }),
    onOpenChange: (isEnabled: boolean) => set({ isEnabled, isOpen: true }),
}))