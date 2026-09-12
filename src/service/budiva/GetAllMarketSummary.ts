import { createServerFn } from "@tanstack/react-start";

export interface AllMarketSummary {
    SYMBOL: string
    CLOSE_PRICE: string
    CHANGE_PRICE: string
    TRADES_COUNT: string
    TURNOVER: string
    TURNOVER_VALUE: string
    TRANS_DATE: string
    ISIN_AUX: string
    TYPOLOGY: string
    TYPOLOGY_AUX: string
    CHANGE_PRICE_MANU: string
}


export const GetAllMarketSummary = createServerFn({ method: "GET" }).handler(async (): Promise<AllMarketSummary[]> => {
    const response = await fetch("https://www.bodiva.ao/website/api/GetAllMarketSummary_no.php", {
        method: "GET",
        headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
            'Cookie': 'userId=114586',
            'Host': 'www.bodiva.ao',
            'Priority': 'u=0, i',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Sec-GPC': '1',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:155.0) Gecko/20100101 Firefox/155.0',
        }
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("Failed to fetch market summary", text);
        throw new Error("Failed to fetch market summary");
    }

    const data = await response.json();

    console.log("Data", data);

    return data;
});