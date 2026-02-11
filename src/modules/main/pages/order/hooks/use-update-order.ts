import { create } from "zustand"

import { CreateOrderForm } from "@/backend/db/types"

interface Props {
    action: "continue" | "update" | "publish"
    isOpen: boolean
    orderId: string
    defaultValues: CreateOrderForm | undefined

    onClose: () => void
    onOpenChange: (values: CreateOrderForm, action: "continue" | "update" | "publish", orderId: string) => void
}

export const useUpdateOrder = create<Props>((set) => ({
    action: "update",
    isOpen: false,
    orderId: "",
    defaultValues: undefined,
    onOpenChange: (values: CreateOrderForm, action: "continue" | "update" | "publish", orderId: string) => set({
        action,
        orderId,
        isOpen: true,
        defaultValues: values
    }),
    onClose: () => set({
        isOpen: false,
        defaultValues: undefined
    }),
}))