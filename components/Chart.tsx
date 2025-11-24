
import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, ColorType } from 'lightweight-charts';
import { useMarketStore } from '@/store/useMarketStore';
import { CHART_OPTIONS } from '@/constants';

export const Chart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const price = useMarketStore((s) => s.prices['BTC/USDT']);
  const lastCandleTimeRef = useRef<number>(Math.floor(Date.now() / 1000));

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      ...CHART_OPTIONS,
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const series = chart.addCandlestickSeries({
      upColor: '#00ffea',
      downColor: '#ff00ff',
      borderVisible: false,
      wickUpColor: '#00ffea',
      wickDownColor: '#ff00ff',
    });

    // Seed Data
    let time = Math.floor(Date.now() / 1000) - 3600;
    let val = 65000;
    const data = [];
    for(let i=0; i<60; i++) {
        const open = val;
        const close = val + (Math.random() - 0.5) * 100;
        data.push({ time, open, high: Math.max(open, close)+10, low: Math.min(open, close)-10, close });
        val = close;
        time += 60;
    }
    series.setData(data);
    seriesRef.current = series;
    chartRef.current = chart;
    lastCandleTimeRef.current = time;

    const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Real-time tick update
  useEffect(() => {
    if (!seriesRef.current || !price) return;

    const time = Math.floor(Date.now() / 60) * 60; // Minute candles
    // Very simple tick simulation for visual feed
    seriesRef.current.update({
        time: time as any,
        open: price,
        high: price + 10,
        low: price - 10,
        close: price
    });
  }, [price]);

  return (
    <div className="w-full h-full relative group">
        <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur p-2 border border-white/10 rounded">
            <h2 className="text-2xl font-orbitron text-cyber-cyan font-bold tracking-wider">BTC/USDT</h2>
            <div className="text-3xl font-mono text-white mt-1">${price?.toFixed(2)}</div>
        </div>
        <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
};
