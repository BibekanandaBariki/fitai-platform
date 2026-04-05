"use client";

import React, { useState } from "react";
import { FBXViewer } from "./FBXViewer";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

// Extracted from the FBX files provided in /public/models
export const AVAILABLE_EXERCISES = [
    { id: "idle", name: "Idle (Base Model)", file: "male-body.fbx", color: "#16a34a" }, // green glow
    { id: "walking", name: "Walking", file: "Walking.fbx", color: "#3b82f6" }, // blue
    { id: "running", name: "Running", file: "Running.fbx", color: "#ef4444" }, // red
    { id: "pushup", name: "Push Up", file: "Push-Up.fbx", color: "#f97316" }, // orange
    { id: "squat", name: "Air Squat", file: "Air-Squat.fbx", color: "#8b5cf6" }, // purple
    { id: "overhead-squat", name: "Overhead Squat", file: "Overhead-Squat.fbx", color: "#a855f7" },
    { id: "jumping-jacks", name: "Jumping Jacks", file: "Jumping-Jacks.fbx", color: "#14b8a6" }, // teal
    { id: "burpee", name: "Burpee", file: "Burpee.fbx", color: "#ec4899" }, // pink
    { id: "plank", name: "Plank", file: "Plank.fbx", color: "#eab308" }, // yellow
    { id: "bicycle-crunch", name: "Bicycle Crunch", file: "Bicycle-Crunch.fbx", color: "#f43f5e" }, // rose
    { id: "lifting", name: "Lifting Object", file: "Lifting-Object.fbx", color: "#0ea5e9" }, // sky
    { id: "stairs", name: "Running Up Stairs", file: "Running-Up-Stairs.fbx", color: "#c026d3" }, // fuchsia
];

interface FBXAnimationPlayerProps {
    initialExerciseId?: string;
    hideList?: boolean; // If true, only shows this single animation without the list switcher
    bmi?: number; // Optional BMI for body scaling
    height?: number; // Optional height in cm for vertical scaling
}

export function FBXAnimationPlayer({ initialExerciseId = "idle", hideList = false, bmi, height }: FBXAnimationPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [activeId, setActiveId] = useState(initialExerciseId);
    
    // Fallback safely if id is not found
    const currentEx = AVAILABLE_EXERCISES.find(ex => ex.id === activeId) || AVAILABLE_EXERCISES[0];

    return (
        <div className="w-full relative h-[50vh] md:h-[600px] flex flex-col group">
            {/* 3D Canvas rendering the selected FBX */}
            <div className="absolute inset-0">
                {/* Using key to force remount of FBXViewer when file changes to avoid animation caching issues */}
                <FBXViewer 
                    key={currentEx.id} 
                    url={`/models/${currentEx.file}`} 
                    isPlaying={isPlaying} 
                    tintColor={currentEx.color} 
                    bmiScale={bmi ? bmi / 22 : 1}
                    heightScale={height ? height / 175 : 1}
                />
            </div>

            {/* Overlay UI */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-4 items-end pointer-events-none">
                
                {/* Exercise Switcher (Left Side) */}
                {!hideList && (
                    <div className="bg-background/80 backdrop-blur-md rounded-2xl border border-primary/20 p-2 flex flex-col max-h-48 overflow-y-auto pointer-events-auto hide-scrollbar w-48 shadow-lg">
                        {AVAILABLE_EXERCISES.map((ex) => (
                            <button
                                key={ex.id}
                                onClick={() => setActiveId(ex.id)}
                                className={cn(
                                    "text-left text-xs font-medium px-3 py-2 rounded-xl transition-all flex items-center gap-2",
                                    activeId === ex.id 
                                    ? "bg-primary/20 text-primary" 
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ex.color }}></span>
                                {ex.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Play / Pause Toggle (Right Side) */}
                <div className="ml-auto pointer-events-auto">
                    <Button 
                        size="icon" 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="h-14 w-14 rounded-full shadow-primary/20 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] bg-background/80 backdrop-blur-md border border-primary/20 hover:bg-primary/20 hover:border-primary/50 text-foreground"
                    >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                    </Button>
                </div>
            </div>
            
            {/* Top Stats HUD */}
            <div className="absolute top-4 left-4 bg-background/60 backdrop-blur-md border border-primary/20 px-3 py-1.5 rounded-full pointer-events-none">
                <span className="text-xs font-mono font-medium text-primary flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentEx.color }}></span>
                    {currentEx.name}
                </span>
            </div>
        </div>
    );
}
