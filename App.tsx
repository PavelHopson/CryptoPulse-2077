import React from 'react';
import { Chart } from './components/Chart';
import { OrderForm } from './components/OrderForm';
import { PositionsTable } from './components/PositionsTable';
import { AIPanel } from './components/AIPanel';

const App: React.FC = () => {
  return (
    <div className="flex h-screen w-screen bg-cyber-bg text-white selection:bg-cyber-cyan selection:text-black">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-white/10 flex items-center px-6 bg-black/40 backdrop-blur justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyber-cyan to-cyber-magenta rounded transform rotate-45 border border-white/20"></div>
                <h1 className="text-2xl font-orbitron font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-cyber-cyan to-white">
                    CRYPTO<span className="text-cyber-magenta">PULSE</span> <span className="text-sm text-gray-500">2077</span>
                </h1>
            </div>
            <div className="flex items-center gap-4 text-sm font-rajdhani">
                <div className="px-3 py-1 border border-cyber-cyan/30 rounded text-cyber-cyan bg-cyber-cyan/5">
                    NET: MAINNET-BETA
                </div>
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                   <span>SYSTEM NORMAL</span>
                </div>
            </div>
        </header>

        {/* Middle Section: Chart & Orderbook placeholder */}
        <div className="flex-1 flex min-h-0">
            <div className="flex-1 border-r border-white/10 relative">
                <Chart />
            </div>
            {/* Right Panel: Order Form */}
            <div className="w-80 min-w-[320px]">
                <OrderForm />
            </div>
        </div>

        {/* Bottom Section: Positions */}
        <div className="h-64 border-t border-white/10 min-h-[200px]">
            <PositionsTable />
        </div>
      </div>

      {/* Overlays */}
      <AIPanel />
    </div>
  );
};

export default App;