
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'market',
})
export class MarketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET || 'secret' });
      client.join(`user_${payload.sub}`);
      console.log(`Client connected: ${payload.sub}`);
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  broadcastPrice(symbol: string, price: number) {
    this.server.emit('priceUpdate', { symbol, price, timestamp: Date.now() });
  }

  sendPositionUpdate(userId: string, positions: any[]) {
    this.server.to(`user_${userId}`).emit('positionsUpdate', positions);
  }
}
