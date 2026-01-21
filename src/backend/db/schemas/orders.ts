import { randomUUID } from "crypto";
import { relations } from "drizzle-orm";
import { boolean, decimal, index, integer, jsonb, pgEnum, pgTable, numeric, text, timestamp, serial, } from "drizzle-orm/pg-core";

import { organization } from "@/backend/db/schemas/users";
import { driver, link, trailer, truck } from "@/backend/db/schemas/fleet";
import { INSURANCE_PAYMENT_STATUS, Location, PAYMENT_STATUS, FISCAL_REGIME, ORDER_STATUS, TRIP_STATUS, TRIP_TYPE, ROUTE_TYPE, TRUCK_AGE, WEIGHT_UNIT, POD_STATUS, CURRENCY, SHARE } from "@/backend/db/types";

export const shareEnum = pgEnum("share_enum", SHARE)
export const currencyEnum = pgEnum("currency_enum", CURRENCY)
export const tripTypeEnum = pgEnum("trip_type_enum", TRIP_TYPE)
export const truckAgeEnum = pgEnum("truck_age_enum", TRUCK_AGE)
export const podStatusEnum = pgEnum("pod_status_enum", POD_STATUS)
export const routeTypeEnum = pgEnum("route_type_enum", ROUTE_TYPE)
export const weightUnitEnum = pgEnum("weight_unit_enum", WEIGHT_UNIT)
export const tripStatusEnum = pgEnum("trip_status_enum", TRIP_STATUS)
export const orderStatusEnum = pgEnum("order_status_enum", ORDER_STATUS)
export const fiscalRegimeEnum = pgEnum("fiscal_regime_enum", FISCAL_REGIME)
export const paymentStatusEnum = pgEnum("payment_status_enum", PAYMENT_STATUS)
export const insurancePaymentStatusEnum = pgEnum("insurance_payment_status_enum", INSURANCE_PAYMENT_STATUS)

export const order = pgTable(
    "order",
    {
        id: text("id").primaryKey().$default(() => randomUUID()),
        legacyId: serial("legacy_id").unique().notNull(),
        shipperId: text("shipper_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),
        shipperName: text("shipper_name").notNull(), 

        loadingAddress: jsonb("loading_address").$type<Location>(),
        expectedLoadingDate: timestamp("expected_loading_date").notNull(),
        offloadingAddress: jsonb("offloading_address").$type<Location>(),
        expectedOffloadingDate: timestamp("expected_offloading_date").notNull(),
        distance: integer("distance"),

        expectedTrucks: integer("expected_trucks").default(1),

        status: orderStatusEnum("status"),
        route: routeTypeEnum("route").default("national"),
        share: shareEnum("share").default("non-subscribers"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("order_shipperId_idx").on(table.shipperId),
        index("order_legacyId_idx").on(table.legacyId)
    ]
)

export const cargo = pgTable(
    "cargo",
    {
        id: text("id").primaryKey().$default(() => randomUUID()),
        orderId: text("order_id")
            .notNull()
            .references(() => order.id, { onDelete: "cascade" }),

        category: text("category").notNull(),
        description: text("description").notNull(),
        quantity: decimal("quantity").notNull(),
        unit: text("unit").default("ton").notNull(),
        packing: text("packing").notNull(),

        isHazardous: boolean("is_hazardous").default(false),
        hazchemCode: text("hazchem_code"),
        isRefrigerated: boolean("is_refrigerated").default(false),
        temperature: integer("temperature"),
        temperatureInstructions: text("temperature_instructions"),
        isGroupageAllowed: boolean("is_groupage_allowed").default(false)
    },
    (table) => [
        index("cargo_orderId_idx").on(table.orderId),
    ]
)

export const trip = pgTable(
    "trip",
    {
        id: text("id").primaryKey().$default(() => randomUUID()),
        legacyId: serial("legacy_id").unique().notNull(),
        orderId: text("order_id")
            .notNull()
            .references(() => order.id, { onDelete: "cascade" }),
        carrierId: text("carrier_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),
        carrierName: text("carrier_name").notNull(),

        driverId: text("driver_id")
            .references(() => driver.id, { onDelete: "set null" }),
        driverName: text("driver_name"),
        driverPassport: text("driver_passport"),
        driverPhoneNumber: text("driver_phone_number"),
        truckPlate: text("truck_plate")
            .references(() => truck.regPlate, { onDelete: "set null" }),
        trailerPlate: text("trailer_plate")
            .references(() => trailer.regPlate, { onDelete: "set null" }),
        linkPlate: text("link_plate")
            .references(() => link.regPlate, { onDelete: "set null" }),
        truckAge: truckAgeEnum("truck_age"),

        proposedLoadingDate: timestamp("proposed_loading_date").notNull(),
        arrivalAtLoading: timestamp("arrival_at_loading"),
        arrivalOnTimeLoading: boolean("arrival_ontime_loading"),
        actualLoadingDate: timestamp("actual_loading_date"),
        departureLoadingDate: timestamp("departure_loading_date"),
        daysSpendLoading: integer("days_spend_loading"),

        daysSpendTraveling: integer("days_spend_traveling"),

        proposedOffloadingDate: timestamp("proposed_offloading_date").notNull(),
        arrivalAtOffloading: timestamp("arrival_at_offloading"),
        arrivalOnTimeOffloading: boolean("arrival_ontime_offloading"),
        actualOffloadingDate: timestamp("actual_offloading_date"),
        departureOffloadingDate: timestamp("departure_offloading_date"),
        daysSpendOffloading: integer("days_spend_offloading"),

        demurageCharged: boolean("demurage_charge").default(false),
        totalDemurageChargedDays: integer("total_demurage_charge_days"),

        arrivalAtBorder: timestamp("arrival_at_border"),
        departureFromBorder: timestamp("departure_from_border"),

        loadedWeight: decimal("loaded_weight"),
        offloadedWeight: decimal("offloaded_weight"),
        weightUnit: weightUnitEnum("weight_unit").default("ton"),

        tripType: tripTypeEnum("trip_type").default("normal"),
        deliveries: integer("deliveries").default(1),
        podStatus: podStatusEnum("pod_status"),
        status: tripStatusEnum("status").default("booked"),

        carrierInvoiceNumber: text("carrier_invoice_number"),
        carrierInvoiceDate: timestamp("carrier_invoice_date"),
        fiscalRegime: fiscalRegimeEnum("fiscal_regime"),
        carrierSubtotal: numeric("carrier_subtotal"),
        carrierVAT: numeric("carrier_vat"),
        carrierTotal: numeric("carrier_total"),
        carrierCurrency: currencyEnum("carrier_currency").default("MZN"),
        carrierPaidPartially: text("carrier_paid_partially"),
        carrierPaidAmount: numeric("carrier_paid_amount"),
        carrierPaidPercentage: numeric("carrier_paid_percentage"),
        carrierPaymentStatus: paymentStatusEnum("carrier_payment_status"),
        carrierRemainingAmount: numeric("carrier_remaining_amount"),
        carrierRemainingPercentage: numeric("carrier_remaining_percentage"),
        carrierFullPaymentDate: timestamp("carrier_full_payment_date"),

        insuranceSubscriber: text("insurance_subscriber"),
        insuranceValue: numeric("insurance_value"),
        insuranceCurrency: currencyEnum("insurance_currency"),
        insuranceStatus: insurancePaymentStatusEnum("insurance_status"),

        apploadCommissionSubtotal: numeric("appload_commission_subtotal"),
        apploadCommissionVAT: numeric("appload_commission_vat"),
        apploadCommissionTotal: numeric("appload_commission_total"),

        shipperInvoiceNumber: text("shipper_invoice_number"),
        shipperInvoiceDate: timestamp("shipper_invoice_date"),
        shipperSubtotal: numeric("shipper_subtotal"),
        shipperVAT: numeric("shipper_vat"),
        shipperTotal: numeric("shipper_total"),
        shipperCurrency: currencyEnum("shipper_currency").default("MZN"),
        shipperPaidPartially: text("shipper_paid_partially"),
        shipperPaidAmount: numeric("shipper_paid_amount"),
        shipperPaidPercentage: numeric("shipper_paid_percentage"),
        shipperPaymentStatus: paymentStatusEnum("shipper_payment_status"),
        shipperRemainingAmount: numeric("shipper_remaining_amount"),
        shipperRemainingPercentage: numeric("shipper_remaining_percentage"),
        shipperFullPaymentDate: timestamp("shipper_full_payment_date"),

        numberOfMechanicalFailuresStops: integer("number_mechanical_failures_stops").default(0),
        totalMechanicalFailuresDelayedDays: integer("total_mechanical_failures_delayed_days"),
        numberOfDocumentationIssuesStops: integer("number_documentation_issues_stops").default(0),
        totalDocumentationIssuesDelayedDays: integer("total_documentation_issues_delayed_days"),
        numberOfPoliceStops: integer("number_police_stops").default(0),
        totalPoliceDelayedDays: integer("total_police_delayed_days"),

        numberAccidents: integer("number_accidents").default(0),
        cargoDamaged: boolean("cargo_damaged").default(false),
        damagedPercent: numeric("damaged_percent"),
        claimed: boolean("claimed").default(false),

        ageFactor: numeric("age_factor"),
        loadFactor: numeric("load_factor"),
        defaultCoefficient: numeric("default_coefficient"),
        costPerKm: numeric("cost_per_km"),
        costPerUnit: numeric("cost_per_unit"),
        costPerUnitKm: numeric("cost_per_unit_km"),
        totalFuelCost: numeric("total_fuel_cost"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    }
)

export const offer = pgTable(
    "offer",
    {
        id: text("id").primaryKey().$default(() => randomUUID()),
        orderId: text("order_id")
            .notNull()
            .references(() => order.id, { onDelete: "cascade" }),
        carrierId: text("carrier_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),
        proposedLoadingDate: timestamp("proposed_loading_date"),
        proposedOffloadingDate: timestamp("proposed_offloading_date"),

        driverId: text("driver_id")
            .references(() => driver.id, { onDelete: "set null" }),
        driverName: text("driver_name"),
        driverPassport: text("driver_passport"),
        driverPhoneNumber: text("driver_phone_number"),
        truckPlate: text("truck_plate")
            .references(() => truck.regPlate, { onDelete: "set null" }),
        truckAge: truckAgeEnum("truck_age"),
        trailerPlate: text("trailer_plate")
            .references(() => trailer.regPlate, { onDelete: "set null" }),
        linkPlate: text("link_plate")
            .references(() => link.regPlate, { onDelete: "set null" }),

        status: text("status").default("pending"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    }
)

export const orderRelations = relations(order, ({ one, many }) => ({
    shipper: one(organization, {
        fields: [order.shipperId],
        references: [organization.id]
    }),
    cargo: one(cargo),
    offer: many(offer),
    trips: many(trip),
}))

export const cargoRelations = relations(cargo, ({ one })=> ({
    order: one(order, {
        fields: [cargo.orderId],
        references: [order.id]
    })
}))

export const offerRelations = relations(offer, ({ one }) => ({
    order: one(order, {
        fields: [offer.orderId],
        references: [order.id]
    }),
    carrier: one(organization, {
        fields: [offer.carrierId],
        references: [organization.id]
    })
}))

export const tripRelations = relations(trip, ({ one }) => ({
    order: one(order, {
        fields: [trip.orderId],
        references: [order.id]
    }),
    carrier: one(organization, {
        fields: [trip.carrierId],
        references: [organization.id]
    }),
    driver: one(driver, {
        fields: [trip.driverId],
        references: [driver.id]
    }),
    truck: one(truck, {
        fields: [trip.truckPlate],
        references: [truck.regPlate]
    }),
    trailer: one(trailer, {
        fields: [trip.trailerPlate],
        references: [trailer.regPlate]
    }),
    link: one(link, {
        fields: [trip.linkPlate],
        references: [link.regPlate]
    })
}))