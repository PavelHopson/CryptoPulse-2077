import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { analyzeMarket, chatWithAI } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AIPanel: React.FC = () => {
  const { isAIPanelOpen, toggleAIPanel, currentSymbol, currentPrice, marketData } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'system', text: 'CryptoPulse AI Core Online. Waiting for query...', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isAIPanelOpen) {
    return (
        <button 
            onClick={toggleAIPanel}
            className="fixed bottom-6 right-6 z-50 bg-cyber-panel border border-cyber-cyan p-4 rounded-full shadow-neon hover:scale-110 transition-transform group"
        >
            <div className="w-6 h-6 bg-cyber-cyan rounded-full animate-pulse group-hover:bg-white"></div>
        </button>
    );
  }

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const responseText = await chatWithAI(messages.map(m => m.text), input);
    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, aiMsg]);
  };

  const handleQuickAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeMarket(currentSymbol, currentPrice, marketData);
    const aiMsg: ChatMessage = { id: Date.now().toString(), role: 'model', text: result, timestamp: Date.now() };
    setMessages(prev => [...prev, aiMsg]);
    setIsAnalyzing(false);
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 h-[500px] bg-cyber-panel border border-cyber-cyan z-50 flex flex-col shadow-2xl font-rajdhani">
      {/* Header */}
      <div className="p-3 border-b border-cyber-cyan flex justify-between items-center bg-black/50">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse"></div>
            <span className="font-orbitron text-cyber-cyan">AI CORE</span>
        </div>
        <button onClick={toggleAIPanel} className="text-cyber-cyan hover:text-white">X</button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 text-sm border ${
                    msg.role === 'user' 
                    ? 'border-cyber-magenta text-white bg-cyber-magenta/10 rounded-tl-lg rounded-br-lg' 
                    : 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/5 rounded-tr-lg rounded-bl-lg'
                }`}>
                    {msg.text}
                </div>
            </div>
        ))}
        {isAnalyzing && <div className="text-xs text-cyber-cyan animate-pulse text-center">PROCESSING MARKET DATA...</div>}
      </div>

      {/* Controls */}
      <div className="p-3 border-t border-cyber-cyan bg-black/50 space-y-2">
        <button 
            onClick={handleQuickAnalysis}
            className="w-full py-2 border border-cyber-yellow text-cyber-yellow text-xs hover:bg-cyber-yellow hover:text-black transition-colors font-bold"
        >
            RUN MARKET SCAN
        </button>
        <div className="flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Command..."
                className="flex-1 bg-black/50 border border-gray-700 text-white px-2 py-1 text-sm focus:border-cyber-cyan focus:outline-none"
            />
            <button onClick={handleSend} className="text-cyber-cyan hover:text-white">→</button>
        </div>
      </div>
    </div>
  );
};