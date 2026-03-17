import type { cargo, order, tracking, trip } from "@/backend/db/schema"

export type LAYOUT_VIEW = "list" | "grid"
export type PERIOD = "week" | "month" | "quarter" | "year"
export type KPIs_TABS = "operational" | "incidents" | "costs" | "efficiency"
export type MAP_FILTER = "all" | "loading" | "moving" | "stopped" | "issue" | "offloading"
export type ORDERS_PATH = "all" | "drafted" | "open" | "booked" | "on-going" | "delivered" | "history"

export type Values = {
    order: typeof order.$inferSelect,
    cargo: typeof cargo.$inferSelect,
    trip: typeof trip.$inferSelect | null,
    tracking: typeof tracking.$inferSelect | null,
}

export type TransporterValues = {
    id: string;
    name: string;
    logo: string | null;
    address: string;
    trips: number;
    paid: number;
    createdAt: Date;
}