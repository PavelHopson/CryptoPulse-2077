
import React, { useEffect } from 'react';
import { useTradeStore } from '@/store/useTradeStore';
import { useMarketStore } from '@/store/useMarketStore';

export const PositionsTable = () => {
  const { positions, fetchPositions, closePosition } = useTradeStore();
  const prices = useMarketStore((s) => s.prices);

  useEffect(() => {
    fetchPositions();
    const interval = setInterval(fetchPositions, 2000); // Sync backup
    return () => clearInterval(interval);
  }, []);

  const calculatePnL = (pos: any) => {
    const current = prices[pos.symbol] || pos.entryPrice;
    const diff = pos.side === 'BUY' ? current - pos.entryPrice : pos.entryPrice - current;
    return diff * pos.size;
  };

  return (
    <div className="w-full h-full overflow-auto font-mono text-xs">
      <table className="w-full text-left">
        <thead className="bg-black/40 text-gray-500 sticky top-0">
            <tr>
                <th className="p-3">SYMBOL</th>
                <th className="p-3">SIDE</th>
                <th className="p-3">SIZE</th>
                <th className="p-3">ENTRY</th>
                <th className="p-3">MARK</th>
                <th className="p-3">PNL</th>
                <th className="p-3">ACTION</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
            {positions.map((pos) => {
                const pnl = calculatePnL(pos);
                const pnlClass = pnl >= 0 ? 'text-green-400' : 'text-red-400';
                return (
                    <tr key={pos.id} className="hover:bg-white/5">
                        <td className="p-3 font-bold">{pos.symbol} <span className="text-gray-600">x{pos.leverage}</span></td>
                        <td className={`p-3 ${pos.side === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>{pos.side}</td>
                        <td className="p-3">{pos.size.toFixed(4)}</td>
                        <td className="p-3">{pos.entryPrice.toFixed(2)}</td>
                        <td className="p-3 text-white">{(prices[pos.symbol] || 0).toFixed(2)}</td>
                        <td className={`p-3 font-bold ${pnlClass}`}>{pnl.toFixed(2)} USDT</td>
                        <td className="p-3">
                            <button 
                                onClick={() => closePosition(pos.id)}
                                className="px-2 py-1 border border-white/20 hover:bg-white/10 rounded text-white"
                            >
                                CLOSE
                            </button>
                        </td>
                    </tr>
                );
            })}
        </tbody>
      </table>
    </div>
  );
};
