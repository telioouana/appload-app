import { createTRPCRouter } from "@/backend/trpc/init";

import { privateRouter } from "@/modules/shipper/main/private/server/procedures";
import { kpisRouter } from "@/modules/shipper/main/public/pages/kpis/server/procedures";
import { dashboardRouter } from "@/modules/shipper/main/public/pages/dashboard/server/procedures";

export const appRouter = createTRPCRouter({
    // merge your routers here
    
    // new layout routers
    kpis: kpisRouter,
    private: privateRouter,
    dashboard: dashboardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;