import { LineChart, AlertCircle } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useGetAllMarketSummary } from "#/hooks/budiva/useGetAllMarketSummary";
import { Skeleton } from "../ui/skeleton";
import OrderBookDetails from "../ui/OrderBookDetails";
import { Link } from "@tanstack/react-router";

const tabs = [
    "Resumo dos Mercados",
    "Livro de Ordens",
    "Evolução das Cotações",
    "Taxas",
    "Preço Médio",
];

function SkeletonTableBody({ rows = 10 }: { rows?: number }) {
    return Array.from({ length: rows }, (_, i) => (
        <TableRow key={i}>
            {/* Match the 11 columns defined in TableHeader */}
            {Array.from({ length: 9 }, (_, j) => (
                <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                </TableCell>
            ))}
        </TableRow>
    ));
}

function ErrorMessage({ error }: { error: string | null }) {
    return (
        <div className="flex items-center justify-center p-6">
            <AlertCircle className="size-8 text-destructive" />
            <span>{error || "Error to fetch market summary"}</span>
        </div>
    );
}

export function TradersTable() {
    const {
        data: marketSummary,
        error: marketSummaryError,
        isLoading: marketSummaryIsLoading
    } = useGetAllMarketSummary();

    return (
        <div className="rounded-xl border border-border bg-surface">
            <div className="flex gap-4 overflow-x-auto border-b border-border px-4 py-3 text-sm">
                {tabs.map((t, i) => (
                    <button
                        key={t}
                        className={`whitespace-nowrap ${i === 0
                            ? "font-semibold text-bull"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Simbolo</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Preço d' Fech.</TableHead>
                            <TableHead className="text-right">Variação</TableHead>
                            <TableHead className="text-right">Transações</TableHead>
                            <TableHead className="text-right">Volume</TableHead>
                            <TableHead className="text-right">Valor Negociado</TableHead>
                            <TableHead className="text-center">Livro</TableHead>
                        </TableRow>
                    </TableHeader>

                    {marketSummaryIsLoading ? (
                        <TableBody>
                            <SkeletonTableBody />
                        </TableBody>
                    ) : marketSummaryError ? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={11}>
                                    <ErrorMessage error={marketSummaryError.message} />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {marketSummary?.map((market, index) => {
                                return (
                                    <TableRow key={market.SYMBOL}>
                                        <TableCell className="font-medium whitespace-nowrap">
                                            {index + 1}
                                        </TableCell>
                                        <a href={`https://www.bodiva.ao/reports/ficha-tecnica?i=${market.ISIN_AUX}&t=${market.TYPOLOGY_AUX}`} target="_blank" rel="noopener noreferrer">
                                            <TableCell className="font-medium whitespace-nowrap">
                                                {market.SYMBOL}
                                            </TableCell>
                                        </a>
                                        <TableCell className="font-mono whitespace-nowrap">
                                            {market.TYPOLOGY}
                                        </TableCell>
                                        <TableCell className="font-mono whitespace-nowrap font-bold">
                                            {Number(market.CLOSE_PRICE).toLocaleString("pt-BR", { style: "currency", currency: "AOA" })}
                                        </TableCell>
                                        {Number(market.CHANGE_PRICE) === 0 ? (
                                            <TableCell className="font-mono whitespace-nowrap text-right text-yellow-400">
                                                {Number(market.CHANGE_PRICE)?.toFixed(2)}%
                                            </TableCell>
                                        ) : Number(market.CHANGE_PRICE) > 0 ? (
                                            <TableCell className="font-mono whitespace-nowrap text-right text-bull">
                                                {Number(market.CHANGE_PRICE)?.toFixed(2)}%
                                            </TableCell>
                                        ) : (
                                            <TableCell className="font-mono whitespace-nowrap text-right text-bear">
                                                {Number(market.CHANGE_PRICE)?.toFixed(2)}%
                                            </TableCell>
                                        )}
                                        <TableCell className="font-mono whitespace-nowrap text-right">
                                            {Number(market.TRADES_COUNT).toFixed(0)}
                                        </TableCell>
                                        <TableCell className="font-mono whitespace-nowrap text-right">
                                            {Number(market.TURNOVER).toLocaleString("pt-BR")}
                                        </TableCell>
                                        <TableCell className="font-mono whitespace-nowrap font-semibold text-bull text-right">
                                            {Number(market.TURNOVER_VALUE).toLocaleString("pt-BR", { style: "currency", currency: "AOA" })}
                                        </TableCell>
                                        <TableCell className="font-mono whitespace-nowrap font-semibold text-bull text-right">
                                            <OrderBookDetails security={market.SYMBOL} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    )}
                </Table>
            </div>
        </div>
    );
}