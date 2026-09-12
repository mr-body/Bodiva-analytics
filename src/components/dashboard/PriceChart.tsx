"use client"

import * as React from "react"
import { useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import { ApexChart } from "@/components/charts/ClientChart";
import type { ShareTransaction } from "#/service/budiva/GetAllDaillyTradeAmountVariation";
import { useGetAllDaillyTradeAmountVariation } from "#/hooks/budiva/useGetAllDaillyTradeAmountVariation";
import { useGetAllMarketSummary } from "#/hooks/budiva/useGetAllMarketSummary";

import { addDays } from "date-fns"
import { type DateRange } from "react-day-picker"
import { DatePickerWithRange } from "../ui/range-picker";

const BULL = "#16a34a";
const BEAR = "#dc2626";

const ranges = ["1m", "5m", "15m", "1h", "4h", "1D"];

// Converte e filtra os dados da BODIVA com base no intervalo de datas selecionado
function processBodivaData(transactions: ShareTransaction[], dateRange: DateRange | undefined) {
    const startMs = dateRange?.from ? new Date(dateRange.from).setHours(0, 0, 0, 0) : 0;
    const endMs = dateRange?.to ? new Date(dateRange.to).setHours(23, 59, 59, 999) : (dateRange?.from ? new Date(dateRange.from).setHours(23, 59, 59, 999) : Number.MAX_SAFE_INTEGER);

    const filteredAndSorted = [...transactions]
        .filter((tx) => {
            const txTime = new Date(tx.Data).getTime();
            return txTime >= startMs && txTime <= endMs;
        })
        .sort((a, b) => new Date(a.Data).getTime() - new Date(b.Data).getTime());

    const candles: { x: number; y: [number, number, number, number] }[] = [];
    const volumes: { x: number; y: number }[] = [];

    filteredAndSorted.forEach((tx) => {
        const time = new Date(tx.Data).getTime();
        const price = tx.Preco;

        const open = price;
        const close = price;
        const high = Number((price * 1.002).toFixed(2));
        const low = Number((price * 0.998).toFixed(2));

        candles.push({ x: time, y: [open, high, low, close] });
        volumes.push({ x: time, y: tx.Quantidade || tx.Montante });
    });

    return { candles, volumes };
}

export function PriceChart() {
    const [range, setRange] = useState("5m");
    const [securityCode, setSecurityCode] = useState<string>("");

    // Estado do Range de Datas predefinido para as últimas 2 semanas até hoje
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: addDays(new Date(), -14),
        to: new Date(),
    });

    // Busca o sumário do mercado para preencher dinamicamente o select de ativos
    const { data: marketSummary = [], isLoading: isLoadingMarket } = useGetAllMarketSummary();

    // Define o primeiro ativo por omissão assim que a lista de mercado carregar (se nenhum estiver selecionado)
    React.useEffect(() => {
        if (!securityCode && marketSummary.length > 0) {
            setSecurityCode(marketSummary[0].SYMBOL);
        }
    }, [marketSummary, securityCode]);

    // Busca os dados de transação via TanStack Query para o ativo selecionado
    const { data: transactions = [], isLoading: isLoadingTransactions, error } = useGetAllDaillyTradeAmountVariation(securityCode);

    // Processa e filtra os dados da API usando o intervalo de datas selecionado
    const { candles, volumes } = useMemo(() => {
        return processBodivaData(transactions, dateRange);
    }, [transactions, dateRange]);

    // Calcula a variação percentual com base nos dados filtrados
    const priceChange = useMemo(() => {
        if (candles.length < 2) return "+0.00%";
        const first = candles[0].y[0];
        const last = candles[candles.length - 1].y[3];
        const diff = ((last - first) / first) * 100;
        return `${diff >= 0 ? "+" : ""}${diff.toFixed(2)}%`;
    }, [candles]);

    const candleOptions: ApexOptions = {
        chart: {
            id: "apexstock-bodiva",
            type: "candlestick",
            toolbar: { show: false },
            background: "transparent",
            animations: { enabled: false },
            fontFamily: "inherit",
        },
        theme: { mode: "light" },
        grid: { borderColor: "rgba(120,120,140,0.18)", strokeDashArray: 3 },
        plotOptions: {
            candlestick: { colors: { upward: BULL, downward: BEAR } },
        },
        xaxis: { type: "datetime", labels: { style: { fontSize: "10px" } } },
        yaxis: {
            opposite: true,
            tooltip: { enabled: true },
            labels: {
                formatter: (v: number) => `${v.toLocaleString("pt-AO", { minimumFractionDigits: 2 })} Kz`,
                style: { fontSize: "10px" }
            },
        },
        tooltip: { theme: "light" },
    };

    const volumeOptions: ApexOptions = {
        chart: {
            id: "apexstock-bodiva-volume",
            type: "bar",
            brush: { enabled: true, target: "apexstock-bodiva" },
            selection: {
                enabled: true,
                xaxis: {
                    min: candles.length > 0 ? candles[Math.floor(candles.length * 0.4)]?.x : undefined,
                    max: candles.length > 0 ? candles[candles.length - 1]?.x : undefined,
                },
                fill: { color: "#888", opacity: 0.12 },
            },
            toolbar: { show: false },
            background: "transparent",
            fontFamily: "inherit",
        },
        dataLabels: { enabled: false },
        plotOptions: { bar: { columnWidth: "60%" } },
        colors: ["#6b7280"],
        grid: { show: false },
        xaxis: { type: "datetime", labels: { style: { fontSize: "10px" } } },
        yaxis: { show: false },
        legend: { show: false },
    };

    return (
        <div className="rounded-xl border border-border bg-surface p-4">
            {/* Barra de controlos: Select dinâmico de Ativos via MarketSummary, DatePickerWithRange e Intervalos */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Select dinâmico alimentado pelo GetAllMarketSummary */}
                    <select
                        value={securityCode}
                        onChange={(e) => setSecurityCode(e.target.value)}
                        disabled={isLoadingMarket}
                        className="rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                    >
                        {isLoadingMarket ? (
                            <option value="">A carregar ativos...</option>
                        ) : (
                            marketSummary.map((item) => (
                                <option key={item.SYMBOL} value={item.SYMBOL}>
                                    {item.SYMBOL} {item.TYPOLOGY ? `- ${item.TYPOLOGY}` : ""}
                                </option>
                            ))
                        )}
                    </select>

                    {/* Componente DatePickerWithRange atualizado com props */}
                    <DatePickerWithRange
                        from={dateRange?.from}
                        to={dateRange?.to}
                        onChange={setDateRange}
                    />
                </div>

                <div className="flex items-center gap-1">
                    {ranges.map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`rounded-md px-2 py-1 font-mono text-xs ${r === range
                                ? "bg-foreground text-background"
                                : "text-muted-foreground hover:bg-accent"
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">
                    {securityCode || "Selecione um ativo"} · BODIVA
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                    Variação: <span className={priceChange.startsWith("+") ? "text-bull" : "text-bear"}>{priceChange}</span>
                </span>
            </div>

            {isLoadingTransactions || !securityCode ? (
                <div className="flex h-[390px] w-full items-center justify-center font-mono text-xs text-muted-foreground">
                    A carregar dados da BODIVA para {securityCode || "o ativo"}...
                </div>
            ) : error ? (
                <div className="flex h-[390px] w-full items-center justify-center font-mono text-xs text-red-500">
                    Erro ao carregar o gráfico.
                </div>
            ) : candles.length === 0 ? (
                <div className="flex h-[390px] w-full items-center justify-center font-mono text-xs text-muted-foreground">
                    Sem registos de transações para o período selecionado.
                </div>
            ) : (
                <>
                    <ApexChart
                        type="candlestick"
                        height={280}
                        options={candleOptions}
                        series={[{ name: securityCode, data: candles }]}
                    />
                    <ApexChart
                        type="bar"
                        height={110}
                        options={volumeOptions}
                        series={[{ name: "Volume", data: volumes }]}
                    />
                </>
            )}
        </div>
    );
}