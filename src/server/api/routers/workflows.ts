import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForWorkflow = (user: User) => {
  return {
    id: user.id, 
    username: user.username, 
    profilePicture: user.imageUrl
  };
}
export const workflowsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const workflows = await ctx.prisma.workflows.findMany({
      take: 100,
      include: {
        requests: true,
      },
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: workflows.map((workflow) => workflow.adminId),
        limit: 100,
      }))
      .map(filterUserForWorkflow);

    return workflows.map((workflow) => {
      const creator = users.find((user) => user.id === workflow.adminId);
      if (!creator) 
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "Admin not found" 
        });
      
      return {
        workflow,
        creator,
      };
    });
  }),
});

