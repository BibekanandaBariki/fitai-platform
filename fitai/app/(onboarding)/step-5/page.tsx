"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Home, Dumbbell, MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = [
    { id: "Mon", label: "M" }, { id: "Tue", label: "T" },
    { id: "Wed", label: "W" }, { id: "Thu", label: "T" },
    { id: "Fri", label: "F" }, { id: "Sat", label: "S" }, { id: "Sun", label: "S" }
];

const LOCATIONS = [
    { id: "home", title: "Home", icon: Home, desc: "Bodyweight or basic gear" },
    { id: "gym", title: "Gym", icon: Dumbbell, desc: "Full commercial gym" },
    { id: "outdoor", title: "Outdoor", icon: MapPin, desc: "Parks & bodyweight" },
    { id: "travel", title: "Travel", icon: Briefcase, desc: "Hotel rooms, zero gear" }
];

export default function OnboardingStep5() {
    const { days, location, durationMinutes, updateData } = useOnboardingStore();
    const router = useRouter();

    const toggleDay = (dayId: string) => {
        let newDays = [...days];
        if (newDays.includes(dayId)) {
            newDays = newDays.filter(d => d !== dayId);
        } else {
            newDays.push(dayId);
        }
        updateData({ days: newDays });
    };

    const handleNext = () => {
        // Require at least 2 days, a location, and duration
        if (days.length >= 2 && location && durationMinutes) {
            router.push("/onboarding/step-6");
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <div className="w-full h-1 bg-muted fixed top-0 left-0 z-50">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "56%" }}
                    animate={{ width: "70%" }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="container mx-auto flex h-16 items-center px-4 mt-2">
                <Button variant="ghost" size="icon" onClick={() => router.push("/onboarding/step-4")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="ml-auto text-sm font-medium text-muted-foreground mr-2">5 of 7</span>
            </div>

            <main className="flex-1 container mx-auto px-4 pb-32 max-w-xl mt-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3 tracking-tight">
                        How's your schedule?
                    </h1>
                    <p className="text-muted-foreground mb-8 text-lg">
                        We'll adapt the volume based on how many days and minutes you have.
                    </p>

                    <div className="space-y-10">
                        {/* Days Selection */}
                        <div>
                            <label className="text-base font-semibold mb-1 block">
                                Which days can you work out?
                            </label>
                            <span className="text-sm text-muted-foreground mb-4 block">Select at least 2 days</span>
                            <div className="flex justify-between max-w-sm">
                                {DAYS.map((day) => (
                                    <button
                                        key={day.id}
                                        onClick={() => toggleDay(day.id)}
                                        className={cn(
                                            "w-10 h-10 rounded-full font-bold flex items-center justify-center transition-all press-glow border-2",
                                            days.includes(day.id)
                                                ? "bg-primary text-primary-foreground border-primary shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                                                : "bg-card text-muted-foreground border-input hover:border-primary/50"
                                        )}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="text-base font-semibold mb-4 block">
                                How long do you want to train?
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {[20, 30, 45, 60, 90].map((min) => (
                                    <button
                                        key={min}
                                        onClick={() => updateData({ durationMinutes: min })}
                                        className={cn(
                                            "px-5 py-2 rounded-full font-medium transition-all press-glow border-2",
                                            durationMinutes === min
                                                ? "bg-primary/10 border-primary text-primary"
                                                : "bg-card border-input hover:border-primary/50"
                                        )}
                                    >
                                        {min} min
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="text-base font-semibold mb-4 block">
                                Where will you usually work out?
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {LOCATIONS.map((loc) => {
                                    const Icon = loc.icon;
                                    return (
                                        <button
                                            key={loc.id}
                                            onClick={() => updateData({ location: loc.id })}
                                            className={cn(
                                                "flex items-center text-left p-4 rounded-xl border-2 transition-all press-glow group",
                                                location === loc.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-input bg-card hover:border-primary/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "p-2 rounded-full mr-3 transition-colors",
                                                location === loc.id ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:text-primary"
                                            )}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{loc.title}</h3>
                                                <p className="text-xs text-muted-foreground mt-0.5">{loc.desc}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </motion.div>
            </main>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-md border-t">
                <div className="container mx-auto max-w-2xl flex justify-between items-center">
                    <Button variant="ghost" onClick={() => router.push("/onboarding/step-6")} className="text-muted-foreground">
                        Skip
                    </Button>
                    <Button
                        size="lg"
                        className="w-32 h-12 shadow-primary/20 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]"
                        disabled={days.length < 2 || !location || !durationMinutes}
                        onClick={handleNext}
                    >
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
