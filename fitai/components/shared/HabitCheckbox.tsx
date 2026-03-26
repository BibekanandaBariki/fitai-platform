import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface HabitCheckboxProps {
    id: string;
    title: string;
    isCompleted: boolean;
    streak: number;
    onToggle: (id: string, completed: boolean) => void;
    icon?: React.ReactNode;
}

export function HabitCheckbox({ id, title, isCompleted, streak, onToggle, icon }: HabitCheckboxProps) {
    return (
        <button
            onClick={() => onToggle(id, !isCompleted)}
            className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl border transition-all press-glow group",
                isCompleted
                    ? "bg-primary/5 border-primary/30"
                    : "bg-card border-input hover:border-primary/50"
            )}
        >
            <div className="flex items-center gap-3">
                {/* Checkbox */}
                <div className={cn(
                    "relative flex h-6 w-6 items-center justify-center rounded-full border transition-all",
                    isCompleted ? "border-primary bg-primary" : "border-muted-foreground/30 bg-transparent group-hover:border-primary/50"
                )}>
                    {isCompleted && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <Check className="h-3.5 w-3.5 text-primary-foreground stroke-[3]" />
                        </motion.div>
                    )}
                </div>

                {/* Title & Icon */}
                <div className="flex items-center gap-2">
                    {icon && <span className={cn("text-muted-foreground", isCompleted && "text-primary/70")}>{icon}</span>}
                    <span className={cn(
                        "font-medium transition-all text-sm",
                        isCompleted ? "text-foreground line-through decoration-primary/30 opacity-80" : "text-foreground"
                    )}>
                        {title}
                    </span>
                </div>
            </div>

            {/* Streak Badge */}
            {streak > 0 && (
                <div className={cn(
                    "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md transition-colors",
                    isCompleted ? "bg-accent/20 text-accent glow-accent" : "bg-muted text-muted-foreground"
                )}>
                    🔥 {streak}
                </div>
            )}
        </button>
    )
}
