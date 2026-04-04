"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Crown, Star, Flame, Users, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createBrowserClient } from "@supabase/ssr";
import { trpc } from "@/lib/trpc/client";

const LEADERBOARD = [
    { rank: 1, name: "Rahul S.",  xp: 12450, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",  isMe: false },
    { rank: 2, name: "Priya M.",  xp: 11200, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",  isMe: false },
    { rank: 3, name: "You",       xp: 0,     avatar: "",                                                        isMe: true  },
    { rank: 4, name: "Vikram K.", xp: 9400,  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram", isMe: false },
    { rank: 5, name: "Sneha R.",  xp: 8900,  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",  isMe: false },
];

const BADGES = [
    { id: 1, name: "First Step",  desc: "Complete 1st workout",   icon: Star,   unlocked: true  },
    { id: 2, name: "Consistency", desc: "7-day streak",           icon: Flame,  unlocked: true  },
    { id: 3, name: "Iron Pumper", desc: "Lift 10,000kg total",    icon: Trophy, unlocked: false },
    { id: 4, name: "Early Bird",  desc: "5 AM workout",           icon: Star,   unlocked: false },
];

/** XP grows 100 pts/day from journey start + 500 bonus for completing onboarding */
function calcXP(journeyStartedAt: string | null | undefined): number {
    if (!journeyStartedAt) return 0;
    const days = Math.floor((Date.now() - new Date(journeyStartedAt).getTime()) / 86_400_000);
    return days * 100 + 500;
}

/** Level = 1 per 1000 XP */
function calcLevel(xp: number) {
    const level    = Math.max(1, Math.floor(xp / 1000) + 1);
    const xpInLevel = xp % 1000;
    const tiers    = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'] as const;
    const tier     = tiers[Math.min(Math.floor(level / 5), tiers.length - 1)];
    return { level, xpInLevel, tier };
}

export default function CommunityPage() {
    const [authUser, setAuthUser] = useState<{ user_metadata?: Record<string, string>; email?: string } | null>(null);
    const { data: profileData }   = trpc.profile.get.useQuery();

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
        );
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setAuthUser(data.user);
        });
    }, []);

    const name   = authUser?.user_metadata?.full_name?.split(" ")[0] || authUser?.email?.split("@")[0] || "Athlete";
    const avatar = authUser?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

    const journeyStart = profileData?.journeyStartedAt as string | null | undefined;


    // useState lazy initializer is pure — runs once at mount, not on every render
    const [now] = useState(() => Date.now());

    const xp = useMemo(() => {
        if (!journeyStart) return 0;
        const days = Math.floor((now - new Date(journeyStart).getTime()) / 86_400_000);
        return days * 100 + 500;
    }, [journeyStart, now]);

    const { level, xpInLevel, tier } = useMemo(() => calcLevel(xp), [xp]);

    const xpToNext = 1000;

    const dayNo = useMemo(() => {
        if (!journeyStart) return 1;
        return Math.floor((now - new Date(journeyStart).getTime()) / 86_400_000) + 1;
    }, [journeyStart, now]);

    // Inject live data into the "isMe" row
    const leaderboard = LEADERBOARD.map((row) =>
        row.isMe ? { ...row, name: `${name} (You)`, xp, avatar } : row
    ).sort((a, b) => b.xp - a.xp).map((r, i) => ({ ...r, rank: i + 1 }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Community</h1>
                    <p className="text-muted-foreground">Rankings &amp; Rewards • Day {dayNo} of your journey</p>
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                    <Share2 className="mr-2 h-4 w-4" /> Invite Friends
                </Button>
                <Button variant="outline" size="icon" className="sm:hidden">
                    <Users className="h-4 w-4" />
                </Button>
            </div>

            {/* XP Card */}
            <Card className="bg-gradient-to-r from-primary/20 to-accent/10 border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                <CardContent className="p-6 relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-background border-2 border-primary overflow-hidden">
                            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold font-heading">Level {level}</h2>
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                <Crown className="h-4 w-4 text-accent" /> {tier} Tier
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">Day {dayNo} of journey</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span>{xp.toLocaleString()} XP</span>
                            <span className="text-muted-foreground">{(Math.floor(xp / 1000) + 1) * 1000} XP (Level {level + 1})</span>
                        </div>
                        <div className="h-2 w-full bg-background/50 rounded-full overflow-hidden border border-input">
                            <motion.div
                                className="h-full bg-primary glow-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${(xpInLevel / xpToNext) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-right">
                            {xpToNext - xpInLevel} XP to Level {level + 1} 🔥
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Badges */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-heading font-semibold">Your Badges</h2>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">View All</Button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    {BADGES.map((badge) => {
                        const Icon = badge.icon;
                        return (
                            <div
                                key={badge.id}
                                className={cn(
                                    "flex-shrink-0 w-32 p-4 rounded-xl border flex flex-col items-center text-center transition-all",
                                    badge.unlocked
                                        ? "bg-card border-primary/30 shadow-sm"
                                        : "bg-muted/30 border-input opacity-60 grayscale"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center mb-3",
                                    badge.unlocked ? "bg-accent/20 text-accent glow-accent" : "bg-muted text-muted-foreground"
                                )}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
                                <p className="text-[10px] text-muted-foreground leading-tight">{badge.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Leaderboard */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-heading font-semibold">Weekly Leaderboard</h2>
                    <div className="text-xs font-semibold bg-secondary text-secondary-foreground px-2 py-1 rounded">Global</div>
                </div>

                <Card>
                    <div className="divide-y divide-border">
                        {leaderboard.map((entry) => (
                            <div
                                key={entry.rank}
                                className={cn(
                                    "flex items-center p-4 transition-colors",
                                    entry.isMe ? "bg-primary/5" : "hover:bg-muted/50"
                                )}
                            >
                                <div className="w-8 flex justify-center font-bold text-muted-foreground font-heading">
                                    {entry.rank === 1 ? <Medal className="h-5 w-5 text-yellow-500" /> :
                                     entry.rank === 2 ? <Medal className="h-5 w-5 text-gray-400"   /> :
                                     entry.rank === 3 ? <Medal className="h-5 w-5 text-amber-600"  /> :
                                     `#${entry.rank}`}
                                </div>

                                <div className="w-10 h-10 rounded-full border border-input ml-3 mr-4 overflow-hidden bg-muted">
                                    <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1">
                                    <h4 className={cn("font-medium text-sm", entry.isMe && "text-primary font-bold")}>
                                        {entry.name}
                                    </h4>
                                    {entry.isMe && journeyStart && (
                                        <p className="text-[10px] text-muted-foreground">Day {dayNo} • Journey started {new Date(journeyStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                    )}
                                </div>

                                <div className="text-right font-medium font-heading">
                                    {entry.xp.toLocaleString()} <span className="text-xs text-muted-foreground font-sans">XP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>
        </div>
    );
}
