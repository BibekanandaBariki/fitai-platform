import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const authRouter = createTRPCRouter({
  getUserProfile: protectedProcedure.query(async ({ ctx }) => {
    // return ctx.user;
    return { id: 1, name: 'Mock User' };
  }),

  // Sample mutation
  updateLanguage: protectedProcedure
    .input(z.object({ language: z.enum(['en', 'hi', 'ta', 'te', 'bn']) }))
    .mutation(async ({ ctx, input }) => {
      // Implementation stub
      return { success: true, language: input.language };
    }),
});
