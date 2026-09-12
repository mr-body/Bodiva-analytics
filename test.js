
export const GetAllMarketSummary = (async () => {
    const response = await fetch("https://www.bodiva.ao/website/api/GetAllMarketSummary_no.php", {
        method: "GET",
        headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Host': 'www.bodiva.ao',
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

GetAllMarketSummary();