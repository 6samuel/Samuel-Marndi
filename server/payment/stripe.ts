import { Request, Response } from 'express';
import Stripe from 'stripe';

// Will be initialized when the secret key is available
let stripe: Stripe | null = null;

// Initialize Stripe with the secret key
export const initStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (secretKey) {
    stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16' as any, // Type assertion to bypass static type checking
    });
    
    console.log('Stripe payment gateway initialized');
    return true;
  } else {
    console.warn('Stripe payment gateway not initialized: Missing secret key');
    return false;
  }
};

// Create a payment intent
export const createPaymentIntent = async (req: Request, res: Response) => {
  if (!stripe) {
    return res.status(503).json({ 
      error: 'Stripe payment gateway not available',
      configured: false
    });
  }

  try {
    const { amount, currency = 'inr', description = 'Samuel Marndi Services' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents/paise
      currency,
      description,
      metadata: {
        integration_check: 'accept_a_payment',
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Error creating Stripe payment intent:', error);
    res.status(500).json({ error: error.message });
  }
};

// Handle Stripe webhook
export const handleWebhook = async (req: Request, res: Response) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe payment gateway not available' });
  }

  const signature = req.headers['stripe-signature'] as string;
  if (!signature) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );

    // Handle the event based on its type
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Payment was successful
        console.log('Payment succeeded:', event.data.object);
        break;
      case 'payment_intent.payment_failed':
        // Payment failed
        console.log('Payment failed:', event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Error handling Stripe webhook:', error);
    res.status(400).json({ error: error.message });
  }
};

// Check if Stripe is configured
export const getStripeStatus = () => {
  return {
    available: !!stripe,
    secretKey: process.env.STRIPE_SECRET_KEY ? 'configured' : null,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? 'configured' : null,
    publicKey: process.env.VITE_STRIPE_PUBLIC_KEY ? 'configured' : null,
  };
};