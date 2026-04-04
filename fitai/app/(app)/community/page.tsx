"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Crown, Star, Flame, Users, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LEADERBOARD = [
    { rank: 1, name: "Rahul S.", xp: 12450, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", isMe: false },
    { rank: 2, name: "Priya M.", xp: 11200, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", isMe: false },
    { rank: 3, name: "Alex (You)", xp: 9850, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", isMe: true },
    { rank: 4, name: "Vikram K.", xp: 9400, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram", isMe: false },
    { rank: 5, name: "Sneha R.", xp: 8900, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha", isMe: false },
];

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

const BADGES = [
    { id: 1, name: "First Step", desc: "Complete 1st workout", icon: Star, unlocked: true },
    { id: 2, name: "Consistency", desc: "7-day streak", icon: Flame, unlocked: true },
    { id: 3, name: "Iron Pumper", desc: "Lift 10,000kg total", icon: Trophy, unlocked: false },
    { id: 4, name: "Early Bird", desc: "5 AM workout", icon: Star, unlocked: false },
];

export default function CommunityPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
        );
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setUser(data.user);
        });
    }, []);

    const name = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || "there";
    const avatar = user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Community</h1>
                    <p className="text-muted-foreground">Rankings & Rewards</p>
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                    <Share2 className="mr-2 h-4 w-4" /> Invite Friends
                </Button>
                <Button variant="outline" size="icon" className="sm:hidden">
                    <Users className="h-4 w-4" />
                </Button>
            </div>

            {/* User Status / XP Progress */}
            <Card className="bg-gradient-to-r from-primary/20 to-accent/10 border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                <CardContent className="p-6 relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-background border-2 border-primary overflow-hidden">
                            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold font-heading">Level 12</h2>
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                <Crown className="h-4 w-4 text-accent" /> Silver Tier
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span>9,850 XP</span>
                            <span className="text-muted-foreground">10,000 XP (Next Level)</span>
                        </div>
                        <div className="h-2 w-full bg-background/50 rounded-full overflow-hidden border border-input">
                            <motion.div
                                className="h-full bg-primary glow-primary"
                                initial={{ width: 0 }}
                                animate={{ width: "98.5%" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-right">Just 150 XP to Level 13! 🔥</p>
                    </div>
                </CardContent>
            </Card>

            {/* Badges Carousel */}
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
                        )
                    })}
                </div>
            </section>

            {/* Global Leaderboard */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-heading font-semibold">Weekly Leaderboard</h2>
                    <div className="text-xs font-semibold bg-secondary text-secondary-foreground px-2 py-1 rounded">Global</div>
                </div>

                <Card>
                    <div className="divide-y divide-border">
                        {LEADERBOARD.map((user) => (
                            <div
                                key={user.rank}
                                className={cn(
                                    "flex items-center p-4 transition-colors",
                                    user.isMe ? "bg-primary/5" : "hover:bg-muted/50"
                                )}
                            >
                                <div className="w-8 flex justify-center font-bold text-muted-foreground font-heading">
                                    {user.rank === 1 ? <Medal className="h-5 w-5 text-yellow-500" /> :
                                        user.rank === 2 ? <Medal className="h-5 w-5 text-gray-400" /> :
                                            user.rank === 3 ? <Medal className="h-5 w-5 text-amber-600" /> :
                                                `#${user.rank}`}
                                </div>

                                <div className="w-10 h-10 rounded-full border border-input ml-3 mr-4 overflow-hidden bg-muted">
                                    <img src={user.isMe ? avatar : user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1">
                                    <h4 className={cn("font-medium text-sm", user.isMe && "text-primary font-bold")}>
                                        {user.isMe ? `${name} (You)` : user.name}
                                    </h4>
                                </div>

                                <div className="text-right font-medium font-heading">
                                    {user.xp.toLocaleString()} <span className="text-xs text-muted-foreground font-sans">XP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>

        </div>
    );
}
