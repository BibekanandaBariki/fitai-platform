"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import { TrendingUp, Camera, History, Crown, Plus, Calendar, Scaling, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import { trpc } from "@/lib/trpc/client";

const WEIGHT_DATA_MOCK = [
    { date: "Oct 1", weight: 78.5 },
    { date: "Oct 5", weight: 77.8 },
    { date: "Oct 10", weight: 77.2 },
    { date: "Oct 15", weight: 76.9 },
    { date: "Oct 20", weight: 76.5 },
    { date: "Oct 25", weight: 76.0 },
    { date: "Oct 30", weight: 75.4 },
];

const RECORDS = [
    { id: 1, name: "Barbell Bench Press", weight: "80kg", reps: 5, date: "2 days ago" },
    { id: 2, name: "Deadlift", weight: "120kg", reps: 3, date: "1 week ago" },
    { id: 3, name: "Squat", weight: "100kg", reps: 5, date: "2 weeks ago" },
];

export default function ProgressPage() {
    const { data: profileData } = trpc.profile.get.useQuery();
    const [activeTab, setActiveTab] = useState<"overview" | "photos" | "history">("overview");
    const [isExporting, setIsExporting] = useState(false);

    const exportPDF = async () => {
        setIsExporting(true);
        const element = document.getElementById('progress-report');
        if (element) {
            try {
                const canvas = await html2canvas(element, { backgroundColor: '#09090b', scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('FitAI_Progress_Report.pdf');
            } catch (err) {
                console.error("PDF Export failed", err);
            }
        }
        setIsExporting(false);
    };

    const currentWeight = profileData?.profile?.weightKg ? Number(profileData.profile.weightKg) : null;
    const targetWeight = profileData?.profile?.targetWeightKg ? Number(profileData.profile.targetWeightKg) : null;
    const diff = (currentWeight && targetWeight) ? Math.abs(currentWeight - targetWeight).toFixed(1) : "0.0";
    
    // Smooth the mock graph by anchoring it on the user's actual current weight at the end
    const dynamicGraphData = currentWeight ? [
        ...WEIGHT_DATA_MOCK.map(d => ({ ...d, weight: d.weight + (currentWeight - 75.4) })).slice(0, 6),
        { date: "Today", weight: currentWeight }
    ] : WEIGHT_DATA_MOCK;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Progress</h1>
                    <p className="text-muted-foreground">
                        {currentWeight && targetWeight ? `You're ${diff}kg away from your goal! 🎉` : "Track your journey here! 🎉"}
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={exportPDF} disabled={isExporting}>
                    {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                    Export PDF
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex bg-muted/50 p-1 rounded-xl w-full max-w-sm">
                <button
                    onClick={() => setActiveTab("overview")}
                    className={cn(
                        "flex-1 py-1.5 text-sm font-medium rounded-lg transition-all",
                        activeTab === "overview" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab("photos")}
                    className={cn(
                        "flex-1 py-1.5 text-sm font-medium rounded-lg transition-all",
                        activeTab === "photos" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Photos
                </button>
                <button
                    onClick={() => setActiveTab("history")}
                    className={cn(
                        "flex-1 py-1.5 text-sm font-medium rounded-lg transition-all",
                        activeTab === "history" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Logs
                </button>
            </div>

            <AnimatePresence mode="wait">

                {/* Overview Tab (Charts & PRs) */}
                {activeTab === "overview" && (
                    <motion.div
                        id="progress-report"
                        key="overview"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                    >
                        {/* Body Weight Chart */}
                        <Card className="bg-gradient-to-br from-card to-card/50">
                            <div className="p-4 flex items-center justify-between border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <Scaling className="h-5 w-5 text-primary" />
                                    <h2 className="font-heading font-semibold">Body Weight</h2>
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-xs px-2 py-1 rounded bg-muted font-medium">1M</span>
                                    <span className="text-xs px-2 py-1 rounded bg-transparent text-muted-foreground font-medium">3M</span>
                                    <span className="text-xs px-2 py-1 rounded bg-transparent text-muted-foreground font-medium">1Y</span>
                                </div>
                            </div>
                            <CardContent className="p-0">
                                <div className="flex items-end justify-between p-4 pb-0">
                                    <div>
                                        <span className="text-3xl font-heading font-bold">{currentWeight ?? '--'} <span className="text-base text-muted-foreground font-medium">kg</span></span>
                                        <p className="text-xs text-primary font-medium flex items-center gap-1 mt-1">
                                            <TrendingUp className="h-3 w-3 rotate-180" /> Target: {targetWeight ?? '--'}kg
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-8">
                                        <Plus className="h-4 w-4 mr-1" /> Log
                                    </Button>
                                </div>

                                <div className="h-[200px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={dynamicGraphData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                            <YAxis
                                                domain={['dataMin - 1', 'dataMax + 1']}
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: '#71717a' }}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#121212', borderColor: '#27272a', borderRadius: '8px' }}
                                                itemStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                                                cursor={{ stroke: '#27272a', strokeWidth: 2 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="weight"
                                                stroke="#22c55e"
                                                strokeWidth={3}
                                                dot={{ r: 4, fill: '#121212', strokeWidth: 2 }}
                                                activeDot={{ r: 6, fill: '#22c55e', stroke: '#121212' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Personal Records */}
                        <section>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-heading font-semibold">Personal Records</h2>
                                <Button variant="ghost" size="sm" className="h-8 text-xs">See All</Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {RECORDS.map((record) => (
                                    <Card key={record.id} className="bg-card">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                                                <Crown className="h-6 w-6 text-accent" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm line-clamp-1">{record.name}</h4>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-lg font-heading font-bold text-accent">{record.weight} <span className="text-xs text-muted-foreground font-medium">× {record.reps}</span></p>
                                                    <span className="text-[10px] text-muted-foreground">{record.date}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>

                    </motion.div>
                )}

                {/* Photos Tab */}
                {activeTab === "photos" && (
                    <motion.div
                        key="photos"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-heading font-semibold">Gallery</h2>
                            <Button size="sm">
                                <Camera className="h-4 w-4 mr-2" /> Add Photo
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Compare Card */}
                            <div className="col-span-2 rounded-xl border-2 border-primary border-dashed bg-primary/5 p-4 flex flex-col items-center justify-center min-h-[160px] text-center cursor-pointer hover:bg-primary/10 transition-colors">
                                <Scaling className="h-8 w-8 text-primary mb-2" />
                                <h3 className="font-semibold">Generate Comparison</h3>
                                <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Select Day 1 and Today to see your transformation.</p>
                            </div>

                            {/* Photo Grid Placeholder */}
                            <div className="aspect-[3/4] rounded-xl bg-muted relative overflow-hidden group">
                                <img src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80" alt="Progress" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                                    <div className="text-white">
                                        <p className="font-medium text-sm">Today</p>
                                        <p className="text-xs opacity-80">75.4 kg</p>
                                    </div>
                                </div>
                            </div>

                            <div className="aspect-[3/4] rounded-xl bg-muted relative overflow-hidden group">
                                <img src="https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=400&q=80" alt="Progress" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                                    <div className="text-white">
                                        <p className="font-medium text-sm">Day 1</p>
                                        <p className="text-xs opacity-80">78.5 kg</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
