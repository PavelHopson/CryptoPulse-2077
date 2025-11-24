
import { create } from 'zustand';

interface MarketState {
  prices: Record<string, number>;
  updatePrice: (symbol: string, price: number) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  prices: {
    'BTC/USDT': 65000,
    'ETH/USDT': 3500,
    'SOL/USDT': 145
  },
  updatePrice: (symbol, price) => set((state) => ({
    prices: { ...state.prices, [symbol]: price }
  }))
}));
