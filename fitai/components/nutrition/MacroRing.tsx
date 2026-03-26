import * as React from "react"
import { cn } from "@/lib/utils"

interface MacroRingProps {
    protein: { current: number; target: number };
    carbs: { current: number; target: number };
    fat: { current: number; target: number };
    calories: { current: number; target: number };
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export function MacroRing({
    protein,
    carbs,
    fat,
    calories,
    size = 200,
    strokeWidth = 14,
    className,
}: MacroRingProps) {
    const radius = (size - strokeWidth * 2) / 2;
    const circumference = radius * 2 * Math.PI;

    const getOffset = (current: number, target: number) => {
        const percent = Math.min((current / target) * 100, 100);
        return circumference - (percent / 100) * circumference;
    };

    return (
        <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">

                {/* Background Track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-muted/30"
                />

                {/* Fat Ring (Inner) */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius - strokeWidth * 2 + 4}
                    fill="transparent"
                    stroke="var(--color-chart-3, #f59e0b)"
                    strokeWidth={strokeWidth - 2}
                    strokeDasharray={circumference}
                    strokeDashoffset={getOffset(fat.current, fat.target)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out drop-shadow-sm"
                />

                {/* Carbs Ring (Middle) */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius - strokeWidth + 2}
                    fill="transparent"
                    stroke="var(--color-chart-2, #3b82f6)"
                    strokeWidth={strokeWidth - 1}
                    strokeDasharray={circumference}
                    strokeDashoffset={getOffset(carbs.current, carbs.target)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out drop-shadow-sm"
                />

                {/* Protein Ring (Outer) */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="var(--primary)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={getOffset(protein.current, protein.target)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out drop-shadow-sm glow-primary"
                />
            </svg>

            {/* Center Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-heading font-bold">{calories.target - calories.current}</span>
                <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider mt-1">cals left</span>
            </div>
        </div>
    )
}
