"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const CONDITIONS = [
    "Diabetes", "Hypertension", "PCOS",
    "Thyroid Issue", "Asthma", "Heart Disease", "None"
];

const INJURIES = [
    "Lower Back", "Shoulder", "Knee",
    "Wrist", "Ankle", "Neck", "None"
];

export default function OnboardingStep4() {
    const { conditions, injuries, updateData } = useOnboardingStore();
    const router = useRouter();

    const toggleArrayItem = (item: string, currentArray: string[], key: "conditions" | "injuries") => {
        if (item === "None") {
            updateData({ [key]: ["None"] });
            return;
        }

        let newArray = currentArray.filter(i => i !== "None");
        if (newArray.includes(item)) {
            newArray = newArray.filter(i => i !== item);
        } else {
            newArray.push(item);
        }
        updateData({ [key]: newArray });
    };

    const handleNext = () => {
        // Require at least one selection in each (even if it's "None")
        if (conditions.length > 0 && injuries.length > 0) {
            router.push("/step-5");
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <div className="w-full h-1 bg-muted fixed top-0 left-0 z-50">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "42%" }}
                    animate={{ width: "56%" }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="container mx-auto flex h-16 items-center px-4 mt-2">
                <Button variant="ghost" size="icon" onClick={() => router.push("/step-3")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="ml-auto text-sm font-medium text-muted-foreground mr-2">4 of 7</span>
            </div>

            <main className="flex-1 container mx-auto px-4 pb-32 max-w-xl mt-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">
                            Health & Safety
                        </h1>
                        <AlertTriangle className="h-8 w-8 text-accent" />
                    </div>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Our AI uses this to filter out dangerous exercises and adapt your plan safely.
                    </p>

                    <div className="space-y-8">
                        {/* Medical Conditions */}
                        <div>
                            <label className="text-base font-semibold mb-3 block">
                                Do you have any of these conditions?
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {CONDITIONS.map((condition) => (
                                    <button
                                        key={condition}
                                        onClick={() => toggleArrayItem(condition, conditions, "conditions")}
                                        className={cn(
                                            "px-4 text-sm py-2 rounded-full font-medium transition-all press-glow border",
                                            conditions.includes(condition)
                                                ? "bg-accent/10 border-accent text-accent"
                                                : "bg-card border-input hover:border-accent/50 text-foreground"
                                        )}
                                    >
                                        {condition}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Injuries */}
                        <div>
                            <label className="text-base font-semibold mb-3 block">
                                Any current or past injuries?
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {INJURIES.map((injury) => (
                                    <button
                                        key={injury}
                                        onClick={() => toggleArrayItem(injury, injuries, "injuries")}
                                        className={cn(
                                            "px-4 text-sm py-2 rounded-full font-medium transition-all press-glow border",
                                            injuries.includes(injury)
                                                ? "bg-destructive/10 border-destructive text-destructive"
                                                : "bg-card border-input hover:border-destructive/50 text-foreground"
                                        )}
                                    >
                                        {injury}
                                    </button>
                                ))}
                            </div>

                            {injuries.length > 0 && !injuries.includes("None") && (
                                <div className="mt-4 p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground border border-border">
                                    FitAI will automatically swap out exercises that put load on the {injuries.join(", ")}.
                                </div>
                            )}
                        </div>

                        {/* PAR-Q Disclaimer */}
                        <div className="text-xs text-muted-foreground border-t pt-6 mt-8">
                            By continuing, you confirm that you have clearance from a medical professional to begin an exercise program if you have selected any medical conditions or severe injuries.
                        </div>

                    </div>
                </motion.div>
            </main>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-md border-t">
                <div className="container mx-auto max-w-2xl flex justify-between items-center">
                    <Button variant="ghost" onClick={() => router.push("/step-5")} className="text-muted-foreground">
                        Skip
                    </Button>
                    <Button
                        size="lg"
                        className="w-32 h-12 shadow-primary/20 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]"
                        disabled={conditions.length === 0 || injuries.length === 0}
                        onClick={handleNext}
                    >
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
