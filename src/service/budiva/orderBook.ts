import { createServerFn } from "@tanstack/react-start";

export interface ListarLivroOrdenResponse {
    sQuantity: number
    sPrice: number
    bQuantity?: number
    bPrice?: number
}

// O TanStack Start recebe os parâmetros de entrada dentro de um objeto estruturado
export const GetOrderBook = createServerFn({ method: "GET" })
    .validator((security: string) => security)
    .handler(async ({ data: security }): Promise<ListarLivroOrdenResponse[]> => {
        const response = await fetch(`https://www.bodiva.ao/website/api/ListarLivroOrdensCPZvm_no.php?security=${security}`, {
            method: "GET",
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Cookie': 'userId=114586',
                'Host': 'www.bodiva.ao',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:155.0) Gecko/20100101 Firefox/155.0',
            }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Failed to fetch order book", text);
            throw new Error("Failed to fetch order book");
        }

        const data: ListarLivroOrdenResponse[] = await response.json();

        return data;
    });