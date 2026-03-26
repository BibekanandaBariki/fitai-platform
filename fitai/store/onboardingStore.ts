import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
    // Step 1: Goals
    primaryGoal: string | null;
    subGoals: string[];
    timeline: string | null;

    // Step 2: Physical
    height: number | null;
    weight: number | null;
    targetWeight: number | null;

    // Step 3: Fitness Level
    pushups: string | null;
    cardio: string | null;
    experienceYears: number | null;

    // Step 4: Medical
    conditions: string[];
    injuries: string[];

    // Step 5: Schedule
    days: string[];
    timeSlots: string[];
    durationMinutes: number | null;
    location: string | null;

    // Step 6: Nutrition
    dietType: string | null;
    dislikes: string[];

    // Actions
    updateData: (data: Partial<OnboardingState>) => void;
    reset: () => void;
}

const initialState = {
    primaryGoal: null,
    subGoals: [],
    timeline: null,
    height: null,
    weight: null,
    targetWeight: null,
    pushups: null,
    cardio: null,
    experienceYears: null,
    conditions: [],
    injuries: [],
    days: [],
    timeSlots: [],
    durationMinutes: null,
    location: null,
    dietType: null,
    dislikes: [],
};

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            ...initialState,
            updateData: (data) => set((state) => ({ ...state, ...data })),
            reset: () => set(initialState),
        }),
        {
            name: "fitai-onboarding-storage",
        }
    )
);
