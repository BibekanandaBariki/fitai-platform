"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Camera, X, Check, Box } from "lucide-react";
import { Avatar3D } from "@/components/onboarding/Avatar3D";
import { FBXAnimationPlayer } from "@/components/3d/FBXAnimationPlayer";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const GENDERS = [
    { value: 'male',   label: '♂  Male'   },
    { value: 'female', label: '♀  Female' },
    { value: 'other',  label: '⚧  Other'  },
] as const;

export default function OnboardingStep2() {
    const { gender, height, weight, targetWeight, updateData } = useOnboardingStore();
    const router = useRouter();

    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [is3DMode, setIs3DMode] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const bmi = height && weight ? (weight / Math.pow(height / 100, 2)).toFixed(1) : null;

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
        // Store the file reference for upload at step 7
        updateData({ progressPhoto: file } as any);
    };

    const handleNext = () => {
        if (height && weight && targetWeight) {
            router.push("/step-3");
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
                <Button variant="ghost" size="icon" onClick={() => router.push("/step-1")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="ml-auto text-sm font-medium text-muted-foreground mr-2">2 of 7</span>
            </div>

            <main className="flex-1 container mx-auto px-4 pb-32 max-w-6xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="order-2 md:order-1"
                >
                    <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3 tracking-tight">
                        Tell us about yourself
                    </h1>
                    <p className="text-muted-foreground mb-8 text-lg">
                        This helps us calculate your daily nutritional needs and body metrics.
                    </p>

                    <div className="space-y-8">
                        {/* Gender Selector */}
                        <div>
                            <label className="text-sm font-medium mb-3 block">Your gender</label>
                            <div className="flex gap-3">
                                {GENDERS.map((g) => (
                                    <button
                                        key={g.value}
                                        onClick={() => updateData({ gender: g.value })}
                                        className={cn(
                                            "flex-1 py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all duration-200",
                                            gender === g.value
                                                ? "border-primary bg-primary/10 text-primary shadow-[0_0_12px_rgba(34,197,94,0.25)]"
                                                : "border-input bg-card text-muted-foreground hover:border-primary/40"
                                        )}
                                    >
                                        {g.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Height Input */}
                        <div>
                            <label className="text-sm font-medium mb-3 block">How tall are you?</label>
                            <div className="flex items-center gap-4 mb-4">
                                <input
                                    type="number"
                                    placeholder="175"
                                    value={height || ""}
                                    onChange={(e) => updateData({ height: Number(e.target.value) })}
                                    className="flex-1 max-w-40 h-16 text-3xl font-heading font-bold text-center rounded-xl border-2 border-input bg-card focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/50"
                                    min="100"
                                    max="250"
                                />
                                <span className="text-2xl font-semibold text-muted-foreground">cm</span>
                            </div>
                            <input
                                type="range"
                                min="100" max="250"
                                step="1"
                                value={height || 175}
                                onChange={(e) => updateData({ height: Number(e.target.value) })}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        {/* Current Weight Input */}
                        <div>
                            <label className="text-sm font-medium mb-3 block">Current weight</label>
                            <div className="flex items-center gap-4 mb-4">
                                <input
                                    type="number"
                                    placeholder="70"
                                    value={weight || ""}
                                    onChange={(e) => updateData({ weight: Number(e.target.value) })}
                                    className="flex-1 max-w-40 h-16 text-3xl font-heading font-bold text-center rounded-xl border-2 border-input bg-card focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/50"
                                    min="30"
                                    max="250"
                                />
                                <span className="text-2xl font-semibold text-muted-foreground">kg</span>
                            </div>
                            <input
                                type="range"
                                min="30" max="250"
                                step="1"
                                value={weight || 70}
                                onChange={(e) => updateData({ weight: Number(e.target.value) })}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                            />
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

                        {/* Day 1 Photo Upload */}
                        <div className="pt-6 border-t border-border">
                            <label className="text-sm font-medium mb-3 flex items-center justify-between">
                                <span>Add Day 1 Photo</span>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Optional</span>
                            </label>

                            {/* Hidden real file input */}
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                capture="user"
                                className="hidden"
                                onChange={handlePhotoSelect}
                            />

                            {photoPreview ? (
                                <div className="relative rounded-xl overflow-hidden border-2 border-primary/40">
                                    <img src={photoPreview} alt="Day 1 Photo" className="w-full h-48 object-cover" />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <span className="bg-primary/90 text-xs font-bold px-2 py-1 rounded-full text-black flex items-center gap-1">
                                            <Check className="h-3 w-3" /> Saved
                                        </span>
                                        <button
                                            onClick={() => { setPhotoPreview(null); updateData({ progressPhoto: null } as any); }}
                                            className="bg-background/80 rounded-full p-1 border border-input"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => fileRef.current?.click()}
                                    className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-input rounded-xl bg-card hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                                >
                                    <div className="p-4 rounded-full bg-muted group-hover:bg-primary/20 transition-colors mb-3">
                                        <Camera className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="font-medium">Upload progress photo</span>
                                    <span className="text-sm text-muted-foreground mt-1">Private, encrypted, just for you.</span>
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Right side Avatar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.4 }}
                    className="order-1 md:order-2 flex flex-col justify-center items-center h-full w-full max-w-md mx-auto"
                >
                    <div className="w-full flex items-center justify-between mb-3 px-1">
                        <label className="text-sm font-medium flex items-center gap-2 cursor-pointer transition-colors hover:text-primary">
                            <Box className="h-4 w-4" /> Use 3D Model
                        </label>
                        <button 
                            onClick={() => setIs3DMode(!is3DMode)}
                            className={cn(
                                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                is3DMode ? "bg-primary" : "bg-input"
                            )}
                        >
                            <span className={cn(
                                "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
                                is3DMode ? "translate-x-5" : "translate-x-0"
                            )} />
                        </button>
                    </div>
                    {is3DMode ? (
                        <div className="w-full h-full min-h-[50vh] md:min-h-[600px]">
                            <FBXAnimationPlayer initialExerciseId="idle" hideList bmi={Number(bmi) || 22} />
                        </div>
                    ) : (
                        <Avatar3D />
                    )}
                </motion.div>
            </main>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-md border-t">
                <div className="container mx-auto max-w-2xl flex justify-between items-center">
                    <Button variant="ghost" onClick={() => router.push("/step-3")} className="text-muted-foreground">
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
