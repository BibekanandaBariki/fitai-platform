"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PUSHUPS = [
    { id: "0", label: "0" },
    { id: "1-9", label: "1 to 9" },
    { id: "10-19", label: "10 to 19" },
    { id: "20+", label: "20+" },
];

const CARDIO = [
    { id: "walk_20", label: "Can barely walk 20 min" },
    { id: "walk_60", label: "Can walk for an hour" },
    { id: "run_short", label: "Can run a little (1-2km)" },
    { id: "run_long", label: "Can run 5km+" },
];

export default function OnboardingStep3() {
    const { pushups, cardio, updateData } = useOnboardingStore();
    const router = useRouter();

    const handleNext = () => {
        if (pushups && cardio) {
            router.push("/step-4");
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <div className="w-full h-1 bg-muted fixed top-0 left-0 z-50">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "28%" }}
                    animate={{ width: "42%" }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="container mx-auto flex h-16 items-center px-4 mt-2">
                <Button variant="ghost" size="icon" onClick={() => router.push("/step-2")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="ml-auto text-sm font-medium text-muted-foreground mr-2">3 of 7</span>
            </div>

            <main className="flex-1 container mx-auto px-4 pb-32 max-w-xl mt-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3 tracking-tight">
                        How fit are you right now?
                    </h1>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Be honest. This sets the baseline for your first AI-generated plan.
                    </p>

                    <div className="space-y-8">
                        {/* Pushups Question */}
                        <div>
                            <label className="text-base font-semibold mb-3 block">
                                How many strict push-ups can you do?
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {PUSHUPS.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => updateData({ pushups: option.id })}
                                        className={cn(
                                            "flex items-center justify-center p-4 rounded-xl border-2 font-medium transition-all press-glow",
                                            pushups === option.id
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-input bg-card hover:border-border"
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cardio Question */}
                        <div>
                            <label className="text-base font-semibold mb-3 block">
                                What's your cardiovascular baseline?
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                {CARDIO.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => updateData({ cardio: option.id })}
                                        className={cn(
                                            "flex items-center p-4 rounded-xl border-2 font-medium transition-all text-left press-glow",
                                            cardio === option.id
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-input bg-card hover:border-border"
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </motion.div>
            </main>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-md border-t">
                <div className="container mx-auto max-w-2xl flex justify-between items-center">
                    <Button variant="ghost" onClick={() => router.push("/step-4")} className="text-muted-foreground">
                        Skip
                    </Button>
                    <Button
                        size="lg"
                        className="w-32 h-12 shadow-primary/20 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]"
                        disabled={!pushups || !cardio}
                        onClick={handleNext}
                    >
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
