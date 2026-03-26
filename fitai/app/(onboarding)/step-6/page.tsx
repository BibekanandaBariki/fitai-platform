"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

const DIETS = [
  { id: "balanced", title: "Balanced", desc: "No specific restrictions" },
  { id: "vegetarian", title: "Vegetarian", desc: "Plant-based + Dairy" },
  { id: "vegan", title: "Vegan", desc: "100% Plant-based" },
  { id: "jain", title: "Jain", desc: "No root vegetables" },
  { id: "keto", title: "Keto", desc: "High fat, very low carb" },
  { id: "ayurvedic", title: "Ayurvedic", desc: "Based on Indian doshas" },
];

const DISLIKES = [
  "Mushrooms", "Paneer", "Soya", "Eggs", "Chicken", "Fish", "Dairy", "Gluten", "Nuts"
];

export default function OnboardingStep6() {
  const { dietType, dislikes, updateData } = useOnboardingStore();
  const router = useRouter();

  const toggleDislike = (item: string) => {
    let newDislikes = [...dislikes];
    if (newDislikes.includes(item)) {
      newDislikes = newDislikes.filter(d => d !== item);
    } else {
      newDislikes.push(item);
    }
    updateData({ dislikes: newDislikes });
  };

  const handleNext = () => {
    if (dietType) {
      router.push("/onboarding/step-7");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="w-full h-1 bg-muted fixed top-0 left-0 z-50">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "70%" }}
          animate={{ width: "84%" }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="container mx-auto flex h-16 items-center px-4 mt-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/onboarding/step-5")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="ml-auto text-sm font-medium text-muted-foreground mr-2">6 of 7</span>
      </div>

      <main className="flex-1 container mx-auto px-4 pb-32 max-w-xl mt-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">
              Fuel your body
            </h1>
            <UtensilsCrossed className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground mb-8 text-lg">
            Our AI generates Indian meal plans around your exact preferences.
          </p>

          <div className="space-y-10">
            {/* Diet Type */}
            <div>
              <label className="text-base font-semibold mb-4 block">
                What's your primary dietary preference?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DIETS.map((diet) => (
                  <button
                    key={diet.id}
                    onClick={() => updateData({ dietType: diet.id })}
                    className={cn(
                      "flex flex-col text-left p-4 rounded-xl border-2 transition-all press-glow text-primary",
                      dietType === diet.id
                        ? "border-primary bg-primary/10 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                        : "border-input bg-card hover:border-primary/50"
                    )}
                  >
                    <span className="font-semibold">{diet.title}</span>
                    <span className={cn(
                      "text-xs mt-1",
                      dietType === diet.id ? "text-primary/80" : "text-muted-foreground"
                    )}>{diet.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Food Dislikes / Allergies */}
            <div>
              <label className="text-base font-semibold mb-1 block">
                Any foods you dislike or are allergic to?
              </label>
              <span className="text-sm text-muted-foreground mb-4 block">We won't include these in your meal plans.</span>
              <div className="flex flex-wrap gap-2">
                {DISLIKES.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleDislike(item)}
                    className={cn(
                      "px-4 text-sm py-2 rounded-full font-medium transition-all press-glow border",
                      dislikes.includes(item)
                        ? "bg-destructive/10 border-destructive text-destructive"
                        : "bg-card border-input hover:border-destructive/30 text-foreground"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-md border-t">
        <div className="container mx-auto max-w-2xl flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.push("/onboarding/step-7")} className="text-muted-foreground">
            Skip
          </Button>
          <Button
            size="lg"
            className="w-32 h-12 shadow-primary/20 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]"
            disabled={!dietType}
            onClick={handleNext}
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div >
  );
}
