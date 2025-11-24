
import { create } from 'zustand';
import { Position } from '@/types';
import api from '@/lib/api';

interface TradeState {
  positions: Position[];
  balance: number;
  fetchPositions: () => Promise<void>;
  openPosition: (dto: any) => Promise<void>;
  closePosition: (positionId: string) => Promise<void>;
}

export const useTradeStore = create<TradeState>((set) => ({
  positions: [],
  balance: 10000, // Initial mock, should fetch from user profile

  fetchPositions: async () => {
    try {
      const res = await api.get('/trades');
      set({ positions: res.data });
    } catch (e) {
      console.error(e);
    }
  },

  openPosition: async (dto) => {
    await api.post('/trades/open', dto);
    useTradeStore.getState().fetchPositions();
  },

  closePosition: async (positionId) => {
    await api.post('/trades/close', { positionId });
    useTradeStore.getState().fetchPositions();
  }
}));
