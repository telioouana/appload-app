import { createTRPCRouter } from "@/backend/trpc/init";

import { ordersRouter } from "@/modules/main/pages/orders/server/procedures";

export const appRouter = createTRPCRouter({
    // merge your routers here
    orders: ordersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;