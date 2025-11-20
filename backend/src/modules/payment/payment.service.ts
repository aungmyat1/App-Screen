import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as braintree from 'braintree';
import { User } from '../../entities/user.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private gateway: braintree.BraintreeGateway;

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox, // Use Production in production
      merchantId: this.configService.get('BRAINTREE_MERCHANT_ID'),
      publicKey: this.configService.get('BRAINTREE_PUBLIC_KEY'),
      privateKey: this.configService.get('BRAINTREE_PRIVATE_KEY'),
    });
  }

  async generateClientToken(): Promise<string> {
    try {
      const response = await this.gateway.clientToken.generate({});
      return response.clientToken;
    } catch (error) {
      this.logger.error('Error generating client token:', error);
      throw error;
    }
  }

  async createSubscription(
    userId: string,
    paymentMethodNonce: string,
    planId: string,
  ): Promise<any> {
    try {
      // Find user
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Check if user already has a Braintree customer ID
      let customerId = user.subscription?.braintreeCustomerId;
      
      // If no customer ID, create a new customer
      if (!customerId) {
        const customerResult = await this.gateway.customer.create({
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ')[1] || '',
          email: user.email,
          paymentMethodNonce: paymentMethodNonce,
        });

        if (!customerResult.success) {
          throw new Error(`Failed to create customer: ${customerResult.message}`);
        }

        customerId = customerResult.customer.id;
        
        // Update user with Braintree customer ID
        await this.userRepository.update(user.id, {
          subscription: {
            ...user.subscription,
            braintreeCustomerId: customerId,
          },
        });
      }

      // Create subscription
      const subscriptionResult = await this.gateway.subscription.create({
        paymentMethodToken: paymentMethodNonce,
        planId: planId,
      });

      if (!subscriptionResult.success) {
        throw new Error(`Failed to create subscription: ${subscriptionResult.message}`);
      }

      // Update user with subscription details
      const planName = this.getPlanName(planId);
      await this.userRepository.update(user.id, {
        subscription: {
          ...user.subscription,
          plan: planName,
          braintreeCustomerId: customerId,
        },
      });

      return {
        success: true,
        subscription: subscriptionResult.subscription,
      };
    } catch (error) {
      this.logger.error('Error creating subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(userId: string): Promise<any> {
    try {
      // Find user
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Check if user has a subscription
      if (!user.subscription?.braintreeCustomerId) {
        throw new Error('User does not have a subscription');
      }

      // In a real implementation, you would cancel the subscription in Braintree
      // For this demo, we'll just update the user's subscription status
      await this.userRepository.update(user.id, {
        subscription: {
          ...user.subscription,
          plan: 'free',
        },
      });

      return {
        success: true,
        message: 'Subscription cancelled successfully',
      };
    } catch (error) {
      this.logger.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  private getPlanName(planId: string): string {
    // In a real implementation, you would map plan IDs to plan names
    // based on your Braintree plans configuration
    const planMap = {
      'pro': 'pro',
      'enterprise': 'enterprise',
    };
    
    return planMap[planId] || 'free';
  }
}