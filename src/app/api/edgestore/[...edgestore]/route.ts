import { z } from "zod"
import { initEdgeStore } from "@edgestore/server"
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app"

const es = initEdgeStore.create();

/**
 * This is the main router for the EdgeStore buckets.
 */
const edgeStoreRouter = es.router({
    apploadFiles: es
        .fileBucket({
            maxSize: 1024 * 1024 * 2,
            accept: ["application/pdf"]
        })
        .input(
            z.object({
                owner: z.string(),
                path: z.string(),
            })
        )
        .path(({ input }) => [
            { owner: input.owner },
            { type: input.path },
        ])
        .beforeDelete(() => {
            return true; // allow delete
        }),

    publicImages: es
        .imageBucket({
            maxSize: 1024 * 1024 * 1,
            accept: ["image/png", "image/jpg"]
        })
        .input(
            z.object({
                owner: z.string().min(9).max(15),
                path: z.enum(["profile", "logo"]),
            })
        )
        .path(({ input }) => [
            { owner: input.owner },
            { type: input.path },
        ])
        .beforeDelete(({ fileInfo }) => {
            console.log("beforeDelete", fileInfo);
            return true; // allow delete
        }),
});

const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;