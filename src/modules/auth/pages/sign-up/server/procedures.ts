"use server"

import { eq } from "drizzle-orm"

import { db } from "@/backend/db"
import { user } from "@/backend/db/schema"
import { APIError } from "better-auth"

export async function checkUser(value: string, type: "email" | "phoneNumber") {
    let person: typeof user.$inferSelect[][0] | undefined

    if (type === "email") { [person] = await db.select().from(user).where(eq(user.email, value)).limit(1) }
    else { [person] = await db.select().from(user).where(eq(user.phoneNumber, value)).limit(1) }

    if (!person) return false
    else if (person) return true
    else throw new APIError("INTERNAL_SERVER_ERROR", { message: "Unable to verify user" })
}

export async function updatePhoneNumber(oldPhone: string, phoneNumber: string) {
    const person = await checkUser(phoneNumber, "phoneNumber")

    if (person) return true

    const [updatedUser] = await db.update(user)
        .set({ phoneNumber })
        .where(eq(user.phoneNumber, oldPhone))
        .returning()

    if (!updatedUser) {
        throw new APIError("INTERNAL_SERVER_ERROR", { message: "UPDATE_PHONE_FAILED" })
    }
}