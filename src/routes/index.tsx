import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  ChevronRight,
  CircleDot,
  Download,
  Globe2,
  Landmark,
  LineChart as LineIcon,
  Search,
  Settings2,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: TradingFloor,
});

// ---------- fake but plausible market data ----------
const TICKER = [
  { s: "BCGAAAAA", p: 19500, c: 0.52 },
  { s: "BAIAAAAA", p: 94000, c: 0.0 },
  { s: "ENSAAAAA", p: 28000, c: -1.75 },
  { s: "BFAAAAAA", p: 100000, c: 0.0 },
  { s: "BDVAAAAA", p: 77500, c: 0.39 },
  { s: "ON30J33A", p: 96.0, c: -2.04 },
  { s: "OJ08M30A", p: 97.0, c: 2.86 },
  { s: "OJ15I31A", p: 96.0, c: 1.05 },
  { s: "OJ10M28A", p: 101.5, c: -6.88 },
  { s: "ON07A32A", p: 106.5, c: 0.47 },
  { s: "OO01I34A", p: 122.0, c: -0.81 },
  { s: "OJ10O31A", p: 95.0, c: -4.04 },
  { s: "OG12F29A", p: 97.0, c: 2.11 },
  { s: "OI08I30A", p: 92.0, c: -3.16 },
  { s: "OH15L29A", p: 97.0, c: 0.86 },
];

const INDICES = [
  { name: "BODIVA 20", value: 12847.32, change: 1.24, tone: "bull" as const },
  { name: "BODIVA Bond Idx", value: 987.65, change: -0.42, tone: "bear" as const },
  { name: "BODIVA OT-NR", value: 104.82, change: 0.31, tone: "bull" as const },
  { name: "AOA / USD", value: 912.4, change: 0.08, tone: "neutral" as const },
];

const SECTORS = [
  { name: "Banca", weight: 42, change: 1.4 },
  { name: "Energia", weight: 18, change: -0.6 },
  { name: "Telecom", weight: 14, change: 2.1 },
  { name: "Seguros", weight: 9, change: 0.2 },
  { name: "Retalho", weight: 7, change: -1.1 },
  { name: "Indústria", weight: 6, change: 0.8 },
  { name: "Agro", weight: 4, change: 3.4 },
];

const TOP = [
  { s: "BCGAAAAA", type: "Acções", price: 19500, ch: 0.52, vol: 1293, trades: 29, amount: 25192500 },
  { s: "BAIAAAAA", type: "Acções", price: 94000, ch: 0.0, vol: 168, trades: 23, amount: 15802000 },
  { s: "ENSAAAAA", type: "Acções", price: 28000, ch: -1.75, vol: 90, trades: 21, amount: 2538024 },
  { s: "BFAAAAAA", type: "Acções", price: 100000, ch: 0.0, vol: 93, trades: 19, amount: 9308200 },
  { s: "BDVAAAAA", type: "Acções", price: 77500, ch: 0.39, vol: 67, trades: 8, amount: 5192500 },
  { s: "OI15I29A", type: "OT-NR", price: 80.0, ch: 0.0, vol: 6266, trades: 7, amount: 5107811 },
  { s: "OJ10M28A", type: "OT-NR", price: 101.5, ch: -6.88, vol: 4210, trades: 12, amount: 4270650 },
  { s: "ON07A32A", type: "OT-NR", price: 106.5, ch: 0.47, vol: 3120, trades: 9, amount: 3322800 },
];

function seedSeries(n: number, base: number, vol: number, seed = 1) {
  const out: { t: string; v: number; h: number; l: number; o: number }[] = [];
  let v = base;
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < n; i++) {
    const o = v;
    const delta = (rnd() - 0.48) * vol;
    v = Math.max(1, v + delta);
    const h = Math.max(o, v) + rnd() * vol * 0.4;
    const l = Math.min(o, v) - rnd() * vol * 0.4;
    const hh = i.toString().padStart(2, "0");
    out.push({ t: `${9 + Math.floor(i / 12)}:${((i * 5) % 60).toString().padStart(2, "0")}`, v: +v.toFixed(2), h: +h.toFixed(2), l: +l.toFixed(2), o: +o.toFixed(2) });
  }
  return out;
}

const fmt = (n: number, d = 2) =>
  new Intl.NumberFormat("pt-PT", { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
const fmtAOA = (n: number) =>
  new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 }).format(n) + " AOA";

// ---------- component ----------
function TradingFloor() {
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState("BCGAAAAA");
  const [flash, setFlash] = useState<Record<string, "up" | "down" | undefined>>({});

  // clock
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // ticker "live" jitter
  const [prices, setPrices] = useState(() => Object.fromEntries(TICKER.map((t) => [t.s, t.p])));
  useEffect(() => {
    const id = setInterval(() => {
      setTick((n) => n + 1);
      setPrices((prev) => {
        const next = { ...prev };
        const nextFlash: Record<string, "up" | "down" | undefined> = {};
        TICKER.forEach((t) => {
          if (Math.random() < 0.45) {
            const jitter = (Math.random() - 0.5) * Math.max(t.p * 0.002, 0.05);
            const newVal = +(prev[t.s] + jitter).toFixed(2);
            nextFlash[t.s] = newVal >= prev[t.s] ? "up" : "down";
            next[t.s] = newVal;
          }
        });
        setFlash(nextFlash);
        return next;
      });
    }, 1600);
    return () => clearInterval(id);
  }, []);

  const chart = useMemo(() => seedSeries(78, 19500, 260, selected.charCodeAt(0) + selected.length), [selected]);
  const volSeries = useMemo(
    () => seedSeries(24, 800, 400, selected.length + 3).map((d, i) => ({ t: `${9 + Math.floor(i / 3)}h`, v: Math.abs(d.v - 400) })),
    [selected],
  );
  const yieldCurve = useMemo(
    () =>
      [1, 2, 3, 5, 7, 10, 15, 20].map((y, i) => ({
        m: `${y}Y`,
        r: +(11.2 + Math.sin(i / 2) * 1.3 + i * 0.2).toFixed(2),
      })),
    [],
  );

  const last = chart[chart.length - 1].v;
  const first = chart[0].v;
  const dayChange = ((last - first) / first) * 100;

  return (
    <div className="min-h-screen text-foreground ">
      {/* TICKER TAPE */}
      <div className="relative overflow-hidden border-b border-border bg-panel/60 backdrop-blur">
        <div className="flex whitespace-nowrap py-2 animate-ticker">
          {[...TICKER, ...TICKER].map((t, i) => {
            const p = prices[t.s] ?? t.p;
            const up = t.c >= 0;
            const fl = flash[t.s];
            return (
              <span
                key={i}
                className={`mx-6 inline-flex items-center gap-2 text-[13px] font-mono tabular ${fl === "up" ? "flash-up" : fl === "down" ? "flash-down" : ""}`}
              >
                <span className="text-muted-foreground">{t.s}</span>
                <span className="text-foreground">{fmt(p, 2)}</span>
                <span className={up ? "text-bull" : t.c === 0 ? "text-neutral" : "text-bear"}>
                  {up ? "▲" : t.c === 0 ? "■" : "▼"} {fmt(Math.abs(t.c), 2)}%
                </span>
              </span>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-5 py-3">
          <a href="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-primary to-gold text-primary-foreground shadow-[0_0_20px_-4px_var(--gold)]">
              <Landmark className="h-4.5 w-4.5" strokeWidth={2.4} />
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-bold tracking-wide">BODIVA</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Exchange · Angola</div>
            </div>
          </a>
          <nav className="hidden items-center gap-1 text-[13px] lg:flex">
            {["Mercado", "Investir", "Financiar", "Estatística", "Membros", "Regulação"].map((n, i) => (
              <a
                key={n}
                href="#"
                className={`rounded-md px-3 py-1.5 transition-colors hover:bg-panel ${i === 0 ? "bg-panel text-foreground" : "text-muted-foreground"}`}
              >
                {n}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-panel/60 px-2.5 py-1.5 md:flex">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                className="w-48 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
                placeholder="Pesquisar valor mobiliário…"
              />
              <kbd className="rounded border border-border bg-background/50 px-1 text-[10px] text-muted-foreground">⌘K</kbd>
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-md border border-border bg-panel/60 text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>
            <div className="hidden items-center gap-2 rounded-md border border-border bg-panel/60 px-3 py-1.5 font-mono text-[12px] tabular sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-bull" />
                <span className="inline-flex h-2 w-2 rounded-full bg-bull" />
              </span>
              <span className="text-muted-foreground">LUANDA</span>
              <span>{now.toLocaleTimeString("pt-PT")}</span>
            </div>
            <button className="rounded-md bg-primary px-3.5 py-1.5 text-[13px] font-semibold text-primary-foreground shadow-[0_10px_30px_-10px_var(--gold)] transition-transform hover:-translate-y-0.5">
              Abrir Conta
            </button>
          </div>
        </div>
      </header>

      {/* HERO / INDICES */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-[1400px] px-5 pb-8 pt-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary"
              >
                <Sparkles className="h-3 w-3" /> Sessão Aberta · Contínua
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl"
              >
                O pulso do <span className="text-shimmer">mercado angolano</span>
                <br />
                em tempo real.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
              >
                Cotações, livro de ordens, curvas de rendimento e estatísticas
                consolidadas da Bolsa de Dívida e Valores de Angola — numa única
                plataforma de nível profissional.
              </motion.p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <button className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2.5 text-[13px] font-semibold text-background">
                  Explorar Mercado <ChevronRight className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-panel px-4 py-2.5 text-[13px] font-semibold">
                  <Download className="h-3.5 w-3.5" /> Boletim Diário
                </button>
              </div>
            </div>

            {/* INDEX CARDS */}
            <div className="grid grid-cols-2 gap-3">
              {INDICES.map((idx, i) => (
                <motion.div
                  key={idx.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className={`panel relative overflow-hidden p-4 ${i === 0 ? "panel-glow" : ""}`}
                >
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
                    <span>{idx.name}</span>
                    <CircleDot className="h-3 w-3 text-bull" />
                  </div>
                  <div className="mt-1.5 font-mono text-2xl font-semibold tabular">
                    {fmt(idx.value, 2)}
                  </div>
                  <div
                    className={`mt-1 inline-flex items-center gap-1 font-mono text-[12px] tabular ${idx.tone === "bull" ? "text-bull" : idx.tone === "bear" ? "text-bear" : "text-neutral"}`}
                  >
                    {idx.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {fmt(Math.abs(idx.change), 2)}%
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-10 opacity-70">
                    <ResponsiveContainer>
                      <AreaChart data={seedSeries(24, 100, 6, i + 1)}>
                        <defs>
                          <linearGradient id={`spark-${i}`} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={idx.tone === "bear" ? "var(--bear)" : "var(--bull)"} stopOpacity={0.6} />
                            <stop offset="100%" stopColor={idx.tone === "bear" ? "var(--bear)" : "var(--bull)"} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          dataKey="v"
                          type="monotone"
                          stroke={idx.tone === "bear" ? "var(--bear)" : "var(--bull)"}
                          strokeWidth={1.5}
                          fill={`url(#spark-${i})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TERMINAL GRID */}
      <section className="mx-auto max-w-[1400px] px-5 pb-8">
        <div className="grid gap-4 lg:grid-cols-[280px_1fr_320px]">
          {/* WATCHLIST */}
          <aside className="panel p-3">
            <div className="mb-2 flex items-center justify-between px-1">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Watchlist</div>
              <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <ul className="space-y-0.5">
              {TICKER.slice(0, 10).map((t) => {
                const active = selected === t.s;
                const p = prices[t.s] ?? t.p;
                const fl = flash[t.s];
                return (
                  <li key={t.s}>
                    <button
                      onClick={() => setSelected(t.s)}
                      className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left transition-colors ${active ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-panel-2"}`}
                    >
                      <div>
                        <div className="font-mono text-[13px] font-semibold">{t.s}</div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {t.s.startsWith("O") ? "Obrigação" : "Acção"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono text-[13px] tabular ${fl === "up" ? "flash-up" : fl === "down" ? "flash-down" : ""}`}>
                          {fmt(p, 2)}
                        </div>
                        <div
                          className={`font-mono text-[11px] tabular ${t.c > 0 ? "text-bull" : t.c < 0 ? "text-bear" : "text-neutral"}`}
                        >
                          {t.c > 0 ? "+" : ""}
                          {fmt(t.c, 2)}%
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* MAIN CHART */}
          <div className="panel flex flex-col p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-mono text-xl font-bold">{selected}</h2>
                  <span className="rounded border border-border bg-panel-2 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {selected.startsWith("O") ? "OT-NR" : "Acções"}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-3">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={last}
                      initial={{ y: 6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      className="font-mono text-3xl font-semibold tabular"
                    >
                      {fmt(last, 2)}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-[12px] uppercase tracking-widest text-muted-foreground">AOA</span>
                  <span
                    className={`font-mono text-sm tabular ${dayChange >= 0 ? "text-bull" : "text-bear"}`}
                  >
                    {dayChange >= 0 ? "+" : ""}
                    {fmt(dayChange, 2)}% hoje
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 rounded-md border border-border bg-panel-2 p-0.5 text-[11px] font-medium">
                {["1D", "1S", "1M", "3M", "1A", "MAX"].map((r, i) => (
                  <button
                    key={r}
                    className={`rounded px-2 py-1 ${i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 h-[280px]">
              <ResponsiveContainer>
                <AreaChart data={chart} margin={{ top: 10, right: 8, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="mainArea" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--grid-line)" strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="t" stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={12} />
                  <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--panel)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                    }}
                    labelStyle={{ color: "var(--muted-foreground)" }}
                  />
                  <Area type="monotone" dataKey="v" stroke="var(--gold)" strokeWidth={2} fill="url(#mainArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 h-[80px] border-t border-border pt-2">
              <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <BarChart3 className="h-3 w-3" /> Volume
              </div>
              <ResponsiveContainer>
                <BarChart data={volSeries} margin={{ top: 0, right: 8, bottom: 0, left: -30 }}>
                  <Bar dataKey="v" radius={[2, 2, 0, 0]}>
                    {volSeries.map((_, i) => (
                      <Cell key={i} fill={i % 3 === 0 ? "var(--bear)" : "var(--bull)"} opacity={0.75} />
                    ))}
                  </Bar>
                  <XAxis dataKey="t" hide />
                  <YAxis hide />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* stats row */}
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-border pt-3 text-[12px] sm:grid-cols-4">
              {[
                ["Abertura", fmt(first, 2)],
                ["Máx.", fmt(Math.max(...chart.map((c) => c.h)), 2)],
                ["Mín.", fmt(Math.min(...chart.map((c) => c.l)), 2)],
                ["Volume", fmt(volSeries.reduce((a, b) => a + b.v, 0), 0)],
                ["N.º Negócios", "29"],
                ["Preço Médio", fmt(chart.reduce((a, b) => a + b.v, 0) / chart.length, 2)],
                ["Capitalização", "1,24 B AOA"],
                ["ISIN", "AO" + selected.slice(0, 6)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-mono tabular">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ORDER BOOK */}
          <div className="panel p-3">
            <div className="mb-2 flex items-center justify-between px-1">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Livro de Ordens
              </div>
              <span className="flex items-center gap-1 text-[10px] text-bull">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-bull" /> LIVE
              </span>
            </div>
            <div className="grid grid-cols-3 px-2 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Preço</span>
              <span className="text-center">Quant.</span>
              <span className="text-right">Total</span>
            </div>
            <OrderBook base={last} tick={tick} />
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <button className="rounded-md bg-bull/15 py-2 text-[12px] font-semibold text-bull ring-1 ring-bull/30 hover:bg-bull/25">
                COMPRAR
              </button>
              <button className="rounded-md bg-bear/15 py-2 text-[12px] font-semibold text-bear ring-1 ring-bear/30 hover:bg-bear/25">
                VENDER
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERS TABLE */}
      <section className="mx-auto max-w-[1400px] px-5 pb-8">
        <div className="panel overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-widest">Resumo dos Mercados</h3>
              <span className="rounded border border-border bg-panel-2 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                Sessão · {now.toLocaleDateString("pt-PT")}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              {["Todos", "Acções", "OT-NR", "OT-TXC"].map((t, i) => (
                <button
                  key={t}
                  className={`rounded-md px-2.5 py-1 ${i === 0 ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {t}
                </button>
              ))}
              <button className="ml-2 inline-flex items-center gap-1 rounded-md border border-border bg-panel-2 px-2 py-1 text-muted-foreground">
                <Download className="h-3 w-3" /> Excel
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] font-mono text-[12.5px] tabular">
              <thead className="bg-panel-2/60 text-[10.5px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  {["Valor Mobiliário", "Tipologia", "Preço", "Var. %", "Negócios", "Quantidade", "Montante"].map((h, i) => (
                    <th key={h} className={`px-4 py-2.5 ${i > 1 ? "text-right" : "text-left"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOP.map((r, i) => (
                  <motion.tr
                    key={r.s}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t border-border/60 transition-colors hover:bg-panel-2/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="grid h-7 w-7 place-items-center rounded bg-gradient-to-br from-primary/30 to-primary/5 text-[10px] font-bold text-primary">
                          {r.s.slice(0, 2)}
                        </div>
                        <span className="font-semibold">{r.s}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.type}</td>
                    <td className="px-4 py-3 text-right">{fmt(r.price, 2)}</td>
                    <td className={`px-4 py-3 text-right ${r.ch > 0 ? "text-bull" : r.ch < 0 ? "text-bear" : "text-neutral"}`}>
                      {r.ch > 0 ? "▲" : r.ch < 0 ? "▼" : "■"} {fmt(Math.abs(r.ch), 2)}%
                    </td>
                    <td className="px-4 py-3 text-right">{r.trades}</td>
                    <td className="px-4 py-3 text-right">{fmt(r.vol, 0)}</td>
                    <td className="px-4 py-3 text-right">{fmtAOA(r.amount)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
            <span>Linhas por página: 10</span>
            <span>1–8 de 39</span>
            <div className="flex gap-1">
              <button className="rounded border border-border px-2 py-0.5">←</button>
              <button className="rounded border border-border px-2 py-0.5">→</button>
            </div>
          </div>
        </div>
      </section>

      {/* HEATMAP + YIELD + DEPTH */}
      <section className="mx-auto max-w-[1400px] px-5 pb-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* HEATMAP */}
          <div className="panel p-4">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-widest">Mapa Sectorial</h3>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {SECTORS.flatMap((s, si) =>
                Array.from({ length: Math.max(2, Math.round(s.weight / 4)) }).map((_, k) => {
                  const change = s.change + (Math.random() - 0.5) * 1.2;
                  const intensity = Math.min(1, Math.abs(change) / 3);
                  const bg = change >= 0
                    ? `oklch(0.74 0.19 155 / ${0.15 + intensity * 0.7})`
                    : `oklch(0.65 0.24 27 / ${0.15 + intensity * 0.7})`;
                  return (
                    <motion.div
                      key={`${si}-${k}`}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (si * 4 + k) * 0.02 }}
                      style={{ background: bg }}
                      className="group relative flex aspect-square flex-col justify-between rounded-md p-1.5 text-[9px] font-mono ring-1 ring-white/5"
                    >
                      <span className="truncate opacity-90">{s.name.slice(0, 3).toUpperCase()}</span>
                      <span className="text-right text-[10px] font-semibold">
                        {change >= 0 ? "+" : ""}
                        {change.toFixed(1)}
                      </span>
                    </motion.div>
                  );
                }),
              )}
            </div>
            <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>-3%</span>
              <div className="mx-3 h-1.5 flex-1 rounded-full bg-gradient-to-r from-bear via-neutral to-bull" />
              <span>+3%</span>
            </div>
          </div>

          {/* YIELD CURVE */}
          <div className="panel p-4">
            <div className="mb-3 flex items-center gap-2">
              <LineIcon className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-widest">Curva de Rendimentos OT</h3>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer>
                <LineChart data={yieldCurve} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="var(--grid-line)" strokeDasharray="2 4" />
                  <XAxis dataKey="m" stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--panel)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="r" stroke="var(--gold)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--gold)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2 text-[11px] font-mono tabular">
              {yieldCurve.filter((_, i) => [0, 2, 4, 7].includes(i)).map((y) => (
                <div key={y.m} className="rounded-md border border-border bg-panel-2 p-2">
                  <div className="text-muted-foreground">{y.m}</div>
                  <div className="font-semibold text-primary">{y.r}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* DEPTH */}
          <div className="panel p-4">
            <div className="mb-3 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-widest">Profundidade de Mercado</h3>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer>
                <AreaChart data={buildDepth()} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="bidG" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--bull)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--bull)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="askG" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--bear)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--bear)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--grid-line)" strokeDasharray="2 4" />
                  <XAxis dataKey="p" stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="stepAfter" dataKey="bid" stroke="var(--bull)" strokeWidth={1.5} fill="url(#bidG)" />
                  <Area type="stepBefore" dataKey="ask" stroke="var(--bear)" strokeWidth={1.5} fill="url(#askG)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] font-mono tabular">
              <div className="rounded-md border border-bull/30 bg-bull/10 p-2">
                <div className="text-muted-foreground">Bid Vol.</div>
                <div className="font-semibold text-bull">18 420</div>
              </div>
              <div className="rounded-md border border-border bg-panel-2 p-2 text-center">
                <div className="text-muted-foreground">Spread</div>
                <div className="font-semibold">0,42%</div>
              </div>
              <div className="rounded-md border border-bear/30 bg-bear/10 p-2 text-right">
                <div className="text-muted-foreground">Ask Vol.</div>
                <div className="font-semibold text-bear">21 105</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="mx-auto max-w-[1400px] px-5 pb-10">
        <div className="panel grid grid-cols-2 gap-6 p-6 sm:grid-cols-4">
          {[
            { k: "Volume da sessão", v: "68,4 M", u: "AOA" },
            { k: "Negócios executados", v: "1 247", u: "ordens" },
            { k: "Emissões activas", v: "312", u: "títulos" },
            { k: "Membros negociadores", v: "17", u: "corretoras" },
          ].map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.k}</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-bold tabular">{s.v}</span>
                <span className="text-[11px] text-muted-foreground">{s.u}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-panel/40">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-primary to-gold text-primary-foreground">
                <Landmark className="h-4 w-4" />
              </div>
              <div className="text-sm font-bold">BODIVA</div>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
              Bolsa de Dívida e Valores de Angola. Rua Marechal Brós Tito, Nº 41,
              Sky Business Tower, 8º Andar, Luanda.
            </p>
          </div>
          {[
            { t: "Mercado", l: ["Resumo", "Livro de Ordens", "Cotações", "Taxas", "Preço Médio"] },
            { t: "Institucional", l: ["Sobre Nós", "Governação", "Regulamentos", "Contactos"] },
            { t: "Sites Relacionados", l: ["CMC", "MINFIN", "ASEA", "ANNA", "CoSSE"] },
          ].map((c) => (
            <div key={c.t}>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {c.t}
              </div>
              <ul className="space-y-1.5 text-[13px]">
                {c.l.map((i) => (
                  <li key={i}>
                    <a href="#" className="text-foreground/80 hover:text-primary">{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-5 py-4 text-[11px] text-muted-foreground">
            <span>© {new Date().getFullYear()} BODIVA — Todos os direitos reservados</span>
            <span className="inline-flex items-center gap-1.5"><Globe2 className="h-3 w-3" /> pt · en</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function OrderBook({ base, tick }: { base: number; tick: number }) {
  const rows = useMemo(() => {
    const asks: { price: number; qty: number }[] = [];
    const bids: { price: number; qty: number }[] = [];
    const step = Math.max(base * 0.0008, 0.05);
    for (let i = 5; i >= 1; i--) {
      asks.push({ price: +(base + step * i).toFixed(2), qty: Math.round(30 + Math.random() * 240) });
    }
    for (let i = 1; i <= 5; i++) {
      bids.push({ price: +(base - step * i).toFixed(2), qty: Math.round(30 + Math.random() * 240) });
    }
    return { asks, bids };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const maxAsk = Math.max(...rows.asks.map((r) => r.qty));
  const maxBid = Math.max(...rows.bids.map((r) => r.qty));

  return (
    <div className="space-y-0.5 font-mono text-[12px] tabular">
      {rows.asks.map((r, i) => (
        <div key={`a${i}`} className="relative grid grid-cols-3 rounded px-2 py-1">
          <div className="absolute inset-y-0.5 right-0 rounded bg-bear/15" style={{ width: `${(r.qty / maxAsk) * 100}%` }} />
          <span className="relative text-bear">{fmt(r.price, 2)}</span>
          <span className="relative text-center text-muted-foreground">{r.qty}</span>
          <span className="relative text-right text-muted-foreground">{fmt(r.price * r.qty, 0)}</span>
        </div>
      ))}
      <div className="my-1 flex items-center justify-between rounded-md bg-primary/10 px-2 py-1.5 ring-1 ring-primary/30">
        <span className="text-[10px] uppercase tracking-widest text-primary">Spread</span>
        <span className="text-primary">{fmt(base, 2)}</span>
      </div>
      {rows.bids.map((r, i) => (
        <div key={`b${i}`} className="relative grid grid-cols-3 rounded px-2 py-1">
          <div className="absolute inset-y-0.5 right-0 rounded bg-bull/15" style={{ width: `${(r.qty / maxBid) * 100}%` }} />
          <span className="relative text-bull">{fmt(r.price, 2)}</span>
          <span className="relative text-center text-muted-foreground">{r.qty}</span>
          <span className="relative text-right text-muted-foreground">{fmt(r.price * r.qty, 0)}</span>
        </div>
      ))}
    </div>
  );
}

function buildDepth() {
  const data: { p: number; bid?: number; ask?: number }[] = [];
  let bidCum = 0;
  let askCum = 0;
  for (let i = -10; i <= 0; i++) {
    bidCum += Math.round(400 + Math.random() * 1400 * (1 + i / 10));
    data.push({ p: 19500 + i * 60, bid: bidCum });
  }
  for (let i = 1; i <= 10; i++) {
    askCum += Math.round(400 + Math.random() * 1400 * (1 - i / 10));
    data.push({ p: 19500 + i * 60, ask: askCum });
  }
  return data;
}
