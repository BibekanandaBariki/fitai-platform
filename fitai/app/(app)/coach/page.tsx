"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Camera, Sparkles, AlertCircle, RefreshCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from '@ai-sdk/react';

const SUGGESTIONS = [
    "Review my form 📸",
    "Modify tomorrow's workout",
    "Suggest a high-protein snack",
    "Why am I so sore today?"
];

export default function CoachPage() {
    const { messages, input, handleInputChange, handleSubmit, setInput, isLoading, append } = useChat() as any;
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] md:h-[calc(100vh-2rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-primary">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></div>
                    </div>
                    <div>
                        <h1 className="text-xl font-heading font-bold tracking-tight">Coach Claude</h1>
                        <p className="text-xs text-primary font-medium">Online • AI Active</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <RefreshCcw className="h-5 w-5" />
                </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {/* Context Chip */}
                <div className="flex justify-center">
                    <div className="bg-muted/50 text-muted-foreground text-xs px-3 py-1 rounded-full flex items-center gap-1.5 border border-border">
                        <AlertCircle className="h-3 w-3" /> Coach has access to your live fitness data
                    </div>
                </div>

                {messages.map((msg: any) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "flex w-full",
                            msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        <div className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                            msg.role === "user"
                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-card border border-input text-card-foreground rounded-bl-sm"
                        )}>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                    </motion.div>
                ))}
                
                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-card border border-input text-card-foreground rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm inline-flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Claude is thinking...</span>
                        </div>
                    </motion.div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 1 && (
                <div className="pb-4 overflow-x-auto whitespace-nowrap hide-scrollbar flex gap-2">
                    {SUGGESTIONS.map((suggestion, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setInput("");
                                append({ role: 'user', content: suggestion });
                            }}
                            className="inline-flex items-center text-xs font-medium bg-card border border-input px-3 py-1.5 rounded-full hover:border-primary/50 hover:bg-primary/5 transition-colors press-glow"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="pt-2 flex items-end gap-2 relative">
                <Button type="button" variant="outline" size="icon" className="h-14 w-14 shrink-0 rounded-2xl border-input bg-card shadow-sm text-muted-foreground hover:text-primary">
                    <Camera className="h-6 w-6" />
                </Button>
                <div className="relative flex-1">
                    <textarea
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (input.trim() && !isLoading) {
                                  handleSubmit(e);
                                }
                            }
                        }}
                        placeholder="Ask your coach anything..."
                        className="w-full min-h-[56px] max-h-32 rounded-2xl border border-input bg-card px-4 py-4 pr-12 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary shadow-sm resize-none hide-scrollbar"
                        rows={1}
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input?.trim() || isLoading}
                        className={cn(
                            "absolute right-2 bottom-2 h-10 w-10 text-primary-foreground shadow-sm transition-all",
                            input?.trim() ? "bg-primary scale-100" : "bg-muted text-muted-foreground scale-90"
                        )}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </form>

        </div>
    );
}
