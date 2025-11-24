
import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { TradesService } from './trades.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trades')
@UseGuards(JwtAuthGuard)
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post('open')
  open(@Request() req, @Body() body: any) {
    return this.tradesService.openPosition(req.user.userId, body);
  }

  @Post('close')
  close(@Request() req, @Body() body: { positionId: string }) {
    return this.tradesService.closePosition(req.user.userId, body.positionId);
  }

  @Get()
  findAll(@Request() req) {
    return this.tradesService.getPositions(req.user.userId);
  }
}
