import { 
  pgTable, 
  uuid, 
  varchar, 
  timestamp, 
  boolean, 
  decimal, 
  date, 
  pgEnum, 
  integer, 
  jsonb, 
  text 
} from "drizzle-orm/pg-core";

// --- ENUMS --- //
export const authProviderEnum = pgEnum('auth_provider', ['google', 'phone', 'email']);
export const subscriptionTierEnum = pgEnum('subscription_tier', ['free', 'pro', 'elite', 'corporate']);
export const languageEnum = pgEnum('language', ['en', 'hi', 'ta', 'te', 'bn']);
export const genderEnum = pgEnum('gender', ['male', 'female', 'other', 'prefer_not']);
export const fitnessGoalEnum = pgEnum('fitness_goal', ['lose_weight', 'gain_muscle', 'maintain', 'athletic', 'flexibility', 'general_health']);
export const experienceLevelEnum = pgEnum('experience_level', ['beginner', 'intermediate', 'advanced', 'athlete']);
export const activityLevelEnum = pgEnum('activity_level', ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']);
export const bodyTypeEnum = pgEnum('body_type', ['ectomorph', 'mesomorph', 'endomorph']);
export const conditionTypeEnum = pgEnum('condition_type', ['injury', 'chronic_disease', 'allergy', 'surgery', 'disability', 'other']);
export const severityEnum = pgEnum('severity', ['mild', 'moderate', 'severe']);
export const planTypeEnum = pgEnum('plan_type', ['ai_generated', 'trainer_created', 'template', 'custom']);
export const planGoalEnum = pgEnum('plan_goal', ['strength', 'hypertrophy', 'endurance', 'fat_loss', 'mobility', 'sport_specific']);
export const workoutLocationEnum = pgEnum('workout_location', ['gym', 'home', 'outdoor', 'mixed']);

// --- TABLES --- //

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email').unique(),
  phone: varchar('phone').unique(),
  authProvider: authProviderEnum('auth_provider'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastActive: timestamp('last_active', { withTimezone: true }),
  subscriptionTier: subscriptionTierEnum('subscription_tier').default('free'),
  subscriptionExpiresAt: timestamp('subscription_expires_at', { withTimezone: true }),
  language: languageEnum('language').default('en'),
  timezone: varchar('timezone'),
  isOnboarded: boolean('is_onboarded').default(false),
  referralCode: varchar('referral_code').unique(),
  referredById: uuid('referred_by') // Self-referencing FK should be handled at relation level or explicitly
});

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).unique().notNull(),
  fullName: varchar('full_name'),
  dateOfBirth: date('date_of_birth'),
  gender: genderEnum('gender'),
  heightCm: decimal('height_cm'),
  weightKg: decimal('weight_kg'),
  targetWeightKg: decimal('target_weight_kg'),
  bodyFatPercentage: decimal('body_fat_percentage'),
  // BMI can be calculated virtually in app logic
  fitnessGoal: fitnessGoalEnum('fitness_goal'),
  experienceLevel: experienceLevelEnum('experience_level'),
  activityLevel: activityLevelEnum('activity_level'),
  bodyType: bodyTypeEnum('body_type'),
  profilePhotoUrl: varchar('profile_photo_url'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export const userHealthConditions = pgTable('user_health_conditions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  conditionType: conditionTypeEnum('condition_type'),
  conditionName: varchar('condition_name'),
  affectedBodyPart: varchar('affected_body_part'),
  severity: severityEnum('severity'),
  isActive: boolean('is_active').default(true),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const workoutPlans = pgTable('workout_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  planName: varchar('plan_name').notNull(),
  planType: planTypeEnum('plan_type'),
  goal: planGoalEnum('goal'),
  durationWeeks: integer('duration_weeks'),
  daysPerWeek: integer('days_per_week'),
  equipmentRequired: jsonb('equipment_required'), // Array of strings
  workoutLocation: workoutLocationEnum('workout_location'),
  difficultyLevel: integer('difficulty_level'),
  estimatedDurationMinutes: integer('estimated_duration_minutes'),
  isActive: boolean('is_active').default(true),
  aiReasoning: text('ai_reasoning'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export const workoutDays = pgTable('workout_days', {
  id: uuid('id').primaryKey().defaultRandom(),
  planId: uuid('plan_id').references(() => workoutPlans.id).notNull(),
  dayNumber: integer('day_number'),
  dayName: varchar('day_name'),
  muscleGroups: jsonb('muscle_groups'), // array of strings
  estimatedDurationMinutes: integer('estimated_duration_minutes'),
  warmupExercises: jsonb('warmup_exercises'),
  coolDownExercises: jsonb('cool_down_exercises')
});

// Added remaining relationships as needed.
