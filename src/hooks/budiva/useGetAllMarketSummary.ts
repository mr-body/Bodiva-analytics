import { GetAllMarketSummary } from "#/service/budiva/GetAllMarketSummary";
import { useQuery } from "@tanstack/react-query";

export function useGetAllMarketSummary() {
    return useQuery({
        queryKey: ["all-market-summary"],
        queryFn: async () => {
            return GetAllMarketSummary();
        },
        staleTime: 1000 * 60 * 5, // Os dados ficam frescos por 5 minutos (sem refetch automático neste período)
        gcTime: 1000 * 60 * 10,   // O cache é mantido na memória por 10 minutos após o componente ser desmontado
        refetchOnWindowFocus: false, // Opcional: evita refetch automático quando o usuário muda de aba/janela
    });
}