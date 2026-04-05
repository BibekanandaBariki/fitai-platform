import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "FitAI — India's #1 AI Personal Trainer & Fitness Coach",
  description: "Transform your body with personalized AI workout plans, meal tracking, and real-time coaching. Free to start. 500,000+ Indians already transforming.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/bb_fitness_logo.png", sizes: "32x32", type: "image/png" },
      { url: "/bb_fitness_logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/bb_fitness_logo.png",
    shortcut: "/bb_fitness_logo.png",
  },
};

import { TRPCProvider } from "@/lib/trpc/Provider";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { URLSanitizer } from "@/components/shared/URLSanitizer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20",
        inter.variable,
        sora.variable
      )}>
        <URLSanitizer />
        <NextIntlClientProvider messages={messages}>
          <TRPCProvider>
            {children}
          </TRPCProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
