import { createTRPCRouter } from './trpc';
import { authRouter } from './routers/auth';
import { workoutRouter } from './routers/workout';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  workout: workoutRouter,
});

export type AppRouter = typeof appRouter;
