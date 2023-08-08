// import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { requestsRouter } from "./routers/requests";
import { approvalsRouter } from "./routers/approvals";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // example: exampleRouter,
  requests: requestsRouter,
  approvals: approvalsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
