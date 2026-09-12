import { GetBanners } from "#/service/budiva/banner";
import { useQuery } from "@tanstack/react-query";

export function useBanners() {
    return useQuery({
        queryKey: ["banners"],
        queryFn: async () => {
            return GetBanners();
        },
        staleTime: 0, // sem stale time 
        gcTime: 0, // sem gc time
        refetchOnWindowFocus: false, // sem refetch on window focus
        refetchInterval: false, // sem refetch interval
    });
}