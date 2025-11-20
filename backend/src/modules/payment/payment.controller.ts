import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscribeDto } from './dto/subscribe.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Get('client-token')
  async getClientToken(@Request() req) {
    const clientToken = await this.paymentService.generateClientToken();
    return { clientToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribe(@Request() req, subscribeDto: SubscribeDto) {
    const result = await this.paymentService.createSubscription(
      req.user.userId,
      subscribeDto.paymentMethodNonce,
      subscribeDto.planId,
    );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel')
  async cancelSubscription(@Request() req) {
    const result = await this.paymentService.cancelSubscription(req.user.userId);
    return result;
  }
}