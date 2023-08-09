import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const approvalsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const approvals = await ctx.prisma.approvals.findMany({
        include: {
            request: true,
        },
    });

    return approvals;
  }),

  create: privateProcedure
  .input(z.object({
    status: z.string().min(1).max(255),
  }))
  .mutation( async ({ ctx, input }) => {
    const userId = ctx.currentUser;
    const approval = await ctx.prisma.approvals.create({
      data: {
        approverId: userId,
        status: input.status,
      },
    });

    return approval;
  }),

});
