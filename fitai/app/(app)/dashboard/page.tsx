"use client";

import { motion } from "framer-motion";
import { MacroRing } from "@/components/nutrition/MacroRing";
import { HabitCheckbox } from "@/components/shared/HabitCheckbox";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Dumbbell, Droplet, Flame, ArrowRight, Play, Edit3 } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { useTranslations } from "next-intl";
import { createBrowserClient } from "@supabase/ssr";

export default function DashboardPage() {
    const t = useTranslations('Dashboard');
    const { data: activePlan, isLoading } = trpc.workout.getActivePlan.useQuery();
    const { data: profileData, refetch: refetchProfile } = trpc.profile.get.useQuery();
    const updateAvatarMutation = trpc.profile.updateAvatar.useMutation();
    const [user, setUser] = useState<any>(null);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
        );
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setUser(data.user);
        });
    }, []);

    const [habits, setHabits] = useState([
        { id: "water", title: "Drink 3L Water", completed: false, streak: 12, icon: <Droplet className="h-4 w-4" /> },
        { id: "sleep", title: "Sleep 7+ Hours", completed: true, streak: 5, icon: <Flame className="h-4 w-4" /> },
        { id: "read", title: "Read 10 pages", completed: false, streak: 0, icon: <Edit3 className="h-4 w-4" /> },
    ]);

    const toggleHabit = (id: string, completed: boolean) => {
        setHabits(habits.map(h => h.id === id ? { ...h, completed } : h));
    };

    const AVATAR_OPTIONS = [
        { label: "Male Default", url: `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix` },
        { label: "Female Default", url: `https://api.dicebear.com/7.x/avataaars/svg?seed=Mia` },
        { label: "Superhero", url: `https://api.dicebear.com/7.x/adventurer/svg?seed=Superhero` },
        { label: "Cute Bot", url: `https://api.dicebear.com/7.x/bottts/svg?seed=Tinker` },
        { label: "Artist", url: `https://api.dicebear.com/7.x/micah/svg?seed=Artist` }
    ];

    const currentAvatar = profileData?.profile?.profilePhotoUrl || user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || "Alex"}`;

    const handleSelectAvatar = async (url: string) => {
        await updateAvatarMutation.mutateAsync({ avatarUrl: url });
        refetchProfile();
        setIsAvatarModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-bold">
                        {t('title')}, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || "there"}!
                    </h1>
                    <p className="text-muted-foreground">{activePlan ? `Ready for ${activePlan.todayWorkout?.dayName}? 🔥` : "Let's log your first workout! 🔥"}</p>
                </div>
                <button 
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary overflow-hidden hover:scale-105 transition-transform"
                >
                    <img src={currentAvatar} alt="Avatar" className="h-full w-full object-cover" />
                </button>
            </div>

            {/* Avatar Selection Modal Overlay */}
            {isAvatarModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <Card className="w-full max-w-sm border border-border shadow-2xl relative">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 text-muted-foreground"
                            onClick={() => setIsAvatarModalOpen(false)}
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                        </Button>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-heading font-bold mb-4 text-center">Customize Avatar</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {AVATAR_OPTIONS.map((avatar, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => handleSelectAvatar(avatar.url)}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-transparent hover:border-primary/50 hover:bg-primary/10 transition-colors"
                                    >
                                        <div className="h-16 w-16 rounded-full overflow-hidden bg-primary/20 border border-primary/20">
                                            <img src={avatar.url} alt={avatar.label} className="h-full w-full object-cover" />
                                        </div>
                                        <span className="text-xs font-semibold text-muted-foreground">{avatar.label}</span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

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
                    <Link href="/workout">
                        <Button variant="ghost" size="sm" className="h-8 text-xs text-primary">{t('view_plan')}</Button>
                    </Link>
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
