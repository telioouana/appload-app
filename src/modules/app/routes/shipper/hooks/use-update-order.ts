import { create } from "zustand"

import { CreateOrderForm } from "@/backend/db/types"

interface Props {
    action: "continue" | "update" | "duplicate"
    isOpen: boolean
    orderId: string
    values: CreateOrderForm | undefined

    onClose: () => void
    onOpenChange: (values: CreateOrderForm, action: "continue" | "update" | "duplicate", orderId: string) => void
}

export const useUpdateOrder = create<Props>((set) => ({
    action: "update",
    isOpen: false,
    orderId: "",
    values: undefined,
    onOpenChange: (values: CreateOrderForm, action: "continue" | "update" | "duplicate", orderId: string) => set({
        action,
        orderId,
        isOpen: true,
        values: values
    }),
    onClose: () => set({
        isOpen: false,
        values: undefined
    }),
}))