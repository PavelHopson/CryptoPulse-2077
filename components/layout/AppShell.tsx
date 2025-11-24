import React, { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';
import { Zap, Activity, LayoutGrid, Settings, User } from 'lucide-react';

export const AppShell = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 md:w-20 border-r border-white/10 bg-black/40 backdrop-blur flex flex-col items-center py-6 gap-8 z-20">
        <div className="w-10 h-10 bg-gradient-to-br from-cyber-cyan to-cyber-magenta rounded transform rotate-45 border border-white/20 shadow-[0_0_15px_rgba(0,255,234,0.3)]" />
        
        <nav className="flex flex-col gap-6 w-full items-center">
          <NavItem icon={<LayoutGrid size={24} />} active />
          <NavItem icon={<Activity size={24} />} />
          <NavItem icon={<Zap size={24} />} />
        </nav>

        <div className="mt-auto flex flex-col gap-6">
          <NavItem icon={<User size={24} />} />
          <NavItem icon={<Settings size={24} />} />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/20 backdrop-blur z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-orbitron font-black tracking-widest select-none">
              <span className="text-cyber-cyan text-glow">CRYPTO</span>
              <span className="text-cyber-magenta text-glow-magenta">PULSE</span>
            </h1>
            <div className="hidden md:block w-px h-6 bg-white/20" />
            <span className="hidden md:block text-xs text-cyber-cyan/70 font-mono bg-cyber-cyan/5 px-2 py-0.5 border border-cyber-cyan/20 rounded">
              v2.0.77-BETA
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-green-400 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              SYSTEM ONLINE
            </div>
            <div className="font-mono text-cyber-yellow">
              BTC: $65,420.00
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative">
            {children}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, active }: { icon: React.ReactNode, active?: boolean }) => (
  <button className={cn(
    "p-3 rounded-xl transition-all duration-300 group relative",
    active 
      ? "text-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_10px_rgba(0,255,234,0.2)]" 
      : "text-gray-500 hover:text-white hover:bg-white/5"
  )}>
    {icon}
    {active && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-1 h-6 bg-cyber-cyan rounded-r-full shadow-[0_0_5px_rgba(0,255,234,0.8)]" />
    )}
  </button>
);