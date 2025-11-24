
import React, { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import api from '@/lib/api';
import { Zap } from 'lucide-react';

export const LoginModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useUserStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await api.post(endpoint, { email, password });
      if (res.data.access_token) {
        login(res.data.access_token);
      }
    } catch (error) {
      alert('Access Denied: Invalid Credentials');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-96 bg-cyber-panel border border-cyber-cyan p-8 shadow-[0_0_30px_rgba(0,255,234,0.2)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-cyan to-cyber-magenta" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-cyber-cyan/10 rounded-full border border-cyber-cyan mb-4">
            <Zap className="w-8 h-8 text-cyber-cyan" />
          </div>
          <h2 className="text-2xl font-orbitron text-white tracking-wider">
            {isLogin ? 'SYSTEM LOGIN' : 'NEW IDENTITY'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-cyber-cyan font-mono">NET_ID (EMAIL)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-cyber-cyan outline-none font-mono"
              placeholder="runner@nightcity.net"
            />
          </div>
          <div>
            <label className="text-xs text-cyber-cyan font-mono">PASSPHRASE</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-cyber-cyan outline-none font-mono"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-3 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan font-orbitron hover:bg-cyber-cyan hover:text-black transition-all shadow-neon mt-4"
          >
            {isLogin ? 'JACK IN' : 'INITIALIZE'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-gray-500 hover:text-white font-mono"
          >
            {isLogin ? 'NO ID? CREATE NEW' : 'HAS ID? LOGIN'}
          </button>
        </div>
      </div>
    </div>
  );
};
