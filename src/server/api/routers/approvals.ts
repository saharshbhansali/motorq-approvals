import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForApproval = (user: User) => {
  return {
    id: user.id, 
    username: user.username, 
    profilePicture: user.imageUrl
  };
}

export const approvalsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const approvals = await ctx.prisma.approvals.findMany({
      take: 100,
      include: {
        request: true,
      },
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: approvals.map((approval) => approval.approverId),
        limit: 100,
      }))
      .map(filterUserForApproval);

    return approvals.map((approval) => {
      const approver = users.find((user) => user.id === approval.approverId);
      if (!approver) 
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "Approver not found" 
        });
      
      return {
        approval,
        approver,
      };
    });
  }),
});

