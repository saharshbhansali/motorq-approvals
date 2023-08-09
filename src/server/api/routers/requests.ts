import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const requestsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const requests = await ctx.prisma.requests.findMany({
      take: 100,
      orderBy: {createdAt: "desc"},
      include: {
        workflow: true,
      },
    });

    return requests;
  }),

  create: privateProcedure
    .input(z.object({
      content: z.string().min(1).max(255),
      attachments: z.string().min(1).max(255),
      workflowType: z.string().min(1).max(255),
    }))
    .mutation( async ({ ctx, input }) => {
      const userId = ctx.currentUser;
      const request = await ctx.prisma.requests.create({
        data:{
          requesterId: userId,
          content: input.content,
          attachments: input.attachments,
          workflowType: input.workflowType,
          status: "pending",
        },
      });

      return request;
    }),
  
});
