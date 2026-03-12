import { create } from "zustand"
import { Values } from "../types/types"

interface Props {
    isOpen: boolean
    values: Values | undefined

    onClose: () => void
    onOpenChange: (values: Values) => void
}

export const useAcceptOrder = create<Props>((set) => ({
    isOpen: false,
    values: undefined,
    onOpenChange: (values: Values) => set({
        isOpen: true,
        values: values
    }),
    onClose: () => set({
        isOpen: false,
        values: undefined
    }),
}))