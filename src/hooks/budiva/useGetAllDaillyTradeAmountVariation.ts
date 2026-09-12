import { GetAllDaillyTradeAmountVariation } from "#/service/budiva/GetAllDaillyTradeAmountVariation";
import { useQuery } from "@tanstack/react-query";

export function useGetAllDaillyTradeAmountVariation(security: string) {
    return useQuery({
        queryKey: ["order-book", security],
        queryFn: async () => {
            return GetAllDaillyTradeAmountVariation({ data: security });
        },
        enabled: !!security,
    });
}