import { createTRPCRouter } from "@/backend/trpc/init";

import { publicRouter } from "@/modules/app/routes/shipper/server/public-procedures";
import { shipperMapRouter } from "@/modules/app/routes/shipper/server/map-procedures";
import { privateRouter } from "@/modules/app/routes/shipper/server/private-procedures";
import { shipperKpisRouter } from "@/modules/app/routes/shipper/server/kpis-procedures";
import { shipperOrderRouter } from "@/modules/app/routes/shipper/server/order-procedures";
import { shipperDashboardRouter } from "@/modules/app/routes/shipper/server/dashboard-procedures";

import { driverRouter } from "@/modules/app/routes/carrier/server/driver-procedures";
import { ordersRouter } from "@/modules/app/routes/carrier/server/orders-procedures";
import { carrierMapRouter } from "@/modules/app/routes/carrier/server/map-procedures";
import { carrierDashboardRouter } from "@/modules/app/routes/carrier/server/dashboard-procedures";

export const appRouter = createTRPCRouter({
    // merge your routers here
    // Shipper Routers
    public: publicRouter,
    private: privateRouter,
    shipperMap: shipperMapRouter,
    shipperKpis: shipperKpisRouter,
    shipperOrder: shipperOrderRouter,
    shipperDashboard: shipperDashboardRouter,

    // Carrier Routers
    driver: driverRouter,
    orders: ordersRouter,
    carrierMap: carrierMapRouter,
    carrierDashboard: carrierDashboardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;