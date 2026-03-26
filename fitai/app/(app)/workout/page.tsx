"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Trophy, Zap, ChevronRight, Activity, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HISTORY = [
    { id: 1, date: "Yesterday", name: "Leg Day Focus", duration: "52m", volume: "8.4k kg" },
    { id: 2, date: "Mon, Oct 12", name: "Push Day Power", duration: "45m", volume: "12.1k kg" },
    { id: 3, date: "Sat, Oct 10", name: "Active Recovery", duration: "30m", volume: "-" },
];

export default function WorkoutPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Workout</h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Current Phase: Hypertrophy Block 1
                    </p>
                </div>
            </div>

            {/* Up Next Hero Card */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-heading font-semibold">Up Next</h2>
                    <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">Week 2/8</span>
                </div>
                <Card className="border-primary/30 overflow-hidden relative group bg-gradient-to-br from-card to-card/50">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
                    <CardContent className="p-6 relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold font-heading">Pull Day: Back & Biceps</h3>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><Activity className="h-4 w-4" /> 6 Exercises</span>
                                    <span className="flex items-center gap-1"><Zap className="h-4 w-4 text-accent" /> High Intensity</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="text-sm flex justify-between">
                                <span className="text-muted-foreground">Deadlifts</span>
                                <span className="font-medium">3 × 5 reps</span>
                            </div>
                            <div className="text-sm flex justify-between">
                                <span className="text-muted-foreground">Lat Pulldowns</span>
                                <span className="font-medium">3 × 10 reps</span>
                            </div>
                            <div className="text-sm flex justify-between text-muted-foreground">
                                <span>+ 4 more exercises</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link href="/workout/execute/session-123" className="flex-1">
                                <Button className="w-full h-12 shadow-primary/20 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]">
                                    <Play className="mr-2 h-4 w-4 fill-current" /> Start Session
                                </Button>
                            </Link>
                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border border-input">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Analytics / Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card">
                    <CardContent className="p-4 flex flex-col justify-center">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mb-2">
                            <Trophy className="h-4 w-4 text-accent" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Weekly Volume</p>
                        <p className="text-2xl font-heading font-bold">34.5<span className="text-base font-normal text-muted-foreground">k kg</span></p>
                        <p className="text-xs text-primary font-medium mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> +12% vs last week
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardContent className="p-4 flex flex-col justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                            <Calendar className="h-4 w-4 text-blue-500" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Compliance</p>
                        <p className="text-2xl font-heading font-bold">92<span className="text-base font-normal text-muted-foreground">%</span></p>
                        <p className="text-xs text-muted-foreground mt-1">
                            11/12 sessions completed
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent History */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-heading font-semibold">Recent History</h2>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">View All</Button>
                </div>

                <div className="space-y-3">
                    {HISTORY.map((session) => (
                        <Card key={session.id} className="group hover:border-primary/50 transition-colors cursor-pointer">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-muted flex flex-col items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary">
                                            {session.date === "Yesterday" ? "Yst" : session.date.split(", ")[1].split(" ")[1]}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm">{session.name}</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {session.duration} • {session.volume}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

        </div>
    );
}
