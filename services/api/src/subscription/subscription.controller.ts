import { Controller, Get, Post, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
@UseGuards(AuthGuard('jwt'))
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get()
  async getSubscription(@Req() req: any) {
    return this.subscriptionService.getSubscription(req.user.userId);
  }

  @Post()
  async createSubscription(
    @Req() req: any,
    @Body() body: { plan: string; paymentMethodId: string },
  ) {
    return this.subscriptionService.createSubscription(
      req.user.userId,
      body.plan,
      body.paymentMethodId,
    );
  }

  @Delete()
  async cancelSubscription(@Req() req: any) {
    return this.subscriptionService.cancelSubscription(req.user.userId);
  }
}
