import { FISCAL_REGIME, FLEET_STATUS, LOADING_BAY, TRUCK_TYPE } from "@/backend/db/types"
import type { cargo, order } from "@/backend/db/schema"

export type LAYOUT_VIEW = "list" | "grid"
export type PERIOD = "month" | "quarter" | "year"
export type ORDERS_PATH = "all" | "private" | "public"
export type STATUS_FILTER = "all" | "active" | "idle" | "free"
export type TRIP_PATH = "all" | "booked" | "on-going" | "delivered"
export type MAP_FILTER = "all" | "loading" | "moving" | "stopped" | "issue" | "offloading"

export type Drivers = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
}[]

export type Fleet = {
    driver: {
        name: string;
        email: string;
        phone: string | null;
        status: typeof FLEET_STATUS[number] | null;
    }
    truck: {
        code: string | null;
        plate: string;
        status: typeof FLEET_STATUS[number] | null;
        type: typeof TRUCK_TYPE[number];
        loading: {
            width: number;
            length: number;
            height: number;
            volume: number;
            capacity: number;
            type: typeof LOADING_BAY[number];
        } | null;
    }
    trailer: {
        code: string | null;
        plate: string;
        status: typeof FLEET_STATUS[number] | null;
        loading: {
            width: number;
            length: number;
            height: number;
            volume: number;
            capacity: number;
            type: typeof LOADING_BAY[number];
        }
    } | null
    link: {
        code: string | null;
        plate: string;
        status: typeof FLEET_STATUS[number] | null;
        loading: {
            width: number;
            length: number;
            height: number;
            volume: number;
            capacity: number;
            type: typeof LOADING_BAY[number];
        }
    } | null
}

export type Values = {
    order: typeof order.$inferSelect,
    cargo: typeof cargo.$inferSelect,
    organizationId: string,
    organizationName: string,
    fiscalRegime: typeof FISCAL_REGIME[number],
    fleet: Fleet[]
}