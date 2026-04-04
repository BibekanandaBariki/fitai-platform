"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnatomyMapProps {
    muscle: string;
    className?: string;
}

// Mapping of muscle groups to percentage-based coordinates on the silhouette
// Coordinates: top (y) and left (x)
const MUSCLE_COORDS: Record<string, { top: string, left: string, width: string, height: string }> = {
    "Chest": { top: "32%", left: "50%", width: "40%", height: "12%" },
    "Upper Chest": { top: "28%", left: "50%", width: "35%", height: "8%" },
    "Lower Chest": { top: "35%", left: "50%", width: "40%", height: "8%" },
    "Back": { top: "35%", left: "50%", width: "45%", height: "25%" },
    "Lats": { top: "38%", left: "50%", width: "55%", height: "20%" },
    "Shoulders": { top: "26%", left: "50%", width: "65%", height: "10%" },
    "Biceps": { top: "40%", left: "30%", width: "15%", height: "15%" },
    "Triceps": { top: "40%", left: "70%", width: "15%", height: "15%" },
    "Abs": { top: "45%", left: "50%", width: "25%", height: "20%" },
    "Core": { top: "45%", left: "50%", width: "28%", height: "22%" },
    "Legs": { top: "70%", left: "50%", width: "45%", height: "35%" },
    "Quads": { top: "65%", left: "50%", width: "40%", height: "25%" },
    "Hamstrings": { top: "75%", left: "50%", width: "45%", height: "20%" },
    "Calves": { top: "88%", left: "50%", width: "35%", height: "12%" },
};

export function AnatomyMap({ muscle, className }: AnatomyMapProps) {
    // Normalize muscle name to find coordinates
    const targetKey = Object.keys(MUSCLE_COORDS).find(k => 
        muscle.toLowerCase().includes(k.toLowerCase())
    ) || "Abs"; // Default fallback

    const targetCoords = MUSCLE_COORDS[targetKey];

    return (
        <div className={cn("relative flex items-center justify-center overflow-hidden", className)}>
            {/* Dark background ambient glow */}
            <div className="absolute inset-0 bg-background/90" />
            
            {/* The Greyscale Anatomical Model Base */}
            {/* We use a high-end greyscale anatomy dummy from a reliable fitness CDN or generate a sleek silhouette */}
            <div className="relative h-full aspect-[1/2] max-h-[400px] flex items-center justify-center">
                
                {/* Silhouette / Base Image */}
                <img 
                    src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop" 
                    alt="Anatomy Base"
                    className="h-full w-full object-cover rounded-xl opacity-30 grayscale mix-blend-screen mix-blend-luminosity filter blur-[1px] contrast-150 relative z-10"
                    style={{ maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" }}
                />

                {/* Grid Overlay for technical/scientific aesthetic */}
                <div className="absolute inset-0 z-20 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* Custom Anatomical SVG Overlay (Abstract representation) */}
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                   <svg viewBox="0 0 100 200" className="h-full w-auto drop-shadow-2xl">
                       {/* Abstract Body Path */}
                       <path 
                           d="M50 20 C45 20 42 25 42 30 C42 35 45 38 50 38 C55 38 58 35 58 30 C58 25 55 20 50 20 Z 
                              M35 45 C45 42 55 42 65 45 C75 50 78 60 78 70 L75 100 L65 100 L65 80 L60 80 L60 120 L55 180 L45 180 L40 120 L40 80 L35 80 L35 100 L25 100 L22 70 C22 60 25 50 35 45 Z" 
                           fill="none" 
                           stroke="rgba(255,255,255,0.1)" 
                           strokeWidth="0.5"
                       />
                   </svg>
                </div>

                {/* TARGET MUSCLE GLOW INDICATOR */}
                <motion.div
                    className="absolute z-40 bg-destructive/60 blur-md rounded-full mix-blend-color-dodge shadow-[0_0_30px_10px_rgba(220,38,38,0.6)]"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                        opacity: [0.4, 0.8, 0.4],
                        scale: [0.9, 1.1, 0.9]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        top: targetCoords.top,
                        left: targetCoords.left,
                        width: targetCoords.width,
                        height: targetCoords.height,
                        transform: "translate(-50%, -50%)"
                    }}
                >
                    {/* Core intense center */}
                    <div className="absolute inset-0 m-auto w-1/2 h-1/2 bg-red-500 rounded-full blur-sm" />
                </motion.div>

                {/* Technical Callout Line */}
                <motion.div 
                    className="absolute z-50 pointer-events-none"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        top: targetCoords.top,
                        left: `calc(${targetCoords.left} + 25%)`
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-[1px] bg-destructive" />
                        <span className="text-[10px] font-mono font-bold tracking-widest text-destructive uppercase bg-background/80 px-1 py-0.5 rounded backdrop-blur-sm border border-destructive/30">
                            TARGET: {muscle}
                        </span>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
