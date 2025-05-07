import { Request, Response } from 'express';
import Stripe from 'stripe';

// Will be initialized when the secret key is available
let stripe: Stripe | null = null;

// Initialize Stripe with the secret key
export const initStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (secretKey) {
    stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });
    console.log('Stripe payment gateway initialized');
    return true;
  } else {
    console.warn('Stripe payment gateway not initialized: Missing STRIPE_SECRET_KEY');
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
    const { amount, currency = 'INR', metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Error creating Stripe payment intent:', error);
    res.status(500).json({ error: error.message });
  }
};

// Handle webhook events
export const handleWebhook = async (req: Request, res: Response) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe payment gateway not available' });
  }

  try {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      return res.status(400).json({ error: 'Webhook secret not configured' });
    }

    let event;

    // Verify the webhook signature
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        // Add your business logic here
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed: ${failedPayment.id}`);
        // Add your failure handling here
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Error handling Stripe webhook:', error);
    res.status(500).json({ error: error.message });
  }
};

// Check if Stripe is configured
export const getStripeStatus = () => {
  return {
    available: !!stripe,
    publicKey: process.env.VITE_STRIPE_PUBLIC_KEY || null
  };
};