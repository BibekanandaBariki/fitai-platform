"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Smartphone, ArrowRight, Loader2, Fingerprint } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    const [authMethod, setAuthMethod] = useState<"options" | "phone" | "email">("options");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        const { supabase } = await import("@/lib/supabase/client");
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                skipBrowserRedirect: true, // Prevents cookie/redirect race condition on first login
            },
        });
        
        if (error) {
            console.error("Google login error:", error);
            setIsLoading(false);
        } else if (data?.url) {
            window.location.href = data.url;
        }
    };

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const email = (e.target as any)[0].value;
        const { supabase } = await import("@/lib/supabase/client");
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) {
            console.error("Magic link error:", error);
        } else {
            alert("Check your email for the magic link!");
        }
        setIsLoading(false);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background relative overflow-hidden">

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
            <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] -z-10" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] -z-10" />

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 group">
                <div className="bg-black/60 p-1 rounded-lg border border-primary/20">
                    <Image src="/bb_fitness_logo.png" alt="BB Fitness" width={26} height={26} className="object-contain group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-heading text-xl font-bold tracking-tight">FitAI</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <div className="rounded-2xl border bg-card/60 backdrop-blur-xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-heading font-bold mb-2">Welcome Back</h1>
                        <p className="text-muted-foreground">Log in to unleash your potential</p>
                    </div>

                    <AnimatePresence mode="wait">

                        {/* Main Options View */}
                        {authMethod === "options" && (
                            <motion.div
                                key="options"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <Button
                                    size="lg"
                                    className="w-full h-14 text-base bg-white text-black hover:bg-gray-100 border border-gray-200"
                                    onClick={handleGoogleLogin}
                                >
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-3" />
                                    Continue with Google
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full h-14 text-base"
                                    onClick={() => setAuthMethod("phone")}
                                >
                                    <Smartphone className="mr-3 h-5 w-5" />
                                    Continue with Phone
                                </Button>

                                <Button
                                    size="lg"
                                    variant="ghost"
                                    className="w-full h-14 text-base"
                                    onClick={() => setAuthMethod("email")}
                                >
                                    <Mail className="mr-3 h-5 w-5" />
                                    Use Email Link
                                </Button>

                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">Or</span>
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full h-14 text-base font-medium flex items-center justify-center gap-2 hover:bg-muted border-primary/20 text-primary"
                                    onClick={() => alert("WebAuthn / Passkey flow initiated...")}
                                >
                                    <Fingerprint className="w-5 h-5 text-green-500" />
                                    Login with Passkey / Face ID
                                </Button>

                            </motion.div>
                        )}

                        {/* Phone Input View */}
                        {authMethod === "phone" && (
                            <motion.form
                                key="phone"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    alert("Phone auth coming soon (requires SMS provider).");
                                }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <div className="flex">
                                        <div className="flex items-center justify-center px-4 border border-r-0 border-input bg-muted/50 rounded-l-md text-sm">
                                            +91
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="99999 99999"
                                            className="flex-1 h-12 rounded-r-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => setAuthMethod("options")}>
                                        Back
                                    </Button>
                                    <Button type="submit" className="flex-[2] h-12 shadow-primary/20 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Send OTP"}
                                    </Button>
                                </div>
                            </motion.form>
                        )}

                        {/* Email Input View */}
                        {authMethod === "email" && (
                            <motion.form
                                key="email"
                                onSubmit={handleMagicLink}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full h-12 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => setAuthMethod("options")}>
                                        Back
                                    </Button>
                                    <Button type="submit" className="flex-[2] h-12 shadow-primary/20 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Send Magic Link"}
                                    </Button>
                                </div>
                            </motion.form>
                        )}

                    </AnimatePresence>

                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        By continuing, you agree to our{" "}
                        <Link href="/" className="underline underline-offset-4 hover:text-primary">Terms of Service</Link>{" "}
                        and{" "}
                        <Link href="/" className="underline underline-offset-4 hover:text-primary">Privacy Policy</Link>.
                    </div>
                </div>

                <div className="mt-6 text-center text-sm">
                    Don't have an account?{" "}
                    <button className="font-medium text-primary hover:underline">Sign up</button>
                </div>
            </motion.div>
        </div>
    );
}
