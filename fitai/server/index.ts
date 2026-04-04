import { createTRPCRouter } from './trpc';
import { authRouter } from './routers/auth';
import { workoutRouter } from './routers/workout';
import { profileRouter } from './routers/profile';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  workout: workoutRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;
