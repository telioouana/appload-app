import { randomUUID } from "crypto";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, integer, index, uniqueIndex, jsonb, primaryKey, } from "drizzle-orm/pg-core";

import { Urls } from "@/backend/db/types";

export const user = pgTable(
    "user",
    {
        id: text("id").primaryKey(),
        name: text("name").notNull(),
        email: text("email").notNull().unique(),
        emailVerified: boolean("email_verified").default(false).notNull(),
        image: text("image"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        phoneNumber: text("phone_number").unique(),
        phoneNumberVerified: boolean("phone_number_verified"),
        role: text("role"),
        banned: boolean("banned").default(false),
        banReason: text("ban_reason"),
        banExpires: timestamp("ban_expires"),
        type: text("type", { enum: ["appload", "shipper", "carrier"] }).notNull(),
        gender: text("gender", { enum: ["male", "female", "other"] }),
        status: text("status", { enum: ["active", "closed"] })
            .default("active")
            .notNull(),
    });

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        impersonatedBy: text("impersonated_by"),
        activeOrganizationId: text("active_organization_id"),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const organization = pgTable(
    "organization",
    {
        id: text("id").primaryKey(),
        name: text("name").notNull(),
        slug: text("slug").notNull().unique(),
        logo: text("logo"),
        createdAt: timestamp("created_at").notNull(),
        metadata: text("metadata"),
        subscriptionPlan: text("subscription_plan", { enum: ["free", "pro"] })
            .default("free")
            .notNull(),
        nuit: integer("nuit").notNull().unique(),
        type: text("type", { enum: ["shipper", "carrier"] }).notNull(),
        status: text("status", { enum: ["pending", "active", "closed"] })
            .default("pending")
            .notNull(),
        email: text("email").notNull(),
        phoneNumber: text("phone_number").notNull(),
        billingAddress: text("billing_address").notNull(),
        physicalAddress: text("physical_address").notNull(),
    },
    (table) => [uniqueIndex("organization_slug_uidx").on(table.slug)],
);

export const network = pgTable(
    "network",
    {
        shipperId: text("shipper_id").notNull().references(() => organization.id),
        carrierId: text("carrier_id").notNull().references(() => organization.id),
    },
    (table) => [primaryKey({ columns: [table.shipperId, table.carrierId] })]
)

export const kyc = pgTable(
    "kyc",
    {
        id: text("id").primaryKey().$default(() => randomUUID()),
        organizationId: text("organization_id")
            .unique()
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),
        fiscalRegime: text("fiscal_regime"),
        idCard: jsonb("id_card").$type<Urls>(),
        nuit: jsonb("nuit").$type<Urls>(),
        alvara: jsonb("alvara").$type<Urls>(),
        bankLetter: jsonb("bank_letter").$type<Urls>(),
        republicBulletin: jsonb("republic_bulletin").$type<Urls>(),
        commercialExercise: jsonb("commercial_exercise").$type<Urls>(),
        commercialCertificate: jsonb("commercial_certificate").$type<Urls>(),
    },
    (table) => [index("kyc_organizationId_idx").on(table.organizationId)],
)

export const member = pgTable(
    "member",
    {
        id: text("id").primaryKey(),
        organizationId: text("organization_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        role: text("role").default("member").notNull(),
        createdAt: timestamp("created_at").notNull(),
    },
    (table) => [
        index("member_organizationId_idx").on(table.organizationId),
        index("member_userId_idx").on(table.userId),
    ],
);

export const invitation = pgTable(
    "invitation",
    {
        id: text("id").primaryKey(),
        organizationId: text("organization_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),
        email: text("email").notNull(),
        role: text("role"),
        status: text("status").default("pending").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        inviterId: text("inviter_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
    },
    (table) => [
        index("invitation_organizationId_idx").on(table.organizationId),
        index("invitation_email_idx").on(table.email),
    ],
);

export const userRelations = relations(user, ({ many }) => ({
    members: many(member),
    sessions: many(session),
    accounts: many(account),
    invitations: many(invitation),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const organizationRelations = relations(
    organization,
    ({ one, many }) => ({
        kyc: one(kyc),
        members: many(member),
        invitations: many(invitation),
    }),
);

export const memberRelations = relations(member, ({ one }) => ({
    organization: one(organization, {
        fields: [member.organizationId],
        references: [organization.id],
    }),
    user: one(user, {
        fields: [member.userId],
        references: [user.id],
    }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
    organization: one(organization, {
        fields: [invitation.organizationId],
        references: [organization.id],
    }),
    user: one(user, {
        fields: [invitation.inviterId],
        references: [user.id],
    }),
}));