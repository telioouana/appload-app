import type { cargo, order, tracking, trip } from "@/backend/db/schema"

export type LAYOUT_VIEW = "list" | "grid"
export type PERIOD = "month" | "quarter" | "year"
export type ORDERS_PATH = "all" | "private" | "public" 
export type TRIP_PATH = "all"| "booked" | "on-going" | "delivered"

export type Values = {
    order: typeof order.$inferSelect,
    cargo: typeof cargo.$inferSelect,
    trip: typeof trip.$inferSelect | null,
    tracking: typeof tracking.$inferSelect | null,
}