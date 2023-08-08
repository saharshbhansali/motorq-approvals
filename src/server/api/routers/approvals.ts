import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const approvalsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.approval.findMany();
  }),
});
