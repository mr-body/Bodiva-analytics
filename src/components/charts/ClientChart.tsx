import { Suspense, lazy, useEffect, useState, type ComponentProps } from "react";

const ReactApexChart = lazy(() => import("react-apexcharts"));
const ReactECharts = lazy(() => import("echarts-for-react"));

function useMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}

function Skeleton({ height }: { height: number | string }) {
    return (
        <div
            className="w-full animate-pulse rounded-lg bg-panel"
            style={{ height: typeof height === "number" ? `${height}px` : height }}
        />
    );
}

export function ApexChart(props: ComponentProps<typeof ReactApexChart>) {
    const mounted = useMounted();
    const height = (props.height as number | string) ?? 300;
    if (!mounted) return <Skeleton height={height} />;
    return (
        <Suspense fallback={<Skeleton height={height} />}>
            <ReactApexChart {...props} />
        </Suspense>
    );
}

export function EChart(props: ComponentProps<typeof ReactECharts>) {
    const mounted = useMounted();
    const height = (props.style?.height as number | string) ?? 300;
    if (!mounted) return <Skeleton height={height} />;
    return (
        <Suspense fallback={<Skeleton height={height} />}>
            <ReactECharts {...props} />
        </Suspense>
    );
}
