import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const requestsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const requests = await ctx.prisma.requests.findMany({
      take: 100,
      include: {
        workflow: true,
      },
    });

    return requests;
  }),
});
