import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const workflowsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const workflows = await ctx.prisma.workflows.findMany({
      take: 100,
      include: {
          requests: true,
      },
    });

    return workflows;
  }),
});
