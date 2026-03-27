import { create } from "zustand"
import { TripValues } from "../types/types"

interface Props {
    isOpen: boolean
    values: TripValues | undefined

    onClose: () => void
    onOpenChange: (values: TripValues) => void
}

export const useManageTrip = create<Props>((set) => ({
    isOpen: false,
    values: undefined,
    onOpenChange: (values: TripValues) => set({
        isOpen: true,
        values: values
    }),
    onClose: () => set({
        isOpen: false,
        values: undefined
    }),
}))