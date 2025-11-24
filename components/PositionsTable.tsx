import React from 'react';
import { useStore } from '../store/useStore';
import { OrderSide } from '../types';

export const PositionsTable: React.FC = () => {
  const { positions, closePosition, currentPrice } = useStore();

  return (
    <div className="w-full h-full overflow-auto bg-cyber-panel border-t border-white/10">
      <table className="w-full text-xs text-left font-mono">
        <thead className="bg-black/50 text-gray-400 sticky top-0">
            <tr>
                <th className="p-2">SYMBOL</th>
                <th className="p-2">SIDE</th>
                <th className="p-2">SIZE</th>
                <th className="p-2">ENTRY</th>
                <th className="p-2">MARK</th>
                <th className="p-2">PNL (USDT)</th>
                <th className="p-2">ACTION</th>
            </tr>
        </thead>
        <tbody className="text-white divide-y divide-white/5">
            {positions.map(pos => (
                <tr key={pos.id} className="hover:bg-white/5">
                    <td className="p-2 font-bold">{pos.symbol} <span className="text-gray-500">x{pos.leverage}</span></td>
                    <td className={`p-2 ${pos.side === OrderSide.BUY ? 'text-green-400' : 'text-red-400'}`}>{pos.side}</td>
                    <td className="p-2">{pos.size.toFixed(4)}</td>
                    <td className="p-2">{pos.entryPrice.toFixed(2)}</td>
                    <td className="p-2 text-gray-300">{currentPrice.toFixed(2)}</td>
                    <td className={`p-2 font-bold ${pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pos.pnl.toFixed(2)}
                    </td>
                    <td className="p-2">
                        <button 
                            onClick={() => closePosition(pos.id, currentPrice)}
                            className="px-2 py-1 border border-white/20 hover:bg-white/10 text-xs rounded"
                        >
                            CLOSE
                        </button>
                    </td>
                </tr>
            ))}
            {positions.length === 0 && (
                <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-600 italic">NO OPEN POSITIONS</td>
                </tr>
            )}
        </tbody>
      </table>
    </div>
  );
};