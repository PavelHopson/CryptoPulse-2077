# CryptoPulse Backend API

## Architecture
Modular NestJS Monolith tailored for high-load simulation.

## Environment Variables
Create a `.env` file in the root of `backend/`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/cryptopulse?schema=public"
JWT_SECRET="do-not-use-this-secret-in-production-use-strong-key"
REDIS_HOST="localhost"
REDIS_PORT=6379
BINANCE_API_KEY="" # Optional for real data feed
API_KEY="" # Gemini API Key
```

## API Endpoints

### Auth
- `POST /auth/register` - Create new user
- `POST /auth/login` - Get JWT
- `POST /auth/refresh` - Refresh token

### Trades
- `GET /trades` - Get open positions
- `POST /trades/open` - Open Long/Short
- `POST /trades/close` - Close position

### Market (WebSocket)
- Namespace: `/market`
- Event: `priceUpdate` - Real-time tick
- Event: `positionsUpdate` - PnL updates
