import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

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

  create: privateProcedure
    .input(z.object({
      type: z.string().min(5).max(255),
    }))
    .mutation( async ({ ctx, input }) => {
      const userId = ctx.currentUser;
      const workflow = await ctx.prisma.workflows.create({
        data: {
          adminId: userId,
          type: input.type
        }
      })

      return workflow;
    }),
  
});

