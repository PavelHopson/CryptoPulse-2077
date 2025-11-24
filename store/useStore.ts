import { create } from 'zustand';
import { Position, OrderSide, Candle } from '../types';

interface AppState {
  // Market Data
  currentSymbol: string;
  currentPrice: number;
  marketData: Candle[];
  
  // User Data
  balance: number;
  positions: Position[];
  
  // AI State
  isAIPanelOpen: boolean;
  
  // Actions
  setSymbol: (symbol: string) => void;
  updatePrice: (price: number) => void;
  addCandle: (candle: Candle) => void;
  openPosition: (position: Omit<Position, 'id' | 'pnl' | 'timestamp'>) => void;
  closePosition: (id: string, exitPrice: number) => void;
  toggleAIPanel: () => void;
}

export const useStore = create<AppState>((set) => ({
  currentSymbol: 'BTC/USDT',
  currentPrice: 65000,
  marketData: [],
  balance: 10000, // Start with 10k simulated USDT
  positions: [],
  isAIPanelOpen: false,

  setSymbol: (symbol) => set({ currentSymbol: symbol, marketData: [] }),
  
  updatePrice: (price) => set((state) => {
    // Simulate PnL updates for open positions
    const updatedPositions = state.positions.map(pos => {
      const diff = price - pos.entryPrice;
      const multiplier = pos.side === OrderSide.BUY ? 1 : -1;
      const pnl = (diff / pos.entryPrice) * pos.size * pos.leverage * multiplier; // Simplified PnL
      return { ...pos, pnl };
    });
    return { currentPrice: price, positions: updatedPositions };
  }),

  addCandle: (candle) => set((state) => {
    const newData = [...state.marketData, candle];
    if (newData.length > 1000) newData.shift();
    return { marketData: newData };
  }),

  openPosition: (posData) => set((state) => {
    const newPosition: Position = {
      ...posData,
      id: Math.random().toString(36).substr(2, 9),
      pnl: 0,
      timestamp: Date.now(),
    };
    return { positions: [newPosition, ...state.positions] };
  }),

  closePosition: (id, exitPrice) => set((state) => {
    const position = state.positions.find(p => p.id === id);
    if (!position) return {};
    
    // Realize PnL
    // Note: Simplified calc. In real app would include fees.
    return {
      positions: state.positions.filter(p => p.id !== id),
      balance: state.balance + position.pnl
    };
  }),

  toggleAIPanel: () => set((state) => ({ isAIPanelOpen: !state.isAIPanelOpen })),
}));