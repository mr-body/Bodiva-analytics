import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useOrderBook } from "#/hooks/budiva/useOrderBook";
import { BookOpen, Layers } from "lucide-react";

export default function OrderBookDetails({ security }: { security: string }) {
    const { data, isLoading, isError } = useOrderBook(security);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs font-mono bg-background/50 hover:bg-accent">
                    Book
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-xl bg-surface border-border shadow-2xl">
                <AlertDialogHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                        <AlertDialogTitle className="font-mono text-base flex items-center gap-2">
                            <Layers className="size-4 text-bull" />
                            Livro de Ordens de Mercado — <span className="text-bull font-bold">{security}</span>
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription asChild>
                        <div className="space-y-3  w-full">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-2 text-muted-foreground font-mono">
                                    <div className="size-6 border-2 border-bull border-t-transparent rounded-full animate-spin" />
                                    <p className="text-xs">A carregar livro de profundidade...</p>
                                </div>
                            ) : isError ? (
                                <p className="text-center py-8 text-destructive text-xs font-mono">Erro ao sincronizar dados do livro de ordens.</p>
                            ) : data && data.length > 0 ? (
                                <div className="rounded-lg border border-border bg-panel/40 overflow-hidden font-mono text-xs">
                                    {/* Cabeçalho da Tabela */}
                                    <div className="grid grid-cols-2 bg-muted/40 px-3 py-2 font-semibold text-muted-foreground border-b border-border">
                                        <div className="flex justify-between pr-2">
                                            <span>Preço (Ask)</span>
                                            <span>Qtd</span>
                                        </div>
                                        <div className="flex justify-between pl-2 border-l border-border/60">
                                            <span>Preço (Bid)</span>
                                            <span>Qtd</span>
                                        </div>
                                    </div>

                                    {/* Lista de Ordens */}
                                    <div className="max-h-72 overflow-y-auto divide-y divide-border/20">
                                        {data.map((item, index) => (
                                            <div key={index} className="grid grid-cols-2 px-3 py-1.5 hover:bg-muted/20 transition-colors">
                                                {/* Lado das Vendas (Asks) */}
                                                <div className="flex justify-between pr-2 items-center">
                                                    <span className="text-bear font-medium">
                                                        {item.sPrice ? item.sPrice.toLocaleString("pt-BR", { style: "currency", currency: "AOA" }) : "—"}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {item.sQuantity ? item.sQuantity.toLocaleString("pt-BR") : ""}
                                                    </span>
                                                </div>

                                                {/* Lado das Compras (Bids) */}
                                                <div className="flex justify-between pl-2 border-l border-border/60 items-center">
                                                    <span className="text-bull font-medium">
                                                        {item.bPrice ? item.bPrice.toLocaleString("pt-BR", { style: "currency", currency: "AOA" }) : "—"}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {item.bQuantity ? item.bQuantity.toLocaleString("pt-BR") : ""}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center py-10 text-muted-foreground text-xs font-mono">Sem ordens ativas no momento para este ativo.</p>
                            )}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="pt-3 border-t border-border">
                    <AlertDialogCancel className="w-full sm:w-auto text-xs font-medium">Fechar</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}