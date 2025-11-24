
import { Injectable, OnModuleInit } from '@nestjs/common';
import { MarketGateway } from './market.gateway';

@Injectable()
export class MarketService implements OnModuleInit {
  private prices = {
    'BTC/USDT': 65000,
    'ETH/USDT': 3500,
    'SOL/USDT': 145,
  };

  constructor(private gateway: MarketGateway) {}

  onModuleInit() {
    // Simulate market movement
    setInterval(() => {
      Object.keys(this.prices).forEach(symbol => {
        const volatility = symbol.includes('BTC') ? 50 : symbol.includes('ETH') ? 5 : 0.5;
        const change = (Math.random() - 0.5) * volatility;
        this.prices[symbol] += change;
        this.gateway.broadcastPrice(symbol, this.prices[symbol]);
      });
    }, 1000); // 1 second tick
  }

  getCurrentPrice(symbol: string): number {
    return this.prices[symbol] || 0;
  }
}
