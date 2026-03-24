import { create } from "zustand"

interface Props {
    isOpen: boolean
    onClose: () => void
    onOpenChange: () => void
}

export const useCreateOrganization = create<Props>(( set) => ({
    isOpen: false,
    onClose: () => set({ isOpen: false }),
    onOpenChange: () => set({ isOpen: true }),
}))