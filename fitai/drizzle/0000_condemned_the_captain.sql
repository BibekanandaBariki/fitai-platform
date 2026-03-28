CREATE TYPE "public"."activity_level" AS ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active');--> statement-breakpoint
CREATE TYPE "public"."auth_provider" AS ENUM('google', 'phone', 'email');--> statement-breakpoint
CREATE TYPE "public"."body_type" AS ENUM('ectomorph', 'mesomorph', 'endomorph');--> statement-breakpoint
CREATE TYPE "public"."condition_type" AS ENUM('injury', 'chronic_disease', 'allergy', 'surgery', 'disability', 'other');--> statement-breakpoint
CREATE TYPE "public"."experience_level" AS ENUM('beginner', 'intermediate', 'advanced', 'athlete');--> statement-breakpoint
CREATE TYPE "public"."fitness_goal" AS ENUM('lose_weight', 'gain_muscle', 'maintain', 'athletic', 'flexibility', 'general_health');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other', 'prefer_not');--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('en', 'hi', 'ta', 'te', 'bn');--> statement-breakpoint
CREATE TYPE "public"."plan_goal" AS ENUM('strength', 'hypertrophy', 'endurance', 'fat_loss', 'mobility', 'sport_specific');--> statement-breakpoint
CREATE TYPE "public"."plan_type" AS ENUM('ai_generated', 'trainer_created', 'template', 'custom');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('mild', 'moderate', 'severe');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('free', 'pro', 'elite', 'corporate');--> statement-breakpoint
CREATE TYPE "public"."workout_location" AS ENUM('gym', 'home', 'outdoor', 'mixed');--> statement-breakpoint
CREATE TABLE "user_health_conditions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"condition_type" "condition_type",
	"condition_name" varchar,
	"affected_body_part" varchar,
	"severity" "severity",
	"is_active" boolean DEFAULT true,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"full_name" varchar,
	"date_of_birth" date,
	"gender" "gender",
	"height_cm" numeric,
	"weight_kg" numeric,
	"target_weight_kg" numeric,
	"body_fat_percentage" numeric,
	"fitness_goal" "fitness_goal",
	"experience_level" "experience_level",
	"activity_level" "activity_level",
	"body_type" "body_type",
	"profile_photo_url" varchar,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"phone" varchar,
	"auth_provider" "auth_provider",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_active" timestamp with time zone,
	"subscription_tier" "subscription_tier" DEFAULT 'free',
	"subscription_expires_at" timestamp with time zone,
	"language" "language" DEFAULT 'en',
	"timezone" varchar,
	"is_onboarded" boolean DEFAULT false,
	"referral_code" varchar,
	"referred_by" uuid,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "users_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "workout_days" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"day_number" integer,
	"day_name" varchar,
	"muscle_groups" jsonb,
	"estimated_duration_minutes" integer,
	"warmup_exercises" jsonb,
	"cool_down_exercises" jsonb
);
--> statement-breakpoint
CREATE TABLE "workout_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_name" varchar NOT NULL,
	"plan_type" "plan_type",
	"goal" "plan_goal",
	"duration_weeks" integer,
	"days_per_week" integer,
	"equipment_required" jsonb,
	"workout_location" "workout_location",
	"difficulty_level" integer,
	"estimated_duration_minutes" integer,
	"is_active" boolean DEFAULT true,
	"ai_reasoning" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_health_conditions" ADD CONSTRAINT "user_health_conditions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_days" ADD CONSTRAINT "workout_days_plan_id_workout_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."workout_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_plans" ADD CONSTRAINT "workout_plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;