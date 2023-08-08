import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const approvalsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const approvals = await ctx.prisma.approvals.findMany({
        include: {
            request: true,
        },
    });

    return approvals;
  }),
});
