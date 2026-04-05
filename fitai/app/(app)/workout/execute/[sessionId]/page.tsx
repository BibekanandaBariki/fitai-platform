"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Info, Settings2, Play, Check, ChevronRight, PlayCircle, Box, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnatomyMap } from "@/components/onboarding/AnatomyMap";
import { FBXAnimationPlayer } from "@/components/3d/FBXAnimationPlayer";

// Mock Exercise Data
// videoId = YouTube video ID for exercise tutorial embed
const EXERCISES = [
    { id: 1, name: "Barbell Bench Press", sets: 4, reps: "8-10", muscle: "Chest", rpe: 8, prevWeight: 60, videoId: "rT7DgCr-3pg", fbxId: "pushup", formTip: "Keep your feet flat on the floor, elbows at 45°. Lower the bar slowly to mid-chest, pause, then press explosively. Keep your core braced and scapula retracted throughout." },
    { id: 2, name: "Incline Dumbbell Press", sets: 3, reps: "10-12", muscle: "Upper Chest", rpe: 8, prevWeight: 24, videoId: "8iPEnn-ltC8", fbxId: "lifting", formTip: "Set the bench to 30-45°. Control the descent slowly, let elbows track below shoulder level. Squeeze the upper chest at the top. Avoid flaring elbows too wide." },
    { id: 3, name: "Cable Crossovers", sets: 3, reps: "12-15", muscle: "Lower Chest", rpe: 9, prevWeight: 15, videoId: "taI4XduLpTk", fbxId: "jumping-jacks", formTip: "Stand in the middle of the cable station, pull cables forward and down in an arc, meeting hands at the bottom. Fully stretch the chest at the top of each rep." },
];

export default function WorkoutExecutionPage() {
    const router = useRouter();
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [weight, setWeight] = useState("");
    const [isResting, setIsResting] = useState(false);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"anatomy" | "3d">("anatomy");
    const [restTimeLeft, setRestTimeLeft] = useState(90); // 90 seconds
    const [completedSets, setCompletedSets] = useState<any[]>([]);

    const exercise = EXERCISES[currentExerciseIndex];

    // Rest Timer Logic
    useEffect(() => {
        let timer: any;
        if (isResting && restTimeLeft > 0) {
            timer = setInterval(() => {
                setRestTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (isResting && restTimeLeft === 0) {
            // Haptic feedback could go here via navigator.vibrate
            setIsResting(false);
        }
        return () => clearInterval(timer);
    }, [isResting, restTimeLeft]);

    // Pre-fill weight on exercise load
    useEffect(() => {
        setWeight(exercise.prevWeight.toString());
    }, [exercise]);

    const handleLogSet = () => {
        setCompletedSets([...completedSets, { exId: exercise.id, set: currentSet, weight }]);

        if (currentSet < exercise.sets) {
            setCurrentSet(currentSet + 1);
            setRestTimeLeft(90);
            setIsResting(true);
        } else {
            if (currentExerciseIndex < EXERCISES.length - 1) {
                setCurrentExerciseIndex(currentExerciseIndex + 1);
                setCurrentSet(1);
                setRestTimeLeft(120); // Longer rest between exercises
                setIsResting(true);
            } else {
                // Workout Complete
                router.push("/dashboard");
            }
        }
    };

    const skipRest = () => {
        setIsResting(false);
        setRestTimeLeft(0);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col overflow-hidden">

            {/* Top Bar Navigation */}
            <div className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-md relative z-10">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">
                        Exercise {currentExerciseIndex + 1} of {EXERCISES.length}
                    </span>
                    <span className="font-heading font-bold text-lg">{exercise.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                    <X className="h-6 w-6" />
                </Button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative flex flex-col">

                {/* 3D Viewer Placeholder (React Three Fiber canvas will go here) */}
                <div className="relative h-2/5 min-h-[300px] w-full bg-secondary/20 flex flex-col items-center justify-center border-b overflow-hidden group">
                    <div className="absolute top-4 right-4 flex gap-2 z-10 bg-background/50 backdrop-blur-md rounded-full p-1 border border-border/50">
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            className={cn("rounded-full h-8 w-8", viewMode === 'anatomy' ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
                            onClick={() => setViewMode('anatomy')}
                        >
                            <Activity className="h-4 w-4" />
                        </Button>
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            className={cn("rounded-full h-8 w-8", viewMode === '3d' ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
                            onClick={() => setViewMode('3d')}
                        >
                            <Box className="h-4 w-4" />
                        </Button>
                    </div>
                    
                    <div className="absolute inset-0 z-0">
                        {viewMode === '3d' ? (
                            <FBXAnimationPlayer initialExerciseId={exercise.fbxId} hideList bmi={22} />
                        ) : (
                            <AnatomyMap muscle={exercise.muscle} className="h-full w-full" />
                        )}
                    </div>

                    {/* Massive Play Button Overlay - Hide when in 3D mode because 3D has its own playback logic over the model */}
                    {viewMode === 'anatomy' && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <Button 
                                 size="lg" 
                                 className="rounded-full h-16 w-auto px-6 shadow-[0_0_40px_rgba(34,197,94,0);] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] backdrop-blur-md bg-background/80 border border-primary/50 text-primary group-hover:scale-110 transition-all font-bold"
                                 onClick={() => setIsVideoOpen(true)}
                             >
                                 <PlayCircle className="h-6 w-6 mr-3" />
                                 Play Form Video
                             </Button>
                        </div>
                    )}


                    {/* Real-time muscle activation overlay pill */}
                    <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 shadow-xs z-10">
                        <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span> {exercise.muscle}
                    </div>
                </div>

                {/* Exercise Controls */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col max-w-lg mx-auto w-full pb-24">

                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Target</p>
                            <p className="text-4xl font-heading font-bold tracking-tight">{exercise.sets} <span className="text-2xl text-muted-foreground font-medium">×</span> {exercise.reps}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-1">Target RPE</p>
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/20 text-accent font-bold text-lg border border-accent/30 glow-accent">
                                {exercise.rpe}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-sm font-semibold mb-3 block">Weight (kg)</label>
                            <div className="flex items-center justify-center gap-6 p-4 rounded-xl border-2 border-input bg-card shadow-sm">
                                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full text-xl" onClick={() => setWeight(String(Math.max(0, Number(weight) - 2.5)))}>-</Button>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="w-24 h-16 text-4xl font-heading font-bold text-center bg-transparent focus:outline-none"
                                />
                                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full text-xl" onClick={() => setWeight(String(Number(weight) + 2.5))}>+</Button>
                        </div>
                        <p className="text-center text-xs text-muted-foreground mt-2">Previous session: {exercise.prevWeight}kg</p>
                    </div>

                    <div className="pt-4">
                        <Button
                            size="lg"
                            className="w-full h-16 text-lg font-bold shadow-primary/20 shadow-[0_4px_20px_0_rgba(34,197,94,0.39)] uppercase tracking-wide group"
                            onClick={handleLogSet}
                        >
                            Log Set {currentSet} <Check className="ml-2 h-5 w-5 group-active:scale-110 transition-transform" />
                        </Button>
                    </div>

                    {/* Set History Bubbles */}
                    <div className="pt-6 flex justify-center gap-2">
                        {Array.from({ length: exercise.sets }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
                                    i + 1 < currentSet ? "bg-primary border-primary text-primary-foreground" :
                                        i + 1 === currentSet ? "bg-transparent border-primary text-primary" :
                                            "bg-muted border-transparent text-muted-foreground"
                                )}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>

      {/* Rest Timer Full Screen Overlay */ }
    <AnimatePresence>
        {isResting && (
            <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
            >
                <h2 className="text-2xl font-heading font-bold mb-2">Rest & Recover</h2>
                <p className="text-muted-foreground mb-12">Up next: Set {currentSet}</p>

                {/* Circular Timer SVG */}
                <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
                        <motion.circle
                            cx="128" cy="128" r="120"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeLinecap="round"
                            className="text-primary glow-primary"
                            strokeDasharray={2 * Math.PI * 120}
                            animate={{ strokeDashoffset: [0, 2 * Math.PI * 120] }}
                            transition={{ duration: 90, ease: "linear" }}
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-7xl font-heading font-bold font-mono tracking-tighter">
                            {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>

                <Button size="lg" variant="outline" className="w-full max-w-xs h-14 rounded-full text-base" onClick={skipRest}>
                    Skip Rest <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
            </motion.div>
        )}

        {/* Video Tutorial Modal */ }
        {isVideoOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4"
            >
                <div className="w-full max-w-2xl bg-card border border-border/50 rounded-2xl overflow-hidden shadow-2xl relative">
                     <Button 
                         variant="ghost" 
                         size="icon" 
                         className="absolute top-4 right-4 z-10 bg-background/50 hover:bg-background/80 backdrop-blur-md rounded-full"
                         onClick={() => setIsVideoOpen(false)}
                     >
                         <X className="h-6 w-6" />
                     </Button>
                     
                     {/* YouTube Tutorial Embed */}
                     <div className="aspect-video w-full bg-black relative overflow-hidden">
                         <iframe
                             key={exercise.id}
                             className="w-full h-full"
                             src={`https://www.youtube.com/embed/${exercise.videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                             title={`${exercise.name} Tutorial`}
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                             allowFullScreen
                         />
                         {/* Tech aesthetic overlay */}
                         <div className="absolute bottom-4 left-4 bg-background/90 px-3 py-1.5 rounded-sm border-l-2 border-primary font-mono text-xs uppercase tracking-widest text-primary pointer-events-none">
                             AI Form Analysis: ACTIVE
                         </div>
                     </div>
                     <div className="p-6">
                         <h3 className="text-xl font-heading font-bold mb-2">{exercise.name} Tutorial</h3>
                         <p className="text-sm text-muted-foreground">{exercise.formTip}</p>
                     </div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
    </div >
  );
}
