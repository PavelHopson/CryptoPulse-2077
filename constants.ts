import { ColorType, CrosshairMode, LineStyle } from 'lightweight-charts';

export const SYMBOLS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'DOGE/USDT'];

export const CHART_OPTIONS = {
  layout: {
    background: { type: ColorType.Solid, color: '#05000a' },
    textColor: '#666',
  },
  grid: {
    vertLines: { color: '#1a1a1a' },
    horzLines: { color: '#1a1a1a' },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
  },
  rightPriceScale: {
    borderColor: '#333',
  },
  timeScale: {
    borderColor: '#333',
    timeVisible: true,
  },
};

export const MOCK_INITIAL_PRICE = 65000;
export const MAX_LEVERAGE = 125;