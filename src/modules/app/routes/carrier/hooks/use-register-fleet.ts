import { create } from "zustand"
import { Driver } from "../types/types"

interface Props {
    isOpen: boolean
    drivers: Driver[] | []
    onClose: () => void
    onOpenChange: (drivers: Driver[]) => void
}

export const useRegisterFleet = create<Props>(( set) => ({
    isOpen: false,
    drivers: [],
    onClose: () => set({ isOpen: false }),
    onOpenChange: (drivers: Driver[]) => set({ 
        isOpen: true,
        drivers: drivers
    }),
}))