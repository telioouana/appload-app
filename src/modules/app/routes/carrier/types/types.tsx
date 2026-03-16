import type { cargo, driver, link, order, tracking, trailer, trip, truck, user } from "@/backend/db/schema"
import { FISCAL_REGIME } from "@/backend/db/types"

export type LAYOUT_VIEW = "list" | "grid"
export type PERIOD = "month" | "quarter" | "year"
export type ORDERS_PATH = "all" | "private" | "public"
export type STATUS_FILTER = "all" | "active" | "idle" | "free"
export type TRIPS_PATH = "all" | "booked" | "on-going"
export type MAP_FILTER = "all" | "loading" | "moving" | "stopped" | "issue" | "offloading"

export type Driver = {
    id: string;
    name: string;
    phone: string | null;
    passport: string | null;
}

export type DriverValues = {
    driver: typeof driver.$inferSelect
    user: typeof user.$inferSelect
    truck: typeof truck.$inferSelect | null
    tracking: typeof tracking.$inferSelect | null
}

export type FleetValues = {
    truck: typeof truck.$inferSelect
    trailer: typeof trailer.$inferSelect | null
    link: typeof link.$inferSelect | null
    driver: typeof driver.$inferSelect | null
    user: typeof user.$inferSelect | null
    tracking: typeof tracking.$inferSelect | null
}

export type Fleet = {
    truck: typeof truck.$inferSelect
    trailer: typeof trailer.$inferSelect | null
    link: typeof link.$inferSelect | null
}

export type OrderValues = {
    order: typeof order.$inferSelect,
    cargo: typeof cargo.$inferSelect,
    organizationId: string,
    organizationName: string,
    fiscalRegime: typeof FISCAL_REGIME[number],
    fleet: Fleet[]
    drivers: Driver[]
}

export type TripValues = {
    order: typeof order.$inferSelect,
    cargo: typeof cargo.$inferSelect,
    trip: typeof trip.$inferSelect,
    tracking: typeof tracking.$inferSelect | null
}