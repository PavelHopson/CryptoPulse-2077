
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarketService } from '../market/market.service';
import { MarketGateway } from '../market/market.gateway';

@Injectable()
export class TradesService {
  constructor(
    private prisma: PrismaService,
    private marketService: MarketService,
    private gateway: MarketGateway
  ) {
    // Check for PnL updates every second
    setInterval(() => this.updatePnL(), 1000);
  }

  async openPosition(userId: string, dto: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const price = this.marketService.getCurrentPrice(dto.symbol);
    
    const marginRequired = dto.amount; // The amount user puts down
    if (user.balance < marginRequired) throw new BadRequestException('Insufficient balance');

    const size = (marginRequired * dto.leverage) / price;
    
    // Calculate Liquidation Price (Simplified)
    // Long: Entry - (Margin / Size)
    // Short: Entry + (Margin / Size)
    const liqDistance = marginRequired / size;
    const liquidationPrice = dto.side === 'BUY' 
      ? price - liqDistance 
      : price + liqDistance;

    const position = await this.prisma.position.create({
      data: {
        userId,
        symbol: dto.symbol,
        side: dto.side,
        size,
        entryPrice: price,
        leverage: dto.leverage,
        liquidationPrice,
        status: 'OPEN'
      }
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { balance: user.balance - marginRequired }
    });

    return position;
  }

  async closePosition(userId: string, positionId: string) {
    const position = await this.prisma.position.findUnique({ where: { id: positionId } });
    if (!position || position.userId !== userId || position.status !== 'OPEN') {
      throw new BadRequestException('Invalid position');
    }

    const currentPrice = this.marketService.getCurrentPrice(position.symbol);
    const pnl = this.calculatePnL(position, currentPrice);
    
    // Return Margin + PnL
    const margin = (position.size * position.entryPrice) / position.leverage;
    const totalReturn = margin + pnl;

    await this.prisma.$transaction([
        this.prisma.position.update({
            where: { id: positionId },
            data: { status: 'CLOSED', closedAt: new Date(), pnl }
        }),
        this.prisma.user.update({
            where: { id: userId },
            data: { balance: { increment: totalReturn } }
        })
    ]);

    return { success: true, pnl };
  }

  async getPositions(userId: string) {
    return this.prisma.position.findMany({ where: { userId, status: 'OPEN' } });
  }

  private calculatePnL(pos: any, currentPrice: number): number {
    if (pos.side === 'BUY') {
        return (currentPrice - pos.entryPrice) * pos.size;
    } else {
        return (pos.entryPrice - currentPrice) * pos.size;
    }
  }

  private async updatePnL() {
    const openPositions = await this.prisma.position.findMany({ 
        where: { status: 'OPEN' },
        include: { user: true } // In real app, optimize this
    });

    for (const pos of openPositions) {
        const price = this.marketService.getCurrentPrice(pos.symbol);
        const pnl = this.calculatePnL(pos, price);

        // Check Liquidation
        const isLiquidated = pos.side === 'BUY' ? price <= pos.liquidationPrice : price >= pos.liquidationPrice;
        
        if (isLiquidated) {
            await this.prisma.position.update({
                where: { id: pos.id },
                data: { status: 'LIQUIDATED', closedAt: new Date(), pnl: -((pos.size * pos.entryPrice) / pos.leverage) }
            });
            // User loses margin, no balance return
            this.gateway.sendPositionUpdate(pos.userId, []); // Force refresh
        } else {
            // Emit update to specific user
            // In prod, batch these
            // Here we rely on client pulling or socket pushing logic
        }
    }
  }
}
