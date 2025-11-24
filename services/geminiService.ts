import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Candle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMarket = async (symbol: string, currentPrice: number, recentCandles: Candle[]): Promise<string> => {
  // Prepare data summary for the prompt to save tokens
  const last5 = recentCandles.slice(-5);
  const priceAction = last5.map(c => `[${new Date(c.time * 1000).toLocaleTimeString()}: O${c.open} H${c.high} L${c.low} C${c.close}]`).join('\n');

  const prompt = `
    Act as a senior crypto market analyst in a cyberpunk future.
    Symbol: ${symbol}
    Current Price: ${currentPrice}
    
    Recent Price Action (Last 5 candles):
    ${priceAction}
    
    Analyze the immediate trend. Give a trading signal (BUY/SELL/HOLD) with a confidence score (0-100%).
    Keep it brief, punchy, and use cyberpunk slang (e.g., "neural link stable", "whale detected", "grid overload").
    Format: 
    SIGNAL: [BUY/SELL/HOLD]
    CONFIDENCE: [0-100]%
    REASONING: [One sentence]
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    });
    return response.text || "System malfunction. No data received.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connection to AI Core interrupted.";
  }
};

export const chatWithAI = async (history: string[], message: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `System: You are CryptoPulse, a cynical but helpful AI trading assistant. Keep answers short.\n\nUser: ${message}`,
        });
        return response.text || "...";
    } catch (e) {
        return "Error processing request.";
    }
}