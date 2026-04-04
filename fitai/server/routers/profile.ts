import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { db } from '@/db';
import { users, userProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const profileRouter = createTRPCRouter({

  // Get current user's saved profile
  get: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    const [user] = await db
      .select({ isOnboarded: users.isOnboarded, journeyStartedAt: users.journeyStartedAt })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return { profile: profile ?? null, isOnboarded: user?.isOnboarded ?? false, journeyStartedAt: user?.journeyStartedAt ?? null };
  }),

  // Save / upsert profile and mark user as onboarded
  save: protectedProcedure
    .input(z.object({
      fullName:       z.string().optional(),
      gender:         z.enum(['male', 'female', 'other', 'prefer_not']).optional(),
      heightCm:       z.number().optional(),
      weightKg:       z.number().optional(),
      targetWeightKg: z.number().optional(),
      fitnessGoal:    z.enum(['lose_weight', 'gain_muscle', 'maintain', 'athletic', 'flexibility', 'general_health']).optional(),
      experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'athlete']).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Upsert userProfiles
      const existing = await db.select({ id: userProfiles.id, journeyStartedAt: userProfiles.journeyStartedAt })
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);

      const now = new Date();

      if (existing.length === 0) {
        await db.insert(userProfiles).values({
          userId,
          fullName:       input.fullName,
          gender:         input.gender,
          heightCm:       input.heightCm?.toString(),
          weightKg:       input.weightKg?.toString(),
          targetWeightKg: input.targetWeightKg?.toString(),
          fitnessGoal:    input.fitnessGoal,
          experienceLevel: input.experienceLevel,
          journeyStartedAt: now,
        });
      } else {
        await db.update(userProfiles)
          .set({
            fullName:       input.fullName,
            gender:         input.gender,
            heightCm:       input.heightCm?.toString(),
            weightKg:       input.weightKg?.toString(),
            targetWeightKg: input.targetWeightKg?.toString(),
            fitnessGoal:    input.fitnessGoal,
            experienceLevel: input.experienceLevel,
            updatedAt: now,
          })
          .where(eq(userProfiles.userId, userId));
      }

      // Mark user as onboarded + record journey start time
      await db.update(users)
        .set({ isOnboarded: true, journeyStartedAt: existing[0]?.journeyStartedAt ?? now })
        .where(eq(users.id, userId));

      return { success: true };
    }),

  // Reset journey — wipes profile and resets onboarding flag
  reset: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;
    const now = new Date();

    await db.update(userProfiles)
      .set({ journeyStartedAt: now, updatedAt: now })
      .where(eq(userProfiles.userId, userId));

    await db.update(users)
      .set({ isOnboarded: false, journeyStartedAt: now })
      .where(eq(users.id, userId));

    return { success: true };
  }),
  // Get global leaderboard
  getLeaderboard: protectedProcedure.query(async ({ ctx }) => {
    // Get all users who have started a journey
    // Notice: userProfiles has fullName, users has email and journeyStartedAt
    // It's easier to just pull users and left join userProfiles for names
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        journeyStartedAt: users.journeyStartedAt,
        fullName: userProfiles.fullName,
        avatar: userProfiles.profilePhotoUrl,
      })
      .from(users)
      .leftJoin(userProfiles, eq(userProfiles.userId, users.id));

    // Calculate XP for each
    const now = Date.now();
    const leaderboard = allUsers
      .filter((u) => u.journeyStartedAt) // only users who started
      .map((u) => {
        const started = new Date(u.journeyStartedAt!).getTime();
        const days = Math.floor((now - started) / 86_400_000);
        const xp = days * 100 + 500;
        
        let initialName = u.fullName?.split(" ")[0] || u.email?.split("@")[0] || "Athlete";
        return {
          id: u.id,
          name: initialName,
          xp: xp,
          avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${initialName}`,
          isMe: u.id === ctx.user.id
        };
      })
      .sort((a, b) => b.xp - a.xp)
      .map((user, index) => ({ ...user, rank: index + 1 }));

    return leaderboard;
  }),
});
