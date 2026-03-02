import type { cargo, order, tracking, trip } from "@/backend/db/schema"

export type LAYOUT_VIEW = "list" | "grid"
export type PERIOD = "month" | "quarter" | "year"
export type KPIs_TABS = "operational" | "incidents" | "costs" | "efficiency"
export type ORDERS_PATH = "all" | "drafted" | "open" | "booked" | "on-going" | "delivered" | "history"

export type Values = {
    order: typeof order.$inferSelect,
    cargo: typeof cargo.$inferSelect,
    trip: typeof trip.$inferSelect | null,
    tracking: typeof tracking.$inferSelect | null,
}