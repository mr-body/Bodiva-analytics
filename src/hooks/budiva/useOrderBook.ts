import { GetOrderBook } from "#/service/budiva/orderBook";
import { useQuery } from "@tanstack/react-query";

export function useOrderBook(security: string) {
    return useQuery({
        queryKey: ["order-book", security],
        queryFn: async () => {
            return GetOrderBook({ data: security });
        },
        enabled: !!security,
    });
}