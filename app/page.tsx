
'use client';

import React, { useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Chart } from '@/components/Chart';
import { OrderPanel } from '@/components/trading/OrderPanel';
import { PositionsTable } from '@/components/trading/PositionsTable';
import { AIPanel } from '@/components/AIPanel';
import { LoginModal } from '@/components/auth/LoginModal';
import { useUserStore } from '@/store/useUserStore';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { useMarketStore } from '@/store/useMarketStore';
import { getSocket } from '@/lib/socket';

export default function Dashboard() {
  const { isAuthenticated, checkAuth } = useUserStore();
  const updatePrice = useMarketStore((s) => s.updatePrice);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
      const socket = getSocket();
      if (socket) {
        socket.on('priceUpdate', (data: { symbol: string, price: number }) => {
          updatePrice(data.symbol, data.price);
        });
      }
    } else {
      disconnectSocket();
    }
    return () => {
      const socket = getSocket();
      if (socket) socket.off('priceUpdate');
    };
  }, [isAuthenticated]);

  return (
    <AppShell>
      {!isAuthenticated && <LoginModal />}
      <div className={`flex flex-col h-full ${!isAuthenticated ? 'blur-sm pointer-events-none' : ''}`}>
        {/* Top Section */}
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 border-r border-white/10 relative bg-black/40">
            <Chart />
          </div>
          <div className="w-[360px] min-w-[320px] bg-cyber-panel/80 backdrop-blur border-l border-white/5">
            <OrderPanel />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="h-[300px] border-t border-white/10 bg-cyber-panel/95 relative z-10">
          <PositionsTable />
        </div>

        <AIPanel />
      </div>
    </AppShell>
  );
}
