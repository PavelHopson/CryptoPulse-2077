export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT'
}

export interface Position {
  id: string;
  symbol: string;
  side: OrderSide;
  size: number;
  entryPrice: number;
  leverage: number;
  pnl: number;
  timestamp: number;
}

export interface Candle {
  time: number; // UNIX timestamp
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
}

export interface AIAnalysisResult {
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  summary: string;
  keyLevels: { support: number[]; resistance: number[] };
}