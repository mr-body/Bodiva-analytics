import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Bell, Bookmark, Search } from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { OrderBook } from "@/components/dashboard/OrderBook";
import { TradePanel } from "@/components/dashboard/TradePanel";
import { TradersTable } from "@/components/dashboard/TradersTable";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import bodiva from "@/assets/bodiva.png";
import { useGetAllMarketSummary } from "#/hooks/budiva/useGetAllMarketSummary";
import { Skeleton } from "#/components/ui/skeleton";

const title = "Quant.AI — Investment Platform Dashboard";
const description =
  "Real-time markets, order book, perps trading and smart-money position intelligence in one dashboard.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Dashboard,
});

// Função utilitária para formatação numérica segura
const fmt = (value: number, decimals: number = 2) => {
  if (isNaN(value)) return "0.00";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

function Dashboard() {
  const {
    data: marketSummary,
    error: marketSummaryError,
    isLoading: marketSummaryIsLoading,
  } = useGetAllMarketSummary();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />

        <main className="min-w-0 flex-1 overflow-x-hidden">
          <header className="flex flex-wrap items-center gap-3 border-b border-border bg-surface px-4 py-3">
            <SidebarTrigger />
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search tokens, wallets, contracts, narratives..."
                className="w-full rounded-lg border border-border bg-panel py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <span className="rounded-full border border-border px-3 py-1.5 text-xs font-medium">
              <span className="mr-2 inline-block size-2 rounded-full bg-bull align-middle" />
              24,182 wallets tracked
            </span>
            <Bookmark className="size-4 text-muted-foreground" />
            <Bell className="size-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-accent" />
              <div className="leading-tight">
                <p className="text-sm font-semibold">RahMan</p>
                <p className="text-xs text-muted-foreground">Fortis Capital</p>
              </div>
            </div>
          </header>

          <section className="flex flex-wrap items-center border-b border-border bg-surface">
            <div className="flex items-center gap-2">
              <img src={bodiva} alt="Logo" width={125} height={50} className="bg-[#007aff]  p-2" />
            </div>

            {/* TICKER TAPE */}
            <div className="relative flex-1 overflow-hidden bg-panel/60 backdrop-blur">
              <div className="flex whitespace-nowrap py-2 animate-ticker">
                {marketSummaryIsLoading ? (
                  <div className="flex items-center px-4">
                    <Skeleton className="h-4 w-48" />
                  </div>
                ) : marketSummaryError ? (
                  <div className="flex items-center gap-2 px-4 text-destructive">
                    <AlertCircle className="size-5" />
                    <span className="text-xs">{marketSummaryError.message}</span>
                  </div>
                ) : marketSummary ? (
                  [...marketSummary, ...marketSummary].map((t, i) => {
                    const price = Number(t.CLOSE_PRICE) || 0;
                    const changeVal = Number(t.CHANGE_PRICE) || 0;
                    const isUp = changeVal > 0;
                    const isZero = changeVal === 0;

                    return (
                      <span
                        key={`${t.SYMBOL}-${i}`}
                        className="mx-6 inline-flex items-center gap-2 text-[13px] font-mono tabular-nums"
                      >
                        <span className="text-muted-foreground">{t.SYMBOL}</span>
                        <span className="text-foreground">{fmt(price, 2)}</span>
                        <span className={isUp ? "text-bull" : isZero ? "text-neutral" : "text-bear"}>
                          {isUp ? "▲" : isZero ? "■" : "▼"} {fmt(Math.abs(changeVal), 2)}%
                        </span>
                      </span>
                    );
                  })
                ) : null}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
            </div>
          </section>

          <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_260px_280px]">
            <div className="flex flex-col gap-4">
              <PriceChart />
              <TradersTable />
            </div>
            <OrderBook />
            <TradePanel />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}