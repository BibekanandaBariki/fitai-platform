"use client";

import { motion } from "framer-motion";
import { MacroRing } from "@/components/nutrition/MacroRing";
import { HabitCheckbox } from "@/components/shared/HabitCheckbox";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dumbbell, Droplet, Flame, ArrowRight, Play, Edit3 } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
    const t = useTranslations('Dashboard');
    const { data: activePlan, isLoading } = trpc.workout.getActivePlan.useQuery();

    const [habits, setHabits] = useState([
        { id: "water", title: "Drink 3L Water", completed: false, streak: 12, icon: <Droplet className="h-4 w-4" /> },
        { id: "sleep", title: "Sleep 7+ Hours", completed: true, streak: 5, icon: <Flame className="h-4 w-4" /> },
        { id: "read", title: "Read 10 pages", completed: false, streak: 0, icon: <Edit3 className="h-4 w-4" /> },
    ]);

    const toggleHabit = (id: string, completed: boolean) => {
        setHabits(habits.map(h => h.id === id ? { ...h, completed } : h));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-bold">{t('title')}, Alex!</h1>
                    <p className="text-muted-foreground">{t('ready', { day: 14 })} 🔥</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-xl overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" />
                </div>
            </div>

            {/* AI Quote Card */}
            <Card className="bg-gradient-to-r from-secondary to-secondary/80 border-none shadow-lg">
                <CardContent className="p-4 flex gap-4 items-center">
                    <div className="bg-primary/20 p-2 rounded-full h-fit">
                        <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-secondary-foreground">{t('coach_says')}</p>
                        <p className="text-xs text-secondary-foreground/80 mt-1 italic">"You hit a bench PR yesterday. Take it easy on the shoulders today — focus on form over weight."</p>
                    </div>
                </CardContent>
            </Card>

            {/* Today's Workout */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-heading font-semibold">{t('todays_protocol')}</h2>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-primary">{t('view_plan')}</Button>
                </div>
                
                {isLoading ? (
                    <Card className="border-primary/20 h-40 animate-pulse bg-primary/5 flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">{t('loading')}</p>
                    </Card>
                ) : (
                    <Card className="border-primary/20 overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                        <CardContent className="p-0">
                            <div className="p-5 flex justify-between items-start">
                                <div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-primary/15 text-primary mb-2 shadow-sm">
                                        {activePlan?.planName} • Week {activePlan?.todayWorkout?.weekNumber || 1}
                                    </span>
                                    <h3 className="text-xl font-bold font-heading">{activePlan?.todayWorkout?.dayName || t('rest_day')}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                        <Dumbbell className="h-3 w-3" /> {t('exercises', { count: activePlan?.todayWorkout?.exercisesCount || 0 })} • {t('mins', { duration: activePlan?.todayWorkout?.estimatedDurationMinutes || 0 })}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Dumbbell className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                            <div className="px-5 pb-5">
                                <Link href="/workout/execute/session-123">
                                    <Button className="w-full shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] group-hover:bg-primary/90 transition-all">
                                        <Play className="mr-2 h-4 w-4 fill-current" /> {t('start_session')}
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </section>

            {/* Nutrition Summary */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-heading font-semibold">{t('nutrition')}</h2>
                    <Link href="/nutrition">
                        <Button variant="ghost" size="sm" className="h-8 text-xs">{t('log_meal')} <ArrowRight className="ml-1 h-3 w-3" /></Button>
                    </Link>
                </div>
                <Card>
                    <CardContent className="p-5 flex items-center flex-col sm:flex-row gap-6 justify-around">
                        <MacroRing
                            calories={{ current: 1250, target: 2400 }}
                            protein={{ current: 90, target: 160 }}
                            carbs={{ current: 120, target: 250 }}
                            fat={{ current: 45, target: 80 }}
                            size={160}
                            strokeWidth={12}
                        />

                        <div className="flex sm:flex-col justify-between w-full sm:w-auto gap-4">
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-primary"></span> {t('protein')}
                                </span>
                                <span className="font-heading font-bold text-lg">90 <span className="text-sm font-normal text-muted-foreground">/ 160g</span></span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> {t('carbs')}
                                </span>
                                <span className="font-heading font-bold text-lg">120 <span className="text-sm font-normal text-muted-foreground">/ 250g</span></span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> {t('fat')}
                                </span>
                                <span className="font-heading font-bold text-lg">45 <span className="text-sm font-normal text-muted-foreground">/ 80g</span></span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Daily Habits */}
            <section>
                <h2 className="text-lg font-heading font-semibold mb-3">{t('daily_habits')}</h2>
                <div className="space-y-3">
                    {habits.map((habit) => (
                        <HabitCheckbox
                            key={habit.id}
                            id={habit.id}
                            title={habit.title}
                            isCompleted={habit.completed}
                            streak={habit.streak}
                            onToggle={toggleHabit}
                            icon={habit.icon}
                        />
                    ))}
                </div>
            </section>

        </div>
    );
}
