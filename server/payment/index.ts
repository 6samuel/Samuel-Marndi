import { Request, Response } from 'express';
import { initStripe, getStripeStatus, createPaymentIntent, createPaymentIntentDirect, handleWebhook } from './stripe';
import { 
  createOrder as createPaypalOrder, 
  captureOrder as capturePaypalOrder,
  setupClient as setupPaypalClient,
  getPayPalStatus,
  initPayPal
} from './paypal';
import {
  createOrder as createRazorpayOrder,
  verifyPayment as verifyRazorpayPayment,
  getPaymentDetails as getRazorpayPaymentDetails,
  getRazorpayStatus,
  initRazorpay
} from './razorpay';
import { upiHandler } from './upi';

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
    upi: {
      available: true, // UPI is always available as it doesn't require API keys
      upiId: upiHandler.upiId
    }
  });
};

// Export all payment functions
export {
  // Stripe
  initStripe,
  getStripeStatus,
  createPaymentIntent,
  createPaymentIntentDirect,
  handleWebhook,
  
  // PayPal
  initPayPal,
  getPayPalStatus,
  createPaypalOrder,
  capturePaypalOrder,
  setupPaypalClient,
  
  // Razorpay
  initRazorpay,
  getRazorpayStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayPaymentDetails,
  
  // UPI
  upiHandler
};