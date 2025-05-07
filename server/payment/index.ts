import { Request, Response } from 'express';
import { initStripe, getStripeStatus } from './stripe';
import { initPayPal, getPayPalStatus } from './paypal';
import { initRazorpay, getRazorpayStatus } from './razorpay';

// Initialize all payment gateways
export const initPaymentGateways = () => {
  const stripeInitialized = initStripe();
  const paypalInitialized = initPayPal();
  const razorpayInitialized = initRazorpay();

  return {
    stripeInitialized,
    paypalInitialized,
    razorpayInitialized,
    anyInitialized: stripeInitialized || paypalInitialized || razorpayInitialized
  };
};

// Check the status of all payment gateways
export const getPaymentGatewaysStatus = (req: Request, res: Response) => {
  res.json({
    stripe: getStripeStatus(),
    paypal: getPayPalStatus(),
    razorpay: getRazorpayStatus(),
  });
};

// Re-export all payment functions
export * from './stripe';
export * from './paypal';
export * from './razorpay';