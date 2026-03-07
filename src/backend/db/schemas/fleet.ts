import { randomUUID } from "crypto";
import { pgTable, text, timestamp, integer, index, jsonb, serial, pgEnum, } from "drizzle-orm/pg-core";

import { organization, user } from "@/backend/db/schema";
import { FLEET_STATUS, LoadingBay, TRUCK_TYPE, Urls } from "@/backend/db/types";

export const truckEnum = pgEnum("truck_enum", TRUCK_TYPE)
export const fleetEnum = pgEnum("fleet_enum", FLEET_STATUS)

export const driver = pgTable(
    "driver",
    {
        id: text("id").primaryKey().$default(() => randomUUID()),
        legacyId: serial("legacy_id").unique().notNull(),
        userId: text("user_id")
            .unique()
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        carrierId: text("carrier_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),
        driverLicense: jsonb("driver_card").$type<Urls>(),
        passportCard: jsonb("passport_card").$type<Urls>(),
        status: fleetEnum("status").default("idle"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    }
)

export const truck = pgTable(
    "truck",
    {
        id: text("id").primaryKey().$default(() => randomUUID()),
        legacyId: serial("legacy_id").unique().notNull(),
        internalId: text("internal_id"),
        carrierId: text("carrier_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),
        regPlate: text("reg_plate").unique().notNull(),

        driver: text("driver_id")
            .references(() => driver.id, { onDelete: "set null" }),
        trailer: text("driver_id")
            .references(() => trailer.regPlate, { onDelete: "set null" }),
        driverName: text("driver_name"),

        brand: text("brand").notNull(),
        model: text("model").notNull(),
        year: integer("year").notNull(),
        type: truckEnum("type").notNull(),
        loadingBay: jsonb("loading_bay").$type<LoadingBay>(),
        vin: text("vin").notNull().unique(),
        booklet: jsonb("booklet").$type<Urls>(),
        license: jsonb("license").$type<Urls>(),
        status: fleetEnum("status").default("idle"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("truck_carrierId_idx").on(table.carrierId),
        index("truck_plate_idx").on(table.regPlate),
    ]
)

export const trailer = pgTable(
    "trailer",
    {
        id: text("id").primaryKey().$default(() => randomUUID()),
        legacyId: serial("legacy_id").unique().notNull(),
        internalId: text("internal_id"),
        carrierId: text("carrier_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),
        link: text("driver_id")
            .references(() => link.regPlate, { onDelete: "set null" }),

        regPlate: text("reg_plate").unique().notNull(),
        brand: text("brand").notNull(),
        model: text("model").notNull(),
        year: integer("year").notNull(),
        loadingBay: jsonb("loading_bay").$type<LoadingBay>().notNull(),
        vin: text("vin").notNull().unique(),
        booklet: jsonb("booklet").$type<Urls>(),
        license: jsonb("license").$type<Urls>(),
        status: fleetEnum("status").default("idle"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("trailer_carrierId_idx").on(table.carrierId),
        index("trailer_plate_idx").on(table.regPlate),
    ]
)

export const link = pgTable(
    "link",
    {
        id: text("id").primaryKey().$default(() => randomUUID()),
        legacyId: serial("legacy_id").unique().notNull(),
        internalId: text("internal_id"),
        carrierId: text("carrier_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),
        regPlate: text("reg_plate").unique().notNull(),
        brand: text("brand").notNull(),
        model: text("model").notNull(),
        year: integer("year").notNull(),
        loadingBay: jsonb("loading_bay").$type<LoadingBay>().notNull(),
        vin: text("vin").notNull().unique(),
        booklet: jsonb("booklet").$type<Urls>(),
        license: jsonb("license").$type<Urls>(),
        status: fleetEnum("status").default("idle"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("link_carrierId_idx").on(table.carrierId),
        index("link_plate_idx").on(table.regPlate),
    ]
)