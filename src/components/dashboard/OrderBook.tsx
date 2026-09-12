import { useGetAllMarketSummary } from "#/hooks/budiva/useGetAllMarketSummary";
import type { AllMarketSummary } from "#/service/budiva/GetAllMarketSummary";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

const trades = Array.from({ length: 9 }, (_, i) => ({
    price: (52029 - i * 4).toFixed(2),
    size: (0.15 + i * 0.02).toFixed(3),
    time: `12:0${i}:22`,
    buy: i % 3 !== 0,
}));

export function OrderBook() {
    const [asksList, setAsksList] = useState<AllMarketSummary[]>([]);
    const [bidsList, setBidsList] = useState<AllMarketSummary[]>([]);

    const {
        data: marketSummary,
        error: marketSummaryError,
        isLoading: marketSummaryIsLoading
    } = useGetAllMarketSummary();

    useEffect(() => {
        if (marketSummary) {
            // Exemplo de separação baseado em regras de preço/mudança da API
            setAsksList(marketSummary.filter((m) => Number(m.CHANGE_PRICE) > 0));
            setBidsList(marketSummary.filter((m) => Number(m.CHANGE_PRICE) < 0));
        }
    }, [marketSummary]);

    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-surface p-3">
                <Tabs defaultValue="book">
                    <TabsList className="w-full">
                        <TabsTrigger value="book" className="flex-1">
                            Order Book
                        </TabsTrigger>
                        <TabsTrigger value="token" className="flex-1">
                            Token
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="mt-3 grid grid-cols-3 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                    <span>Symbol / Price</span>
                    <span className="text-right">Close</span>
                    <span className="text-right">Turnover</span>
                </div>

                <div className="mt-1 space-y-0.5">
                    {marketSummaryIsLoading ? (
                        <div className="text-xs text-muted-foreground py-2 text-center">Loading asks...</div>
                    ) : asksList.length === 0 ? (
                        <div className="text-xs text-muted-foreground py-2 text-center">No asks found</div>
                    ) : (
                        asksList.map((r) => (
                            <div key={r.SYMBOL} className="grid grid-cols-3 font-mono text-[11px]">
                                <span className="text-bear">{r.SYMBOL}</span>
                                <span className="text-right text-muted-foreground">{Number(r.CLOSE_PRICE).toLocaleString("pt-AO", { style: "currency", currency: "AOA", maximumFractionDigits: 0 })}</span>
                                <span className="text-right text-muted-foreground">{(Number(r.TURNOVER)).toFixed(0)}</span>
                            </div>
                        ))
                    )}
                </div>

                <div className="my-2 flex items-center justify-between border-y border-border py-1.5 font-mono text-sm font-semibold">
                    <span className="text-bull">Market Summary</span>
                    <span className="text-xs text-muted-foreground">Active</span>
                </div>

                <div className="space-y-0.5">
                    {marketSummaryIsLoading ? (
                        <div className="text-xs text-muted-foreground py-2 text-center">Loading bids...</div>
                    ) : bidsList.length === 0 ? (
                        <div className="text-xs text-muted-foreground py-2 text-center">No bids found</div>
                    ) : (
                        bidsList.map((r) => (
                            <div key={r.SYMBOL} className="grid grid-cols-3 font-mono text-[11px]">
                                <span className="text-bull">{r.SYMBOL}</span>
                                <span className="text-right text-muted-foreground">{Number(r.CLOSE_PRICE).toLocaleString("pt-AO", { style: "currency", currency: "AOA", maximumFractionDigits: 0 })}</span>
                                <span className="text-right text-muted-foreground">{(Number(r.TURNOVER)).toFixed(0)}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-sm font-semibold">Trades</p>
                <div className="mt-2 grid grid-cols-3 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                    <span>Price</span>
                    <span className="text-right">Size</span>
                    <span className="text-right">Time</span>
                </div>
                <div className="mt-1 space-y-0.5">
                    {trades.map((t) => (
                        <div key={t.time} className="grid grid-cols-3 font-mono text-[11px]">
                            <span className={t.buy ? "text-bull" : "text-bear"}>{t.price}</span>
                            <span className="text-right text-muted-foreground">{t.size}</span>
                            <span className="text-right text-muted-foreground">{t.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}