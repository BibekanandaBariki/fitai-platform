"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Flame, Dumbbell, HeartPulse, Trophy, Activity, PersonStanding } from "lucide-react";
import { cn } from "@/lib/utils";

const GOALS = [
    { id: "lose_weight", title: "Lose Weight", desc: "Burn fat and lean down", icon: Flame },
    { id: "gain_muscle", title: "Build Muscle", desc: "Increase mass & strength", icon: Dumbbell },
    { id: "get_fit", title: "Get Fit", desc: "Improve overall stamina", icon: HeartPulse },
    { id: "athletic", title: "Athletic", desc: "Train for a sport or event", icon: Trophy },
    { id: "flexibility", title: "Flexibility", desc: "Better mobility & joints", icon: PersonStanding },
    { id: "general_health", title: "General Health", desc: "Build healthy habits", icon: Activity },
];

export default function OnboardingStep1() {
    const { primaryGoal, updateData } = useOnboardingStore();
    const router = useRouter();

    const handleNext = () => {
        if (primaryGoal) {
            router.push("/onboarding/step-2");
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Progress Header */}
            <div className="w-full h-1 bg-muted fixed top-0 left-0 z-50">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "14%" }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="container mx-auto flex h-16 items-center px-4 mt-2">
                <Button variant="ghost" size="icon" onClick={() => router.push("/login")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="ml-auto text-sm font-medium text-muted-foreground mr-2">1 of 7</span>
            </div>

            <main className="flex-1 container mx-auto px-4 pb-24 max-w-2xl mt-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3 tracking-tight">
                        What's your main goal?
                    </h1>
                    <p className="text-muted-foreground mb-8 text-lg">
                        We'll personalize FitAI to help you get there faster.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {GOALS.map((goal) => {
                            const Icon = goal.icon;
                            const isSelected = primaryGoal === goal.id;

                            return (
                                <button
                                    key={goal.id}
                                    onClick={() => updateData({ primaryGoal: goal.id })}
                                    className={cn(
                                        "flex items-start text-left p-6 rounded-xl border-2 transition-all press-glow relative overflow-hidden group",
                                        isSelected
                                            ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                                            : "border-border bg-card hover:border-primary/50"
                                    )}
                                >
                                    <div className={cn(
                                        "p-3 rounded-full mr-4 transition-colors",
                                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary"
                                    )}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg font-heading">{goal.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{goal.desc}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </main>

            {/* Floating Bottom Bar */}
            <div className="fixed bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-md border-t">
                <div className="container mx-auto max-w-2xl flex justify-between items-center">
                    <Button variant="ghost" onClick={() => router.push("/onboarding/step-2")} className="text-muted-foreground">
                        Skip
                    </Button>
                    <Button
                        size="lg"
                        className="w-32 h-12 shadow-primary/20 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]"
                        disabled={!primaryGoal}
                        onClick={handleNext}
                    >
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
