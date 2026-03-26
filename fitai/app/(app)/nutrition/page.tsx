"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MacroRing } from "@/components/nutrition/MacroRing";
import { Search, Camera, Mic, Plus, Flame, Utensils, Coffee, ChevronRight } from "lucide-react";

export default function NutritionPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Nutrition</h1>
                    <p className="text-muted-foreground">Today's Balance</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-primary/50 text-primary bg-primary/10">
                        <Camera className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-accent/50 text-accent bg-accent/10">
                        <Mic className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Main Macro Card */}
            <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-8 justify-around">
                        <MacroRing
                            calories={{ current: 1450, target: 2400 }}
                            protein={{ current: 110, target: 160 }}
                            carbs={{ current: 140, target: 250 }}
                            fat={{ current: 50, target: 80 }}
                            size={180}
                            strokeWidth={14}
                        />

                        <div className="grid grid-cols-3 sm:grid-cols-1 gap-6 w-full sm:w-auto">
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex justify-center sm:justify-start items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-primary"></span> Protein
                                </span>
                                <span className="font-heading font-bold text-xl">110g <span className="text-sm font-normal text-muted-foreground block sm:inline">left 50g</span></span>
                            </div>
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex justify-center sm:justify-start items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Carbs
                                </span>
                                <span className="font-heading font-bold text-xl">140g <span className="text-sm font-normal text-muted-foreground block sm:inline">left 110g</span></span>
                            </div>
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex justify-center sm:justify-start items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Fat
                                </span>
                                <span className="font-heading font-bold text-xl">50g <span className="text-sm font-normal text-muted-foreground block sm:inline">left 30g</span></span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Smart Logging Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                    type="text"
                    className="block w-full h-14 pl-10 pr-3 rounded-xl border border-input bg-card text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary shadow-sm transition-all"
                    placeholder="Search for '2 Roti and Dal'..."
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                    <Button size="sm" className="h-10 rounded-lg bg-primary/20 text-primary hover:bg-primary/30">
                        Log
                    </Button>
                </div>
            </div>

            {/* Meal Diary */}
            <section className="space-y-4 pt-2">

                {/* Breakfast */}
                <div className="rounded-xl border bg-card overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-muted/30 border-b">
                        <div className="flex items-center gap-2">
                            <Coffee className="h-5 w-5 text-orange-400" />
                            <h3 className="font-heading font-semibold">Breakfast</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <span>350 kcal</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex justify-between items-center group cursor-pointer">
                            <div>
                                <p className="font-medium text-sm">Masala Oats</p>
                                <p className="text-xs text-muted-foreground">1 bowl (200g)</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-xs text-muted-foreground hidden sm:flex gap-2">
                                    <span className="text-primary">8P</span>
                                    <span className="text-blue-500">22C</span>
                                    <span className="text-amber-500">4F</span>
                                </div>
                                <span className="font-semibold text-sm">180 kcal</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center group cursor-pointer">
                            <div>
                                <p className="font-medium text-sm">Boiled Eggs</p>
                                <p className="text-xs text-muted-foreground">2 large</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-xs text-muted-foreground hidden sm:flex gap-2">
                                    <span className="text-primary">12P</span>
                                    <span className="text-blue-500">1C</span>
                                    <span className="text-amber-500">10F</span>
                                </div>
                                <span className="font-semibold text-sm">170 kcal</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lunch */}
                <div className="rounded-xl border bg-card overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-muted/30 border-b">
                        <div className="flex items-center gap-2">
                            <Utensils className="h-5 w-5 text-green-500" />
                            <h3 className="font-heading font-semibold">Lunch</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <span>720 kcal</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex justify-between items-center group cursor-pointer">
                            <div>
                                <p className="font-medium text-sm">Chicken Biryani (Restaurant)</p>
                                <p className="text-xs text-muted-foreground">1 plate (350g)</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-xs text-muted-foreground hidden sm:flex gap-2">
                                    <span className="text-primary">32P</span>
                                    <span className="text-blue-500">65C</span>
                                    <span className="text-amber-500">22F</span>
                                </div>
                                <span className="font-semibold text-sm">600 kcal</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center group cursor-pointer">
                            <div>
                                <p className="font-medium text-sm">Cucumber Raita</p>
                                <p className="text-xs text-muted-foreground">1 small bowl (100g)</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-xs text-muted-foreground hidden sm:flex gap-2">
                                    <span className="text-primary">4P</span>
                                    <span className="text-blue-500">8C</span>
                                    <span className="text-amber-500">3F</span>
                                </div>
                                <span className="font-semibold text-sm">120 kcal</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Snacks */}
                <div className="rounded-xl border bg-card overflow-hidden border-dashed border-input">
                    <div className="flex items-center justify-between p-4 bg-card cursor-pointer hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Flame className="h-5 w-5" />
                            <h3 className="font-heading font-semibold">Add Snacks</h3>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 rounded-full border-dashed">
                            <Plus className="h-4 w-4 mr-1" /> Log
                        </Button>
                    </div>
                </div>

                {/* Dinner */}
                <div className="rounded-xl border bg-card overflow-hidden border-dashed border-input">
                    <div className="flex items-center justify-between p-4 bg-card cursor-pointer hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Utensils className="h-5 w-5" />
                            <h3 className="font-heading font-semibold">Add Dinner</h3>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 rounded-full border-dashed">
                            <Plus className="h-4 w-4 mr-1" /> Log
                        </Button>
                    </div>
                </div>

            </section>

        </div>
    );
}
