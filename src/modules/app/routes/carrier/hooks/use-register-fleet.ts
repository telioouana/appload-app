import { create } from "zustand"
import { Drivers } from "../types/types"

interface Props {
    isOpen: boolean
    drivers: Drivers | []
    onClose: () => void
    onOpenChange: (drivers: Drivers) => void
}

export const useRegisterFleet = create<Props>(( set) => ({
    isOpen: false,
    drivers: [],
    onClose: () => set({ isOpen: false }),
    onOpenChange: (drivers: Drivers) => set({ 
        isOpen: true,
        drivers: drivers
    }),
}))