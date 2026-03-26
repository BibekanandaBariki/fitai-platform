"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Camera } from "lucide-react";

export default function OnboardingStep2() {
    const { height, weight, targetWeight, updateData } = useOnboardingStore();
    const router = useRouter();

    // Simple BMI calculater for live feedback if needed
    const bmi = height && weight ? (weight / Math.pow(height / 100, 2)).toFixed(1) : null;

    const handleNext = () => {
        if (height && weight && targetWeight) {
            router.push("/onboarding/step-3");
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <div className="w-full h-1 bg-muted fixed top-0 left-0 z-50">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "14%" }}
                    animate={{ width: "28%" }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="container mx-auto flex h-16 items-center px-4 mt-2">
                <Button variant="ghost" size="icon" onClick={() => router.push("/onboarding/step-1")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="ml-auto text-sm font-medium text-muted-foreground mr-2">2 of 7</span>
            </div>

            <main className="flex-1 container mx-auto px-4 pb-32 max-w-xl mt-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3 tracking-tight">
                        Tell us about yourself
                    </h1>
                    <p className="text-muted-foreground mb-8 text-lg">
                        This helps us calculate your daily nutritional needs and body metrics.
                    </p>

                    <div className="space-y-8">
                        {/* Height Input */}
                        <div>
                            <label className="text-sm font-medium mb-3 block">How tall are you?</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    placeholder="175"
                                    value={height || ""}
                                    onChange={(e) => updateData({ height: Number(e.target.value) })}
                                    className="flex-1 max-w-40 h-16 text-3xl font-heading font-bold text-center rounded-xl border-2 border-input bg-card focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/50"
                                    min="50"
                                    max="300"
                                />
                                <span className="text-2xl font-semibold text-muted-foreground">cm</span>
                            </div>
                        </div>

                        {/* Current Weight Input */}
                        <div>
                            <label className="text-sm font-medium mb-3 block">Current weight</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    placeholder="70"
                                    value={weight || ""}
                                    onChange={(e) => updateData({ weight: Number(e.target.value) })}
                                    className="flex-1 max-w-40 h-16 text-3xl font-heading font-bold text-center rounded-xl border-2 border-input bg-card focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/50"
                                    min="20"
                                    max="400"
                                />
                                <span className="text-2xl font-semibold text-muted-foreground">kg</span>
                            </div>
                        </div>

                        {/* Target Weight Input */}
                        <div>
                            <label className="text-sm font-medium mb-3 block">Target weight</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    placeholder="65"
                                    value={targetWeight || ""}
                                    onChange={(e) => updateData({ targetWeight: Number(e.target.value) })}
                                    className="flex-1 max-w-40 h-16 text-3xl font-heading font-bold text-center rounded-xl border-2 border-primary/50 text-primary bg-primary/5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                                    min="20"
                                    max="400"
                                />
                                <span className="text-2xl font-semibold text-primary/80">kg</span>
                            </div>

                            {weight && targetWeight && weight !== targetWeight && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-3 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                                >
                                    We aim to {weight > targetWeight ? "lose" : "gain"} {Math.abs(weight - targetWeight)}kg safely over ~
                                    {Math.max(4, Math.ceil(Math.abs(weight - targetWeight) / 0.5))} weeks.
                                </motion.div>
                            )}
                        </div>

                        {/* Optional Photo Upload */}
                        <div className="pt-6 border-t border-border">
                            <label className="text-sm font-medium mb-3 block flex items-center justify-between">
                                <span>Add Day 1 Photo</span>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Optional</span>
                            </label>
                            <button className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-input rounded-xl bg-card hover:border-primary/50 hover:bg-primary/5 transition-colors group">
                                <div className="p-4 rounded-full bg-muted group-hover:bg-primary/20 transition-colors mb-3">
                                    <Camera className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <span className="font-medium">Upload progress photo</span>
                                <span className="text-sm text-muted-foreground mt-1">Private, encrypted, just for you.</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </main>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-md border-t">
                <div className="container mx-auto max-w-2xl flex justify-between items-center">
                    <Button variant="ghost" onClick={() => router.push("/onboarding/step-3")} className="text-muted-foreground">
                        Skip
                    </Button>
                    <Button
                        size="lg"
                        className="w-32 h-12 shadow-primary/20 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]"
                        disabled={!height || !weight || !targetWeight}
                        onClick={handleNext}
                    >
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
