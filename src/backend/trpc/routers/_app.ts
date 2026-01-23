import { createTRPCRouter } from "@/backend/trpc/init";

export const appRouter = createTRPCRouter({
    // merge your routers here
});

// export type definition of API
export type AppRouter = typeof appRouter;