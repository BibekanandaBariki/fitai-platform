"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Dumbbell, UtensilsCrossed, LineChart, MessageSquare, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Workout", href: "/workout", icon: Dumbbell },
    { name: "Meals", href: "/nutrition", icon: UtensilsCrossed },
    { name: "Coach", href: "/coach", icon: MessageSquare },
    { name: "Progress", href: "/progress", icon: LineChart },
];

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Hide nav on specific immersive screens (like active workout or photo full-screen)
    const isImmersiveScreen = pathname.includes("/workout/execute") || pathname.includes("/form-check");

    if (isImmersiveScreen) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen flex-col bg-background pb-20 md:pb-0 md:flex-row">
            {/* Desktop Sidebar (hidden on mobile) */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-card h-screen sticky top-0 px-4 py-6">
                <Link href="/dashboard" className="flex items-center gap-2 px-2 mb-10 group">
                    <div className="bg-primary/20 p-1.5 rounded-lg">
                        <svg className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    </div>
                    <span className="font-heading text-2xl font-bold tracking-tight">FitAI</span>
                </Link>
                <nav className="flex-1 space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
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
                    <Link
                        href="/community"
                        className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                            pathname.startsWith("/community") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        <Users2 className="h-5 w-5" />
                        Community
                    </Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-md mx-auto md:max-w-4xl pt-4 md:pt-8 px-4 h-full">
                {children}
            </main>

            {/* Mobile Bottom Navigation (hidden on desktop) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-background/90 backdrop-blur-lg border-t z-50 px-2 flex items-center justify-around pb-safe">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
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
                            <div className={cn(
                                "p-1 rounded-full transition-all duration-300",
                                isActive && "bg-primary/10 scale-110"
                            )}>
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
