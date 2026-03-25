import { Address } from "@/backend/db/types"
import type { cargo, offer, order, timeline, tracking, trip } from "@/backend/db/schema"

export type LAYOUT_VIEW = "list" | "grid"
export type PERIOD = "week" | "month" | "quarter" | "year"
export type KPIs_TABS = "operational" | "incidents" | "costs" | "efficiency"
export type MAP_FILTER = "all" | "loading" | "moving" | "stopped" | "issue" | "offloading"
export type ORDERS_PATH = "all" | "drafted" | "open" | "booked" | "on-going" | "delivered" | "history"

export type Values = {
    order: Order
    cargo: Cargo
    trip: Trip | null
    status: Status | null
    tracking: Tracking | null
    offers: Offer[] | []
}

export type Tracking = typeof tracking.$inferSelect
export type Status = typeof timeline.$inferSelect
export type Offer = typeof offer.$inferSelect
export type Order = typeof order.$inferSelect
export type Cargo = typeof cargo.$inferSelect
export type Trip = typeof trip.$inferSelect

export type TransporterValues = {
    id: string;
    name: string;
    logo: string | null;
    address: Address | null;
    trips: number;
    paid: number;
    createdAt: Date;
}