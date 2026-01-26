import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/backend/trpc/routers/_app";
import { createTRPCContext } from "@/backend/trpc/init";

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: createTRPCContext,
    });
export { handler as GET, handler as POST };