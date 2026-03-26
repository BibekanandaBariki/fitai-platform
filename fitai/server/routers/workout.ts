import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { workoutPlans, workoutDays } from '@/db/schema';
import { generateObject } from 'ai';
import { claudeSonnet } from '@/lib/ai/anthropic';

export const workoutRouter = createTRPCRouter({
  
  // Real AI Plan Generation Endpoint
  generatePlan: protectedProcedure
    .input(z.object({
      goal: z.enum(['strength', 'hypertrophy', 'endurance', 'fat_loss', 'mobility', 'general_health']),
      experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
      daysPerWeek: z.number().min(2).max(7),
      durationWeeks: z.number().min(4).max(12),
      equipment: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      
      const systemPrompt = `You are FitAI, a world-class certified personal trainer and strength coach. 
      Generate a realistic, balanced, and scientifically-sound resistance training plan based on the user's criteria.
      The output must strictly adhere to the requested JSON schema. Focus on progressive overload.`;

      const result = await generateObject({
        model: claudeSonnet,
        system: systemPrompt,
        prompt: `Create a ${input.durationWeeks}-week ${input.goal} plan for a ${input.experienceLevel} level user who trains ${input.daysPerWeek} days a week. They have access to: ${input.equipment.join(", ")}.`,
        schema: z.object({
          planName: z.string(),
          aiReasoning: z.string().describe("A motivational paragraph explaining why you designed the plan this way."),
          workoutDays: z.array(z.object({
            dayNumber: z.number(),
            dayName: z.string().describe("e.g. 'Push Day' or 'Full Body'"),
            muscleGroups: z.array(z.string()),
            estimatedDurationMinutes: z.number(),
            exercises: z.array(z.object({
              name: z.string(),
              targetSets: z.number(),
              targetReps: z.string().describe("e.g. '8-10' or 'AMRAP'"),
              restSeconds: z.number(),
              notes: z.string().optional()
            }))
          }))
        })
      });

      const planData = result.object;

      // In production, we would INSERT into the Drizzle PostgreSQL Database here:
      // const [newPlan] = await ctx.db.insert(workoutPlans).values({...})
      // await ctx.db.insert(workoutDays).values({...})

      return {
        success: true,
        plan: planData
      };
    }),

  getActivePlan: protectedProcedure.query(async ({ ctx }) => {
    return {
      planName: "Hypertrophy Program",
      daysPerWeek: 4,
      durationWeeks: 8,
      todayWorkout: {
        dayName: "Back & Biceps",
        weekNumber: 2,
        exercisesCount: 6,
        estimatedDurationMinutes: 45
      }
    };
  }),

  logSet: protectedProcedure
    .input(z.object({
      exerciseId: z.string().uuid(),
      setNumber: z.number(),
      weight: z.number(),
      reps: z.number(),
      rpe: z.number().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return { success: true };
    })
});

