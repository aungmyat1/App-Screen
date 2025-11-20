import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SubscriptionPlan } from '../../entities/user.entity';
import * as braintree from 'braintree';

@Injectable()
export class PaymentService {
  private gateway;

  constructor(private readonly userService: UserService) {
    this.gateway = braintree.connect({
      environment: braintree.Environment.Sandbox, // Use braintree.Environment.Production for production
      merchantId: process.env.BRAINTREE_MERCHANT_ID,
      publicKey: process.env.BRAINTREE_PUBLIC_KEY,
      privateKey: process.env.BRAINTREE_PRIVATE_KEY,
    });
  }

  async generateClientToken(): Promise<string> {
    try {
      const response = await this.gateway.clientToken.generate({});
      return response.clientToken;
    } catch (error) {
      throw new Error('Error generating client token');
    }
  }

  async processSubscription(
    userId: string,
    paymentMethodNonce: string,
    planId: string,
  ): Promise<any> {
    try {
      // Get user
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Create customer in Braintree
      const customerResult = await this.gateway.customer.create({
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1] || '',
        email: user.email,
        paymentMethodNonce: paymentMethodNonce,
      });

      if (!customerResult.success) {
        throw new Error(
          `Error creating customer: ${customerResult.message}`,
        );
      }

      const customerId = customerResult.customer.id;

      // Update user with Braintree customer ID and plan
      const updatedUser = await this.userService.updateSubscription(
        userId,
        planId as SubscriptionPlan,
        customerId,
      );

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      throw new Error(`Error processing subscription: ${error.message}`);
    }
  }

  async cancelSubscription(userId: string): Promise<any> {
    try {
      // Get user
      const user = await this.userService.findById(userId);
      if (!user || !user.subscription.braintreeCustomerId) {
        throw new Error('No active subscription found');
      }

      // Update user's plan to free
      const updatedUser = await this.userService.updateSubscription(
        userId,
        SubscriptionPlan.FREE,
      );

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      throw new Error(`Error cancelling subscription: ${error.message}`);
    }
  }
}