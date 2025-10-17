import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY') || '',
      { apiVersion: '2023-10-16' },
    );
  }

  async createSubscription(
    userId: string,
    plan: string,
    paymentMethodId: string,
  ): Promise<Subscription> {
    // Create Stripe customer
    const customer = await this.stripe.customers.create({
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create Stripe subscription
    const stripeSubscription = await this.stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: this.getPriceId(plan) }],
      expand: ['latest_invoice.payment_intent'],
    });

    // Save to database
    const subscription = this.subscriptionRepository.create({
      userId,
      stripeCustomerId: customer.id,
      stripeSubscriptionId: stripeSubscription.id,
      plan,
      status: stripeSubscription.status,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    });

    return this.subscriptionRepository.save(subscription);
  }

  async cancelSubscription(userId: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId },
    });

    if (subscription) {
      await this.stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      subscription.status = 'canceled';
      subscription.canceledAt = new Date();
      return this.subscriptionRepository.save(subscription);
    }

    throw new Error('Subscription not found');
  }

  async getSubscription(userId: string): Promise<Subscription> {
    return this.subscriptionRepository.findOne({ where: { userId } });
  }

  private getPriceId(plan: string): string {
    // TODO: Replace with actual Stripe price IDs
    const priceIds = {
      monthly: this.configService.get('STRIPE_MONTHLY_PRICE_ID') || 'price_monthly',
      yearly: this.configService.get('STRIPE_YEARLY_PRICE_ID') || 'price_yearly',
      trial: this.configService.get('STRIPE_TRIAL_PRICE_ID') || 'price_trial',
    };
    return priceIds[plan] || priceIds.monthly;
  }
}
