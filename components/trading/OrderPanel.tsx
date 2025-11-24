
import React, { useState } from 'react';
import { useMarketStore } from '@/store/useMarketStore';
import { useTradeStore } from '@/store/useTradeStore';
import { OrderSide } from '@/types';

export const OrderPanel = () => {
  const currentPrice = useMarketStore((s) => s.prices['BTC/USDT']);
  const { openPosition, balance } = useTradeStore();
  const [leverage, setLeverage] = useState(10);
  const [amount, setAmount] = useState(1000);
  const [loading, setLoading] = useState(false);

  const handleOrder = async (side: OrderSide) => {
    setLoading(true);
    try {
        await openPosition({
            symbol: 'BTC/USDT',
            side,
            amount,
            leverage
        });
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="h-full p-4 flex flex-col gap-4 bg-cyber-panel text-white font-rajdhani">
      <div className="flex justify-between items-center border-b border-white/10 pb-2">
        <h3 className="font-orbitron text-cyber-cyan">TERMINAL</h3>
        <span className="text-xs font-mono text-cyber-yellow">BAL: ${balance.toFixed(2)}</span>
      </div>

      <div className="space-y-4">
        <div>
            <label className="text-xs text-gray-500">LEVERAGE: <span className="text-white">{leverage}x</span></label>
            <input 
                type="range" min="1" max="125" value={leverage} onChange={(e) => setLeverage(Number(e.target.value))}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyber-cyan mt-2"
            />
        </div>

        <div>
            <label className="text-xs text-gray-500">AMOUNT (USDT)</label>
            <input 
                type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 p-2 text-right text-white focus:border-cyber-cyan outline-none font-mono"
            />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 bg-black/20 p-2 rounded">
            <div>ENTRY:</div><div className="text-right text-white">{currentPrice.toFixed(2)}</div>
            <div>SIZE:</div><div className="text-right text-white">{((amount * leverage) / currentPrice).toFixed(4)} BTC</div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">
            <button 
                onClick={() => handleOrder(OrderSide.BUY)} disabled={loading}
                className="py-3 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-all font-bold"
            >
                LONG
            </button>
            <button 
                onClick={() => handleOrder(OrderSide.SELL)} disabled={loading}
                className="py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all font-bold"
            >
                SHORT
            </button>
        </div>
      </div>
    </div>
  );
};
