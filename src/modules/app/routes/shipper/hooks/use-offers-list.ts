import { create } from "zustand"

import { Offer, Order } from "../types/types"

interface Props {
    isOpen: boolean
    order: Order | undefined
    offers: Offer[] | []
    onClose: () => void
    onOpenChange: (offers: Offer[], order: Order) => void
}

export const useOffersList = create<Props>((set) => ({
    isOpen: false,
    order: undefined,
    offers: [],
    onClose: () => set({ isOpen: false, offers: [], order: undefined }),
    onOpenChange: (offers: Offer[], order: Order) => set({ isOpen: true, offers, order }),
}))