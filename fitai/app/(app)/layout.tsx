"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Dumbbell, UtensilsCrossed, LineChart, MessageSquare, Users2, LogOut, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { trpc } from "@/lib/trpc/client";
import { useOnboardingStore } from "@/store/onboardingStore";

const NAV_ITEMS = [
    { name: "Home",     href: "/dashboard", icon: Home           },
    { name: "Workout",  href: "/workout",   icon: Dumbbell       },
    { name: "Meals",    href: "/nutrition", icon: UtensilsCrossed },
    { name: "Coach",    href: "/coach",     icon: MessageSquare  },
    { name: "Progress", href: "/progress",  icon: LineChart      },
    { name: "Community",href: "/community", icon: Users2         },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname  = usePathname();
    const router    = useRouter();
    const resetStore = useOnboardingStore((s) => s.reset);

    const [user, setUser]           = useState<any>(null);
    const [showRestart, setShowRestart] = useState(false);
    
    const { data: profileData } = trpc.profile.get.useQuery();

    const resetJourney = trpc.profile.reset.useMutation({
        onSuccess: () => {
            resetStore();
            router.replace("/step-1");
        },
    });

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
        );
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setUser(data.user);
        });
    }, []);

    const handleLogout = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
        );
        await supabase.auth.signOut();
        resetStore();
        router.replace("/");
    };

    const displayName = profileData?.profile?.fullName?.split(" ")[0]
        ?? user?.user_metadata?.full_name?.split(" ")[0]
        ?? user?.email?.split("@")[0]
        ?? "Athlete";
        
    const avatar = profileData?.profile?.profilePhotoUrl 
        ?? user?.user_metadata?.avatar_url
        ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

    const isImmersiveScreen =
        pathname.includes("/workout/execute") || pathname.includes("/form-check");

    if (isImmersiveScreen) return <>{children}</>;

    return (
        <div className="flex min-h-screen flex-col bg-background pb-20 md:pb-0 md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-card h-screen sticky top-0 px-4 py-6">
                <Link href="/dashboard" className="flex items-center gap-2 px-2 mb-10 group">
                    <div className="bg-black/50 p-1 rounded-lg backdrop-blur-sm border border-primary/20">
                        <img src="/bb_fitness_logo.png" alt="BB Fitness" className="h-7 w-7 object-contain group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="font-heading text-2xl font-bold tracking-tight">FitAI</span>
                </Link>

                <nav className="flex-1 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const Icon     = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom user card */}
                <div className="mt-auto pt-4 border-t border-border space-y-1">
                    {/* Restart Journey */}
                    {showRestart ? (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs">
                            <p className="text-destructive font-semibold mb-2">Restart your journey?</p>
                            <p className="text-muted-foreground mb-3">Your XP and day count will reset. Workout history is kept.</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => resetJourney.mutate()}
                                    disabled={resetJourney.isPending}
                                    className="flex-1 py-1.5 rounded-lg bg-destructive text-destructive-foreground font-semibold text-xs hover:bg-destructive/80 transition-colors"
                                >
                                    {resetJourney.isPending ? "Resetting…" : "Yes, restart"}
                                </button>
                                <button
                                    onClick={() => setShowRestart(false)}
                                    className="flex-1 py-1.5 rounded-lg bg-muted text-foreground text-xs hover:bg-muted/80 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowRestart(true)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Restart Journey
                        </button>
                    )}

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>

                    {/* User pill */}
                    <div className="flex items-center gap-3 px-3 py-3 mt-1">
                        <img src={avatar} alt={displayName} className="h-8 w-8 rounded-full border border-primary/30 object-cover" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{displayName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-md mx-auto md:max-w-4xl pt-4 md:pt-8 px-4 h-full">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-background/90 backdrop-blur-lg border-t z-50 px-2 flex items-center justify-around pb-safe">
                {NAV_ITEMS.slice(0, 5).map((item) => {
                    const Icon     = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className={cn("p-1 rounded-full transition-all duration-300", isActive && "bg-primary/10 scale-110")}>
                                <Icon className={cn("h-5 w-5", isActive && "fill-primary/20")} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
