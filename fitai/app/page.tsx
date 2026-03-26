"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Brain, Target, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-heading text-xl font-bold tracking-tight">FitAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-medium text-muted-foreground hover:text-foreground">Log in</Button>
            </Link>
            <Link href="/login">
              <Button className="font-semibold shadow-primary/20 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]">Start Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-7xl leading-tight">
              Your AI Personal <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-cyan-400">
                Fitness Ecosystem
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Transform your body with hyper-personalized AI workout plans, meal tracking, real-time form checking, and 24/7 coaching. Built for India, ready for the world.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-primary/30 shadow-[0_8px_30px_rgb(34,197,94,0.3)]">
                  Start Your Transformation <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base">
                  Explore Features
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
            id="features"
          >
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-accent" />}
              title="Adaptive AI Coaching"
              description="Your plan evolves after every session. It knows when to push you and when to deload to prevent injuries."
            />
            <FeatureCard
              icon={<Target className="h-8 w-8 text-primary" />}
              title="Indian Diet Intelligence"
              description="Log 50,000+ Indian foods via photo or voice. AI calculates precise macros for thalis, street food, and home cooking."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-blue-500" />}
              title="Real-Time Form Check"
              description="Use your camera during workouts. Our AI analyzes your joint angles locally to ensure perfect form and safety."
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-2xl border bg-card/50 backdrop-blur-sm card-hover">
      <div className="mb-4 p-4 rounded-full bg-muted/50">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold font-heading">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
