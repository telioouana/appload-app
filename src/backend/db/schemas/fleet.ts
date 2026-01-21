import { randomUUID } from "crypto";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, integer, index, jsonb, } from "drizzle-orm/pg-core";

import { Urls } from "@/backend/db/types";
import { offer, trip } from "@/backend/db/schemas/orders";
import { organization, user } from "@/backend/db/schemas/users";

export const driver = pgTable(
    "driver",
    {
        id: text("id").primaryKey().$default(() => randomUUID()),
        userId: text("user_id")
            .unique()
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        carrierId: text("carrier_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),
        passportNumber: text("passport_number"),
        idCard: jsonb("id_card").$type<Urls>(),
        passportCard: jsonb("passport_card").$type<Urls>(),
        createdAt: timestamp("created_at").defaultNow().notNull()
    }
)

export const truck = pgTable(
    "truck",
    {
        id: text("id").primaryKey().$default(() => randomUUID()),
        carrierId: text("carrier_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),
        regPlate: text("reg_plate").unique().notNull(),
        brand: text("brand").notNull(),
        model: text("model").notNull(),
        year: integer("year").notNull(),
        type: text("type").notNull().default("tractor"),
        loadingBay: jsonb("loading_bay").$type(),
        vin: text("vin").notNull(),
        booklet: jsonb("booklet").$type<Urls>(),
        license: jsonb("license").$type<Urls>(),
        createdAt: timestamp("created_at").defaultNow().notNull()
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
        carrierId: text("carrier_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),
        regPlate: text("reg_plate").unique().notNull(),
        brand: text("brand").notNull(),
        model: text("model").notNull(),
        year: integer("year").notNull(),
        type: text("type").notNull(),
        loadingBay: jsonb("loading_bay").$type().notNull(),
        vin: text("vin").notNull(),
        booklet: jsonb("booklet").$type<Urls>(),
        license: jsonb("license").$type<Urls>(),
        createdAt: timestamp("created_at").defaultNow().notNull()
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
        carrierId: text("carrier_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),
        regPlate: text("reg_plate").unique().notNull(),
        brand: text("brand").notNull(),
        model: text("model").notNull(),
        year: integer("year").notNull(),
        type: text("type").notNull(),
        loadingBay: jsonb("loading_bay").$type().notNull(),
        vin: text("vin").notNull(),
        booklet: jsonb("booklet").$type<Urls>(),
        license: jsonb("license").$type<Urls>(),
        createdAt: timestamp("created_at").defaultNow().notNull()
    },
    (table) => [
        index("link_carrierId_idx").on(table.carrierId),
        index("link_plate_idx").on(table.regPlate),
    ]
)

export const driverRelations = relations(driver, ({ one, many }) => ({
    user: one(user, {
        fields: [driver.userId],
        references: [user.id]
    }),
    organization: one(organization, {
        fields: [driver.carrierId],
        references: [organization.id]
    }),
    trips: many(trip),
    offer: many(offer)
}))

export const truckRelations = relations(truck, ({ one, many }) => ({
    organization: one(organization, {
        fields: [truck.carrierId],
        references: [organization.id]
    }),
    trips: many(trip),
    offer: many(offer)
}))

export const trailerRelations = relations(trailer, ({ one, many }) => ({
    organization: one(organization, {
        fields: [trailer.carrierId],
        references: [organization.id]
    }),
    trips: many(trip),
    offer: many(offer)
}))

export const linkRelations = relations(link, ({ one, many }) => ({
    organization: one(organization, {
        fields: [link.carrierId],
        references: [organization.id]
    }),
    trips: many(trip),
    offer: many(offer)
}))