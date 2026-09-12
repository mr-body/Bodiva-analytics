import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TradePanel() {
    const [side, setSide] = useState<"long" | "short">("long");

    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-surface p-4">
                <Tabs defaultValue="perps">
                    <TabsList className="w-full">
                        <TabsTrigger value="token" className="flex-1">
                            Token
                        </TabsTrigger>
                        <TabsTrigger value="perps" className="flex-1">
                            Perps
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setSide("long")}
                        className={`rounded-lg py-2 text-sm font-semibold transition-colors ${side === "long"
                            ? "bg-bull text-bull-foreground"
                            : "bg-accent text-muted-foreground"
                            }`}
                    >
                        Long
                    </button>
                    <button
                        onClick={() => setSide("short")}
                        className={`rounded-lg py-2 text-sm font-semibold transition-colors ${side === "short"
                            ? "bg-bear text-bear-foreground"
                            : "bg-accent text-muted-foreground"
                            }`}
                    >
                        Short
                    </button>
                </div>

                <div className="mt-3 flex gap-2">
                    {["Market", "Limit", "Advance"].map((t, i) => (
                        <button
                            key={t}
                            className={`rounded-md px-2.5 py-1 text-xs ${i === 0 ? "bg-accent font-medium" : "text-muted-foreground"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <p className="mt-4 text-xs text-muted-foreground">Amount</p>
                <Input className="mt-1 font-mono" defaultValue="1,000" />

                <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs text-muted-foreground">
                    <span>20%</span>
                    <span className="text-center">0.0001</span>
                    <span className="text-right">0.0001</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm">Reduce Only</span>
                    <Switch />
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm">Auto Close</span>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                        <span className="rounded-md bg-accent px-2 py-1">TP</span>
                        <span className="rounded-md bg-accent px-2 py-1">SL</span>
                    </div>
                </div>

                <Button
                    className="mt-4 w-full bg-bull text-bull-foreground hover:bg-bull/90"
                    size="lg"
                >
                    Sign Up to Trade
                </Button>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4 text-center">
                <div className="mb-3 h-24 w-full rounded-lg bg-gradient-to-br from-accent via-secondary to-muted" />
                <p className="text-sm font-semibold">Sign Up for Position Intelligence</p>
                <p className="mt-1 text-xs text-muted-foreground">
                    Get wallet-level insights into long and short positions from Smart Money.
                </p>
                <Button className="mt-3 w-full" size="sm">
                    Sign Up
                </Button>
            </div>
        </div>
    );
}
