import { createTRPCRouter } from "@/backend/trpc/init";

import { marketRouter } from "@/modules/app/routes/shipper/server/market-procedures";
import { publicRouter } from "@/modules/app/routes/shipper/server/public-procedures";
import { shipperMapRouter } from "@/modules/app/routes/shipper/server/map-procedures";
import { privateRouter } from "@/modules/app/routes/shipper/server/private-procedures";
import { shipperKpisRouter } from "@/modules/app/routes/shipper/server/kpis-procedures";
import { shipperOrderRouter } from "@/modules/app/routes/shipper/server/order-procedures";
import { transportersRouter } from "@/modules/app/routes/shipper/server/transporters-procedures";
import { shipperDashboardRouter } from "@/modules/app/routes/shipper/server/dashboard-procedures";

import { fleetRouter } from "@/modules/app/routes/carrier/server/fleet-procedures";
import { offerRouter } from "@/modules/app/routes/carrier/server/offer-procedures";
import { tripsRouter } from "@/modules/app/routes/carrier/server/trips-procedures";
import { driverRouter } from "@/modules/app/routes/carrier/server/driver-procedures";
import { ordersRouter } from "@/modules/app/routes/carrier/server/orders-procedures";
import { carrierMapRouter } from "@/modules/app/routes/carrier/server/map-procedures";
import { clientsRouter } from "@/modules/app/routes/carrier/server/clients-procedures";
import { historyRouter } from "@/modules/app/routes/carrier/server/history-procedures";
import { carrierKpisRouter } from "@/modules/app/routes/carrier/server/kpis-procedures";
import { carrierDashboardRouter } from "@/modules/app/routes/carrier/server/dashboard-procedures";

import { organizationRouter } from "@/modules/app/routes/user/server/organization-procedures";

export const appRouter = createTRPCRouter({
    // merge your routers here
    // Shipper Routers
    market: marketRouter,
    public: publicRouter,
    private: privateRouter,
    shipperMap: shipperMapRouter,
    shipperKpis: shipperKpisRouter,
    shipperOrder: shipperOrderRouter,
    transporters: transportersRouter,
    shipperDashboard: shipperDashboardRouter,

    // Carrier Routers
    fleet: fleetRouter,
    offer: offerRouter,
    trips: tripsRouter,
    driver: driverRouter,
    orders: ordersRouter,
    clients: clientsRouter,
    history: historyRouter,
    carrierMap: carrierMapRouter,
    carrierKpis: carrierKpisRouter,
    carrierDashboard: carrierDashboardRouter,

    // User Routers
    organization: organizationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;