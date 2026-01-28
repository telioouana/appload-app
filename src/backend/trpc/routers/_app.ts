import { createTRPCRouter } from "@/backend/trpc/init";

import { orderRouter } from "@/modules/main/pages/order/server/procedures";
import { ordersRouter } from "@/modules/main/pages/orders/server/procedures";
import { dashboardRouter } from "@/modules/main/pages/dashboard/server/procedures";

export const appRouter = createTRPCRouter({
    // merge your routers here
    order: orderRouter,
    orders: ordersRouter,
    dashboard: dashboardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;