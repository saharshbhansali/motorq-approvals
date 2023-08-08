import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const workflowsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.workflows.findMany({
        include: {
            requests: true,
        },
    });
  }),
});
