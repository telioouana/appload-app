import { create } from "zustand"

interface Props {
    isOpen: boolean
    onOpenChange: () => void
    onClose: () => void
}

export const useCreateOffer = create<Props>(( set) => ({
    isOpen: false,
    onOpenChange: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))