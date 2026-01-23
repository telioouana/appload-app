import superjson from "superjson"

import { cache } from "react";
import { headers } from "next/headers";
import { initTRPC, TRPCError } from "@trpc/server"

import { auth } from "@/backend/auth";

export const createTRPCContext = cache(async () => {
    /**
     * @see: https://trpc.io/docs/server/context
     */
})

// Initialize tRPC with the context we just created and the SuperJSON transformer.
const t = initTRPC.create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
})

// Create a caller factory for making server-side tRPC calls from loaders or actions.
export const createCallerFactory = t.createCallerFactory

// Utility for creating a tRPC router
export const createTRPCRouter = t.router

// Create a utility function for protected tRPC procedures that require an authenticated user.
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) throw new TRPCError({ code: "UNAUTHORIZED" })
    // const { success } = await ratelimit.limit(user.id)
    // if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" })

    return next({ ctx: { ...ctx, auth: session } })
})