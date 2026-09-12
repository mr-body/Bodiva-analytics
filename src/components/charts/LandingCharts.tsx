import type { ApexOptions } from "apexcharts";
import { ApexChart, EChart } from "@/components/charts/ClientChart";

const AMBER = "#f97316";
const AMBER_SOFT = "#fbbf24";

export function RevenueECharts() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
    const option = {
        backgroundColor: "transparent",
        grid: { left: 8, right: 8, top: 24, bottom: 8, containLabel: true },
        tooltip: { trigger: "axis" },
        legend: {
            data: ["Inflow", "Outflow"],
            textStyle: { color: "rgba(255,255,255,0.6)" },
            right: 0,
            top: 0,
            icon: "roundRect",
        },
        xAxis: {
            type: "category",
            data: months,
            axisLine: { lineStyle: { color: "rgba(255,255,255,0.15)" } },
            axisLabel: { color: "rgba(255,255,255,0.5)" },
        },
        yAxis: {
            type: "value",
            splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
            axisLabel: { color: "rgba(255,255,255,0.5)" },
        },
        series: [
            {
                name: "Inflow",
                type: "line",
                smooth: true,
                symbol: "none",
                lineStyle: { width: 3, color: AMBER },
                areaStyle: { color: "rgba(249,115,22,0.22)" },
                data: [32, 41, 38, 55, 49, 68, 72, 65, 84],
            },
            {
                name: "Outflow",
                type: "bar",
                barWidth: 10,
                itemStyle: { color: "rgba(255,255,255,0.22)", borderRadius: [4, 4, 0, 0] },
                data: [18, 24, 21, 30, 26, 34, 39, 33, 42],
            },
        ],
    };

    return <EChart option={option} style={{ height: 280, width: "100%" }} />;
}

export function PortfolioECharts() {
    const option = {
        backgroundColor: "transparent",
        tooltip: { trigger: "item" },
        series: [
            {
                type: "pie",
                radius: ["62%", "88%"],
                avoidLabelOverlap: false,
                itemStyle: { borderWidth: 3, borderColor: "rgba(0,0,0,0.35)" },
                label: { show: false },
                data: [
                    { value: 44, name: "Equities", itemStyle: { color: AMBER } },
                    { value: 26, name: "Crypto", itemStyle: { color: AMBER_SOFT } },
                    { value: 18, name: "Bonds", itemStyle: { color: "#78716c" } },
                    { value: 12, name: "Cash", itemStyle: { color: "#44403c" } },
                ],
            },
        ],
    };
    return <EChart option={option} style={{ height: 220, width: "100%" }} />;
}

export function MiniStockApex() {
    let price = 120;
    const data = Array.from({ length: 40 }, (_, i) => {
        const open = price;
        const close = Number((open + Math.sin(i / 4) * 2.2 + Math.cos(i * 1.3) * 1.4 + 0.3).toFixed(2));
        const high = Number((Math.max(open, close) + 1.4).toFixed(2));
        const low = Number((Math.min(open, close) - 1.4).toFixed(2));
        price = close;
        return { x: Date.UTC(2026, 5, 1 + i), y: [open, high, low, close] as [number, number, number, number] };
    });

    const options: ApexOptions = {
        chart: {
            type: "candlestick",
            toolbar: { show: false },
            background: "transparent",
            fontFamily: "inherit",
        },
        theme: { mode: "dark" },
        grid: { borderColor: "rgba(255,255,255,0.08)" },
        plotOptions: { candlestick: { colors: { upward: AMBER, downward: "#57534e" } } },
        xaxis: { type: "datetime", labels: { style: { colors: "rgba(255,255,255,0.5)", fontSize: "10px" } } },
        yaxis: {
            opposite: true,
            labels: { style: { colors: "rgba(255,255,255,0.5)", fontSize: "10px" } },
        },
        tooltip: { theme: "dark" },
    };

    return <ApexChart type="candlestick" height={260} options={options} series={[{ name: "AAPL", data }]} />;
}
