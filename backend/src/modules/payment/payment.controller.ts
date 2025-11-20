import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('client-token')
  async getClientToken() {
    const clientToken = await this.paymentService.generateClientToken();
    return { clientToken };
  }

  @Post('subscribe')
  async processSubscription(
    @Request() req,
    @Body('paymentMethodNonce') paymentMethodNonce: string,
    @Body('planId') planId: string,
  ) {
    return this.paymentService.processSubscription(
      req.user.id,
      paymentMethodNonce,
      planId,
    );
  }

  @Post('cancel')
  async cancelSubscription(@Request() req) {
    return this.paymentService.cancelSubscription(req.user.id);
  }
}