import { Address, FISCAL_REGIME } from "@/backend/db/types"
import type { cargo, driver, link, order, tracking, trailer, trip, truck, user } from "@/backend/db/schema"

export type LAYOUT_VIEW = "list" | "grid"
export type ORDERS_PATH = "all" | "private" | "public"
export type TRIPS_PATH = "all" | "booked" | "on-going"
export type PERIOD = "week" | "month" | "quarter" | "year"
export type STATUS_FILTER = "all" | "active" | "idle" | "free"
export type KPIs_TABS = "operational" | "incidents" | "costs" | "efficiency"
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

export type ClientValues = {
    id: string;
    name: string;
    logo: string | null;
    address: Address | null;
    trips: number;
    revenue: number;
    createdAt: Date;
}