import { create } from "zustand"
import { OrderValues } from "../types/types"

interface Props {
    isOpen: boolean
    values: OrderValues | undefined

    onClose: () => void
    onOpenChange: (values: OrderValues) => void
}

export const useCreateOffer = create<Props>((set) => ({
    isOpen: false,
    values: undefined,
    onOpenChange: (values: OrderValues) => set({
        isOpen: true,
        values: values
    }),
    onClose: () => set({
        isOpen: false,
        values: undefined
    }),
}))