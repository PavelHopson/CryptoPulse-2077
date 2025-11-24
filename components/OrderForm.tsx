import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { OrderSide, OrderType } from '../types';
import { MAX_LEVERAGE } from '../constants';

export const OrderForm: React.FC = () => {
  const { currentPrice, balance, openPosition } = useStore();
  const [leverage, setLeverage] = useState(10);
  const [amount, setAmount] = useState(1000);
  const [orderType, setOrderType] = useState<OrderType>(OrderType.MARKET);

  const maxBuy = (balance * leverage) / currentPrice;

  const handleOrder = (side: OrderSide) => {
    const size = amount / currentPrice; // Simple size calc
    openPosition({
      symbol: 'BTC/USDT',
      side,
      size,
      entryPrice: currentPrice,
      leverage,
    });
  };

  return (
    <div className="h-full p-4 flex flex-col gap-4 bg-cyber-panel border-l border-white/10">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-orbitron text-lg text-white">TERMINAL</h3>
        <span className="text-xs text-cyber-yellow font-mono">BAL: ${balance.toFixed(2)}</span>
      </div>

      {/* Leverage Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
            <span>LEV</span>
            <span className="text-cyber-cyan">{leverage}x</span>
        </div>
        <input 
            type="range" 
            min="1" 
            max={MAX_LEVERAGE} 
            value={leverage} 
            onChange={(e) => setLeverage(Number(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
        />
      </div>

      {/* Order Type */}
      <div className="flex bg-black/40 p-1 rounded">
        {[OrderType.MARKET, OrderType.LIMIT].map((type) => (
            <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex-1 py-1 text-xs font-bold rounded ${orderType === type ? 'bg-cyber-cyan text-black shadow-neon' : 'text-gray-500 hover:text-white'}`}
            >
                {type}
            </button>
        ))}
      </div>

      {/* Amount Input */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400">AMOUNT (USDT)</label>
        <div className="relative">
            <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-black/50 border border-white/20 text-white p-2 text-right font-mono focus:border-cyber-cyan focus:outline-none"
            />
            <div className="absolute left-2 top-2 text-gray-500 text-xs">MARGIN</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-500 p-2 bg-black/30 rounded">
        <div>SIZE</div>
        <div className="text-right text-white">{(amount * leverage / currentPrice).toFixed(4)} BTC</div>
        <div>LIQ. PRICE</div>
        <div className="text-right text-cyber-magenta">{(currentPrice * 0.9).toFixed(2)}</div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button 
            onClick={() => handleOrder(OrderSide.BUY)}
            className="bg-green-500/10 border border-green-500 text-green-400 py-3 font-orbitron hover:bg-green-500 hover:text-black transition-all shadow-[0_0_10px_rgba(34,197,94,0.2)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
        >
            LONG
        </button>
        <button 
            onClick={() => handleOrder(OrderSide.SELL)}
            className="bg-red-500/10 border border-red-500 text-red-400 py-3 font-orbitron hover:bg-red-500 hover:text-black transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
        >
            SHORT
        </button>
      </div>
    </div>
  );
};