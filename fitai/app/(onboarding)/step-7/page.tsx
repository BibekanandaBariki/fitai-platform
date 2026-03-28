"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Smartphone, Activity } from "lucide-react";
import confetti from "canvas-confetti";
import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useOnboardingStore } from "@/store/onboardingStore";

export default function OnboardingStep7() {
    const router = useRouter();
    const [isFinishing, setIsFinishing] = useState(false);
    
    // Get stored data
    const { primaryGoal, experienceYears, days, location } = useOnboardingStore();
    
    // TRPC Mutation
    const generatePlan = trpc.workout.generatePlan.useMutation({
        onSuccess: (data) => {
            console.log("Plan Generated successfully:", data);
            router.push("/dashboard");
        },
        onError: (err) => {
            console.error("Failed to generate plan:", err);
            alert("Failed to generate your personalized plan. Trying fallback.");
            router.push("/dashboard");
        }
    });

    const handleFinish = () => {
        setIsFinishing(true);

        // Trigger confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        // Map state to TRPC schema securely
        let goalEnum: any = 'general_health';
        if (primaryGoal === 'Build Muscle') goalEnum = 'hypertrophy';
        if (primaryGoal === 'Lose Fat') goalEnum = 'fat_loss';
        if (primaryGoal === 'Get Stronger') goalEnum = 'strength';

        let expEnum: any = 'beginner';
        if (experienceYears && experienceYears > 1) expEnum = 'intermediate';
        if (experienceYears && experienceYears > 3) expEnum = 'advanced';

        const equipment = location === 'Gym' ? ['barbell', 'dumbbell', 'machine', 'cable'] : ['bodyweight', 'bands'];

        generatePlan.mutate({
            goal: goalEnum,
            experienceLevel: expEnum,
            daysPerWeek: Math.max(2, Math.min(7, days.length || 3)),
            durationWeeks: 8,
            equipment
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <div className="w-full h-1 bg-muted fixed top-0 left-0 z-50">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "84%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="container mx-auto flex h-16 items-center px-4 mt-2">
                {!isFinishing && (
                    <Button variant="ghost" size="icon" onClick={() => router.push("/step-6")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                )}
            </div>

            <main className="flex-1 container mx-auto px-4 pb-32 max-w-xl flex flex-col justify-center">
                {!isFinishing ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Smartphone className="h-10 w-10 text-primary" />
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-4 tracking-tight">
                            One last thing!
                        </h1>
                        <p className="text-muted-foreground mb-10 text-lg">
                            Connect your wearables to give FitAI real-time health data for better recovery insights.
                        </p>

                        <div className="space-y-4 text-left max-w-md mx-auto">
                            {/* Integration Cards */}
                            <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                        <Activity className="text-red-500 h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Apple Health</h3>
                                        <p className="text-xs text-muted-foreground">Steps, sleep, heart rate</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-full">Connect</Button>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white border rounded-lg flex items-center justify-center">
                                        {/* Google Icon placeholder */}
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Google Fit</h3>
                                        <p className="text-xs text-muted-foreground">Steps, weight, workouts</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-full">Connect</Button>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full max-w-md h-14 mt-10 text-base shadow-primary/30 shadow-[0_8px_30px_rgb(34,197,94,0.3)] transition-all"
                            onClick={handleFinish}
                        >
                            Generate My AI Plan <Check className="ml-2 h-5 w-5" />
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4">You can always connect these later in Settings.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                    >
                        <div className="relative w-32 h-32 mx-auto mb-8">
                            {/* Spinner */}
                            <svg className="animate-spin w-full h-full text-primary/20" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" strokeWidth="4" stroke="currentColor" />
                                <circle cx="50" cy="50" r="45" fill="none" strokeWidth="4" stroke="currentColor" strokeDasharray="70 200" className="text-primary" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Activity className="h-10 w-10 text-primary animate-pulse" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-heading font-bold mb-2 tracking-tight">
                            Claude AI is building your plan
                        </h1>
                        <p className="text-muted-foreground">
                            Analyzing your goals, syncing medical limits, and optimizing volume...
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
