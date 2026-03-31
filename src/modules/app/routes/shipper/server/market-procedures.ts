import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { and, desc, eq, lt, or } from "drizzle-orm"

import { db } from "@/backend/db"
import { market } from "@/backend/db/schema"
import { sendMarketDataNotification } from "@/backend/resend"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"

import { MarkedDataSchema } from "../schemas/market-data"

export const marketRouter = createTRPCRouter({
    request: protectedProcedure
        .input(
            z.object({
                values: MarkedDataSchema
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { values } = input
            const { session, user } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const [data] = await db
                .insert(market)
                .values({
                    shipperId: session.activeOrganizationId,
                    status: "pending",
                    ...values
                })
                .returning()

            await sendMarketDataNotification({
                requester: {
                    name: user.name,
                    email: user.email
                },
                data
            })
        }),

    history: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(8),
                cursor: z.object({
                    id: z.string(),
                    updatedAt: z.date(),
                }).nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { session } = ctx.auth
            const { cursor, limit } = input

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const data = await db
                .select()
                .from(market)
                .where(
                    cursor
                        ? or(
                            lt(market.updatedAt, cursor.updatedAt),
                            and(
                                eq(market.updatedAt, cursor.updatedAt),
                                lt(market.id, cursor.id),
                            )
                        )
                        : undefined
                )
                .orderBy(desc(market.updatedAt), desc(market.id))
                // Checking if there are more transporters from the current user
                .limit(limit + 1)

            const hasMore = data.length > limit
            // Removing the last item if there are more transporters
            const items = hasMore ? data.slice(0, - 1) : data
            // Setting the next cursor to the last item if there are more transporters
            const lastItem = items[items.length - 1]
            const nextCursor =
                hasMore
                    ? {
                        id: lastItem.id,
                        updatedAt: lastItem.updatedAt,
                    }
                    : null

            return {
                items,
                nextCursor
            }
        })
})