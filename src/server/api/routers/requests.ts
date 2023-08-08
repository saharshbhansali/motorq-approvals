import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForRequest = (user: User) => {
  return {
    id: user.id, 
    username: user.username, 
    profilePicture: user.imageUrl
  };
}

export const requestsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const requests = await ctx.prisma.requests.findMany({
      take: 100,
      include: {
        workflow: true,
      },
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: requests.map((request) => request.requesterId),
        limit: 100,
      }))
      .map(filterUserForRequest);

    return requests.map((request) => {
      const requester = users.find((user) => user.id === request.requesterId);
      if (!requester) 
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "Requester not found" 
        });
      
      return {
        request,
        requester,
      };
    });
  }),
});
