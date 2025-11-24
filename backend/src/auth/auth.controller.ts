
import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() req) {
    return this.authService.login(req);
  }

  @Post('register')
  async register(@Body() req) {
    return this.authService.register(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    // In real implementation, verify refresh token
    return this.authService.login(req.user);
  }
}
